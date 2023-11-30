// @mui
import { Switch, Box, TablePagination, FormControlLabel } from '@mui/material';
// components

// ----------------------------------------------------------------------

type Props = {
  count: number;
  page: number;
  rowsPerPage: number;
  dense: boolean;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FineTablePagination({
  dense,
  count,
  page,
  rowsPerPage,
  onChangePage,
  onChangeDense,
  onChangeRowsPerPage,
}: Props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />

      <FormControlLabel
        control={<Switch checked={dense} onChange={onChangeDense} />}
        label="Dense"
        sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
      />
    </Box>
  );
}
