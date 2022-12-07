import { identity, isEmpty, pickBy } from 'lodash';

const tablePayload = (pagination: any, filters: any, sorter: any) => {
	let sort: any = {};
	let filter: any = {};
	const { current: page, pageSize: limit } = pagination;

	if (!isEmpty(sorter) && sorter.order) {
		sort = {
			sort: sorter.field,
			direction: sorter.order.replace('end', ''),
		};
	}

	if (!isEmpty(pickBy(filters, identity))) {
		const filterData: any = {};

		Object.keys(filters).forEach((key) => {
			if (filters[key]) {
				filterData[key] = filters[key].join();
			}
		});

		filter = {
			filter: Object.keys(filterData).length > 0 ? filterData : null,
		};
	}

	return {
		page,
		limit,
		...sort,
		...filter,
	};
};

export default tablePayload;
