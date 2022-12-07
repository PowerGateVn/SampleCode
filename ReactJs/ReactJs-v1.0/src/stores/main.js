import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './registryReducers';

const createStoreWithMiddleware = compose(applyMiddleware(thunkMiddleware))(createStore); // thunk middleware

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  return store;
}
