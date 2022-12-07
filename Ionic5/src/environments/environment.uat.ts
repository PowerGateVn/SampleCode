// beta
export const environment = {
  production: true,
  envi: 'uat',
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: 'authTokenGaga',
  firebaseConfig: {
    apiKey: 'AIzaSyDp-OTXZj4MedKmr3L9fyFvQ7ehT1I3ULk',
    authDomain: 'gaga-testing.firebaseapp.com',
    databaseURL: 'https://gaga-testing.firebaseio.com',
    projectId: 'gaga-testing',
    storageBucket: 'gaga-testing.appspot.com',
    messagingSenderId: '310541395259',
    appId: '1:310541395259:web:6f7590ee0ad6380249431e',
    measurementId: 'G-YRBKDCG97V'
  },
  // apiUrl: 'https://gaga-testing.firebaseapp.com/api/v1/', // for production
  apiUrl: 'https://us-central1-gaga-testing.cloudfunctions.net/app/api/v1/',
  apiKeyGGMap: 'AIzaSyAIikMNAImJmBzoCV1e9R5TFU3u9YqkRHM'
 };
