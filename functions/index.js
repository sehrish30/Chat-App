const functions = require('firebase-functions');


const admin = require("firebase-admin");

const serviceAccount = require("./service-account.json");

//to access real database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-web-app-27d36.firebaseio.com"
});

const {sendFcm}= require('./src/fcm');
exports.sendFcm= sendFcm;



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = const functions = require('firebase-functions');


// const admin = require("firebase-admin");
