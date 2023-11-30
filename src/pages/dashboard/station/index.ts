import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.station.root) {
      push(PATH_DASHBOARD.station.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (pathname === PATH_DASHBOARD.station.list) {
      push(PATH_DASHBOARD.station.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (pathname === PATH_DASHBOARD.station.create) {
      push(PATH_DASHBOARD.station.create);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
