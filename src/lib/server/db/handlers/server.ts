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

	static async updateDomain(auditor: string, domainId: string, update: Partial<GatewayServer>): Promise<CommandResult<UpdateWriteOpResult>> {
		this.LogInfo(`updateDomain: ${domainId}`);

		await AuditLogHandler.Audit(auditor, 'Updated a domain', { affectsDomain: domainId });

		return CommandResult.Ok(await this.db.updateOne({ _id: domainId }, update));
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
}
