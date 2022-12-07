import type { NextApiRequest, NextApiResponse } from 'next';

import ucwords from 'src/utils/ucwords';

type Response = {
	meta: object;
	data: object;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
	const { action, uid } = req.query;

	res.status(200).json({
		meta: {
			message: `${ucwords(action.toString())} success`,
		},
		data: {
			record: {
				uid,
				title: 'sample',
				path: '/sample-path',
			},
		},
	});
};

export default handler;
