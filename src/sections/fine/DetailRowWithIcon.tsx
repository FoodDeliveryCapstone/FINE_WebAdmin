import { Typography, Stack, Skeleton } from '@mui/material';

import Iconify from 'src/components/Iconify';

type DetailRowWithIconProps = {
  title: string;
  icon: string;
  content?: string | React.ReactElement;
  isLoading?: boolean;
};

export default function DetailRowWithIcon({
  title,
  icon,
  content,
  isLoading,
}: DetailRowWithIconProps) {
  return (
    <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={1}>
      <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={1}>
        <Iconify icon={icon} />
        <Typography variant="h6">{title}:</Typography>
      </Stack>
      <Typography variant="body1">{!isLoading && content ? content : <Skeleton />}</Typography>
    </Stack>
  );
}
