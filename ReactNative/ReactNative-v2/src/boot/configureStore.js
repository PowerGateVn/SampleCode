import devTools from "remote-redux-devtools";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import reducer from "../reducers";
import rootSaga from "../sagas";

export default function configureStore(onCompletion) {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(
    applyMiddleware(sagaMiddleware),
    devTools({
      name: "react-native-tutorials",
      realtime: true
    })
  );
  const store = createStore(reducer, enhancer);
  persistStore(store, onCompletion);
  sagaMiddleware.run(rootSaga);
  return store;
}
