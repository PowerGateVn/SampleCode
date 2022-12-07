import { notification } from 'antd';

import AuthStorage from 'src/utils/auth-storage';
import URL from 'src/constants/urls';

const { API_URL } = URL;

const upload = (
	file: any,
	next = (...f: any) => f,
	nextErr = (...f: any) => f,
) => {
	const { name, renameFile, type } = file;

	const options: any = {
		method: 'POST',
		body: JSON.stringify({
			fileName: renameFile || name,
			contentType: type,
		}),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	// set token
	if (AuthStorage.loggedIn) {
		options.headers.Authorization = AuthStorage.token;
	}

	fetch(API_URL + '/containers/get-signed-url', options)
		.then((response) => {
			return response.status === 204 ||
				response.statusText === 'No Content'
				? {}
				: response.json();
		})
		.then((res: any) => {
			if (res.error) {
				throw res.error;
			} else {
				const optionsS3 = {
					method: 'PUT',
					body: file,
					headers: {
						'Content-Type': type,
					},
				};

				return fetch(res.singedUrl, optionsS3)
					.then((response) => {
						if (response.status === 200) {
							notification.success({
								message: 'Uploaded',
								description: 'Uploaded successfully.',
							});
							return next(res);
						}

						return nextErr(response);
					})
					.catch((err) => {
						console.log('err upload s3', err);
						notification.error({
							message: 'Error',
							// eslint-disable-next-line max-len
							description: 'Please try again. Make sure you are uploading a valid file. (Err upload s3)' + err,
						});
						return nextErr(err);
					});
			}
		})
		.catch((err) => {
			console.log('err upload api', err);
			notification.error({
				message: 'Error',
				description:
					'Please try again. Make sure you are uploading a valid file. (Err upload api)' +
					err,
			});
			return nextErr(err);
		});
};

export default upload;
