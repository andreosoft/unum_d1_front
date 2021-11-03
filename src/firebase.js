// import { onBackgroundMessage } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging();
export { getToken }

getToken(messaging, { vapidKey: process.env.VUE_APP_VAPID_KEY }).then((currentToken) => {
  if (currentToken) {
      console.log('currentToken ', currentToken);
      window.localStorage.setItem('FCM token', currentToken)
      // Send the token to your server and update the UI if necessary
      // ...
  } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
  }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
});

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});
