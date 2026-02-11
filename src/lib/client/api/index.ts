import { CommandResult } from '$lib/result';
import type { ClientTypes } from '$lib/types/client';
import axios from 'axios';
import { parseRequestError } from './error';
import { Store } from '$lib/writable';

export class Backend {
	static client = axios.create({
		baseURL: '/api',
		responseType: 'json',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	static version = Store<string>('');

	public static setToken(token: string) {
		this.client.defaults.headers.Authorization = `Bearer ${token}`;
	}

	public static async getAuditLog(): Promise<CommandResult<ClientTypes.Response.AuditLog[]>> {
		try {
			const response = await this.client.get('/auditlog');

			return CommandResult.Ok<ClientTypes.Response.AuditLog[]>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#region DOMAINS

	public static async getAllDomains(): Promise<CommandResult<ClientTypes.Response.Domain[]>> {
		try {
			const response = await this.client.get('/domains/list');

			return CommandResult.Ok<ClientTypes.Response.Domain[]>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async createDomain(data: ClientTypes.Requests.CreateDomain): Promise<CommandResult<ClientTypes.Response.Domain>> {
		try {
			const response = await this.client.post('/domains/create', data);

			return CommandResult.Ok<ClientTypes.Response.Domain>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async updateDomain(update: ClientTypes.Requests.UpdateDomain): Promise<CommandResult<ClientTypes.Response.UpdateResult>> {
		try {
			const response = await this.client.patch('/domains/update', update);

			return CommandResult.Ok<ClientTypes.Response.UpdateResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async moveDomain(domainId: string, newServerId: string): Promise<CommandResult<ClientTypes.Response.UpdateResult>> {
		try {
			const response = await this.client.patch(`/domains/${domainId}/move`, { newServerId });

			return CommandResult.Ok<ClientTypes.Response.UpdateResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async deleteDomain(domainId: string): Promise<CommandResult<ClientTypes.Response.Domain>> {
		try {
			const response = await this.client.delete(`/domains/${domainId}/delete`);

			return CommandResult.Ok<ClientTypes.Response.Domain>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#endregion
	//#region SERVERS

	public static async getAllServers(): Promise<CommandResult<ClientTypes.Response.Server[]>> {
		try {
			const response = await this.client.get(`/server/list`);

			return CommandResult.Ok<ClientTypes.Response.Server[]>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async createServer(data: ClientTypes.Requests.CreateServer): Promise<CommandResult<ClientTypes.Response.Server>> {
		try {
			const response = await this.client.post(`/server/create`, data);

			return CommandResult.Ok<ClientTypes.Response.Server>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async updateServer(
		serverId: string,
		update: ClientTypes.Requests.UpdateServer
	): Promise<CommandResult<ClientTypes.Response.UpdateResult>> {
		try {
			const response = await this.client.patch(`/server/${serverId}/update`, update);

			return CommandResult.Ok<ClientTypes.Response.UpdateResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async deleteServer(serverId: string): Promise<CommandResult<ClientTypes.Response.DeleteResult>> {
		try {
			const response = await this.client.delete(`/server/${serverId}/delete`);

			return CommandResult.Ok<ClientTypes.Response.DeleteResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#endregion
	//#region USERS

	public static async getAllUsers(): Promise<CommandResult<ClientTypes.Response.User[]>> {
		try {
			const response = await this.client.get(`/user/list`);

			return CommandResult.Ok<ClientTypes.Response.User[]>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}
	public static async resetPassword(userId: string, newPassword: string): Promise<CommandResult<ClientTypes.Response.UpdateResult>> {
		try {
			const response = await this.client.patch(`/user/${userId}/resetpswd`, { newPassword });

			return CommandResult.Ok<ClientTypes.Response.UpdateResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async deleteUser(userId: string): Promise<CommandResult<ClientTypes.Response.DeleteResult>> {
		try {
			const response = await this.client.delete(`/user/${userId}/delete`);

			return CommandResult.Ok<ClientTypes.Response.DeleteResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async enableUser(userId: string): Promise<CommandResult<ClientTypes.Response.UpdateResult>> {
		try {
			const response = await this.client.post(`/user/${userId}/enable`);

			return CommandResult.Ok<ClientTypes.Response.UpdateResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async disableUser(userId: string): Promise<CommandResult<ClientTypes.Response.UpdateResult>> {
		try {
			const response = await this.client.post(`/user/${userId}/disable`);

			return CommandResult.Ok<ClientTypes.Response.UpdateResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async userInfo(token?: string): Promise<CommandResult<ClientTypes.Response.User>> {
		try {
			const response = await this.client.get(`/user/info`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

			return CommandResult.Ok<ClientTypes.Response.User>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#endregion
	//#region AUTH

	public static async login(username: string, password: string): Promise<CommandResult<ClientTypes.Response.Token>> {
		try {
			const response = await this.client.post(`/auth/login`, { username, password });

			return CommandResult.Ok<ClientTypes.Response.Token>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async register(username: string, password: string): Promise<CommandResult<ClientTypes.Response.User>> {
		try {
			const response = await this.client.post(`/auth/register`, { username, password });

			return CommandResult.Ok<ClientTypes.Response.User>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async logout(): Promise<CommandResult<ClientTypes.Response.DeleteResult>> {
		try {
			const response = await this.client.post(`/auth/logout`);

			return CommandResult.Ok<ClientTypes.Response.DeleteResult>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#endregion
	//#region CONFIG

	public static async generateConfiguration(): Promise<CommandResult<string>> {
		try {
			const response = await this.client.post(`/config/generate`, {}, { responseType: 'text' });

			return CommandResult.Ok<string>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	public static async deployConfiguration(): Promise<CommandResult<string>> {
		try {
			const response = await this.client.post(`/config/deploy`, {}, { responseType: 'text' });

			return CommandResult.Ok<string>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#endregion
	//#region MISC

	public static async ping(): Promise<CommandResult<ClientTypes.Response.Ping>> {
		try {
			const response = await this.client.get(`/ping`);

			this.version.set(response.data.version);

			return CommandResult.Ok<ClientTypes.Response.Ping>(response.data);
		} catch (e) {
			return parseRequestError(e);
		}
	}

	//#endregion
}
