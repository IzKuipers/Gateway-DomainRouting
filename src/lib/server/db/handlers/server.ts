import { CommandResult } from '$lib/result';
import type { UpdateWriteOpResult } from 'mongoose';
import { type GatewayServer, Servers } from '../../models/server';
import { DatabaseHandler } from '../handler';
import { AuditLogHandler } from './auditlog';
import { DomainHandler } from './domain';

export class ServerHandler extends DatabaseHandler<GatewayServer>() {
	static db = Servers;

	static async createServer(
		auditor: string,
		displayName: string,
		serverName: string,
		address: string,
		port: number
	): Promise<CommandResult<GatewayServer>> {
		this.LogInfo(`createServer`);

		try {
			const result = await this.db.create({
				displayName,
				serverName,
				address,
				port
			});

			await AuditLogHandler.Audit(auditor, 'Created a server', {
				affectsServer: result._id.toString(),
				extraData: result.toJSON()
			});

			return CommandResult.Ok<GatewayServer>(result);
		} catch (e) {
			return CommandResult.Error(`Failed to create server entry: ${e}`);
		}
	}

	static async updateServer(auditor: string, serverId: string, update: Partial<GatewayServer>): Promise<CommandResult<UpdateWriteOpResult>> {
		this.LogInfo(`updateServer: ${serverId}`);

		const server = await this.getOneById(serverId);
		if (!server) return CommandResult.Error(`Server not found`);

		await AuditLogHandler.Audit(auditor, 'Updated a domain', { affectsServer: serverId });

		return CommandResult.Ok(await this.db.updateOne({ _id: serverId }, update));
	}

	static async deleteServerById(auditor: string, serverId: string) {
		this.LogWarning(`deleteServerById: ${serverId}`);

		const result = await this.db.findOneAndDelete({ _id: serverId });
		if (!result) return CommandResult.Error(`Failed to delete server ${serverId}: not found`);

		await DomainHandler.deleteDomainsByServerId(auditor, serverId);
		await AuditLogHandler.Audit(auditor, 'Deleted a server', {
			affectsServer: serverId,
			extraData: result?.toJSON()
		});

		return CommandResult.Ok<GatewayServer>(result, 'Server deleted successfully');
	}

	static async getStatistics(): Promise<CommandResult<Record<string, number>>> {
		try {
			const servers = await this.getAllSerializable();
			const domains = await DomainHandler.getAllSerializable();
			const result: Record<string, number> = {};

			for (const server of servers) {
				result[server._id.toString()] = domains.filter((d) => d.server === server._id.toString()).length;
			}

			return CommandResult.Ok(result);
		} catch (e) {
			return CommandResult.Error(`Failed to obtain server statistics: ${e}`);
		}
	}
}
