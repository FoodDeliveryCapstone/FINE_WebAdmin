// @mui
import {
  Tooltip,
  IconButton,
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  Button,
  useTheme,
  Typography,
  Grid,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Iconify from 'src/components/Iconify';
import FineMenuPopup from './FineMenuPopup';
import { ButtonGroup } from '@mui/material';
import { FineTableFilter, TFilterItem } from 'src/@types/fine/table';
import { stringify } from 'querystring';
import { isEqual, values } from 'lodash';
import { DatePicker } from '@mui/lab';
import moment from 'moment';
import { checkTargetForNewValues } from 'framer-motion';
// components

// ----------------------------------------------------------------------
const INPUT_WIDTH = 150;

type Props = {
  disableFilter?: boolean;
  hasSearch?: boolean;
  filterName: string;
  filterBy: TFilterItem[];
  tableName: string;
  tableFilters: FineTableFilter[];
  onFilterName: (value: string) => void;
  handleRefetch?: () => void;
  onFilterTable: (filterItem: TFilterItem) => void;
  onSelectFilter: (filterItem: TFilterItem | null) => void;
};

export default function FineTableToolbar({
  disableFilter,
  hasSearch,
  tableName,
  filterName,
  filterBy,
  tableFilters,
  onFilterTable,
  onSelectFilter,
  onFilterName,
  handleRefetch,
}: Props) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleFilter = (item: TFilterItem) => {
    onFilterTable(item);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2.5, px: 3 }}
      gap={1}
    >
      {hasSearch ? (
        <TextField
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder={`Search ${tableName}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon={'eva:search-fill'}
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Stack />
      )}
      <Stack gap={2} alignItems={'center'}>
        {tableFilters?.map((filter) => {
          if (filterBy.map((filter) => filter.name).includes(filter.id)) {
            return (
              <ButtonGroup key={filter.id} size="medium" aria-label="large button group">
                {filter?.items?.map((item) => {
                  const filterItem = { name: filter.id, value: item.value };
                  return (
                    <Button
                      key={item.title}
                      variant={
                        filterBy.findIndex((item) => isEqual(item, filterItem)) > -1
                          ? 'contained'
                          : 'outlined'
                      }
                      color={item.color}
                      onClick={() => handleFilter(filterItem)}
                    >
                      {item.title}
                    </Button>
                  );
                })}
              </ButtonGroup>
            );
          }
        })}
      </Stack>
      <Stack direction="row" gap={2}>
        {handleRefetch && (
          <Tooltip title="Reload">
            <IconButton onClick={handleRefetch}>
              <Iconify icon={'tabler:reload'} />
            </IconButton>
          </Tooltip>
        )}

        <FineMenuPopup
          isDisabled={disableFilter}
          title="FIlter by"
          icon={'ic:round-filter-list'}
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          displayPrimary={filterBy.length > 0}
          actions={
            <>
              {tableFilters?.map((filter) => {
                if (true) {
                  return (
                    <MenuItem
                      key={filter.id}
                      onClick={() => {
                        onSelectFilter({ name: filter.id, value: filter.items[0].value });
                        handleCloseMenu();
                      }}
                      sx={{
                        backgroundColor: filterBy.map((filter) => filter.name).includes(filter.id)
                          ? theme.palette.grey[300]
                          : '',
                      }}
                    >
                      <Iconify icon={'bx:detail'} />
                      {filter.title}
                    </MenuItem>
                  );
                }
              })}
            </>
          }
          primaryAction={
            <>
              <IconButton
                sx={{ width: 40, height: 40 }}
                color="error"
                onClick={() => {
                  onSelectFilter(null);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'clarity:remove-line'} />
              </IconButton>
            </>
          }
        />
      </Stack>
    </Stack>
  );
}
