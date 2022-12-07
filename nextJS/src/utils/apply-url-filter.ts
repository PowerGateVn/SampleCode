export const isEmptyObject = (obj: object) => {
	for (const key in obj) {
		return false;
	}
	return true;
};

export const isPlainObject = (obj: any) => {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

// About 1.5x faster than the two-arg version of Array#splice().
export const spliceOne = (list: any[], index: number) => {
	for (let i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
		list[i] = list[k];
	}
	list.pop();
};

const applyURIFilter = (filter: object, name: string = 'filter') => {
	const flag = isPlainObject(filter) && !isEmptyObject(filter);
	return flag ? `?${name}=${encodeURI(JSON.stringify(filter))}` : '';
};

export default applyURIFilter;
