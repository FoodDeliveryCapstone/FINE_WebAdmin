import { useEffect, useState } from 'react';
import { Button, Card, Container, MenuItem, Table, TableBody, TableContainer } from '@mui/material';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../../components/table';
import { useRouter } from 'next/router';
import { TStore } from 'src/@types/fine/store';
import { FineFormConfig, FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import storeApi from 'src/apis/store';
import Iconify from 'src/components/Iconify';
import { getStoreList } from 'src/redux/slices/store';
import FineTableForm from 'src/sections/@dashboard/fine/FineTableForm';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import OrderDetailDialog from 'src/sections/@dashboard/order/OrderDetailDialog';
import { NumeralJSUtils } from 'numeral';

const TABLE_HEAD: FineTableHead[] = [
  { id: 'storeName', label: 'Tên cửa hàng', align: 'left', width: 150 },
  { id: 'contactPerson', label: 'Người liên hệ', align: 'left', width: 150 },
  { id: 'isActive', label: 'Đang hoạt động', align: 'center', width: 150 },
  { id: 'destinationId', label: 'Địa điểm', align: 'left', width: 150 },
];

const TABLE_FILTERS: FineTableFilter[] = [
  {
    id: 'a',
    title: '',
    items: [
      {
        title: '',
        value: '',
      },
    ],
    isDefault: false,
  },
];

const DEFAULT_FILTER: TFilterItem = { name: '', value: 0 };
const ROWS_PER_PAGE = 10;

StoreList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function StoreList() {
  const {
    dense,
    page,
    order,
    orderBy,
    filterBy,
    rowsPerPage,
    selected,
    setPage,
    setSelected,
    onSelectFilterBy,
    onChangeFilterBy,
    onChangePage,
    onChangeRowsPerPage,
    onSelectRow,
    onSelectAllRows,
    onChangeDense,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt',
    defaultRowsPerPage: ROWS_PER_PAGE,
    defaultFilterBy: [DEFAULT_FILTER],
  });

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const { storeRes, isLoading: storeLoading } = useSelector((state) => state.store);
  const [tableData, setTableData] = useState<TStore[]>([]);
  const [filterName, setFilterName] = useState('');
  const [dataEdit, setDataEdit] = useState<TStore>();

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenEditForm = (test: any) => {
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setDataEdit(undefined);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterTable = (filterItem: TFilterItem) => {
    onChangeFilterBy(filterItem);
    setPage(0);
  };

  function fetchApis() {
    dispatch(getStoreList({ page: page + 1 }));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  useEffect(() => {
    if (storeRes?.data) {
      setTableData(storeRes.data);
    }
  }, [storeRes]);

  const validationConfigs: FineFormConfig[] = [
    {
      id: 'imageUrl',
      validationType: 'string',
      label: 'Hình ảnh',
      defaultValue: dataEdit?.imageUrl,
    },
    {
      id: 'destinationId',
      validationType: 'string',
      label: 'Địa điểm',
      defaultValue: dataEdit?.destinationId,
    },
    {
      id: 'storeName',
      validationType: 'string',
      label: 'Cửa hàng',
      defaultValue: dataEdit?.storeName,
    },
    {
      id: 'contactPerson',
      validationType: 'string',
      label: 'Người phụ trách',
      defaultValue: dataEdit?.contactPerson,
    },

    {
      id: 'isActive',
      validationType: 'boolean',
      label: 'Trạng thái',
    },
  ];

  const handleEditRow = (id: string) => {
    const store = tableData.find((row) => row.id === id);
    setDataEdit(store);
  };

  const handleUpdateForm = async (data: any) => {
    const { imageUrl, storeName, destinationId, contactPerson, isActive } = data;
    const selectedImageUrl = imageUrl !== '' && imageUrl != null ? imageUrl : dataEdit?.imageUrl;
    const selectedstoreName =
      storeName !== '' && storeName != null ? storeName : dataEdit?.storeName;
    const payload = {
      imageUrl: selectedImageUrl,
      storeName: selectedstoreName,
      destinationId: destinationId,
      contactPerson: contactPerson,
      isActive: isActive,
    };

    if (Object.keys(payload).length > 0) {
      const res = await storeApi.updateStore(dataEdit?.id, payload);
      setOpenForm(false);
      dispatch(getStoreList({ page: page + 1 }));
    } else {
      console.log('No fields to update.');
    }
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

  const denseHeight = dense ? 60 : 80;

  const filterTableHead = TABLE_HEAD.filter(
    (head) => !filterBy.map((filter) => filter.name).includes(head.id)
  );

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!storeLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách cửa hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách cửa hàng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách cửa hàng',
              href: PATH_DASHBOARD.store.list,
            },
            { name: 'Tạo cửa hàng', href: PATH_DASHBOARD.store.create },
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard/store/create')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo cửa hàng
            </Button>
          }
        />
        <OrderDetailDialog open={openDetail} handleClose={handleCloseDetail} />
        <FineTableForm
          title="Store"
          isEdit={isEdit}
          open={openForm}
          handleClose={handleCloseForm}
          formConfigs={validationConfigs}
          handleSubmitForm={handleUpdateForm}
        />
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
                  {(storeLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TStore, index) => {
                      if (row) {
                        const newDestination =
                          row.destinationId == '70248c0d-c39f-468f-9a92-4a5a7f1ff6bb'
                            ? 'FPT University'
                            : '';
                        const newRow = {
                          ...row,
                          destinationId: newDestination,
                        };

                        return (
                          <FineTableRow
                            key={newRow.id}
                            row={newRow}
                            tableHeads={TABLE_HEAD}
                            filterBy={filterBy}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleDeleteRow(row.id)}
                            menuActions={
                              <>
                                <MenuItem
                                  onClick={() => {
                                    handleOpenEditForm(handleEditRow(row.id));
                                  }}
                                >
                                  <Iconify icon={'eva:edit-fill'} />
                                  Chỉnh sửa
                                </MenuItem>
                              </>
                            }
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

          {storeRes && (
            <FineTablePagination
              count={storeRes.metadata.total}
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
