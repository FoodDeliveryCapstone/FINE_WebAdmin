import { LoadingButton } from '@mui/lab';
import {
  Button,
  Container,
  Grid,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TGoongType } from 'src/@types/fine/location';
import { FineFormConfig } from 'src/@types/fine/table';
import destinationApi from 'src/apis/destination';
import Layout from 'src/layouts';
import { getDestinationList } from 'src/redux/slices/destination';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';
import useSettings from '../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
interface AutoCompleteResult {
  place_id: string;
  description: string;
}
type FormProps = {
  editObject?: Record<string, any>;
  title?: string;
  open: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  formConfigs: FineFormConfig[];
  handleSubmitForm: (data: any) => void;
};

CreateDestination.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function CreateDestination({
  editObject,
  title,
  open,
  handleClose,
  isEdit = false,
  formConfigs,
  handleSubmitForm,
}: FormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm();

  const {
    register,
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { destinationRes, isLoading: destinationLoading } = useSelector(
    (state) => state.destination
  );
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [location, setLocation] = useState<string>('21.013715429594125,105.79829597455202');
  const [input, setInput] = useState<string>('');
  const [autoCompleteResults, setAutoCompleteResults] = useState<AutoCompleteResult[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [placeDetails, setPlaceDetails] = useState<TGoongType>();
  const [error, setError] = useState<string | null>(null);

  function fetchApis() {
    dispatch(getDestinationList(1));
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    try {
      const updateRes = await destinationApi.createDestination(data);
      enqueueSnackbar('Update succesfully!', { variant: 'success' });
      reset();
    } catch (error) {
      enqueueSnackbar('Error!', { variant: 'error' });
      console.error(error);
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInput(inputValue);

    try {
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=VNoJiA5HwuefS5ItRwKV2Ig5ub27OGgXl6aQBxkC&location=${encodeURIComponent(
          location
        )}&input=${encodeURIComponent(inputValue)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.predictions)) {
          setAutoCompleteResults(data.predictions);
          setError(null);
        } else {
          setError('Invalid data format received from Goong Place Autocomplete API');
        }
      } else {
        const errorData = await response.json();
        setError(
          `Failed to fetch data from Goong Place Autocomplete API. Status: ${response.status}, Message: ${errorData.error.message}`
        );
      }
    } catch (error) {
      setError(`Error occurred during the fetch: ${error.message}`);
    }
  };

  const handleSelectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setAutoCompleteResults([]);
  };

  const handlePlaceDetails = async () => {
    if (selectedPlaceId) {
      try {
        const response = await fetch(
          `https://rsapi.goong.io/Place/Detail?place_id=${selectedPlaceId}&api_key=VNoJiA5HwuefS5ItRwKV2Ig5ub27OGgXl6aQBxkC`
        );

        if (response.ok) {
          const data = await response.json();
          setPlaceDetails(data);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(
            `Failed to fetch place details. Status: ${response.status}, Message: ${errorData.error.message}`
          );
        }
      } catch (error) {
        setError(`Error occurred during the fetch: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    handlePlaceDetails();
  }, [selectedPlaceId]);

  const handleAutoCompleteItemClick = (result: AutoCompleteResult) => {
    handleSelectPlace(result.place_id);
  };

  return (
    <Page title="Tạo địa điểm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo địa điểm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách địa điểm',
              href: PATH_DASHBOARD.destination.list,
            },
            { name: 'Tạo địa điểm', href: PATH_DASHBOARD.destination.create },
          ]}
        />

        <FormProvider methods={methods}>
          <form>
            <Stack spacing={2}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 6 }}
                sx={{ paddingRight: 10 }}
              >
                <Grid item xs={6}>
                  <TextField
                    required
                    id="outlined-required"
                    fullWidth
                    label="name"
                    {...register('name', { required: true })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="outlined-required"
                    fullWidth
                    label="code"
                    {...register('code', { required: true })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="outlined-required"
                    value={placeDetails?.result.geometry.location.lat}
                    fullWidth
                    {...register('lat', { required: true })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="outlined-required"
                    value={placeDetails?.result.geometry.location.lng}
                    fullWidth
                    {...register('long', { required: true })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    options={autoCompleteResults}
                    getOptionLabel={(option) => option.description}
                    onChange={(event, value) => value && handleSelectPlace(value.place_id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tìm kiếm địa điểm"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <ListItemButton onClick={() => handleAutoCompleteItemClick(option)}>
                          <ListItemText primary={option.description} />
                        </ListItemButton>
                      </li>
                    )}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                disabled={isUploading}
                type="submit"
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                loading={isSubmitting}
              >
                Tạo mới
              </LoadingButton>
            </Stack>
          </form>
        </FormProvider>
      </Container>
    </Page>
  );
}
