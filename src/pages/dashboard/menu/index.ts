import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
    const { pathname, push } = useRouter();

    useEffect(() => {
        if (pathname === PATH_DASHBOARD.menu.root) {
            push(PATH_DASHBOARD.menu.list);
        }
        if (pathname === PATH_DASHBOARD.menu.list) {
            push(PATH_DASHBOARD.menu.list);
        }
        if (pathname === PATH_DASHBOARD.menu.create) {
            push(PATH_DASHBOARD.menu.create);
        }
        if (pathname === PATH_DASHBOARD.menu.add) {
            push(PATH_DASHBOARD.menu.add);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return null;
}
