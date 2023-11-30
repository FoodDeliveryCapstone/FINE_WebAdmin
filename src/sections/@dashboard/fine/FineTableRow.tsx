import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import { fCurrency } from 'src/utils/formatNumber';
import Iconify from 'src/components/Iconify';
import { FineTableHead, TFilterItem } from 'src/@types/fine/table';
import Image from 'src/components/Image';
import { TableMoreMenu } from 'src/components/table';
import Label from 'src/components/Label';
import { OrderStatusEnum, getOrderStatus } from 'src/utils/constants';
// utils

// @types

// components

// ----------------------------------------------------------------------

type Props = {
  row: Record<string, any>;
  tableHeads: FineTableHead[];
  filterBy: TFilterItem[];
  primaryAction?: React.ReactElement;
  menuActions?: React.ReactElement;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function FineTableRow({
  row,
  tableHeads,
  filterBy,
  primaryAction,
  menuActions,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const theme = useTheme();
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      {tableHeads.map((head) => {
        const entries = Object.entries(row);
        const entryIndex = entries.findIndex((entry) => entry[0] === head.id);

        if (entryIndex > -1) {
          const key = entries[entryIndex][0];
          const value = entries[entryIndex][1];
          if (filterBy.map((filter) => filter.name).includes(key)) return;
          if (value === null)
            return (
              <TableCell key={head.id} align={head.align}>
                {''}
              </TableCell>
            );
          switch (typeof value) {
            case 'object':
              return (
                <TableCell key={head.id} sx={{ minWidth: head.width }}>
                  {`[Object]`}
                </TableCell>
              );
            case 'boolean':
              switch (key) {
                case 'isPartyMode':
                  return (
                    <TableCell key={head.id} align={head.align} sx={{ minWidth: head.width }}>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={(value && 'primary') || 'secondary'}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {value ? 'Party Order' : 'Single Order'}
                      </Label>
                    </TableCell>
                  );
                default:
                  return (
                    <TableCell key={head.id} align={head.align} sx={{ minWidth: head.width }}>
                      <Iconify
                        icon={value ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
                        sx={{
                          width: 20,
                          height: 20,
                          color: 'success.main',
                          ...(!value && { color: 'warning.main' }),
                        }}
                      />
                    </TableCell>
                  );
              }
            case 'number':
              switch (key) {
                case 'orderStatus':
                  return (
                    <TableCell key={head.id} align={head.align} sx={{ minWidth: head.width }}>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                          (value === OrderStatusEnum.PROCESSING && 'info') ||
                          (value === OrderStatusEnum.PAYMENT_PENDING && 'warning') ||
                          (value === OrderStatusEnum.DELIVERING && 'primary') ||
                          (value === OrderStatusEnum.USER_CANCEL && 'error') ||
                          (value === OrderStatusEnum.FINISHED && 'success') ||
                          'default'
                        }
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {getOrderStatus(value)}
                      </Label>
                    </TableCell>
                  );
                default:
                  return (
                    <TableCell key={head.id} align={head.align} sx={{ minWidth: head.width }}>
                      {fCurrency(value)}
                    </TableCell>
                  );
              }
            case 'string':
              if (key.match('img') || key.match('image')) {
                return (
                  <TableCell
                    key={head.id}
                    sx={{ display: 'flex', alignItems: 'center', minWidth: head.width }}
                  >
                    <Image
                      disabledEffect
                      alt={value}
                      src={value}
                      sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
                    />
                  </TableCell>
                );
              } else {
                return (
                  <TableCell key={head.id} align={head.align} sx={{ minWidth: head.width }}>
                    {value}
                  </TableCell>
                );
              }
            default:
              switch (key) {
                default:
                  return (
                    <TableCell key={head.id} align={head.align} sx={{ minWidth: head.width }}>
                      {value?.toString()}
                    </TableCell>
                  );
              }
          }
        }
      })}
      {primaryAction && (
        <TableCell align="right" sx={{ minWidth: 50 }}>
          {primaryAction}
        </TableCell>
      )}
      {menuActions && (
        <TableCell align="right" sx={{ minWidth: 50 }}>
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={menuActions}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
