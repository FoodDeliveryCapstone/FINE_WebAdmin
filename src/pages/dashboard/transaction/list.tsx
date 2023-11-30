import { useEffect, useState } from 'react';
// next

// @mui
import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import * as React from 'react';
// redux

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
// @types

// layouts
import Layout from '../../../layouts';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
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
import { getCustomerList, getTransaction } from 'src/redux/slices/customer';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';

import { IconButton, Tooltip } from '@mui/material';
import { TTransaction } from 'src/@types/fine/transaction';
import Iconify from 'src/components/Iconify';
import { useDispatch, useSelector } from 'src/redux/store';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import ProductReportList from './listProductReport';
import TransactionRefund from './listRefund';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const TABLE_HEAD: FineTableHead[] = [
  { id: 'accountId', label: 'Tài khoản', align: 'left', width: 50 },
  { id: 'amount', label: 'Tổng tiền', align: 'left', width: 50 },
  { id: 'status', label: 'Trạng thái', align: 'left', width: 100 },
  { id: 'type', label: 'Loại', align: 'left', width: 50 },
  { id: 'notes', label: 'ghi chú', align: 'left', width: 100 },
  { id: 'createdAt', label: 'Ngày tạo', align: 'left', width: 50 },
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

Transaction.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Transaction() {
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
  const { transationRes, isLoading: transactionLoading } = useSelector((state) => state.customer);
  const { customerRes, isLoading: customerLoading } = useSelector((state) => state.customer);

  const [tableData, setTableData] = useState<TTransaction[]>([]);

  const [filterName, setFilterName] = useState('');

  function fetchApis() {
    dispatch(getTransaction({ page: page + 1 }));
    dispatch(getCustomerList(200));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  useEffect(() => {
    if (transationRes?.data) {
      setTableData(transationRes.data);
    }
  }, [transationRes]);

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
    <Page title="Lịch sử giao dịch">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lịch sử giao dịch"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Lịch sử giao dịch' }]}
        />
        <Box sx={{ width: '110%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Lịch sử giao dịch" {...a11yProps(0)} />
              <Tab label="Lịch sử hoàn tiền" {...a11yProps(1)} />
              <Tab label="Báo cáo sản phẩm" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
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
                        (row: TTransaction, index) => {
                          if (row) {
                            const originalDate = new Date(row.createdAt);
                            const day = originalDate.getDate().toString().padStart(2, '0');
                            const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
                            const year = originalDate.getFullYear();
                            const hours = originalDate.getHours().toString().padStart(2, '0');
                            const minutes = originalDate.getMinutes().toString().padStart(2, '0');
                            const seconds = originalDate.getSeconds().toString().padStart(2, '0');
                            const orderDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                            const newType = row.type == 1 ? 'Điểm' : 'Ví Fine';
                            const newStatus =
                              row.status == 1
                                ? 'Đang xử lý'
                                : row.status == 2
                                ? 'Thành công'
                                : 'Thất bại';
                            const priceFormat =
                              row.amount % 1000 ? `${row.amount} điểm` : `${row.amount / 1000}k `;
                            const newRow = {
                              ...row,
                              createdAt: orderDate.toLocaleString(),
                              type: newType,
                              status: newStatus,
                              amount: priceFormat,
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

              {transationRes && (
                <FineTablePagination
                  count={transationRes.metadata.total}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  dense={dense}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                  onChangePage={onChangePage}
                  onChangeDense={onChangeDense}
                />
              )}
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TransactionRefund />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ProductReportList />
          </CustomTabPanel>
        </Box>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------
