import { LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Card,
  TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FineFormConfig } from 'src/@types/fine/table';
import timeslotApi from 'src/apis/timeslot';
import { firebaseStorage } from 'src/firebase';
import Layout from 'src/layouts';
import { getDestinationList } from 'src/redux/slices/destination';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';
import useSettings from '../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface TicksStructure {
  ticks: number;
  days: number;
  hours: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMicroseconds: number;
  totalNanoseconds: number;
  totalMinutes: number;
  totalSeconds: number;
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

CreateTimeslot.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function CreateTimeslot({
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

  function convertDateToTicks(date: Date): TicksStructure {
    const ticks: number = date.getTime();
    const milliseconds: number = ticks % 1000;
    const seconds: number = Math.floor(ticks / 1000) % 60;
    const minutes: number = Math.floor(ticks / (1000 * 60)) % 60;
    const hours: number = Math.floor(ticks / (1000 * 60 * 60)) % 24;
    const days: number = Math.floor(ticks / (1000 * 60 * 60 * 24));

    return {
      ticks,
      days,
      hours,
      milliseconds,
      microseconds: 0, // Assuming you don't need microseconds
      nanoseconds: 0, // Assuming you don't need nanoseconds
      minutes,
      seconds,
      totalDays: days,
      totalHours: hours,
      totalMilliseconds: ticks,
      totalMicroseconds: 0,
      totalNanoseconds: 0,
      totalMinutes: minutes,
      totalSeconds: seconds,
    };
  }
  const { destinationRes, isLoading: destinationLoading } = useSelector(
    (state) => state.destination
  );
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const [destination, setTimeslot] = React.useState('');
  const [closeTime, setCloseTime] = useState<Date | null>(methods.getValues('closeTime') || null);
  const [arriveTime, setArriveTime] = useState<Date | null>(
    methods.getValues('arriveTime') || null
  );
  const [checkoutTime, setCheckoutTime] = useState<Date | null>(
    methods.getValues('checkoutTime') || null
  );
  function formatTime(date: Date | null): string {
    if (date === null) {
      return ''; // or throw an error, or handle it in some way
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(7, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  // Example usage:

  const handleChangeDestination = (event: SelectChangeEvent) => {
    setTimeslot(event.target.value as string);
  };
  function fetchApis() {
    dispatch(getDestinationList(1));
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    try {
      const updateRes = await timeslotApi.createTimeslot(data);
      enqueueSnackbar('Update succesfully!', { variant: 'success' });
      reset();
    } catch (error) {
      enqueueSnackbar('Error!', { variant: 'error' });
      console.error(error);
    }
  };

  return (
    <Page title="Tạo khung giờ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo khung giờ"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách khung giờ',
              href: PATH_DASHBOARD.timeslot.list,
            },
            { name: 'Tạo khung giờ', href: PATH_DASHBOARD.timeslot.create },
          ]}
        />
        <Card
          sx={{ p: 4, width: '1000px', margin: 'auto', marginTop: '20px', borderRadius: '12px' }}
        >
          {' '}
          <FormProvider methods={methods}>
            <form>
              <Stack spacing={3}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 6 }}
                  sx={{ paddingRight: 10 }}
                >
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        renderInput={(params) => (
                          <TextField {...params} fullWidth label="Thời gian đóng đơn" />
                        )}
                        value={closeTime}
                        onChange={(date) => {
                          setCloseTime(date);
                          methods.setValue('closeTime', formatTime(date));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        renderInput={(params) => (
                          <TextField {...params} fullWidth label="Thời gian bắt đầu" />
                        )}
                        value={arriveTime}
                        onChange={(date) => {
                          setArriveTime(date);
                          methods.setValue('arriveTime', formatTime(date));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        renderInput={(params) => (
                          <TextField {...params} fullWidth label="Thời gian kết thúc" />
                        )}
                        value={checkoutTime}
                        onChange={(date) => {
                          setCheckoutTime(date);
                          methods.setValue('checkoutTime', formatTime(date));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Địa điểm</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-timeslot"
                        value={destination}
                        label="destination"
                        {...methods.register('destinationId')}
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
