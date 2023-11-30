import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.user.customer) {
      push(PATH_DASHBOARD.user.customer);
    }
    if (pathname === PATH_DASHBOARD.user.staff) {
      push(PATH_DASHBOARD.user.staff);
    }
    if (pathname === PATH_DASHBOARD.user.create) {
      push(PATH_DASHBOARD.user.create);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
