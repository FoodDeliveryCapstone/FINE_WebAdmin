import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { FIREBASE_API } from 'src/config';

const Firebase = initializeApp(FIREBASE_API);
// init Storage
export const firebaseStorage = getStorage(Firebase);

export default Firebase;
