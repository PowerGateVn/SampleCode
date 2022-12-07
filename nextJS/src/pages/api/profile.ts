import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {
	meta: object;
	data: object;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
	if (req.method === 'GET') {
		res.status(200).json({
			meta: {
				message: 'OK',
			},
			data: {
				record: {
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
