import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUsers, selectUser, updateUser } from '../../../../actions/user';

import './styles.less';

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(getUsers());
  }
  render() {
    const { users } = this.props;
    return (
      <div>
        <h2>User Table</h2>
        <Link to="/user/create"><Button bsStyle="primary" onClick={() => this.props.dispatch(updateUser({}))}>Create User</Button></Link>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map(u =>
                (
                  <tr key={`${u.id}`}>
                    <td> {u.name} </td>
                    <td> {u.username} </td>
                    <td> {u.email} </td>
                    <td>
                      <Link to={`/user/${u.id}`}><Button bsStyle="success" onClick={() => this.props.dispatch(selectUser(u.id))}>Edit</Button></Link>
                      <Button bsStyle="danger">Delete</Button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
