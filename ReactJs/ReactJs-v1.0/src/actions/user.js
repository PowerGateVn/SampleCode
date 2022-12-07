import { get, post, put } from '../utils/api';
import { UserTypes } from '../actionTypes/user';

export const selectUser = id => ({ type: UserTypes.SELECT_USER, data: id });

export const updateUser = user => ({ type: UserTypes.EDIT_USER, data: user });

export const getUsers = () => dispatch =>
  get('users')
    .then(res => dispatch({ type: UserTypes.GET_USERS, data: res }));

export const createUser = user => dispatch =>
  post('users', user)
    .then(res => dispatch({ type: UserTypes.CREATE_USER, data: res }));
    
export const editUser = (user, id) => dispatch =>
  put(`users/${id}`, user)
    .then(res => dispatch({ type: UserTypes.UPDATE_USER, data: res }));

export default {
  getUsers,
  createUser,
  selectUser
};
