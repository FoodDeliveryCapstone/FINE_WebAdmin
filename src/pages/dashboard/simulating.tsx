import * as Yup from 'yup';
// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, CardHeader, Container, Grid, Stack, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import orderApi from 'src/apis/order';
import { MotivationIllustration } from 'src/assets';
import { FormProvider } from 'src/components/hook-form';
import { getCustomerList } from 'src/redux/slices/customer';
import { getMenuList } from 'src/redux/slices/menu';
import { getStationList } from 'src/redux/slices/station';
import { getTimeSlotList } from 'src/redux/slices/timeslot';
import { useDispatch, useSelector } from 'src/redux/store';
import SelectCard from 'src/sections/@dashboard/fine/SelectCard';
import TextFieldCard from 'src/sections/@dashboard/fine/TextFieldCard';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import Layout from '../../layouts';
import { AppCurrentDownload, AppWelcome } from '../../sections/@dashboard/general/app';
import { string } from 'yup/lib/locale';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { InputLabel } from '@mui/material';
// ----------------------------------------------------------------------

OrderSimulating.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
type FormValuesProps = {
  totalOrder: number;
  totalOrderPrepare: number;
  totalOrderDelivery: number;
  totalOrderBoxStored: number;
  totalOrderFinished: number;
  timeSlotId: string;
  orderType: string;
};

export default function OrderSimulating() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { timeSlotRes, isLoading: timeSlotLoading } = useSelector((state) => state.timeslot);
  const [consoleLogContent, setConsoleLogContent] = useState<string>('');
  const [orderScriptResult, setOrderScriptResult] = useState({
    success: 0,
    fail: 0,
  });
  const [orderAmount, setData] = useState<Record<string, any>[]>([]);
  const [orderByStaffPassio, setOrderByStaffPassio] = useState<Record<string, any>[]>([]);
  const [orderByStaff711, setOrderByStaff711] = useState<Record<string, any>[]>([]);
  const [orderByStaffLaha, setOrderByStaffLaha] = useState<Record<string, any>[]>([]);
  const [orderByStaff, setOrderByStaff] = useState<Record<string, any>[]>([]);
  // const { storeRes } = useSelector((state) => state.store);
  const getOrders = async () => {
    const res = await orderApi.getOrderList({ PageSize: 1000 });
    setData(res.data);
  };

  // const getOrderByStaff = async () => {
  //   const res = await orderApi.getOrderByStaff(storeRes?.data.map((e) => e.id));
  //   setOrderByStaff(res.data);
  // };

  const getOrderByStaffPassio = async () => {
    const res = await orderApi.getOrderByStaffPassio();
    setOrderByStaffPassio(res.data);
  };
  const getOrderByStaff711 = async () => {
    const res = await orderApi.getOrderByStaff711();
    setOrderByStaff711(res.data);
  };
  const getOrderByStaffLaha = async () => {
    const res = await orderApi.getOrderByStaffLaha();
    setOrderByStaffLaha(res.data);
  };
  function fetchApis() {
    dispatch(getOrders);
    dispatch(getOrderByStaffPassio);
    dispatch(getOrderByStaff711);
    dispatch(getOrderByStaffLaha);
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);
  const simulateSchema = Yup.object().shape({
    totalOrder: Yup.number()
      .required('Vui lòng không để trống')
      .min(1, 'Số lượng khách hàng phải lớn hơn hoặc bằng 1')
      .max(300, `Số lượng khách hàng phải nhỏ hơn hoặc bằng 300`)
      .typeError('Chỉ được nhập số'),
    totalOrderPrepare: Yup.number()
      .required('Vui lòng không để trống')
      .min(1, 'Số lượng khách hàng phải lớn hơn hoặc bằng 1')
      .max(300, `Số lượng khách hàng phải nhỏ hơn hoặc bằng 300`)
      .typeError('Chỉ được nhập số'),
    totalOrderDelivery: Yup.number()
      .required('Vui lòng không để trống')
      .min(1, 'Số lượng khách hàng phải lớn hơn hoặc bằng 1')
      .max(300, `Số lượng khách hàng phải nhỏ hơn hoặc bằng 300`)
      .typeError('Chỉ được nhập số'),
    totalOrderBoxStored: Yup.number()
      .required('Vui lòng không để trống')
      .min(1, 'Số lượng khách hàng phải lớn hơn hoặc bằng 1')
      .max(300, `Số lượng khách hàng phải nhỏ hơn hoặc bằng 300`)
      .typeError('Chỉ được nhập số'),
    totalOrderFinished: Yup.number()
      .required('Vui lòng không để trống')
      .min(1, 'Số lượng khách hàng phải lớn hơn hoặc bằng 1')
      .max(300, `Số lượng khách hàng phải nhỏ hơn hoặc bằng 300`)
      .typeError('Chỉ được nhập số'),
    timeSlotId: Yup.string().required('Yêu cầu chọn khung giờ'),
    orderType: Yup.string().required('Yêu cầu chọn loại đơn hàng'),
  });

  const defaultValues = {
    totalOrder: 10,
    totalOrderPrepare: 1,
    totalOrderDelivery: 1,
    totalOrderBoxStored: 1,
    totalOrderFinished: 1,
    numOfOrders: 1,
    timeSlotId: '',
    orderType: 'single',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(simulateSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const currentTimeSlot = watch('timeSlotId');
  const currentOrderType = watch('orderType');

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // Single Order
      setSubmitLoading(true);
      if (data.orderType === 'single') {
        console.log('                                                  ');
        console.log('------------------Giả lập đặt hàng-----------------------');
        setSubmitLoading(true);
        const res = await orderApi.simulateOrder({
          timeSlotId: data.timeSlotId,
          singleOrder: {
            totalOrder: data.totalOrder,
          },
        });
        console.log('---------------------------------------------------------');
        console.log(
          `✅ Tổng đơn thành công: ${res.data.singleOrderResult.orderSuccess.length} đơn ✅`
        );
        console.log('                                                     ');
        console.log(
          `❌ Tổng đơn thất bại: ${res.data.singleOrderResult.orderFailed.length} đơn ❌`
        );
        console.log('                                                  ');
        console.log('------------------Đơn thành công-------------------------');
        res.data.singleOrderResult.orderSuccess.forEach((e, index) => {
          const count = index + 1;
          console.log(`${count}. Khách hàng: ${e.customerName} - Đặt thành công`);
          console.log(
            e.orderDetails
              .map(
                (e) =>
                  `- ${e?.storeName}: ${e?.productAndQuantity
                    .map((e) => `${e?.productName}(${e?.quantity})`)
                    .join(' | ')}`
              )
              .join(' \n')
          );
        });

        console.log('                                                   ');
        console.log('------------------Đơn thất bại---------------------------');

        const statusMessages = {
          'Out of Time Slot!': 'Hết thời gian đặt!',
          'Balance is not enough': 'Số dư ví không đủ',
          'Customer needs to update phone number!': 'Khách hàng chưa cập nhật số điện thoại',
          'There is no available box in this station!': 'Hết tủ',
          'Station is unavailable!': 'Trạm không khả dụng',
          'Lỗi hệ thống': 'Lỗi hệ thống',
        };

        res.data.singleOrderResult.orderFailed.forEach((e, index) => {
          const count = index + 1;
          // const message = statusMessages[e.message] || "Không rõ lỗi";
          // console.log(
          //   `${count}. Khách hàng ${e.customerName} - ${message} - Đặt thất bại`
          // );
        });

        setOrderScriptResult({
          success: res.data.singleOrderResult.orderSuccess.length,
          fail: res.data.singleOrderResult.orderFailed.length,
        });

        dispatch(getOrders);
        dispatch(getOrderByStaffPassio);
        dispatch(getOrderByStaff711);
        dispatch(getOrderByStaffLaha);
        // Party Order
      } else if (data.orderType === 'party') {
        console.log('---Co-Order Simulating---');
        const res = await orderApi.simulateOrder({
          timeSlotId: data.timeSlotId,
          singleOrder: {
            totalOrder: data.totalOrder,
          },
        });
        res.data.singleOrderResult.orderFailed.map((e) =>
          console.log(`Order failed: ${e.customerName} - ${e.message}`)
        );
        res.data.singleOrderResult.orderFailed.map((e) =>
          console.log(`Order success: ${e.customerName} - Successfully`)
        );
      } else {
        console.log('---Linked Order---');
      }
    } catch (error) {
      console.log(`Simulating error: ${error.statusCode} - ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onSubmitPrepare = async (data: FormValuesProps) => {
    // dispatch(getOrders);
    setSubmitLoading(true);
    try {
      const res = await orderApi.simulateFinishePrepare({
        timeSlotId: data.timeSlotId,
      });
      console.log('                                                  ');
      console.log('------------------Đơn thành công-------------------------');
      console.log(`Đã chuẩn bị ${data.totalOrderPrepare} đơn hàng`);

      const storeNames = {
        '8db35955-bbc5-40fb-b638-cb44ac786519': 'Passio',
        '751a2190-d06c-4d5e-9c5a-08c33c3db266': '7-Eleven',
        'e19422e9-2c97-4c6e-8919-f4ae0fa739d5': 'LAHA',
      };

      const uniqueEntries = new Set();

      res.data.orderSuccess.forEach((e) => {
        const entryKey = `${e.storeId}-${e.staffName}`;
        if (!uniqueEntries.has(entryKey)) {
          uniqueEntries.add(entryKey);
          // const storeName = storeNames[e.storeId] || '';
          console.log(
            ` Cửa hàng:  - Nhân viên: ${e.staffName}-${e.productName} (${e.quantity}) - chuẩn bị thành công`
          );
        }
      });

      dispatch(getOrders);
      console.log('                                                  ');
      console.log('------------------Đơn thất bại-------------------------');
      res.data.orderFailed.map((e) =>
        console.log(
          `-  Cửa hàng: ${
            e.storeId === '8db35955-bbc5-40fb-b638-cb44ac786519'
              ? 'Passio'
              : e.storeId === '751a2190-d06c-4d5e-9c5a-08c33c3db266'
              ? '7-Eleven'
              : 'Laha'
          } - Nhân viên: ${e.staffName} - ${e.productName} (${e.quantity}) - Hết hàng
          - chuẩn bị thất bại`
        )
      );
    } catch (error) {
    } finally {
      setSubmitLoading(false);
      dispatch(getOrders);
    }
  };

  const onSubmitDelivery = async (data: FormValuesProps) => {
    dispatch(getOrders);
    setSubmitLoading(true);
    try {
      const res = await orderApi.simulateDelivery({
        totalOrder: data.totalOrderDelivery,
      });

      console.log('                                         ');
      console.log(`Đã lấy ${data.totalOrderDelivery} đơn hàng`);
      res.data.forEach(
        (e: { customerName: any; itemQuantity: any; orderCode: any }, index: number) => {
          const count = index + 1;
          console.log(
            `${count}. Mã đơn: ${e.orderCode} - ${e.itemQuantity} món - Lấy hàng thành công`
          );
        }
      );
      dispatch(getOrders);
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };

  const onSubmitBoxStored = async (data: FormValuesProps) => {
    dispatch(getOrders);
    setSubmitLoading(true);
    try {
      const res = await orderApi.simulateboxStored({
        totalOrder: data.totalOrderBoxStored,
      });
      // console.log('data', res.data.);

      console.log('                                         ');
      console.log(`Đã bỏ vào trạm ${data.totalOrderBoxStored} đơn hàng`);
      res.data.forEach(
        (e: { customerName: any; itemQuantity: any; orderCode: any }, index: number) => {
          const count = index + 1;
          console.log(
            `${count}. Mã đơn: ${e.orderCode} - ${e.itemQuantity} món - Vận chuyển tới trạm thành công`
          );
        }
      );
      dispatch(getOrders);
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };

  const onSubmitFinised = async (data: FormValuesProps) => {
    dispatch(getOrders);
    setSubmitLoading(true);
    try {
      const res = await orderApi.simulateFinishedOrder({
        totalOrder: data.totalOrderFinished,
      });
      // console.log('data', res.data.);

      console.log('                                         ');
      console.log(`Đã hoàn thành ${data.totalOrderFinished} đơn hàng`);
      res.data.forEach(
        (e: { customerName: any; itemQuantity: any; orderCode: any }, index: number) => {
          const count = index + 1;
          console.log(
            `${count}. Khách: ${e.customerName} - Mã đơn: ${e.orderCode} - ${e.itemQuantity} món - Nhận hàng thành công`
          );
        }
      );
      dispatch(getOrders);
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getCustomerList(1));
    dispatch(getTimeSlotList('70248C0D-C39F-468F-9A92-4A5A7F1FF6BB'));
    dispatch(getStationList(1));
  }, [dispatch]);

  const firstValue: string | undefined = timeSlotRes?.data[0]?.id;

  useEffect(() => {
    if (firstValue !== undefined) {
      setValue('timeSlotId', firstValue);
    }
  }, [timeSlotRes]);

  useEffect(() => {
    if (currentTimeSlot && currentTimeSlot !== '') dispatch(getMenuList(currentTimeSlot));
  }, [currentTimeSlot]);

  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      originalConsoleLog(...args); // Call the original function
      setConsoleLogContent((prevContent) => prevContent + args.join(' ') + '\n');
    };
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  return (
    // Call the original function
    <Page title="Simulating">
      {/* Order Simulate */}
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={16}>
              <AppWelcome
                title={`Hệ thống giả lập`}
                description="Giả lập đặt hàng"
                img={
                  <MotivationIllustration
                    sx={{
                      p: 3,
                      width: 360,
                      margin: { xs: 'auto', md: 'inherit' },
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel htmlFor="roleType">Loại đơn hàng</InputLabel>
              <Select fullWidth title={`Loại đơn hàng`} name={'orderType'}>
                <MenuItem value={'single'}>Single</MenuItem>
                <MenuItem value={'party'}>Party</MenuItem>
                <MenuItem value={'linked'}>Linked</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel htmlFor="roleType">Khung giờ</InputLabel>
              {timeSlotRes?.data && (
                <Select fullWidth title={`Khung giờ`} name={'timeSlotId'}>
                  {timeSlotRes?.data.map((timeslot) => (
                    <MenuItem key={timeslot.id} value={timeslot.id}>
                      {`${timeslot.arriveTime} - ${timeslot.checkoutTime}`}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
            {currentOrderType === 'single' ? (
              <>
                <Grid item xs={6}>
                  <InputLabel htmlFor="roleType">Tổng số đơn hàng</InputLabel>
                  <TextField
                    type="number"
                    title={`Tổng số đơn hàng`}
                    placeholder="Tổng số đơn hàng"
                    name={'totalOrder'}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}>
                  <TextFieldCard
                    type="number"
                    title={`Tổng số đơn hàng`}
                    placeholder="Tổng số đơn hàng"
                    name={'totalOrder'}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6} sx={{ alignSelf: 'center' }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loadingIndicator="Loading…"
                loading={submitLoading}
              >
                Chạy giả lập
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
        <Grid container spacing={3} sx={{ justifyContent: 'center', pt: 3, pb: 5 }}>
          <Grid item xs={12} md={8} lg={3}>
            <AppCurrentDownload
              title="Tổng đơn đang xử lý"
              chartColors={[theme.palette.primary.light]}
              chartData={[
                {
                  label: 'Đang xử lý',
                  value: orderAmount.filter((e) => e.orderStatus === 4).length,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={3}>
            <AppCurrentDownload
              title="Tổng đơn giả lập"
              chartColors={[theme.palette.primary.main]}
              chartData={[
                {
                  label: 'Tổng đơn giả lập',
                  value: orderScriptResult.success + orderScriptResult.fail,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={3}>
            <AppCurrentDownload
              title="Giả lập thành công"
              chartColors={[theme.palette.success.dark]}
              chartData={[{ label: 'Thành công', value: orderScriptResult.success }]}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={3}>
            <AppCurrentDownload
              title="Giả lập thất bại"
              chartColors={[theme.palette.error.main]}
              chartData={[{ label: 'Thất bại', value: orderScriptResult.fail }]}
            />
          </Grid>
          <Grid container spacing={2} columns={16} pt={4}>
            <Grid item xs={8}>
              <Card>
                <CardHeader title={'Kết quả'} />
                <Stack height={440} px={3} pt={3} pb={5} overflow={'scroll'}>
                  <pre>{consoleLogContent}</pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card>
                <CardHeader title={'7-Eleven'} />
                <Stack pt={2} height={440} px={2} overflow={'scroll'}>
                  <pre>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Tên món</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      {orderByStaff711
                        .reduce((result, e) => {
                          const existingProduct = result.find(
                            (item: { productName: any }) => item.productName === e.productName
                          );
                          if (existingProduct) {
                            existingProduct.quantity += e.quantity;
                          } else {
                            result.push({ ...e });
                          }
                          return result;
                        }, [])
                        .map(
                          (
                            e: {
                              productName:
                                | boolean
                                | ReactChild
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                              quantity:
                                | boolean
                                | ReactChild
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                            },
                            index: Key | null | undefined
                          ) => (
                            <TableBody key={index}>
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="left">{e.productName}</TableCell>
                                <TableCell align="center">x{e.quantity}</TableCell>
                              </TableRow>
                            </TableBody>
                          )
                        )}
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">
                            <strong>Tổng cộng</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>
                              {orderByStaff711.reduce((total, e) => total + e.quantity, 0)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card>
                <CardHeader title={'Passio'} />
                <Stack pt={2} height={440} px={3} overflow={'scroll'}>
                  <pre>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Tên món</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      {orderByStaffPassio
                        .reduce((result, e) => {
                          const existingProduct = result.find(
                            (item: { productName: any }) => item.productName === e.productName
                          );
                          if (existingProduct) {
                            existingProduct.quantity += e.quantity;
                          } else {
                            result.push({ ...e });
                          }
                          return result;
                        }, [])
                        .map(
                          (
                            e: {
                              productName:
                                | boolean
                                | ReactChild
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                              quantity:
                                | boolean
                                | ReactChild
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                            },
                            index: Key | null | undefined
                          ) => (
                            <TableBody key={index}>
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="left">{e.productName}</TableCell>
                                <TableCell align="center">x{e.quantity}</TableCell>
                              </TableRow>
                            </TableBody>
                          )
                        )}
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">
                            <strong>Tổng cộng</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>
                              {orderByStaffPassio.reduce((total, e) => total + e.quantity, 0)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card>
                <CardHeader title={'Laha'} />
                <Stack pt={2} height={440} px={3} overflow={'scroll'}>
                  <pre>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Tên món</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      {orderByStaffLaha
                        .reduce((result, e) => {
                          const existingProduct = result.find(
                            (item: { productName: any }) => item.productName === e.productName
                          );
                          if (existingProduct) {
                            existingProduct.quantity += e.quantity;
                          } else {
                            result.push({ ...e });
                          }
                          return result;
                        }, [])
                        .map(
                          (
                            e: {
                              productName:
                                | boolean
                                | ReactChild
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                              quantity:
                                | boolean
                                | ReactChild
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                            },
                            index: Key | null | undefined
                          ) => (
                            <TableBody key={index}>
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="left">{e.productName}</TableCell>
                                <TableCell align="center">x{e.quantity}</TableCell>
                              </TableRow>
                            </TableBody>
                          )
                        )}
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">
                            <strong>Tổng cộng</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>
                              {orderByStaffLaha.reduce((total, e) => total + e.quantity, 0)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </pre>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* Prepare Simulate*/}
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitPrepare)}>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={6}>
              {timeSlotRes?.data && (
                <Select fullWidth title={`Khung giờ`} name={'timeSlotId'}>
                  {timeSlotRes?.data.map((timeslot) => (
                    <MenuItem key={timeslot.id} value={timeslot.id}>
                      {`${timeslot.arriveTime} - ${timeslot.checkoutTime}`}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ alignSelf: 'center' }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loadingIndicator="Loading…"
                loading={submitLoading}
              >
                Chạy giả lập
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ justifyContent: 'center', pt: 3, pb: 5 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title={'Kết quả'} />
                <Stack height={440} px={3} pt={3} pb={5} overflow={'scroll'}>
                  <pre>
                    Có {orderAmount.filter((e) => e.orderStatus === 4).length} đơn đang chờ chuẩn bị
                  </pre>
                  <pre>{consoleLogContent}</pre>
                  <pre>
                    Còn lại {orderAmount.filter((e) => e.orderStatus === 4).length} đơn chưa được
                    chuẩn bị
                  </pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={8} lg={3}>
              <AppCurrentDownload
                title="Đang chờ xử lý"
                chartColors={[theme.palette.success.dark]}
                chartData={[
                  {
                    label: 'Đang chờ xử lý',
                    value: orderAmount.filter((e) => e.orderStatus === 4).length,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
      {/* Delivery Simulate  */}
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitDelivery)}>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={6}>
              <TextField
                type="number"
                title={`Đơn hàng cần lấy`}
                placeholder="Tổng số đơn hàng"
                name={'totalOrderDelivery'}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ alignSelf: 'center' }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loadingIndicator="Loading…"
                loading={submitLoading}
              >
                Chạy giả lập
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ justifyContent: 'center', pt: 3, pb: 5 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title={'Kết quả'} />
                <Stack height={440} px={3} pt={3} pb={5} overflow={'scroll'}>
                  <pre>
                    Có {orderAmount.filter((e) => e.orderStatus == 6).length} đơn đang chờ được lấy
                  </pre>
                  <pre>{consoleLogContent}</pre>
                  <pre>
                    Còn lại {orderAmount.filter((e) => e.orderStatus == 6).length} chưa được lấy
                  </pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={8} lg={3}>
              <AppCurrentDownload
                title="Đang chờ được lấy"
                chartColors={[theme.palette.success.dark]}
                chartData={[
                  {
                    label: 'Đang chờ được lấy',
                    value: orderAmount.filter((e) => e.orderStatus == 6).length,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
      {/* BoxStored Simulate */}
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitBoxStored)}>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={6}>
              <TextField
                type="number"
                title={`Đơn hàng bỏ vào Box`}
                placeholder="Tổng số đơn hàng"
                name={'totalOrderBoxStored'}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ alignSelf: 'center' }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loadingIndicator="Loading…"
                loading={submitLoading}
              >
                Chạy giả lập
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ justifyContent: 'center', pt: 3, pb: 5 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title={'Kết quả'} />
                <Stack height={440} px={3} pt={3} pb={5} overflow={'scroll'}>
                  <pre>
                    Có {orderAmount.filter((e) => e.orderStatus == 9).length} đơn đang được vận
                    chuyển tới trạm
                  </pre>
                  <pre>{consoleLogContent}</pre>
                  <pre>
                    Còn lại {orderAmount.filter((e) => e.orderStatus == 9).length} đơn chưa bỏ hàng
                    vào trạm
                  </pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={8} lg={3}>
              <AppCurrentDownload
                title="Đã lấy"
                chartColors={[theme.palette.success.dark]}
                chartData={[
                  {
                    label: 'Đã lấy',
                    value: orderAmount.filter((e) => e.orderStatus == 9).length,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
      {/* Finished Simulate  */}
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitFinised)}>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={6}>
              <TextField
                type="number"
                title={`Đơn hàng hoàn thành`}
                placeholder="Tổng số đơn hàng"
                name={'totalOrderFinished'}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ alignSelf: 'center' }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loadingIndicator="Loading…"
                loading={submitLoading}
              >
                Chạy giả lập
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ justifyContent: 'center', pt: 3, pb: 5 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title={'Kết quả'} />
                <Stack height={440} px={3} pt={3} pb={5} overflow={'scroll'}>
                  <pre>
                    Có {orderAmount.filter((e) => e.orderStatus == 10).length} đơn trong đang trong
                    Box
                  </pre>
                  <pre>{consoleLogContent}</pre>
                  <pre>
                    Còn lại {orderAmount.filter((e) => e.orderStatus == 10).length} khách hàng chưa
                    lấy
                  </pre>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={8} lg={3}>
              <AppCurrentDownload
                title="Đang trong box"
                chartColors={[theme.palette.success.dark]}
                chartData={[
                  {
                    label: 'Đang trong box',
                    value: orderAmount.filter((e) => e.orderStatus == 10).length,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}
