import Storage from './storage';

const maxAgeDay = process.env.COOKIE_AUTH_MAXAGE
	? parseInt(process.env.COOKIE_AUTH_MAXAGE, 10)
	: 7;

class AuthStorage extends Storage {
	get loggedIn() {
		return !!this.value?.token;
	}

	get token() {
		return this.value?.token;
	}
}

export default new AuthStorage('auth._token', null, {
	maxAge: maxAgeDay * 24 * 60 * 60,
});
