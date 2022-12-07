import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {
	meta: object;
	data: object;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
	if (req.method === 'POST') {
		let code = 200;
		let message = 'Success';
		let token = 'dummytoken';
		const { username, password } = req.body;

		if (username !== 'admin' || password !== 'admin') {
			code = 400;
			message = 'Invalid username or password';
			token = '';
		}

		res.status(code).json({
			meta: {
				message,
			},
			data: {
				record: {
					token,
					name: 'User Demo',
					email: 'demo@mail.com',
				},
			},
		});
	} else {
		res.status(404).json({
			meta: {
				message: 'Page not found',
			},
			data: {
				record: {},
			},
		});
	}
};

export default handler;
