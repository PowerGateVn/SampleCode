export const initialState = {};

const reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
		case 'GET_USER_AUTH_SUCCESS':
			return action.payload;
		case 'LOGOUT_SUCCESS':
			return {};
		default:
			return state;
	}
};

export default reducer;
