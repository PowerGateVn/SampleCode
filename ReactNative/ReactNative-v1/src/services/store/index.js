import * as Redux from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import ENV from '~app/env';
import createThunkMiddleware from '~app/utils/store/createThunkMiddleware';
import Logging from '~app/utils/logging';
import rootReducer from '~app/reducers';

const log = Logging.getLogger('app.actionLog');

function createStore(services) {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [];

  const thunkMiddleware = createThunkMiddleware(services);
  middleware.push(thunkMiddleware);

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  // enable the logger if TRACE level is available
  // logging must be last in the middleware stack
  if (log.isEnabledFor(Logging.LOG_LEVELS.TRACE)) {
    const loggerMiddleware = createLogger({
      duration: true,
      timestamp: false,
      collapsed: true,
      colors: {},
      logger: {
        group: () => {},
        groupCollapsed: () => {},
        groupEnd: () => {},
        log: (...args) => {
          log.trace(args.join(' '));
        },
        warn: () => {},
      },
      actionTransformer: JSON.stringify,
      stateTransformer: JSON.stringify,
    });
    middleware.push(loggerMiddleware);
  }

  // ======================================================
  // Store Enhancers
  // ======================================================
  let composeEnhancers = Redux.compose;
  if (ENV.DEBUG) {
    composeEnhancers = (
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
      Redux.compose
    );
  }

  // ======================================================
  // Store Instantiation
  // ======================================================
  const store = Redux.createStore(
    rootReducer,
    undefined,
    composeEnhancers(
      Redux.applyMiddleware(...middleware),
    ),
  );

  if (module.hot) {
    module.hot.accept(() => {
      log.debug('hot reloading the store');
      const nextRootReducer = require('~app/reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  // make services available to all sagas via yield getContext('services')
  sagaMiddleware.setContext({
    services: {
      ...services,
      store,
      getState: store.getState,
      dispatch: store.dispatch,
    },
  });

  return {
    ...store,
    runSaga: sagaMiddleware.run,
  };
}

export default createStore;
