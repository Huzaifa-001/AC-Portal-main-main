// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyD11iFrImfeqCCyezfVI28kkbKpP96TUtc",
  authDomain: "accoura-core.firebaseapp.com",
  projectId: "accoura-core",
  storageBucket: "accoura-core.appspot.com",
  messagingSenderId: "29446777775",
  appId: "1:29446777775:web:dddb9c1c76baee71791d5a",
  measurementId: "G-QKX26X2465"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();