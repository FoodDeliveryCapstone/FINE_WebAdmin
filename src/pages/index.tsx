// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// sections

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return (
    <Page title="Management">
      <ContentStyle />
    </Page>
  );
}
