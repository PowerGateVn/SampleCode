import Router from 'next/router';
import { notification } from 'antd';
import merge from 'lodash/merge';
import queryString from 'query-string';

import CONSTANTS from 'src/constants/urls';

import AuthStorage from './auth-storage';

type Property = {
	url: string;
	options?: object;
	payload?: any;
};

const { API_URL }: { API_URL: any } = CONSTANTS;

const fetchApi = async (
	{ url, options, payload = {} /* , dispatch = f => f */ }: Property,
	cb?: (...f: any) => void,
) => {
	try {
		const defaultOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const opts: any = merge(defaultOptions, options);

		// set token
		if (await AuthStorage.token) {
			opts.headers.Authorization = `Bearer ${AuthStorage.token}`;
		}

		let uri = API_URL + url;
		if (payload && Object.keys(payload).length > 0) {
			if (opts && opts.method === 'GET') {
				if (payload.filter) {
					payload.filter = JSON.stringify(payload.filter);
				}

				uri = queryString.stringifyUrl({ url: uri, query: payload });
			} else {
				if (opts.headers['Content-Type'] === 'multipart/form-data') {
					delete opts.headers['Content-Type'];

					const formData = new FormData();
					Object.entries(payload).forEach(([key, val]: any) => {
						if (val) {
							if (
								key === 'assetFiles' ||
								key === 'pdfFiles' ||
								key === 'images' ||
								key === 'newImages' ||
								key === 'newPdfFiles' ||
								key === 'newMediaFiles' ||
								key === 'deleteImages' ||
								key === 'deletePdfFiles' ||
								key === 'deleteMediaFiles'
							) {
								val.forEach((file: any) => {
									formData.append(key, file);
								});
							} else {
								formData.append(key, val);
							}
						}
					});

					opts.body = formData;
				} else {
					opts.body = JSON.stringify(payload);
				}
			}
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('------');
			console.log('Call API: url, options, payload', {
				uri,
				opts,
				payload,
			});
		}

		const response = await fetch(uri, opts);

		if (process.env.NODE_ENV === 'development') {
			console.log('------');
		}

		if (response.ok && (response.status === 204 || response.statusText === 'No Content')) {
			if (cb) cb(null);
			return {};
		}

		const data = await response.json();

		if (response.status !== 200 || data.meta?.code >= 4000) {
			throw data;
		}

		if (cb) cb(null, data || {});
		return data || {};
	} catch (err: any) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Call API Error: ', err);
		}

		if (process.browser) {
			notification.error({
				message: 'Oops!',
				description:
					err.error?.message || err.meta?.message || err.detail || err.message || err.toString(),
			});
		}

		if (err.statusCode === 403 || err.statusCode === 401) {
			// AuthStorage.destroy();
			// dispatch({ type: 'LOGOUT_SUCCESS' });
			if (process.browser) {
				Router.replace('/forbidden');
			}
		}

		if (cb) cb(err);
		throw err;
	}
};

export default fetchApi;
