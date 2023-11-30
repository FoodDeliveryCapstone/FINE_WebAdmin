import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';
import { TOrder, TOrderDialog } from 'src/@types/fine/order';
import { FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import Iconify from 'src/components/Iconify';
import { getCustomerList } from 'src/redux/slices/customer';
import { getOrderList, setCurrentOrderDetail } from 'src/redux/slices/order';
import { getStationList } from 'src/redux/slices/station';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import OrderDetailDialog from 'src/sections/@dashboard/order/OrderDetailDialog';
import { OrderStatusEnum, getOrderStatus } from 'src/utils/constants';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'customerName', label: 'Khách hàng', align: 'left', width: 120 },
  { id: 'orderStatus', label: 'Trạng thái', align: 'left', width: 100 },
  { id: 'checkInDate', label: 'Ngày đặt', align: 'left', width: 180 },
  { id: 'timeSlotRange', label: 'Khung giờ', align: 'left', width: 170 },
  { id: 'finalAmount', label: 'Tổng cộng', align: 'center', width: 100 },
  { id: 'refundAmount', label: 'Hoàn tiền', align: 'center', width: 100 },
  { id: 'finalAmountAfterRefund', label: 'Tính lại', align: 'center', width: 100 },
  { id: 'refundNote', label: 'Ghi chú', align: 'center', width: 250 },
  { id: 'edit', label: '', align: 'left', width: 120 },
];

const TABLE_FILTERS: FineTableFilter[] = [
  {
    id: 'isPartyMode',
    title: 'Order Type',
    items: [
      {
        title: 'Đơn thường',
        value: false,
      },
      {
        title: 'Đơn nhóm',
        value: true,
      },
    ],
    isDefault: false,
  },
  {
    id: 'orderStatus',
    title: 'Order Status',
    items: [
      {
        title: getOrderStatus(OrderStatusEnum.PAYMENT_PENDING),
        value: OrderStatusEnum.PAYMENT_PENDING,
        color: 'primary',
      },
      {
        title: getOrderStatus(OrderStatusEnum.PROCESSING),
        value: OrderStatusEnum.PROCESSING,
        color: 'primary',
      },
      {
        title: getOrderStatus(OrderStatusEnum.FINISHED_PREPARE),
        value: OrderStatusEnum.FINISHED_PREPARE,
        color: 'primary',
      },
      {
        title: getOrderStatus(OrderStatusEnum.DELIVERING),
        value: OrderStatusEnum.DELIVERING,
        color: 'primary',
      },
      {
        title: getOrderStatus(OrderStatusEnum.BOXSTORED),
        value: OrderStatusEnum.BOXSTORED,
        color: 'primary',
      },
      {
        title: getOrderStatus(OrderStatusEnum.FINISHED),
        value: OrderStatusEnum.FINISHED,
        color: 'primary',
      },
      {
        title: getOrderStatus(OrderStatusEnum.USER_CANCEL),
        value: OrderStatusEnum.USER_CANCEL,
        color: 'error',
      },
    ],
    isDefault: true,
  },
];
const DEFAULT_FILTERS: TFilterItem[] = [
  {
    name: 'orderStatus',
    value: 3,
  },
  {
    name: 'isPartyMode',
    value: false,
  },
];
const ROWS_PER_PAGE = 10;
// ----------------------------------------------------------------------

OrderList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function OrderList() {
  const {
    dense,
    page,
    order,
    orderBy,
    filterBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectFilterBy,
    onChangeFilterBy,
    onChangePage,
    onChangeRowsPerPage,
    onSelectRow,
    onSelectAllRows,
    //
    onChangeDense,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt',
    defaultRowsPerPage: ROWS_PER_PAGE,
    defaultFilterBy: DEFAULT_FILTERS,
  });

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleClickOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };
  const { orderRes, isLoading: orderLoading } = useSelector((state) => state.order);
  const { customerRes, isLoading: customerLoading } = useSelector((state) => state.customer);
  const { stationRes, isLoading: stationLoading } = useSelector((state) => state.station);

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  const [filterName, setFilterName] = useState('');
  function fetchApis() {
    const paramsOrder: { [key: string]: string | number | boolean } = { page: page + 1 };
    for (const item of filterBy) {
      paramsOrder[item.name] = item.value;
    }

    dispatch(getOrderList(paramsOrder));
    dispatch(getCustomerList(200));
    dispatch(getStationList(1));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);
  useEffect(() => {
    if (orderRes?.data) {
      setTableData(orderRes.data);
    }
  }, [orderRes]);
  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterTable = (filterItem: TFilterItem) => {
    onChangeFilterBy(filterItem);
    setPage(0);
  };
  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: string) => {
    console.log('');
  };
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const filterTableHead = TABLE_HEAD.filter(
    (head) => !filterBy.map((filter) => filter.name).includes(head.id)
  );

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!orderLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách đơn hàng">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Danh sách đơn hàng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },

            { name: 'Danh sách đơn hàng', href: PATH_DASHBOARD.order.list },
          ]}
        />
        <OrderDetailDialog open={openDetail} handleClose={handleCloseDetail} />
        <Card>
          <FineTableToolbar
            // hasSearch
            tableName=""
            filterName={filterName}
            onFilterName={handleFilterName}
            filterBy={filterBy}
            handleRefetch={fetchApis}
            tableFilters={TABLE_FILTERS}
            onFilterTable={handleFilterTable}
            onSelectFilter={onSelectFilterBy}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={filterBy ? filterTableHead : TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />
                <TableBody>
                  {(orderLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TOrder, index) => {
                      if (row) {
                        const detailCustomer = customerRes?.data.find(
                          (customer) => customer.id === row.customerId
                        );
                        const timeSlotRange = `${row.timeSlot.arriveTime} - ${row.timeSlot.checkoutTime}`;
                        const priceFormat = `${row.finalAmount / 1000}k`;
                        const priceFormatrefund = `${row.refundAmount / 1000}k`;
                        const priceFormatfinalAmount = `${row.finalAmountAfterRefund / 1000}k`;
                        const station = stationRes?.data.find(
                          (station) => station.id === row.stationId
                        );
                        const originalDate = new Date(row.checkInDate);
                        const day = originalDate.getDate().toString().padStart(2, '0');
                        const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
                        const year = originalDate.getFullYear();
                        const hours = originalDate.getHours().toString().padStart(2, '0');
                        const minutes = originalDate.getMinutes().toString().padStart(2, '0');
                        const seconds = originalDate.getSeconds().toString().padStart(2, '0');
                        const orderDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                        console.log(orderDate);
                        const newRow = {
                          ...row,
                          timeSlotRange: timeSlotRange,
                          customerName: detailCustomer?.name,
                          checkInDate: orderDate.toLocaleString(),
                          finalAmount: priceFormat,
                          refundAmount: priceFormatrefund,
                          finalAmountAfterRefund:
                            priceFormatfinalAmount == '0k' ? '' : priceFormatfinalAmount,
                        };

                        return (
                          <FineTableRow
                            key={newRow.id}
                            row={newRow}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            primaryAction={
                              <>
                                <Tooltip title="Detail">
                                  <Button
                                    variant="outlined"
                                    onClick={() => {
                                      const OrderDialog: TOrderDialog = {
                                        customer: detailCustomer,
                                        station: station,
                                        ...newRow,
                                      };
                                      dispatch(setCurrentOrderDetail(OrderDialog)),
                                        handleClickOpenDetail();
                                    }}
                                  >
                                    <Iconify icon={'bx:detail'} />
                                  </Button>
                                </Tooltip>
                              </>
                            }
                            tableHeads={TABLE_HEAD}
                            filterBy={filterBy}
                          />
                        );
                      } else
                        return (
                          !isNotFound && (
                            <TableSkeleton
                              key={index}
                              numOfColumns={filterTableHead.length}
                              sx={{ height: denseHeight }}
                            />
                          )
                        );
                    }
                  )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {orderRes && (
            <FineTablePagination
              count={orderRes.metadata.total}
              page={page}
              rowsPerPage={rowsPerPage}
              dense={dense}
              onChangeRowsPerPage={onChangeRowsPerPage}
              onChangePage={onChangePage}
              onChangeDense={onChangeDense}
            />
          )}
        </Card>
      </Container>
    </Page>
  );
}
