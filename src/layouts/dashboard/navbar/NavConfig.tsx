// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components

import SvgIconStyle from '../../../components/SvgIconStyle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import SvgIcon from 'src/theme/overrides/SvgIcon';
// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  staff: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  order: getIcon('outline_store'),
  store: getIcon('StorefrontIcon'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.analytics, roles: ['admin'] },
      {
        title: 'simulating',
        path: PATH_DASHBOARD.general.simulating,
        icon: ICONS.dashboard,
        roles: ['admin'],
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'order',
        path: PATH_DASHBOARD.order.root,
        icon: ICONS.cart,
        children: [{ title: 'list', path: PATH_DASHBOARD.order.list, roles: ['admin'] }],
      },
      {
        title: 'store',
        path: PATH_DASHBOARD.store.root,
        icon: <StorefrontIcon />,
        children: [
          { title: 'list', path: PATH_DASHBOARD.store.list, roles: ['admin'] },
          { title: 'Tạo mới', path: PATH_DASHBOARD.store.create, roles: ['admin'] },
        ],
        roles: ['admin'],
      },
      {
        title: 'product',
        path: PATH_DASHBOARD.product.root,
        icon: <FastfoodIcon />,
        children: [{ title: 'list', path: PATH_DASHBOARD.product.list, roles: ['admin'] }],
        roles: ['admin'],
      },
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'customer', path: PATH_DASHBOARD.user.customer },
          { title: 'staff', path: PATH_DASHBOARD.user.staff },
          { title: 'Tạo mới', path: PATH_DASHBOARD.user.create },
        ],
        roles: ['admin'],
      },
      {
        title: 'menu',
        path: PATH_DASHBOARD.menu.root,
        icon: <RestaurantMenuIcon />,
        children: [
          { title: 'list', path: PATH_DASHBOARD.menu.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.menu.create },
        ],
        roles: ['admin'],
      },
      {
        title: 'destination',
        path: PATH_DASHBOARD.destination.root,
        icon: <LocationOnIcon />,
        children: [
          { title: 'list', path: PATH_DASHBOARD.destination.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.destination.create },
        ],
        roles: ['admin'],
      },
      {
        title: 'timeslot',
        path: PATH_DASHBOARD.timeslot.root,
        icon: <AccessTimeIcon />,
        children: [
          { title: 'list', path: PATH_DASHBOARD.timeslot.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.timeslot.create },
        ],
        roles: ['admin'],
      },
      {
        title: 'station',
        path: PATH_DASHBOARD.station.root,
        icon: <KitchenIcon />,
        children: [
          { title: 'list', path: PATH_DASHBOARD.station.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.station.create },
        ],
        roles: ['admin'],
      },
      {
        title: 'transaction',
        path: PATH_DASHBOARD.transaction.root,
        icon: <PaidIcon />,
        children: [{ title: 'list', path: PATH_DASHBOARD.transaction.list }],
        roles: ['admin'],
      },
    ],
  },
];

export default navConfig;
