import { Button, Card, Container, Grid, Table, TableBody, TableContainer } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TMenu } from 'src/@types/fine/menu';
import { FineFormConfig, FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import menuApi from 'src/apis/menu';
import Iconify from 'src/components/Iconify';
import { getMenuList } from 'src/redux/slices/menu';
import { getTimeSlotList } from 'src/redux/slices/timeslot';
import FineTableForm from 'src/sections/@dashboard/fine/FineTableForm';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../../components/table';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSnackbar } from 'notistack';

const TABLE_HEAD: FineTableHead[] = [
  { id: 'id', label: 'Id', align: 'left', width: 150 },
  { id: 'menuName', label: 'Tên thực đơn', align: 'left', width: 150 },
  { id: 'isActive', label: 'Đang hoạt động', align: 'center', width: 150 },
  { id: 'position', label: 'Vị trí hiển thị', align: 'center', width: 150 },
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

StationList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function StationList() {
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
  const { timeSlotRes, isLoading: timeSlotLoading } = useSelector((state) => state.timeslot);
  const { menuList, isLoading: isLoading } = useSelector((state) => state.menu);
  const [timeslot, setTimeslot] = React.useState('');

  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [tableData, setTableData] = useState<TMenu[]>([]);
  const [dataEdit, setDataEdit] = useState<TMenu>();
  const [filterName, setFilterName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const handleOpenEditForm = (test: any) => {
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };
  const handleChangeTimeslot = (event: SelectChangeEvent) => {
    setTimeslot(event.target.value as string);
    dispatch(getMenuList(timeslot));
  };

  function fetchApis() {
    dispatch(getTimeSlotList('70248C0D-C39F-468F-9A92-4A5A7F1FF6BB'));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  const firstValue: string | undefined = timeSlotRes?.data[0]?.id;

  useEffect(() => {
    if (firstValue !== undefined) {
      setTimeslot(firstValue);
    }
  }, [timeSlotRes]);

  const [initialTimeslot, setInitialTimeslot] = useState(''); // Add this state variable

  useEffect(() => {
    setInitialTimeslot(timeslot);
  }, [timeslot]);

  useEffect(() => {
    if (menuList?.data) {
      setTableData(menuList.data);
    }
  }, [menuList]);
  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterTable = (filterItem: TFilterItem) => {
    onChangeFilterBy(filterItem);
    setPage(0);
  };

  const validationConfigs: FineFormConfig[] = [
    {
      id: 'imageUrl',
      validationType: 'string',
      label: 'Imgage',
      validations: [{ type: 'required', params: ['Image is required'] }],
      defaultValue: dataEdit?.imageUrl,
    },
    {
      id: 'menuName',
      validationType: 'string',
      label: 'menuName',
      validations: [{ type: 'required', params: ['Destination is required'] }],
      defaultValue: dataEdit?.menuName,
    },
    {
      id: 'timeSlotId',
      validationType: 'string',
      label: 'timeSlotId',
      validations: [{ type: 'required', params: ['Store Name is required'] }],
      defaultValue: dataEdit?.timeSlotId,
    },
    {
      id: 'position',
      validationType: 'string',
      label: 'position',
      validations: [{ type: 'required', params: ['Contact Person is required'] }],
      defaultValue: dataEdit?.position,
    },
    {
      id: 'isActive',
      validationType: 'boolean',
      label: 'Is Active',
      validations: [{ type: 'required', params: ['Is Active is required'] }],
    },
  ];

  const handleEditRow = (id: string) => {
    const store = tableData.find((row) => row.id === id);
    setDataEdit(store);
  };

  const handleUpdateForm = async (data: any) => {
    const { timeSlotId, menuName, imageUrl, isActive, position } = data;
    const payload = {
      timeSlotId: timeSlotId,
      menuName: menuName,
      imageUrl: imageUrl,
      isActive: isActive,
      position: position,
    };

    if (Object.keys(payload).length > 0) {
      const updateRes = await menuApi.updateMenu(dataEdit?.id, payload);
      setOpenForm(false);
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

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách thực đơn">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách thực đơn"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách thực đơn',
              href: PATH_DASHBOARD.menu.list,
            },
            { name: 'Tạo thực đơn', href: PATH_DASHBOARD.menu.create },
            { name: 'Thêm sản phẩm', href: PATH_DASHBOARD.menu.add },
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard/menu/create')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo thực đơn
            </Button>
          }
        />
        {timeSlotLoading ? (
          <Grid item xs={12} md={6} pb={2}>
            <></>
          </Grid>
        ) : (
          <Grid item xs={12} md={6} pb={2}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="demo-simple-select-label">Timeslot</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-timeslot"
                value={timeslot}
                label="timeslot"
                onChange={handleChangeTimeslot}
              >
                {timeSlotRes?.data.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {`${e.arriveTime} - ${e.checkoutTime}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <FineTableForm
          title="Store"
          isEdit={isEdit}
          open={openForm}
          handleClose={handleCloseForm}
          formConfigs={validationConfigs}
          handleSubmitForm={handleUpdateForm}
        />
        {/* Table */}
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
                  {(isLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map((row: TMenu, index) =>
                    row ? (
                      <FineTableRow
                        key={row.id}
                        row={row}
                        tableHeads={TABLE_HEAD}
                        filterBy={filterBy}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
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
                            {/* <MenuItem onClick={() => router.push('/dashboard/menu/add')}>
                              Thêm sản phẩm
                            </MenuItem> */}
                          </>
                        }
                      />
                    ) : (
                      !isNotFound && (
                        <TableSkeleton
                          key={index}
                          numOfColumns={filterTableHead.length}
                          sx={{ height: denseHeight }}
                        />
                      )
                    )
                  )}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {menuList && (
            <FineTablePagination
              count={menuList.metadata.total}
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
