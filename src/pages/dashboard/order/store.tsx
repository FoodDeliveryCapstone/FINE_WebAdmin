import { useEffect, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { TOrderDetail } from 'src/@types/fine/order';
import { TStore } from 'src/@types/fine/store';
import { FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import useAuth from 'src/hooks/useAuth';
import { getOrderDetailListByStore } from 'src/redux/slices/order';
import { getStoreList } from 'src/redux/slices/store';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

type TOrderDetailFilterParams = {
  isPartyMode?: boolean;
  checkInDate?: string;
  orderDetailStatus?: number;
};

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'productName', label: 'Name', align: 'left', width: 200 },
  // { id: 'unitPrice', label: 'Unit Price (VNĐ)', align: 'right', width: 200 },
  { id: 'quantity', label: 'Quantity', align: 'right', width: 50 },
  { id: 'totalAmount', label: 'Total (VNĐ)', align: 'right', width: 120 },
  { id: 'note', label: 'Note', align: 'left', width: 200 },
  { id: 'action', label: '', align: 'center', width: 100 },
];

const TABLE_FILTERS: FineTableFilter[] = [
  {
    id: '',
    title: '',
    items: [
      {
        title: '',
        value: '',
      },
      {
        title: '',
        value: '',
      },
    ],
    isDefault: false,
  },
];
const DEFAULT_FILTER: TFilterItem = {
  name: 'orderDetailStatus',
  value: 3,
};
const ROWS_PER_PAGE = 10;
// ----------------------------------------------------------------------

StoreOrderList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreOrderList() {
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

  const { storeRes, isLoading: orderDetailLoading } = useSelector((state) => state.store);
  const { orderDetailByStoreRes, isLoading: orderLoading } = useSelector((state) => state.order);
  const [selectedStore, setSelectedStore] = useState<TStore | null>(null);
  const [tableData, setTableData] = useState<TOrderDetail[]>([]);
  const { user } = useAuth();
  const [filterName, setFilterName] = useState('');

  async function fetchApis() {
    dispatch(getStoreList(1));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page]);
  useEffect(() => {
    dispatch(
      getOrderDetailListByStore({ storeId: selectedStore?.id ?? '', params: { page: page + 1 } })
    );
  }, [dispatch, selectedStore, storeRes]);
  // useEffect(() => {
  //   const refetchApiInterval = setInterval(() => {
  //     fetchApis();
  //   }, 30000);
  //   return () => clearInterval(refetchApiInterval);
  // }, [page, orderDetailFilterParams]);

  useEffect(() => {
    if (orderDetailByStoreRes?.data) {
      setTableData(orderDetailByStoreRes?.data);
    }
  }, [orderDetailByStoreRes]);
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
  const denseHeight = dense ? 60 : 80;

  const filterTableHead = TABLE_HEAD.filter(
    (head) => !filterBy.map((filter) => filter.name).includes(head.id)
  );

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!orderDetailLoading && !dataFiltered.length);

  useEffect(() => {
    if (user?.role === 'staff') {
      const staffStore = storeRes?.data.find((store) => store.id === user?.storeId);
      if (staffStore) {
        setSelectedStore(staffStore);
      }
    }
  }, [user, storeRes]);
  return (
    <Page title="Store List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đặt hàng cửa hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Order',
            },
            { name: 'Danh sách đặt hàng cửa hàng' },
          ]}
        />
        {user?.role === 'admin' ? (
          <>
            <ButtonGroup size="medium" aria-label="large button group">
              {storeRes?.data?.map((store) => {
                if (store.isActive) {
                  return (
                    <Button key={store.id} onClick={() => setSelectedStore(store)}>
                      {store.storeName}
                    </Button>
                  );
                } else {
                  return null;
                }
              })}
            </ButtonGroup>
          </>
        ) : (
          <Typography variant="h6">Your store to manage is {selectedStore?.storeName}</Typography>
        )}

        {selectedStore && (
          <Card>
            <FineTableToolbar
              disableFilter
              tableName={`${selectedStore.storeName}'s Orders`}
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
                    // actions={
                    //   <Tooltip title="Delete">
                    //     <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                    //       <Iconify icon={'eva:trash-2-outline'} />
                    //     </IconButton>
                    //   </Tooltip>
                    // }
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
                    {(orderDetailLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                      (row: TOrderDetail, index) => {
                        if (row) {
                          const priceFormat = `${row.totalAmount / 1000}k`;
                          const newRow = {
                            ...row,

                            totalAmount: priceFormat,
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

                      // row ? (
                      //   <FineTableRow
                      //     key={row.id}
                      //     row={row}
                      //     tableHeads={TABLE_HEAD}
                      //     filterBy={filterBy}
                      //     selected={selected.includes(row.id)}
                      //     onSelectRow={() => onSelectRow(row.id)}
                      //     onDeleteRow={() => handleDeleteRow(row.id)}
                      //     onEditRow={() => handleEditRow(row.id)}
                      //   />
                      // ) : (
                      //   !isNotFound && (
                      //     <TableSkeleton
                      //       key={index}
                      //       numOfColumns={filterTableHead.length}
                      //       sx={{ height: denseHeight }}
                      //     />
                      //   )
                      // )
                    )}

                    {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            {storeRes && (
              <FineTablePagination
                count={orderDetailByStoreRes?.metadata.total ?? 0}
                page={page}
                rowsPerPage={rowsPerPage}
                dense={dense}
                onChangeRowsPerPage={onChangeRowsPerPage}
                onChangePage={onChangePage}
                onChangeDense={onChangeDense}
              />
            )}
          </Card>
        )}
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------
