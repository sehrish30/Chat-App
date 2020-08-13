import firebase from 'firebase/app';
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
