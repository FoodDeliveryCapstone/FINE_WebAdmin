import { useState, useEffect } from 'react';
// next

// @mui
import { Card, Table, TableBody, Container, TableContainer, MenuItem } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';

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
import { TableNoData, TableSkeleton, TableHeadCustom } from '../../../components/table';
// sections
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import OrderDetailDialog from 'src/sections/@dashboard/order/OrderDetailDialog';
import { FineFormConfig, FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import { getDestinationList } from 'src/redux/slices/destination';
import { TDestination } from 'src/@types/fine/destination';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import Iconify from 'src/components/Iconify';
import { Button } from '@mui/material';
import FineTableForm from 'src/sections/@dashboard/fine/FineTableForm';
import destinationApi from 'src/apis/destination';
import { useRouter } from 'next/router';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'name', label: 'Địa điểm', align: 'left', width: 150 },
  { id: 'code', label: 'Mã code', align: 'left', width: 150 },
  { id: 'lat', label: 'Lat', align: 'left', width: 150 },
  { id: 'long', label: 'Long', align: 'left', width: 150 },
  { id: 'isActive', label: 'Đang hoạt động', align: 'center', width: 150 },
  { id: 'none', label: 'Tạm vắng', align: 'center', width: 150 },
];
const validationConfigs: FineFormConfig[] = [
  {
    id: 'name',
    validationType: 'string',
    label: 'Tên khu vực',
    validations: [{ type: 'required', params: ['Image is required'] }],
  },
  {
    id: 'code',
    validationType: 'string',
    label: 'Mã code',
    validations: [{ type: 'required', params: ['Destination is required'] }],
  },
  {
    id: 'lat',
    validationType: 'string',
    label: 'Kinh độ',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'long',
    validationType: 'string',
    label: 'Vĩ độ',
    validations: [{ type: 'required', params: ['Contact Person is required'] }],
  },
  // Add more validation configs as needed
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

DestinationList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function DestinationList() {
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
  const router = useRouter();
  const handleClickOpenDetail = () => {
    setOpenDetail(true);
  };
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const { destinationRes, isLoading: destinationLoading } = useSelector(
    (state) => state.destination
  );

  const [tableData, setTableData] = useState<TDestination[]>([]);

  const [filterName, setFilterName] = useState('');
  const [dataEdit, setDataEdit] = useState<TDestination>();
  function fetchApis() {
    dispatch(getDestinationList({ page: page + 1 }));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  useEffect(() => {
    if (destinationRes?.data) {
      setTableData(destinationRes.data);
    }
  }, [destinationRes]);
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

  const validationConfigs: FineFormConfig[] = [
    {
      id: 'name',
      validationType: 'string',
      label: 'Tên khu vực',
      validations: [{ type: 'required', params: ['Image is required'] }],
      defaultValue: dataEdit?.name,
    },

    {
      id: 'lat',
      validationType: 'string',
      label: 'Kinh độ',
      validations: [{ type: 'required', params: ['Store Name is required'] }],
      defaultValue: dataEdit?.lat,
    },
    {
      id: 'long',
      validationType: 'string',
      label: 'Vĩ độ',
      validations: [{ type: 'required', params: ['Contact Person is required'] }],
      defaultValue: dataEdit?.long,
    },
    {
      id: 'isActive',
      validationType: 'boolean',
      label: 'isActive code',
      validations: [{ type: 'required', params: ['Destination is required'] }],
    },
    // Add more validation configs as needed
  ];
  const handleEditRow = (id: string) => {
    const store = tableData.find((row) => row.id === id);
    setDataEdit(store);
  };

  const handleSubmitForm = async (data: any) => {
    const { name, long, lat, isActive } = data;
    const payload = {
      name: name,
      long: long,
      lat: lat,
      isActive: isActive,
    };

    if (Object.keys(payload).length > 0) {
      const updateRes = await destinationApi.updateDestination(dataEdit?.id, payload);
      console.log('updateRes', updateRes);
    } else {
      console.log('No fields to update.');
    }
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
  const handleOpenCreateForm = () => {
    setIsEdit(false);
    setOpenForm(true);
  };
  const handleOpenEditForm = (test: any) => {
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setDataEdit(undefined);
  };

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!destinationLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách địa điểm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách địa điểm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Danh sách địa điểm', href: PATH_DASHBOARD.destination.list },
            { name: 'Tạo địa điểm', href: PATH_DASHBOARD.destination.create },
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard/destination/create')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo địa điểm
            </Button>
          }
        />
        <FineTableForm
          title="Store"
          isEdit={isEdit}
          open={openForm}
          handleClose={handleCloseForm}
          formConfigs={validationConfigs}
          handleSubmitForm={handleSubmitForm}
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
                  {(destinationLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TDestination, index) => {
                      if (row) {
                        const newStatus = row.isActive === false ? false : '';
                        const newStatusActive = row.isActive === true ? true : '';
                        const newRow = {
                          ...row,
                          none: newStatus,
                          isActive: newStatusActive,
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
                            menuActions={
                              <>
                                <MenuItem
                                  onClick={() => {
                                    handleOpenEditForm(handleEditRow(row.id));
                                  }}
                                >
                                  <Iconify icon={'eva:edit-fill'} />
                                  Edit
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

          {destinationRes && (
            <FineTablePagination
              count={destinationRes.metadata.total}
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
