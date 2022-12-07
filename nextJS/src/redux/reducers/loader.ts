import { notification } from 'antd';

import { REQUEST_ERROR } from 'src/redux/actions/types';

export const initialState = {
	sending: false,
};

const reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'TOGGLE_LOADING':
			return { sending: !state.sending };
		case 'START_LOADING':
			return { sending: true };

		case 'STOP_LOADING':
			return { sending: false };
		case REQUEST_ERROR: {
			if (process.browser) {
				notification.error({
					message: 'Oops!',
					description: action?.payload?.message || action.payload,
				});
			}

			return { sending: false, error: action.payload };
		}
		default:
			return state;
	}
};

export default reducer;
