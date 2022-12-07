import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import { ConnectedRouter } from "connected-react-router";
import Page404Component from "containers/components/404";
import "mdbreact/dist/css/mdb.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import LoginComponent from "screens/login";
import LoginAccessCodeComponent from "screens/login/verify-code";
import SignupComponent from "screens/sign-up";
import SignUpThankYouComponent from "screens/sign-up/thank-you";
import SignUpAccessCodeComponent from "screens/sign-up/verify-code";
import SignUpYouAreInComponent from "screens/sign-up/you-are-in";
import configureStore from "./boot/configureStore";

const store = configureStore.setup();

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const token = sessionStorage.getItem("token");
//   const auth = props => (!token ? <Redirect to="/login" /> : <Component {...props} />);
//   return <Route {...rest} render={auth} />;
// };

ReactDOM.render(
  <Provider store={store.store}>
    <PersistGate loading={null} persistor={store.persistor}>
      <ConnectedRouter history={configureStore.history}>
        <Switch>
          <Redirect from="/" exact to="/login" />
          <Route path="/login">
            <Route exact path="/login" component={LoginComponent} />
            <Route path="/login/access-code" component={LoginAccessCodeComponent} />
          </Route>
          <Route path="/sign-up">
            <Route exact path="/sign-up" component={SignupComponent} />
            <Route path="/sign-up/access-code" component={SignUpAccessCodeComponent} />
            <Route path="/sign-up/you-are-in" component={SignUpYouAreInComponent} />
            <Route path="/sign-up/thank-you" component={SignUpThankYouComponent} />
          </Route>
          <Route component={Page404Component} />
        </Switch>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("bitwage-root")
);
