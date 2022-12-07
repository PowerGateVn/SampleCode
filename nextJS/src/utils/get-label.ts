const getLabel = (options: any[] = [], val: any) => {
	if (options.length === 0 || !val) {
		return '';
	}

	const option = options.find((el) => {
		return el.value === val;
	});

	return option ? option.label : val;
};

export default getLabel;
