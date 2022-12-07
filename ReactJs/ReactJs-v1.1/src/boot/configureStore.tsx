import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory, History } from "history";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import logger from "./logger";
import allReducers from "./rootReducers";
import allSaga from "./rootSaga";

class ConfigureStore {
  public history: History = createBrowserHistory();

  public setup = () => {
    /** add middlewares */
    const middlewares = [];
    middlewares.push(routerMiddleware(this.history));
    const sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);
    if (process.env.NODE_ENV === "development") {
      middlewares.push(logger);
    }
    const appMiddleware = composeWithDevTools(applyMiddleware(...middlewares));
    /** config redux-persist */
    const persistedReducer = persistReducer(
      {
        key: "root",
        storage,
        whitelist: [""],
        blacklist: ["router"]
      },
      allReducers(this.history)
    );
    const store = createStore(persistedReducer, appMiddleware);
    const persistor = persistStore(store);
    sagaMiddleware.run(allSaga);
    return { store, persistor };
  };
}

export default new ConfigureStore();
