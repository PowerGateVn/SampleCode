
import 'babel-polyfill';

import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'stores/main';
import 'assets/styles/index.less';
import App from './components/layout/App';

render(
  <Provider store={configureStore()}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app_mountpoint')
);
