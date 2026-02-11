import type { ClientTypes } from '$lib/types/client';
import { Store } from '$lib/writable';
import { Backend } from '.';

export class DataCache {
	public static ServerList = Store<ClientTypes.Response.Server[]>([]);
	public static DomainList = Store<ClientTypes.Response.Domain[]>([]);
	public static loading = Store<boolean>(false);

	static async refreshAll() {
		this.loading.set(true);
		await this.refreshServers(true);
		await this.refreshDomains(true);
		this.loading.set(false);
	}

	static async refreshDomains(master = false) {
		if (!master) this.loading.set(true);

		const domainsResult = await Backend.getAllDomains();
		if (!domainsResult.success) return; // todo: error handling

		this.DomainList.set(domainsResult.result!);
		if (!master) this.loading.set(false);
	}

	static async refreshServers(master = false) {
		if (!master) this.loading.set(true);

		const serversResult = await Backend.getAllServers();
		if (!serversResult.success) return; // todo: error handling

		this.ServerList.set(serversResult.result!);
		if (!master) this.loading.set(false);
	}
}
