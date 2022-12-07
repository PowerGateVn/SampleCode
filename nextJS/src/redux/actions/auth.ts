import { SINGLE_API } from 'src/redux/actions/types';
import AuthStorage from 'src/utils/auth-storage';

export const actionLogin = async (payload = {}, next?: (...f: any) => void) => {
	return {
		type: SINGLE_API,
		payload: {
			url: '/login',
			options: { method: 'POST' },
			payload,
			successType: 'LOGIN_SUCCESS',
			next: async (err: any, res: any = {}) => {
				if (!err) {
					AuthStorage.value = {
						token: res.data.record.token,
					};
				}

				if (next) next(null, res);
			},
		},
	};
};

export const actionGetUserAuth = async (next?: (...f: any) => void) => {
	return {
		type: SINGLE_API,
		payload: {
			url: '/profile',
			successType: 'GET_USER_AUTH_SUCCESS',
			next,
		},
	};
};
