import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'todo',
  authDomain: 'todo',
  databaseURL: 'todo',
  projectId: 'housequest-15795',
  storageBucket: 'todo',
  messagingSenderId: 'todo',
  appId: 'todo',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };