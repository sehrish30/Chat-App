import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

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

// firebase Database ($userid is the one in path checking the one sent)
// {
//   "rules": {
//     "profiles":{
//       "$user_id":{
//         ".read": "$user_id === auth.uid",
//         ".write": "$user_id ===auth.uid",
//       }
//     },
//     ".read": false,
//     ".write": false
//   }
// }
// Paste this in database.rules.json
