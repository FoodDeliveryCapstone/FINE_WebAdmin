export enum OrderStatusEnum {
  PRE_ORDER = 1,
  PRE_PARTYORDER = 2,
  PAYMENT_PENDING = 3,
  PROCESSING = 4,
  FINISHED_PREPARE = 6,
  // SHIPPER_ASSIGNED = 7,
  DELIVERING = 9,
  BOXSTORED = 10,
  FINISHED = 11,
  USER_CANCEL = 12,
}
export enum OrderTypeEnum {
  ATSTORE = 'ATSTORE',
  DELIVERY = 'DELIVERY',
}

export enum PaymentTypeEnum {
  CASH = 'Thanh toán bằng tiền mặt',
  MOMO = 'Thanh toán bằng Momo',
  ZALOPAY = 'Thanh toán bằng Zalopay',
}
export enum UpdateOrderTypeEnum {
  USER_CANCEL = 'USERCANCEL',
  FINISH_ORDER = 'FINISHORDER',
  UPDATE_DETAILS = 'UPDATEDETAILS',
}
export enum MenuDateFilterEnums {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum MenuHourFilterEnums {
  BREAKFAST = 'BREAKFAST',
  BRUNCH = 'BRUNCH',
  LUNCH = 'LUNCH',
  TEA = 'TEA',
  DINNER = 'DINNER',
}

// export function getOrderType(status: number) {
//   switch (status) {
//     case 1:
//       return 'Khởi tạo đơn';
//     default:
//       return 'Khách hàng đã hủy';
//   }
// }

// export function getOrderStatus(status: number) {
//   switch (status) {
//     case 1:
//       return 'Khởi tạo đơn';
//     case 2:
//       return 'Khởi tạo đơn nhóm';
//     case 3:
//       return 'Chờ thanh toán';
//     case 4:
//       return 'Đang xử lý';
//     case 7:
//       return 'Shipper đã nhận';
//     case 9:
//       return 'Đang giao';
//     case 10:
//       return 'Hoàn thành';
//     case 11:
//       return 'Khách hàng đã hủy';
//     default:
//       return 'Chưa rõ trạng thái';
//   }
// }

export function getOrderStatus(status: number) {
  switch (status) {
    case 1:
      return 'Preparing Order';
    case 2:
      return 'Preparing Party Order';
    case 3:
      return 'Chờ thanh toán';
    case 4:
      return 'Đang xử lý';
    case 6:
      return 'Đã chuẩn bị';
    case 9:
      return 'Đang giao';
    case 10:
      return 'Đã giao vào trạm';
    case 11:
      return 'Hoàn thành';
    case 12:
      return 'Đơn huỷ';
    default:
      return 'Unknown';
  }
}

export function getOrderTypeValue(status: string) {
  switch (status) {
    case OrderTypeEnum.ATSTORE.toString():
      return 1;
    default:
      return 2;
  }
}

export function getPaymentTypeValue(type: string) {
  switch (type) {
    case PaymentTypeEnum.MOMO.toString():
      return 2;
    case PaymentTypeEnum.ZALOPAY.toString():
      return 3;
    default:
      return 1;
  }
}
