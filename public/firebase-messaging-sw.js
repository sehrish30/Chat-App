/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.17.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyB8VUSxRhO7qzlzfwXzAOVNEgL6xnih5gk',
    authDomain: 'chat-web-app-27d36.firebaseapp.com',
    databaseURL: 'https://chat-web-app-27d36.firebaseio.com',
    projectId: 'chat-web-app-27d36',
    storageBucket: 'chat-web-app-27d36.appspot.com',
    messagingSenderId: '328867438330',
    appId: '1:328867438330:web:12855d48d2d1f43ba9f343',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();