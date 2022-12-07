// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'AIzaSyB718MUJe6ND2WayNqzz43Qbpqunl-uk5I',
    authDomain: 'okrcentral-sandbox.firebaseapp.com',
    databaseURL: 'https://okrcentral-sandbox.firebaseio.com',
    projectId: 'okrcentral-sandbox',
    storageBucket: 'okrcentral-sandbox.appspot.com'
  },
  host: 'https://sandbox.gotoally.com',
  baseUrl: 'https://sandbox.gotoally.com/api/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
