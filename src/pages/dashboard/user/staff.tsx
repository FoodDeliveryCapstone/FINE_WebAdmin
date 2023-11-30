import { useState, useEffect } from 'react';
// next

// @mui
import { Card, Table, TableBody, Container, TableContainer, MenuItem, Button } from '@mui/material';
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
import { FineFormConfig, FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import { getCustomerList } from 'src/redux/slices/customer';

import { TCustomer } from 'src/@types/fine/customer';
import { useDispatch, useSelector } from 'src/redux/store';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { TStaff } from 'src/@types/fine/staff';
import { getStaffList } from 'src/redux/slices/staff';
import FineTableForm from 'src/sections/@dashboard/fine/FineTableForm';
import staffApi from 'src/apis/staff';
import { useRouter } from 'next/router';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'username', label: 'Tài khoản', align: 'left', width: 50 },
  { id: 'name', label: 'Nhân viên', align: 'left', width: 100 },
  { id: 'roleType', label: 'Chức vụ', align: 'center', width: 100 },
  { id: 'storeId', label: 'Cửa hàng', align: 'left', width: 150 },
  { id: 'isActive', label: 'Trạng thái', align: 'center', width: 150 },
  { id: 'none', label: 'Tạm vắng', align: 'left', width: 150 },
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

StaffList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StaffList() {
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
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const [dataEdit, setDataEdit] = useState<TStaff>();

  const { staffRes, isLoading: staffLoading } = useSelector((state) => state.staff);

  const [tableData, setTableData] = useState<TStaff[]>([]);

  const [filterName, setFilterName] = useState('');
  const router = useRouter();
  function fetchApis() {
    dispatch(getStaffList({ page: page + 1 }));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  useEffect(() => {
    if (staffRes?.data) {
      setTableData(staffRes.data);
    }
  }, [staffRes]);
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

  const validationConfigs: FineFormConfig[] = [
    {
      id: 'name',
      validationType: 'string',
      label: 'Họ và Tên',
      validations: [{ type: 'required', params: ['Image is required'] }],
      defaultValue: dataEdit?.name,
    },
    {
      id: 'storeId',
      validationType: 'string',
      label: 'Cửa hàng',
      validations: [{ type: 'required', params: ['Is Active is required'] }],
      defaultValue:
        dataEdit?.storeId == '751a2190-d06c-4d5e-9c5a-08c33c3db266'
          ? '7-Eleven'
          : dataEdit?.storeId == 'e19422e9-2c97-4c6e-8919-f4ae0fa739d5'
          ? 'Laha'
          : dataEdit?.storeId == '8db35955-bbc5-40fb-b638-cb44ac786519'
          ? 'Passio'
          : 'Bảo Store',
    },
    {
      id: 'roleType',
      validationType: 'string',
      label: 'Chức vụ',
      validations: [{ type: 'required', params: ['Is Active is required'] }],
      defaultValue: dataEdit?.roleType.toString(),
    },
    {
      id: 'isActive',
      validationType: 'boolean',
      label: 'Is Active',
    },
    // Add more validation configs as needed
  ];
  const handleEditRow = (id: string) => {
    const staff = tableData.find((row) => row.id === id);
    console.log('staff', staff);

    setDataEdit(staff);
  };

  const handleSubmitForm = async (data: any) => {
    const { name, username, pass, roleType, storeId } = data;
    const payload = {
      name: name,
      roleType: roleType,
      pass: pass,
      username: username,
      storeId: storeId,
    };

    if (Object.keys(payload).length > 0) {
      const updateRes = await staffApi.updateStaff(dataEdit?.id, payload);
      console.log('updateRes', updateRes);
      setOpenForm(false);
      dispatch(getStaffList({ page: page + 1 }));
    } else {
      console.log('No fields to update.');
    }
  };
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
    (!dataFiltered.length && !!filterName) || (!staffLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách nhân viên">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách nhân viên"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách nhân viên',
              href: PATH_DASHBOARD.user.staff,
            },
            { name: 'Tạo nhân viên', href: PATH_DASHBOARD.user.create },
          ]}
          action={
            <>
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard/user/create')}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Tạo nhân viên
              </Button>
            </>
          }
        />{' '}
        <FineTableForm
          title="Store"
          isEdit={isEdit}
          open={openForm}
          handleClose={handleCloseForm}
          formConfigs={validationConfigs}
          handleSubmitForm={handleSubmitForm}
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
                  {(staffLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TStaff, index) => {
                      if (row) {
                        const newStatus = row.isActive === false ? false : '';
                        const newStatusActive = row.isActive === true ? true : '';
                        const newRoleTyoe =
                          row.roleType == 1
                            ? 'Admin'
                            : row.roleType == 2
                            ? 'Nhân viên'
                            : row.roleType == 3
                            ? 'Shipper'
                            : '';
                        const newStore =
                          row.storeId == '751a2190-d06c-4d5e-9c5a-08c33c3db266'
                            ? '7-Eleven'
                            : row.storeId == '8db35955-bbc5-40fb-b638-cb44ac786519'
                            ? 'Passio '
                            : row.storeId == 'e19422e9-2c97-4c6e-8919-f4ae0fa739d5'
                            ? 'Laha'
                            : 'Bảo Store';
                        const newRow = {
                          ...row,
                          storeId: newStore,
                          none: newStatus,
                          isActive: newStatusActive,
                          roleType: newRoleTyoe,
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

          {staffRes && (
            <FineTablePagination
              count={staffRes.metadata.total}
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
