/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);

module.exports = withTM({
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    HOST_API_KEY: 'https://minimal-assets-api-dev.vercel.app',
    NEXT_PUBLIC_BASE_URL_DEV: 'https://dev.fine-api.smjle.vn/api',
    // MAPBOX
    MAPBOX_API: '',
    // FIREBASE
    FIREBASE_API_KEY: 'AIzaSyDIK3XQcYynWy-AO_Fd2B9Ki0clnmpw6pg',
    FIREBASE_AUTH_DOMAIN: 'fine-management-af8f2.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'fine-management-af8f2',
    FIREBASE_STORAGE_BUCKET: 'fine-management-af8f2.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '529237008024',
    FIREBASE_APPID: '1:529237008024:web:76572f5ba372ec3988faed',
    FIREBASE_MEASUREMENT_ID: 'G-4LLK6CPK50',
    // AWS COGNITO
    AWS_COGNITO_USER_POOL_ID: '',
    AWS_COGNITO_CLIENT_ID: '',
    // AUTH0
    AUTH0_CLIENT_ID: '',
    AUTH0_DOMAIN: '',
  },
});
