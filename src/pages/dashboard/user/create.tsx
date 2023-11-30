import { LoadingButton } from '@mui/lab';
import {
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FineFormConfig } from 'src/@types/fine/table';
import staffApi from 'src/apis/staff';
import Layout from 'src/layouts';
import { getDestinationList } from 'src/redux/slices/destination';
import { getStoreList } from 'src/redux/slices/store';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';
import useSettings from '../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { role } from 'src/_mock/role';
import { getStationList } from 'src/redux/slices/station';
type FormProps = {
  editObject?: Record<string, any>;
  title?: string;
  open: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  formConfigs: FineFormConfig[];
  handleSubmitForm: (data: any) => void;
};

CreateStaff.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function CreateStaff({
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

  const { storeRes, isLoading: destinationLoading } = useSelector((state) => state.store);
  const { stationRes, isLoading: stationLoading } = useSelector((state) => state.station);
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [storeId, setStoreId] = React.useState('');
  const [stationId, setStationId] = React.useState('');
  const [roleId, setRoleId] = React.useState('');
  const handleChangeStored = (event: SelectChangeEvent) => {
    setStoreId(event.target.value as string);
  };
  const handleChangeStation = (event: SelectChangeEvent) => {
    setStationId(event.target.value as string);
  };
  const handleChangeRole = (event: SelectChangeEvent) => {
    setRoleId(event.target.value as string);
  };
  function fetchApis() {
    dispatch(getDestinationList(1));
    dispatch(getStoreList(1));
    dispatch(getStationList(1));
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    try {
      const updateRes = await staffApi.createStaff(data);
      enqueueSnackbar('Khởi tạo thành công!', { variant: 'success' });
      reset();
    } catch (error) {
      enqueueSnackbar('Có trục trặc nhỏ!', { variant: 'error' });
      console.error(error);
    }
  };

  const roles = [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'Staff' },
    { value: '3', label: 'Shipper' },
  ];

  return (
    <Page title="Tạo nhân viên">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo nhân viên"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách nhân viên',
              href: PATH_DASHBOARD.user.staff,
            },
            { name: 'Tạo nhân viên', href: PATH_DASHBOARD.user.create },
          ]}
        />
        <Card
          sx={{ p: 4, width: '1000px', margin: 'auto', marginTop: '20px', borderRadius: '12px' }}
        >
          <FormProvider methods={methods}>
            <form>
              <Stack alignItems={'center'} spacing={2}>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 6 }}
                  sx={{ paddingRight: 10 }}
                >
                  <Grid item xs={6}>
                    <TextField
                      required
                      error={Boolean(errors.name)}
                      fullWidth
                      label="Tên nhân viên"
                      {...methods.register('name', { required: true })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      error={Boolean(errors.username)}
                      fullWidth
                      label="Tài khoản"
                      {...methods.register('username', { required: true })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      error={Boolean(errors.pass)}
                      fullWidth
                      label="Mật khẩu"
                      {...methods.register('pass', { required: true })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Chức vụ</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-timeslot"
                        label="destination"
                        defaultValue={'1'}
                        {...methods.register('roleType')}
                        onChange={handleChangeRole}
                        input={<OutlinedInput label="Name" />}
                        inputProps={{ name: 'roleType' }}
                      >
                        {roles.map((e) => (
                          <MenuItem key={e.value} value={e.value}>
                            {e.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Chức vụ</InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        defaultValue={1}
                        placeholder="Chọn vị trí"
                        fullWidth
                        inputProps={{ name: 'roleType' }}
                        {...methods.register('roleType', { required: true })}
                        input={<OutlinedInput label="Name" />}
                      >
                        {roles.map((e) => (
                          <MenuItem key={e.value} value={e.value}>
                            {e.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                  </Grid>
                  {roleId === '2' && (
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Cửa hàng</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select-timeslot"
                          value={storeId}
                          label="destination"
                          {...methods.register('storeId')}
                          onChange={handleChangeStored}
                        >
                          {storeRes?.data.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                              {`${e.storeName}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  {roleId === '3' && (
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Địa điểm</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select-timeslot"
                          value={stationId}
                          label="destination"
                          {...methods.register('stationId')}
                          onChange={handleChangeStation}
                        >
                          {stationRes?.data.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                              {`${e.name}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
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
