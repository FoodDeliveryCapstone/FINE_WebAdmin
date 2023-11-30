import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import orderReducer from './slices/order';
import menuReducer from './slices/menu';
import timeslotReducer from './slices/timeslot';
import customerReducer from './slices/customer';
import storeReducer from './slices/store';
import destinationReducer from './slices/destination';
import staffReducer from './slices/staff';
import stationReducer from './slices/station';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};
const transPersistConfig = {
  key: 'transaction',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  order: orderReducer,
  menu: menuReducer,
  timeslot: timeslotReducer,
  station: stationReducer,
  store: storeReducer,
  destination: destinationReducer,
  customer: customerReducer,
  staff: staffReducer,
});
export { rootPersistConfig, rootReducer };
