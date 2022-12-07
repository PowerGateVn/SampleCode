import { startCase, toLower } from 'lodash';

const ucwords = (text: string) => {
	return startCase(toLower(text));
};

export default ucwords;
