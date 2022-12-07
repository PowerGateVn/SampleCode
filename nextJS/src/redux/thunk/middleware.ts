import { SINGLE_API } from 'src/redux/actions/types';
import fetchAPI from 'src/utils/fetch-api';

const mandatory = () => {
	throw new Error('Missing parameter!');
};

const singleApi = async (
	dataApi = mandatory(),
	dispatch: (data: { type: string; payload?: any }) => void,
) => {
	const {
		url = mandatory(),
		options,
		payload = {},
		beforeCallType,
		successType,
		errorType,
		next = (...f: any) => f,
	} = dataApi;

	try {
		dispatch({ type: 'START_LOADING' });

		if (beforeCallType) {
			dispatch({ type: beforeCallType });
		}

		const response = await fetchAPI({
			url,
			options,
			payload,
			// dispatch,
		});

		next(null, response);

		if (successType) {
			dispatch({ type: successType, payload: response });
		}

		dispatch({ type: 'STOP_LOADING' });

		return response;
	} catch (error) {
		next(error);

		if (errorType) {
			dispatch({ type: errorType, payload: error });
		}

		// dispatch({ type: REQUEST_ERROR, payload: error });
		dispatch({ type: 'STOP_LOADING' });

		throw error;
	}
};

const middleware =
	({ dispatch }: { dispatch: any }) =>
		(next: (...f: any) => void) =>
			(action: any) => {
				switch (action.type) {
					case SINGLE_API:
						return singleApi(action.payload, dispatch);
					default:
						return next(action);
				}
			};

export default middleware;
