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
import { getTimeSlotList } from 'src/redux/slices/timeslot';
import { TTimeSlot } from 'src/@types/fine/timeslot';
import { useRouter } from 'next/router';
import timeslotApi from 'src/apis/timeslot';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'arriveTime', label: 'Bắt đầu', align: 'left', width: 150 },
  { id: 'checkoutTime', label: 'Kết thúc', align: 'left', width: 150 },
  { id: 'closeTime', label: 'Đóng', align: 'left', width: 150 },
  { id: 'isActive', label: 'Đang hoạt động', align: 'center', width: 150 },
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
  const [dataEdit, setDataEdit] = useState<TTimeSlot>();
  const handleClickOpenDetail = () => {
    setOpenDetail(true);
  };
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const { timeSlotRes, isLoading: timeSlotLoading } = useSelector((state) => state.timeslot);

  const [tableData, setTableData] = useState<TTimeSlot[]>([]);

  const [filterName, setFilterName] = useState('');
  const router = useRouter();
  function fetchApis() {
    dispatch(getTimeSlotList('70248C0D-C39F-468F-9A92-4A5A7F1FF6BB'));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);

  useEffect(() => {
    if (timeSlotRes?.data) {
      setTableData(timeSlotRes.data);
    }
  }, [timeSlotRes]);
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

  const validationConfigs: FineFormConfig[] = [
    {
      id: 'arriveTime',
      validationType: 'string',
      label: 'Khung giờ bắt đầu',
      validations: [{ type: 'required', params: ['Destination is required'] }],
      defaultValue: dataEdit?.arriveTime,
    },
    {
      id: 'closeTime',
      validationType: 'string',
      label: 'Khung giờ kết thúc',
      validations: [{ type: 'required', params: ['Store Name is required'] }],
      defaultValue: dataEdit?.closeTime,
    },
    {
      id: 'checkoutTime',
      validationType: 'string',
      label: 'Khung giờ nghỉ',
      validations: [{ type: 'required', params: ['Contact Person is required'] }],
      defaultValue: dataEdit?.checkoutTime,
    },
    {
      id: 'isActive',
      validationType: 'boolean',
      label: 'Is Active',
    },
    // Add more validation configs as needed
  ];

  const handleSubmitForm = async (data: any) => {
    console.log('handleSubmitForm', data);
    const { destinationId, closeTime, arriveTime, checkoutTime, isActive } = data;
    const payload = {
      destinationId: destinationId,
      closeTime: closeTime,
      arriveTime: arriveTime,
      checkoutTime: checkoutTime,
      isActive: isActive,
    };

    if (Object.keys(payload).length > 0) {
      const updateRes = await timeslotApi.updateTimeslot(dataEdit?.id, payload);
      setOpenForm(false);
      dispatch(getTimeSlotList('70248C0D-C39F-468F-9A92-4A5A7F1FF6BB'));
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
  };
  const handleEditRow = (id: string) => {
    const store = tableData.find((row) => row.id === id);
    setDataEdit(store);
    console.log(store);
  };

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!timeSlotLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách khung giờ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách khung giờ"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách khung giờ',
              href: PATH_DASHBOARD.timeslot.list,
            },
            { name: 'Tạo khung giờ', href: PATH_DASHBOARD.timeslot.create },
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard/timeslot/create')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo khung giờ
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
                  {(timeSlotLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
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

          {timeSlotRes && (
            <FineTablePagination
              count={timeSlotRes.metadata.total}
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
