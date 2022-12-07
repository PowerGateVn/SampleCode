import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';

import auth, { initialState as authInitial } from './auth';
import loader, { initialState as initialLoader } from './loader';

export const initialState = {
	auth: authInitial,
	loader: initialLoader,
};

const appReducer = combineReducers({
	auth,
	loader,
});

const reducers = (state: any, action: any) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload, // apply delta from hydration
		};
		return nextState;
	}
	return appReducer(action.type === 'LOGOUT_SUCCESS' ? initialState : state, action);
};

export default reducers;
