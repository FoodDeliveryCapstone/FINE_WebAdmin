import { LoadingButton } from '@mui/lab';
import {
  Card,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FineFormConfig } from 'src/@types/fine/table';
import storeApi from 'src/apis/store';
import { UploadAvatar } from 'src/components/upload';
import { firebaseStorage } from 'src/firebase';
import Layout from 'src/layouts';
import { getDestinationList } from 'src/redux/slices/destination';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';
import useSettings from '../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fData } from '../../../utils/formatNumber';
type FormProps = {
  editObject?: Record<string, any>;
  title?: string;
  open: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  formConfigs: FineFormConfig[];
  handleSubmitForm: (data: any) => void;
};

CreateStore.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function CreateStore({
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
  const [destination, setTimeslot] = React.useState('');
  
  const handleChangeDestination = (event: SelectChangeEvent) => {
    setTimeslot(event.target.value as string);
  };
  function fetchApis() {
    dispatch(getDestinationList(1));
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);

  const handleUploadImageToFirebase = async (file: File) => {
    try {
      if (file) {
        setIsUploading(true);
        const uploadPath = `images/${file.name}`; // geting the image path
        const storageRef = ref(firebaseStorage, uploadPath); // getting the storageRef
        await uploadBytes(storageRef, file)
          .then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then((downloadURL) => {
              setValue('imageUrl', downloadURL);
            });
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error!', { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        handleUploadImageToFirebase(file);
      }
    },
    [setValue]
  );
  const onSubmit = async (data: any) => {
    try {
      const updateRes = await storeApi.createStore(data);
      enqueueSnackbar('Update succesfully!', { variant: 'success' });
      reset();
    } catch (error) {
      enqueueSnackbar('Không tạo được cửa hàng!', { variant: 'error' });
      console.error(error);
    }
  };

  return (
    <Page title="Tạo cửa hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo cửa hàng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách cửa hàng',
              href: PATH_DASHBOARD.store.list,
            },
            { name: 'Tạo cửa hàng', href: PATH_DASHBOARD.store.create },
          ]}
        />
        <Card
          sx={{ p: 4, width: '1000px', margin: 'auto', marginTop: '20px', borderRadius: '12px' }}
        >
          <FormProvider methods={methods}>
            <form>
              <Stack spacing={2} alignItems={'center'}>
                <Card sx={{ p: 3, width: '360px' }}>
                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      const checkError = !!error && !field.value;
                      return (
                        <Stack>
                          <UploadAvatar
                            error={checkError}
                            accept="image/*"
                            maxSize={3145728}
                            onDrop={handleDrop}
                            helperText={
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 2,
                                  mx: 'auto',
                                  display: 'block',
                                  textAlign: 'center',
                                  color: 'text.secondary',
                                }}
                              >
                                Allowed *.jpeg, *.jpg, *.png, *.gif
                                <br /> max size of {fData(3145728)}
                              </Typography>
                            }
                            file={field.value}
                          />
                          {checkError && (
                            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                              {error.message}
                            </FormHelperText>
                          )}
                        </Stack>
                      );
                    }}
                  />
                  <TextField
                    sx={{ visibility: 'hidden', width: '1px', height: '1px' }}
                    {...register('imageUrl')}
                  />
                </Card>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 6 }}
                  sx={{ paddingRight: 10 }}
                >
                  <Grid item xs={6}>
                    <TextField
                      required
                      error={Boolean(errors.storeName)}
                      fullWidth
                      label="Tên cửa hàng"
                      {...methods.register('storeName', { required: true })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(errors.contactPerson)}
                      fullWidth
                      required
                      id="filled-required"
                      label="Người phụ trách"
                      {...methods.register('contactPerson', { required: true })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Địa điểm</InputLabel>
                      <Select
                        error={Boolean(errors.destinationId)}
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-timeslot"
                        value={destination}
                        label="destination"
                        {...methods.register('destinationId', { required: true })}
                        onChange={handleChangeDestination}
                      >
                        {destinationRes?.data.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {`${e.name}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Switch {...methods.register('isActive')} />}
                      label={'IsActive'}
                      labelPlacement="top"
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
        </Card>
      </Container>
    </Page>
  );
}
