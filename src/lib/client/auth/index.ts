import Cookies from 'js-cookie';
import { Backend } from '../api';
import type { ClientTypes } from '$lib/types/client';
import { Store } from '$lib/writable';

export class Authorization {
	static authenticated = Store<boolean>(false);
	static loading = Store<boolean>(true);
	static token = '';
	static userInfo = Store<ClientTypes.Response.User | undefined>();

	static async loadToken() {
		const token = Cookies.get('gdrToken');
		if (!token) return;

		const authenticationResult = await this.authenticateWithToken(token);
		return authenticationResult.result;
	}

	static async authenticateWithToken(token: string) {
		const userInfoResult = await Backend.userInfo(token);

		if (userInfoResult.success) {
			this.setAuthorization(token, userInfoResult.result!);
		}

		return userInfoResult;
	}

	static async authenticateWithCredentials(username: string, password: string) {
		const loginResult = await Backend.login(username, password);

		if (loginResult.success) {
			await this.authenticateWithToken(loginResult.result!.value);
		}

		return loginResult;
	}

	static setAuthorization(token: string, userInfo?: ClientTypes.Response.User) {
		this.token = token;
		this.userInfo.set(userInfo);
		this.authenticated.set(true);

		Backend.setToken(token);
		Cookies.set('gdrToken', token, {
			expires: 14,
			domains: import.meta.env.DEV ? 'localhost' : location.hostname
		});
	}

	static resetAuthorization() {
		this.token = '';
		this.userInfo.set(undefined);
		this.authenticated.set(false);

		Backend.setToken('');
		Cookies.remove('gdrToken');
	}

	static async logout() {
		if (!this.authenticated()) return;

		await Backend.logout();
		this.resetAuthorization();
	}
}
