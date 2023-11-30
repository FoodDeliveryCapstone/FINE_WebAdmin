// @mui
import { styled } from '@mui/material/styles';
import { Typography, Card, CardContent, CardProps } from '@mui/material';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.grey[0],
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// ----------------------------------------------------------------------

interface TextFieldCardProps extends CardProps {
  title?: string;
  children: any;
  name: string;
  action?: React.ReactNode;
}

export default function SelectCard({
  title,
  children,
  name,
  action,
  ...other
}: TextFieldCardProps) {
  return (
    <RootStyle {...other}>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
          bgcolor: 'white',
        }}
      >
        <Typography gutterBottom variant="h4" sx={{ whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <RHFSelect name={name}>{children}</RHFSelect>
      </CardContent>
    </RootStyle>
  );
}
