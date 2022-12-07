import cookie from 'react-cookies';

const maxAgeDay = process.env.COOKIE_DEFAULT_MAXAGE
	? parseInt(process.env.COOKIE_DEFAULT_MAXAGE, 10)
	: 7;
const mandatory = () => {
	throw new Error('Storage Missing parameter!');
};

export default class Storage {
	name: string;

	options: object = {};

	constructor(
		name: string = mandatory(),
		value: any = null,
		options: object = {},
	) {
		this.name = name;
		this.options = options;

		if (!this.value) {
			this.value = value;
		}
	}

	set value(value) {
		if (value) {
			cookie.save(this.name, value, {
				path: '/',
				maxAge: maxAgeDay * 24 * 60 * 60,
				...this.options,
			});
		}
	}

	get value() {
		return cookie.load(this.name);
	}

	get allCookies() {
		return cookie.loadAll();
	}

	destroy = (next = (...f: any) => f) => {
		cookie.remove(this.name, {
			path: '/',
			maxAge: maxAgeDay * 24 * 60 * 60,
			...this.options,
		});
		next();
	};
}
