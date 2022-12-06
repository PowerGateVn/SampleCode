// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envi: 'dev',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
