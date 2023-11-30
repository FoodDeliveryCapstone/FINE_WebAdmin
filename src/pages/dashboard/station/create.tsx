import { LoadingButton } from '@mui/lab';
import {
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FineFormConfig } from 'src/@types/fine/table';
import stationApi from 'src/apis/station';
import Layout from 'src/layouts';
import { getDestinationList, getFloorList } from 'src/redux/slices/destination';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';
import useSettings from '../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
type FormProps = {
  editObject?: Record<string, any>;
  title?: string;
  open: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  formConfigs: FineFormConfig[];
  handleSubmitForm: (data: any) => void;
};

CreateStation.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function CreateStation({
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

  const { floorRes, isLoading: destinationLoading } = useSelector((state) => state.destination);
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [destination, setTimeslot] = React.useState('');
  const handleChangeDestination = (event: SelectChangeEvent) => {
    setTimeslot(event.target.value as string);
  };
  function fetchApis() {
    dispatch(getDestinationList(1));
    dispatch(getFloorList('70248C0D-C39F-468F-9A92-4A5A7F1FF6BB'));
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    try {
      const updateRes = await stationApi.createStation(data);
      enqueueSnackbar('Khởi tạo thành công!', { variant: 'success' });
      reset();
    } catch (error) {
      enqueueSnackbar('Có trục trặc nhỏ!', { variant: 'error' });
      console.error(error);
    }
  };
  const areaCode = [
    { value: 'PASSIO', label: 'PASSIO' },
    { value: 'TD', label: 'TD' },
    { value: '711', label: '711' },
    { value: 'HTA', label: 'HTA' },
  ];

  return (
    <Page title="Tạo trạm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo trạm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách trạm',
              href: PATH_DASHBOARD.station.list,
            },
            { name: 'Tạo trạm', href: PATH_DASHBOARD.station.create },
          ]}
        />
        <Card
          sx={{ p: 4, width: '1000px', margin: 'auto', marginTop: '20px', borderRadius: '12px' }}
        >
          <FormProvider methods={methods}>
            <form>
              <Stack spacing={2} alignItems={'center'}>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 6 }}
                  sx={{ paddingRight: 10 }}
                >
                  <Grid item xs={6}>
                    <TextField fullWidth label="Tên trạm" {...methods.register('name')} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Mã Trạm" {...methods.register('code')} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Mã vùng</InputLabel>
                      <Select
                        label="Mã vùng"
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        defaultValue={'PASSIO'}
                        placeholder="Chọn mã vùng"
                        fullWidth
                        inputProps={{ name: 'roleType' }}
                        input={<OutlinedInput label="Name" />}
                      >
                        {areaCode.map((e) => (
                          <MenuItem key={e.value} value={e.value}>
                            {e.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Tầng</InputLabel>
                      <Select
                        label="Tầng"
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        defaultValue={1}
                        placeholder="Chọn tầng"
                        fullWidth
                        inputProps={{ name: 'floorId' }}
                        input={<OutlinedInput label="Tầng" />}
                      >
                        {floorRes?.data.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.number}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
        </Card>
      </Container>
    </Page>
  );
}
