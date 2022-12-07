import queryString from 'query-string';

const buildUrl = (query: any, url: string = '') => {
	Object.keys(query).forEach((key) => query[key] === '' && delete query[key]);

	const link = queryString.stringifyUrl({ url, query });

	return link;
};
export default buildUrl;
