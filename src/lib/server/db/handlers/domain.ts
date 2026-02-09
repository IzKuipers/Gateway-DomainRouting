import { CommandResult } from '$lib/result';
import type { DeleteResult, UpdateWriteOpResult } from 'mongoose';
import { Domains, type GatewayDomain } from '../../models/domain';
import { DatabaseHandler } from '../handler';
import { AuditLogHandler } from './auditlog';

export class DomainHandler extends DatabaseHandler<GatewayDomain>() {
	static db = Domains;

	static async getDomainsOfServer(serverId: string) {
		this.LogVerbose(`getDomainsOfServer: ${serverId}`);

		return await this.db.find({ serverId });
	}

	static async createDomain(auditor: string, serverId: string, value: string, comment?: string): Promise<CommandResult<GatewayDomain>> {
		this.LogInfo(`createDomain: ${serverId} -> ${value} (${comment ?? '<no comment>'})`);

		try {
			const result = await this.db.create({
				server: serverId,
				value,
				comment: comment ?? ''
			});

			await AuditLogHandler.Audit(auditor, 'Created a domain', {
				affectsDomain: result._id.toString(),
				extraData: result.toJSON()
			});

			return CommandResult.Ok(result);
		} catch (e) {
			return CommandResult.Error(`Failed to create domain entry: ${e}`);
		}
	}

	static async updateDomain(auditor: string, domainId: string, update: Partial<GatewayDomain>): Promise<CommandResult<UpdateWriteOpResult>> {
		this.LogInfo(`updateDomain: ${domainId}`);

		if (update.server) return CommandResult.Error(`The server of a domain can't be changed.`);

		await AuditLogHandler.Audit(auditor, 'Updated a domain', {
			affectsDomain: domainId,
			extraData: { update }
		});

		return CommandResult.Ok(await this.db.updateOne({ _id: domainId }, update));
	}

	static async moveDomain(auditor: string, domainId: string, newServerId: string): Promise<CommandResult<UpdateWriteOpResult>> {
		await AuditLogHandler.Audit(auditor, `Moved a domain to ${newServerId}`, {
			affectsDomain: domainId,
			affectsServer: newServerId
		});

		return CommandResult.Ok(await this.db.updateOne({ _id: domainId }, { serverId: newServerId }));
	}

	static async deleteDomain(auditor: string, domainId: string): Promise<CommandResult<GatewayDomain>> {
		this.LogInfo(`deleteDomain: ${domainId}`);

		const deletedDomain = await this.db.findOneAndDelete({ _id: domainId });

		if (!deletedDomain) return CommandResult.Error(`Failed to delete domain ${domainId}: the domain doesn't exist.`);

		await AuditLogHandler.Audit(auditor, 'Deleted a domain', {
			affectsDomain: domainId,
			extraData: deletedDomain?.toJSON()
		});

		return CommandResult.Ok<GatewayDomain>(deletedDomain, 'The domain has been deleted.');
	}

	static async deleteDomainsByServerId(auditor: string, serverId: string): Promise<CommandResult<DeleteResult>> {
		this.LogInfo(`deleteDomainsByServerId: ${serverId}`);

		const domains = (await this.getDomainsOfServer(serverId)).map((s) => s.toJSON());

		if (!domains.length) return CommandResult.Error(`Failed to delete the domains of ${serverId}: none were found.`);

		await AuditLogHandler.Audit(auditor, 'Deleted domains of server', {
			affectsServer: serverId,
			extraData: domains
		});

		return CommandResult.Ok(await this.db.deleteMany({ serverId }));
	}
}
