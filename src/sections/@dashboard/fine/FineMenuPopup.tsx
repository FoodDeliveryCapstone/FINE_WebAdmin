// @mui
import { Divider, IconButton, Stack, Tooltip } from '@mui/material';
import Iconify from 'src/components/Iconify';
import MenuPopover from 'src/components/MenuPopover';
//

// ----------------------------------------------------------------------

type Props = {
  isDisabled?: boolean;
  title?: string;
  actions: React.ReactNode;
  open?: HTMLElement | null;
  onClose?: VoidFunction;
  onOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  icon?: string;
  primaryAction?: React.ReactNode;
  displayPrimary?: boolean;
};

export default function FineMenuPopup({
  isDisabled,
  title,
  icon,
  actions,
  primaryAction,
  open,
  onClose,
  onOpen,
  displayPrimary,
}: Props) {
  return (
    <>
      <Tooltip title={title ?? 'Select action'}>
        <Stack>
          <IconButton onClick={onOpen} disabled={isDisabled}>
            <Iconify icon={icon ?? 'eva:more-vertical-fill'} width={20} height={20} />
          </IconButton>
        </Stack>
      </Tooltip>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        <Stack sx={{ alignItems: 'center', width: '100%' }}>
          <Stack direction={'row'} alignItems={'center'} gap={2}>
            {title}
          </Stack>
          <Divider sx={{ borderWidth: 1, width: '100%' }} />
        </Stack>
        <Stack gap={1} py={1}>
          {actions}
        </Stack>
        <Divider sx={{ borderWidth: 1, width: '100%' }} />
        {displayPrimary && (
          <Stack gap={1} py={1} alignItems={'center'}>
            {primaryAction}
          </Stack>
        )}
      </MenuPopover>
    </>
  );
}
