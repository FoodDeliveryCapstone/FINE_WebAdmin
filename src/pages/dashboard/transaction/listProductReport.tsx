import { Button, Checkbox, Grid, IconButton } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import productApi from 'src/apis/product';
import { getProductListReport } from 'src/redux/slices/product';
import Page from '../../../components/Page';
import useTable from '../../../hooks/useTable';
import Layout from '../../../layouts';
import { useDispatch, useSelector } from '../../../redux/store';
import { useSnackbar } from 'notistack';
ProductReportList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function ProductReportList() {
  const { page, filterBy } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const dispatch = useDispatch();
  const { productReportRes, isLoading: productLoading } = useSelector((state) => state.product);
  function fetchApis() {
    dispatch(getProductListReport(1));
  }

  useEffect(() => {
    fetchApis();
  }, [dispatch, page, filterBy]);
  const productData = productReportRes?.data || [];
  const productNames = productData.flatMap((e) => e.products);
  const [productIdList, setProductAtt] = React.useState<Record<string, any>[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>([]);
  console.log('selectedProductIds', selectedProductIds);
  const handleCheckboxChange = (productAttributeId: string) => {
    setSelectedProductIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(productAttributeId)) {
        return prevSelectedIds.filter((id) => id !== productAttributeId);
      } else {
        return [...prevSelectedIds, productAttributeId];
      }
    });
  };

  const onReport = async () => {
    try {
      const res = await productApi.updateProductReport(selectedProductIds.toString());
      setProductAtt(res.data);
      enqueueSnackbar('Update successfully!');
    } catch (error) {
      enqueueSnackbar('Error!', { variant: 'error' });
    } finally {
    }
  };

  return (
    <Page title="Danh sách Báo cáo">
      <Grid container rowSpacing={2}>
        {productNames.map((product) => (
          <>
            <Grid item xs={6} key={product.productAttributeId}>
              <Checkbox
                checked={selectedProductIds.includes(product.productAttributeId)}
                onChange={() => handleCheckboxChange(product.productAttributeId)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              {product.productName}
            </Grid>
            <Button
              onClick={onReport}
              variant="contained"
              color="primary"
              style={{ textTransform: 'none' }}
            >
              Update Status
            </Button>
          </>
        ))}
      </Grid>
    </Page>
  );
}
