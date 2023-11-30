import { useState, useEffect } from 'react';
// next

// @mui
import { Card, Table, TableBody, Container, TableContainer } from '@mui/material';
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
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedActions,
} from '../../../components/table';
// sections

import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import OrderDetailDialog from 'src/sections/@dashboard/order/OrderDetailDialog';
import { FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import { getCustomerList } from 'src/redux/slices/customer';

import { TCustomer } from 'src/@types/fine/customer';
import { useDispatch, useSelector } from 'src/redux/store';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'name', label: 'Khách hàng', align: 'left', width: 100 },
  { id: 'dateOfBirth', label: 'Ngày sinh', align: 'left', width: 100 },
  { id: 'phone', label: 'Số điện thoại', align: 'left', width: 100 },
  { id: 'email', label: 'Email', align: 'left', width: 50 },
  { id: 'balance', label: 'Số dư ví', align: 'left', width: 100 },
  { id: 'point', label: 'Điểm', align: 'left', width: 50 },
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

CustomerList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CustomerList() {
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

  const { customerRes, isLoading: customerLoading } = useSelector((state) => state.customer);

  const [tableData, setTableData] = useState<TCustomer[]>([]);

  const [filterName, setFilterName] = useState('');

  function fetchApis() {
    dispatch(getCustomerList(page + 1));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  // useEffect(() => {
  //   const refetchApiInterval = setInterval(() => {
  //     fetchApis();
  //   }, 30000);
  //   return () => clearInterval(refetchApiInterval);
  // }, [page, orderFilterParams]);

  useEffect(() => {
    if (customerRes?.data) {
      setTableData(customerRes.data);
    }
  }, [customerRes]);
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
    (!dataFiltered.length && !!filterName) || (!customerLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách khách hàng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách khách hàng',
              href: PATH_DASHBOARD.user.customer,
            },
           
          ]}
        />
        <OrderDetailDialog open={openDetail} handleClose={handleCloseDetail} />
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
                  {(customerLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TCustomer, index) => {
                      if (row) {
                        const formattedNumber = `+84${'*'.repeat(
                          row.phone.length - 3
                        )}${row.phone.slice(-3)}`;
                        const newRow = {
                          ...row,
                          phone: formattedNumber,
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

          {customerRes && (
            <FineTablePagination
              count={customerRes.metadata.total}
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

// ----------------------------------------------------------------------
