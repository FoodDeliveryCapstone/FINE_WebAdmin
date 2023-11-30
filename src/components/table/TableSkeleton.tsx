// @mui
import { TableRow, TableCell, Skeleton, Stack, TableRowProps } from '@mui/material';

// ----------------------------------------------------------------------

type TTableSkeletonProps = TableRowProps & {
  numOfColumns?: number;
};
export default function TableSkeleton({ numOfColumns, ...other }: TTableSkeletonProps) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={12}>
        <Stack spacing={3} direction="row" alignItems="center">
          {/* <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />
          <Skeleton variant="text" width="100%" height={20} /> */}
          {[...Array(numOfColumns ?? 6)].map((col, index) => (
            <Skeleton key={index} variant="text" width={160} height={20} />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
