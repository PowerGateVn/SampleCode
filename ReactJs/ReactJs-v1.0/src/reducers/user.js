import { UserTypes } from '../actionTypes/user';

const initialState = {
  users: [],
  userSelected: {}
};

export default function register(state = initialState, action) {
  switch (action.type) {
    case UserTypes.GET_USERS:
      return {
        ...state,
        users: action.data
      };
    case UserTypes.CREATE_USER: 
    {
      const cloneState = { ...state };
      cloneState.users.push(action.data);
      return cloneState;
    }  
    case UserTypes.SELECT_USER:
      return {
        ...state,
        userSelected: { ...state.users.find(u => u.id === action.data) }
      };
    case UserTypes.UPDATE_USER:
    {
      const cloneState = { ...state };
      cloneState.users[cloneState.users.findIndex(user => user.id === action.data.id)] = action.data;
      return cloneState;
    }
    case UserTypes.EDIT_USER:
      return {
        ...state,
        userSelected: action.data
      };
    default:
      return state;
  }
}

register.reducer = 'register';
