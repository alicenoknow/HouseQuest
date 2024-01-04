import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);
console.log('auth', auth);
// export const db = getFirestore(firebaseConfig);
// console.log('db', db);
