import {
  Box,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { useEffect, useState } from 'react';
import stationApi from 'src/apis/station';
import { getTimeSlotList } from 'src/redux/slices/timeslot';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import useSettings from '../../../hooks/useSettings';
import useTable from '../../../hooks/useTable';
import Layout from '../../../layouts';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import BoxForm from './createBoxForm';
import { DialogActions } from '@mui/material';
import { TBox, TBoxStation } from 'src/@types/fine/station';

StationList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function StationList() {
  const { page, filterBy } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { timeSlotRes, isLoading: timeSlotLoading } = useSelector((state) => state.timeslot);
  const [boxData, setData1] = useState<Record<string, any>[]>([]);
  const [timeslot, setTimeslot] = React.useState('');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<TBox>();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [stationLists, setStationList] = useState<Record<string, any>[]>([]);
  const [boxDatas, setBoxData] = React.useState({
    stationId: '',
    code: '',
    isHeat: false,
  });
  console.log('selectedBox', selectedBox);

  const getStation = async () => {
    const res = await stationApi.getStationList();
    setStationList(res.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setBoxData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setBoxData((prevData) => ({
      ...prevData,
      stationId: event.target.value,
    }));
  };

  const handleBoxClick = (box: any) => {
    setSelectedBox(box);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditBox = async () => {
    try {
      const updateRes = await stationApi.updateBox(selectedBox?.id, boxData);
    } catch (error) {
      console.error(error);
    }
    setOpenDialog(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCreateBox = () => {
    handleClose();
  };

  const handleChangeTimeslot = (event: SelectChangeEvent) => {
    setTimeslot(event.target.value as string);
    dispatch(getBoxAvailableList);
  };

  function fetchApis() {
    dispatch(getStation);
    dispatch(getTimeSlotList('70248C0D-C39F-468F-9A92-4A5A7F1FF6BB'));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  const firstValue: string | undefined = timeSlotRes?.data[0]?.id;

  useEffect(() => {
    if (firstValue !== undefined) {
      setTimeslot(firstValue);
    }
  }, [timeSlotRes]);

  const [initialTimeslot, setInitialTimeslot] = useState(''); // Add this state variable

  useEffect(() => {
    setInitialTimeslot(timeslot);
  }, [timeslot]);

  const getBoxAvailableList = async () => {
    const res = await stationApi.getBoxAvailableList(timeslot);
    setData1(res.data);
  };

  useEffect(() => {
    getBoxAvailableList();
    const intervalId = setInterval(() => getBoxAvailableList(), 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [initialTimeslot]);

  const isActive = [
    { id: '1', value: true, label: 'Hoạt động' },
    { id: '2', value: false, label: 'Ngưng' },
  ];
  return (
    <Page title="Danh sách trạm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách trạm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Danh sách trạm', href: PATH_DASHBOARD.station.list },
            { name: 'Tạo trạm', href: PATH_DASHBOARD.station.create },
          ]}
        />
        <Card
          sx={{ p: 4, width: '1000px', margin: 'auto', marginTop: '20px', borderRadius: '12px' }}
        >
          {timeSlotLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <Stack spacing={2} direction="row">
                <Grid item xs={12} md={6}>
                  <FormControl sx={{ width: 200 }}>
                    <InputLabel id="demo-simple-select-label">Timeslot</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select-timeslot"
                      value={timeslot}
                      label="timeslot"
                      onChange={handleChangeTimeslot}
                    >
                      {timeSlotRes?.data.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {`${e.arriveTime} - ${e.checkoutTime}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Button
                  onClick={() => router.push('/dashboard/station/create')}
                  variant="contained"
                >
                  Tạo trạm mới
                </Button>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                  Tạo box cho trạm
                </Button>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle sx={{ pb: 3 }}>Tạo hộp</DialogTitle>
                  <DialogContent sx={{ width: '320px' }}>
                    <BoxForm onBoxCreated={handleCreateBox} />
                  </DialogContent>
                </Dialog>
              </Stack>
            </>
          )}
          {boxData == null ? (
            <div>Loading...</div>
          ) : (
            <Stack pt={2} spacing={4}>
              {boxData.map((e) => {
                if (e.isAvailable == true) {
                  return (
                    <Stack key={e.id} spacing={2}>
                      <Typography variant="h4" component="h2">
                        Trạm {e.stationName}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          textAlign={'center'}
                          alignContent={'center'}
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 22 }}
                        >
                          {e.listBox.map((b: any) => (
                            <Grid key={b.id} item xs={2} sm={4} md={4}>
                              <Box
                                borderRadius={2}
                                sx={{
                                  color: 'black',
                                  fontSize: 20,
                                  height: 50,
                                  backgroundColor:
                                    b.status === 1
                                      ? theme.palette.primary.main
                                      : b.status === 5
                                      ? theme.palette.warning.main
                                      : theme.palette.grey[400],
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    color: 'white',
                                    transform: 'scale(1.1)',
                                    backgroundColor: theme.palette.primary.dark,
                                  },
                                }}
                                onClick={() => handleBoxClick(b)} // Handle box click
                              >
                                {b.code.split('_')[0]}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Stack>
                  );
                } else {
                  return null;
                }
              })}
            </Stack>
          )}
        </Card>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Chỉnh sửa</DialogTitle>
          <DialogContent>
            {/* <TextField
              label="Mã"
              variant="outlined"
              name="code"
              value={selectedBox?.code}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Hoạt động"
              variant="outlined"
              name="isActive"
              value={
                selectedBox
                  ? selectedBox?.isActive === true
                    ? 'Đang hoạt động'
                    : 'Ngưng hoạt động'
                  : ''
              }
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            /> */}
            {/* <Select
              label="isActive"
              variant="outlined"
              name="isActive"
              value={
                selectedBox
                  ? selectedBox?.isActive === true
                    ? 'Đang hoạt động'
                    : 'Ngưng hoạt động'
                  : ''
              }
              onChange={handleSelectChange}
              fullWidth
            >
              {isActive.map((station) => (
                <MenuItem key={station.id} value={station.value}>
                  {station.label}
                </MenuItem>
              ))}
            </Select> */}
            <div>
              <Checkbox checked={selectedBox?.isActive} onChange={handleInputChange} name="isActive" />
              <span>Đang hoạt động</span>
            </div>
            <div>
              <Checkbox checked={selectedBox?.isHeat} onChange={handleInputChange} name="isHeat" />
              <span>Có nhiệt</span>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Đóng
            </Button>
            <Button onClick={handleEditBox} color="primary" variant="contained">
              cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
