import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.timeslot.root) {
      push(PATH_DASHBOARD.timeslot.list);
    }
    if (pathname === PATH_DASHBOARD.timeslot.list) {
      push(PATH_DASHBOARD.timeslot.list);
    }
    if (pathname === PATH_DASHBOARD.timeslot.create) {
      push(PATH_DASHBOARD.timeslot.create);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
