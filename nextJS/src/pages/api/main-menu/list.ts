import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {
	meta: object;
	data: object;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
	if (req.method === 'GET') {
		const { filter } = req.query;
		let records = [
			{
				uid: 'x1',
				title: 'Dashboard',
				path: '/',
			},
			{
				uid: 'x2',
				title: 'Add Main Menu',
				path: '/main-menu/add',
			},
			{
				uid: 'x3',
				title: 'Manage Main Menu',
				path: '/main-menu/manage',
			},
		];

		if (filter) {
			const { path, title } = JSON.parse(filter.toString());

			if (path) {
				records = records.filter((r) => r.path.indexOf(path) > -1);
			}

			if (title) {
				records = records.filter((r) => r.title === title);
			}
		}

		res.status(200).json({
			meta: {
				message: 'OK',
				pagination: {
					total_records: 3,
				},
			},
			data: {
				records,
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
