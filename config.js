import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDhe_raUxJKw-nWk0wXWTGYAwH__frKXhI',
  authDomain: 'housequest-15795.firebaseapp.com',
  projectId: 'housequest-15795',
  storageBucket: 'housequest-15795.appspot.com',
  messagingSenderId: '353172267978',
  appId: '1:353172267978:web:ee0872c0a9ed6c842ee533',
  measurementId: 'G-W0JZZ0E5R5'
};

const app = initializeApp(firebaseConfig);
console.log('app', app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
console.log('auth', auth);

export const db = getFirestore(app);
console.log('db', db);

export const storage = getStorage(app);
