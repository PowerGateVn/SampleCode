import React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import UserList from '../../pages/User/List';
import CreateOrEditUser from '../../pages/User/CreatOrEdit';
import './styles.less';

export class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <UserList {...this.props} />} />
          <Route exact path="/user" render={() => <UserList {...this.props} />} />
          <Route path="/user/create" render={props => <CreateOrEditUser {...this.props} {...props} />} />
          <Route
            path="/user/:id"
            render={
              props => (this.props.users.length ? (<CreateOrEditUser {...this.props} {...props} />) : (<Redirect to="/user" />))
            }
          />
        </Switch>
      </div>
    );
  }
}
export default withRouter(connect(state => state.user)(App));
