import ENV from '~app/env';
import Logging from '~app/utils/logging';

import APIMockBackend from '~app/services/backend/api-mock';
import APIBackend from '~app/services/backend/api';

import createStore from './services/store';
import Main from './main';

const log = Logging.getLogger('app.createServices');

export default function() {
  const services = {};

  if (ENV.DEBUG) {  // eslint-disable-line no-constant-condition
    services.backend = new APIMockBackend();
  }
  else {
    services.backend = new APIBackend();
  }

  services.store = createStore(services);
  services.runSaga = services.store.runSaga;
  return services;
}
