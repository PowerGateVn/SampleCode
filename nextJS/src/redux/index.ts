import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducer, { initialState } from 'src/redux/reducers';
import apiMiddleware from 'src/redux/thunk/middleware';

const DEV = process.browser && process.env.NODE_ENV === 'development';

const bindMiddleware = (middleware: any) => {
	if (DEV) {
		const { createLogger } = require('redux-logger');
		const logger = createLogger({
			collapsed: (getState: any, action: any, logEntry: any) => !logEntry.error,
		});

		return applyMiddleware(...middleware, logger);
	}

	return applyMiddleware(...middleware);
};

const makeStore = () => {
	const store = createStore(
		reducer,
		initialState,
		bindMiddleware([apiMiddleware, thunk]),
	);

	return store;
};

export default createWrapper(makeStore, {
	debug: process.env.NODE_ENV === 'development',
});
