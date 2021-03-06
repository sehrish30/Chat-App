import { Notification as Toast } from 'rsuite';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/functions';
import { isLocalhost } from './helpers';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
// Toast because Notification also comes as window might cause confusion

const config = {
  apiKey: 'AIzaSyB8VUSxRhO7qzlzfwXzAOVNEgL6xnih5gk',
  authDomain: 'chat-web-app-27d36.firebaseapp.com',
  databaseURL: 'https://chat-web-app-27d36.firebaseio.com',
  projectId: 'chat-web-app-27d36',
  storageBucket: 'chat-web-app-27d36.appspot.com',
  messagingSenderId: '328867438330',
  appId: '1:328867438330:web:12855d48d2d1f43ba9f343',
};

//Returns an instance of firebase Application
const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
export const functions = app.functions('us-east1');

export const messaging = firebase.messaging.isSupported()
  ? app.messaging()
  : null;

if (messaging) {
  messaging.usePublicVapidKey(
    'BGjVH1KyAnhBjBw4AHxyAWl5VcVQji9Eqpb5shM62uLq-8310uz59zAg-KvZjkdAe7tCdf3SiLX9WFWGl1IB3aI'
  );

  // Handle foreground messages
  // messaging.onMessage(data => {
  //   console.log(data); // prints data sent from SendFcmBtnModal
  // });

  messaging.onMessage(({ notification }) => {
    const { title, body } = notification;
    Toast.info({ title, description: body, duration: 0 }); // duration 0 means not self closing
  });
}

//set with sdk
if (isLocalhost) {
  functions.useFunctionsEmulator('http://localhost:5001');
}
