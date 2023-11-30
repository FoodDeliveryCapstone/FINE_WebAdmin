// @mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import orderApi from 'src/apis/order';
import Iconify from 'src/components/Iconify';
import Label from 'src/components/Label';
import { useSelector } from 'src/redux/store';
import DetailRowWithIcon from 'src/sections/fine/DetailRowWithIcon';
import { OrderStatusEnum, getOrderStatus } from 'src/utils/constants';

// ----------------------------------------------------------------------

type OrderDetailDialogProps = {
  open: boolean;
  handleClose: () => void;
};

export default function OrderDetailDialog({ open, handleClose }: OrderDetailDialogProps) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { currentOrderDetail } = useSelector((state) => state.order);
  const handleUpdateOrder = async () => {
    try {
      const updateRes = await orderApi.updateOrderStatus(currentOrderDetail?.id ?? '', 10);
      console.log('updateRes', updateRes);
      enqueueSnackbar('Update successfully!');
    } catch (error: any) {
      console.log('error', error);
      enqueueSnackbar('Error!', { variant: 'error' });
    }
  };
  return (
    <>
      <Dialog open={open} maxWidth={'sm'} onClose={handleClose} fullWidth>
        <Stack direction="row" justifyContent={'space-between'} alignItems={'center'} pt={1} px={3}>
          <Typography variant="h4">Chi tiết</Typography>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (currentOrderDetail?.orderStatus === OrderStatusEnum.PROCESSING && 'info') ||
              (currentOrderDetail?.orderStatus === OrderStatusEnum.PAYMENT_PENDING && 'warning') ||
              (currentOrderDetail?.orderStatus === OrderStatusEnum.DELIVERING && 'primary') ||
              (currentOrderDetail?.orderStatus === OrderStatusEnum.USER_CANCEL && 'error') ||
              (currentOrderDetail?.orderStatus === OrderStatusEnum.FINISHED && 'success') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {currentOrderDetail?.orderStatus && getOrderStatus(currentOrderDetail.orderStatus)}
          </Label>
        </Stack>

        <DialogContent>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Khách hàng"
                content={currentOrderDetail?.customer?.name}
                icon="material-symbols:person-outline"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Khung giờ"
                content={`${currentOrderDetail?.timeSlot.arriveTime} - ${currentOrderDetail?.timeSlot.checkoutTime}`}
                icon="ri:time-line"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Ngày đặt"
                content={currentOrderDetail?.checkInDate && currentOrderDetail.checkInDate}
                icon="ri:time-line"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Trạm"
                content={currentOrderDetail?.station?.name}
                icon="mdi:box-outline"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Sản phẩm"
                content={
                  <div>
                    {currentOrderDetail?.orderDetails.map((e, index) => (
                      <div key={index}>
                        <span style={{ fontWeight: 'bold' }}>{`${e.quantity}x`}</span>
                        <span style={{ marginLeft: '4px', marginRight: '4px' }}>
                          {`${e.unitPrice / 1000}k`}
                        </span>
                        <span>({e.productName})</span>
                      </div>
                    ))}
                  </div>
                }
                icon="mdi:box-outline"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Tổng cộng"
                content={`${currentOrderDetail?.finalAmount}`}
                icon="ic:twotone-price-check"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Hoàn tiền"
                content={`-${currentOrderDetail?.refundAmount}`}
                icon="ic:twotone-price-check"
              />
            </Grid>
            <Grid item xs={12}>
              <DetailRowWithIcon
                title="Tổng cộng sau khi hoàn"
                content={`${currentOrderDetail?.finalAmountAfterRefund}`}
                icon="ic:twotone-price-check"
              />
            </Grid>
            <Grid
              sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
              item
              xs={12}
            >
              <DetailRowWithIcon
                title="Ghi chú"
                content={currentOrderDetail?.refundNote}
                icon="ph:note-light"
              />
            </Grid>

            {/* <Grid item xs={12}>
              <DetailRowWithIcon
                title="Số lượng"
                content={
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<Iconify icon="ooui:expand" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {currentOrderDetail?.orderDetails?.length.toString() +
                          ` item${
                            currentOrderDetail && currentOrderDetail?.orderDetails?.length > 1
                              ? 's'
                              : ''
                          }`}
                      </Typography>
                    </AccordionSummary>
                    <Typography>
                      {currentOrderDetail?.orderDetails?.map((order) => (
                        <DetailRowWithIcon
                          key={order.id}
                          title={order.productName}
                          content={'x ' + order.quantity}
                          icon=""
                        />
                      ))}
                    </Typography>
                  </Accordion>
                }
                icon="fluent-mdl2:quantity"
              />
            </Grid> */}
          </Grid>

          {/* <Divider sx={{ marginTop: 3, borderColor: 'primary.main' }} /> */}
        </DialogContent>

        {/* <DialogActions>
          <Button onClick={handleUpdateOrder} variant="contained">
            Box Stored
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
}
