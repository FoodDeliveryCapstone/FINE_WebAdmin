import { useEffect, useState } from 'react';
// next

// @mui
import { Card, Table, TableBody, TableContainer } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
// redux

// routes
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
// @types

// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';
// sections
import { FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import { getCustomerList, getTransactionRefund } from 'src/redux/slices/customer';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';

import { IconButton, Tooltip } from '@mui/material';
import { TTransactionRefund } from 'src/@types/fine/transaction';
import Iconify from 'src/components/Iconify';
import { useDispatch, useSelector } from 'src/redux/store';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import { getOrderList } from 'src/redux/slices/order';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TABLE_HEAD: FineTableHead[] = [
  { id: 'orderId', label: 'Mã đơn hàng', align: 'left', width: 100 },
  { id: 'cusId', label: 'Khách hàng', align: 'left', width: 100 },
  { id: 'amount', label: 'Tổng tiền hoàn lại', align: 'right', width: 100 },
  { id: 'type', label: 'Loại', align: 'right', width: 50 },
  { id: 'note', label: 'Ghi chú', align: 'right', width: 150 },
];

const TABLE_FILTERS: FineTableFilter[] = [
  {
    id: 'isPartyMode',
    title: '',
    items: [
      {
        title: '',
        value: 0,
      },
    ],
    isDefault: false,
  },
];
const DEFAULT_FILTER: TFilterItem = { name: '', value: 0 };
const ROWS_PER_PAGE = 10;
// ----------------------------------------------------------------------

TransactionRefund.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TransactionRefund() {
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
    defaultFilterBy: [DEFAULT_FILTER],
  });

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const [openDetail, setOpenDetail] = useState(false);
  const handleClickOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { transationRefundRes, isLoading: transactionLoading } = useSelector(
    (state) => state.customer
  );
  const { orderRes, isLoading: orderLoading } = useSelector((state) => state.order);
  const { customerRes, isLoading: customerLoading } = useSelector((state) => state.customer);
  const [tableData, setTableData] = useState<TTransactionRefund[]>([]);

  const [filterName, setFilterName] = useState('');

  function fetchApis() {
    const paramsOrder: { [key: string]: string | number | boolean } = { page: page + 1 };
    for (const item of filterBy) {
      paramsOrder[item.name] = item.value;
    }
    dispatch(getCustomerList(200));
    dispatch(getOrderList(paramsOrder));
    dispatch(getTransactionRefund({ page: page + 1 }));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  useEffect(() => {
    if (transationRefundRes?.data) {
      setTableData(transationRefundRes.data);
    }
  }, [transationRefundRes]);

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterTable = (filterItem: TFilterItem) => {
    onChangeFilterBy(filterItem);
    setPage(0);
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
  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!transactionLoading && !dataFiltered.length);

  return (
    <Page title="Lịch sử hoàn tiền">
      <Box sx={{ width: '100%' }}>
        <Card>
          <FineTableToolbar
            disableFilter
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
                  {(transactionLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TTransactionRefund, index) => {
                      if (row) {
                        const detailRefund = orderRes?.data.find(
                          (order) => order.id === row.orderId
                        );
                        const cusId = detailRefund?.customerId;
                        const detailCustomer = customerRes?.data.find(
                          (customer) => customer.id === cusId
                        );
                        const cusName = detailCustomer?.name;
                        console.log('detailCustomer', detailCustomer);

                        const newType = row.type == 3 ? 'Hoàn tiền' : '...';
                        const priceFormat = `${row.amount / 1000}k`;
                        const newRow = {
                          ...row,
                          type: newType,
                          amount: priceFormat,
                          cusId: cusName,
                        };

                        return (
                          <FineTableRow
                            key={newRow.id}
                            row={newRow}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
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

          {transationRefundRes && (
            <FineTablePagination
              count={transationRefundRes.metadata.total}
              page={page}
              rowsPerPage={rowsPerPage}
              dense={dense}
              onChangeRowsPerPage={onChangeRowsPerPage}
              onChangePage={onChangePage}
              onChangeDense={onChangeDense}
            />
          )}
        </Card>
      </Box>
    </Page>
  );
}

// ----------------------------------------------------------------------
