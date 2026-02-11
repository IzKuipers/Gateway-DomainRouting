export namespace ClientTypes {
	export namespace Response {
		export interface AuditLog {
			_id: string;
			user: User;
			affectedServer?: Server;
			affectedDomain?: Domain;
			userId: string; // -> User._id
			operation: string;
			affectsServer?: string; // -> Server._id
			affectsDomain?: string; // -> Domain._id
			createdAt: string;
			updatedAt: string;
			extraData?: object;
		}

		export interface User {
			_id: string;
			username: string;
			createdAt: string;
			updatedAt: string;
			enabled: boolean;
		}

		export interface Server {
			_id: string;
			displayName: string;
			serverName: string;
			address: string;
			port: number;
			enabled: boolean;
			createdAt: string;
			updatedAt: string;
		}

		export interface Domain {
			_id: string;
			server: string; // -> GatewayServer._id
			value: string;
			enabled: boolean;
			comment: string;
			createdAt: string;
			updatedAt: string;
		}

		export interface UpdateResult {
			acknowledged: boolean;
			matchedCount: number;
			modifiedCount: number;
			upsertedCount: number;
			upsertedId: number | null;
		}

		export interface DeleteResult {
			acknowledged: boolean;
			deletedCount: number;
		}

		export interface Token {
			_id: string;
			userId: string;
			value: string;
			createdAt: string;
			updatedAt: string;
		}

		export interface Ping {
			ping: string;
			version: string;
		}
	}

	export namespace Requests {
		export interface CreateDomain {
			serverId: string;
			value: string;
			comment?: string;
		}

		export interface UpdateDomain {
			value?: string;
			comment?: string;
			enabled?: boolean;
		}

		export interface CreateServer {
			displayName: string;
			serverName: string;
			address: string;
			port: number;
		}

		export interface UpdateServer {
			displayName?: string;
			serverName?: string;
			address?: string;
			port?: number;
			enabled?: boolean;
		}
	}

	export interface DialogData {
		title: string;
		message: string;
		icon: string;
		buttons: DialogButton[];
	}

	export interface DialogButton {
		caption: string;
		action: () => void;
	}
}
