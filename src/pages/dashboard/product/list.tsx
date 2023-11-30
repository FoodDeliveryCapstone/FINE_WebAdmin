import { Button, Card, Container, Grid, MenuItem, Table, TableBody, TableContainer } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { TProduct } from 'src/@types/fine/product';
import { FineFormConfig, FineTableFilter, FineTableHead, TFilterItem } from 'src/@types/fine/table';
import destinationApi from 'src/apis/destination';
import productApi from 'src/apis/product';
import Iconify from 'src/components/Iconify';
import { getProductList } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import FineTableForm from 'src/sections/@dashboard/fine/FineTableForm';
import FineTablePagination from 'src/sections/@dashboard/fine/FineTablePagination';
import FineTableRow from 'src/sections/@dashboard/fine/FineTableRow';
import FineTableToolbar from 'src/sections/@dashboard/fine/FineTableToolbar';
import { applySortFilter } from 'src/sections/@dashboard/fine/utils';
import OrderDetailDialog from 'src/sections/@dashboard/order/OrderDetailDialog';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../../components/table';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD: FineTableHead[] = [
  { id: 'productName', label: 'Sản phẩm', align: 'left', width: 150 },
  { id: 'productCode', label: 'Mã sản phẩm', align: 'left', width: 150 },
  { id: 'storeId', label: 'Cửa hàng', align: 'left', width: 150 },
  { id: 'isActive', label: 'Đang hoạt động', align: 'center', width: 200 },
  { id: 'none', label: 'Tạm hết', align: 'center', width: 130 },
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

const validationConfigs: FineFormConfig[] = [
  {
    id: 'image',
    validationType: 'string',
    label: 'Image',
    validations: [{ type: 'required', params: ['Image is required'] }],
  },
  {
    id: 'storeId',
    validationType: 'string',
    label: 'Cửa hàng',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'categoryId',
    validationType: 'string',
    label: 'Category',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'productCode',
    validationType: 'string',
    label: 'Mã sản phẩm',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'productName',
    validationType: 'string',
    label: 'Tên sản phẩm',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'productType',
    validationType: 'string',
    label: 'Loại sản phẩm',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'isStackable',
    validationType: 'boolean',
    label: 'Có thể xếp chồng',
    validations: [{ type: 'required', params: ['Is Active is required'] }],
  },
  {
    id: 'productAttribute',
    validationType: 'string',
    label: 'Thuộc tính',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  // Add more validation configs as needed
];

const DEFAULT_FILTER: TFilterItem = { name: '', value: 0 };
const ROWS_PER_PAGE = 10;
// ----------------------------------------------------------------------

StoreList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreList() {
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
  const [isEdit, setIsEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const handleClickOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenCreateForm = () => {
    setIsEdit(false);
    setOpenForm(true);
  };
  const handleOpenEditForm = () => {
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const { productRes, isLoading: productLoading } = useSelector((state) => state.product);
  // console.log('productRes', productRes);

  const [tableData, setTableData] = useState<TProduct[]>([]);
  // console.log('tableData', tableData);

  const [filterName, setFilterName] = useState('');

  function fetchApis() {
    dispatch(getProductList(page + 1));
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
    if (productRes) {
      setTableData(productRes.data);
    }
  }, [productRes]);
  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterTable = (filterItem: TFilterItem) => {
    onChangeFilterBy(filterItem);
    setPage(0);
  };
  const handleSubmitForm = async (data: any) => {
    console.log('handleSubmitForm', data);
    const {
      storeId,
      categoryId,
      productCode,
      productName,
      productType,
      isStackable,
      imageUrl,
      productAttribute,
    } = data;
    const postRes = await productApi.createProduct({
      storeId: storeId,
      productName: productName,
      productCode: productCode,
      categoryId: categoryId,
      productType: productType,
      isStackable: isStackable,
      imageUrl: imageUrl,
      productAttribute: productAttribute,
    });
    console.log('postRes', postRes);
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

  const handleEditRow = (id: string) => {
    const updateRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(updateRow);
    console.log('updateRow', updateRow);
  };
  const denseHeight = dense ? 60 : 80;

  const filterTableHead = TABLE_HEAD.filter(
    (head) => !filterBy.map((filter) => filter.name).includes(head.id)
  );

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!productLoading && !dataFiltered.length);

  const [file, setFile] = useState<File | null | undefined>(null);
  console.log('file', file);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('selectedFile', selectedFile);
    if (selectedFile !== null || undefined) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('excelFile', file);
      const res = await destinationApi.Test(formData);
      if (res.data.status.success == true) {
        enqueueSnackbar('Update succesfully!', { variant: 'success' });
        setFile(null);
      } else {
        enqueueSnackbar('Error!', { variant: 'error' });
        setFile(null);
      }
    } else {
      console.log('Please select a file');
    }
  };

  return (
    <Page title="Product List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },

            { name: 'Product List', href: PATH_DASHBOARD.product.list },

            { name: 'Create Product', href: PATH_DASHBOARD.product.create },
          ]}
          action={
            <>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/dashboard/product/create')}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    New Product
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    sx={{ height: 35.5 }}
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    <input type="file" onChange={handleFileChange} accept=".xlsx" />
                  </Button>
                </Grid>
                <Grid item>
                  {file && (
                    <Button variant="contained" onClick={handleFileUpload}>
                      Upload Excel
                    </Button>
                  )}
                </Grid>
              </Grid>
            </>
          }
        />

        {/* Dialog */}
        <OrderDetailDialog open={openDetail} handleClose={handleCloseDetail} />
        <FineTableForm
          title="Product"
          isEdit={isEdit}
          open={openForm}
          handleClose={handleCloseForm}
          formConfigs={validationConfigs}
          handleSubmitForm={handleSubmitForm}
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
                  {(productLoading ? [...Array(ROWS_PER_PAGE)] : dataFiltered).map(
                    (row: TProduct, index) => {
                      if (row) {
                        const newStore =
                          row.storeId === '751a2190-d06c-4d5e-9c5a-08c33c3db266'
                            ? '7-Eleven'
                            : row.storeId === '8db35955-bbc5-40fb-b638-cb44ac786519'
                            ? 'Passio'
                            : row.storeId === 'e19422e9-2c97-4c6e-8919-f4ae0fa739d5'
                            ? 'Laha'
                            : '';

                        const newStatus = row.isActive === false ? false : '';
                        const newStatusActive = row.isActive === true ? true : '';
                        const newRow = {
                          ...row,
                          storeId: newStore,
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
                                <MenuItem onClick={() => {}} sx={{ color: 'error.main' }}>
                                  <Iconify icon={'eva:trash-2-outline'} />
                                  Delete
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleOpenEditForm();
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

          {productRes && (
            <FineTablePagination
              count={productRes.metadata.total}
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
