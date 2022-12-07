import * as Redux from 'redux';

import feed from './feed';
import home from './home';
import root from './root';

export default Redux.combineReducers({
  feed,
  home,
  root,
});
