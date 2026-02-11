import { CommandResult } from '$lib/result';
import type { DeleteResult, UpdateWriteOpResult } from 'mongoose';
import { Domains, type GatewayDomain } from '../../models/domain';
import { DatabaseHandler } from '../handler';
import { AuditLogHandler } from './auditlog';
import { ServerHandler } from './server';

export class DomainHandler extends DatabaseHandler<GatewayDomain>() {
	static db = Domains;

	static async getDomainsOfServer(serverId: string) {
		this.LogVerbose(`getDomainsOfServer: ${serverId}`);

		return await this.db.find({ server: serverId });
	}

	static async createDomain(auditor: string, serverId: string, value: string, comment?: string): Promise<CommandResult<GatewayDomain>> {
		this.LogInfo(`createDomain: ${serverId} -> ${value} (${comment ?? '<no comment>'})`);

		const server = await ServerHandler.getOneById(serverId);
		if (!server) return CommandResult.Error(`The specified server does not exist`, 404);

		const domain = await this.getOneByValue(value);
		if (domain) return CommandResult.Error(`The domain already exists`, 409);

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
			return CommandResult.Error(`Failed to create domain entry: ${e}`, 500);
		}
	}

	static async updateDomain(auditor: string, domainId: string, update: Partial<GatewayDomain>): Promise<CommandResult<UpdateWriteOpResult>> {
		this.LogInfo(`updateDomain: ${domainId}`);

		const domain = await this.getOneById(domainId);
		if (!domain) return CommandResult.Error(`Domain not found`, 404);

		if (update.server) return CommandResult.Error(`The server of a domain can't be changed.`, 400);

		await AuditLogHandler.Audit(auditor, 'Updated a domain', {
			affectsDomain: domainId,
			extraData: { update }
		});

		return CommandResult.Ok(await this.db.updateOne({ _id: domainId }, update));
	}

	static async moveDomain(auditor: string, domainId: string, newServerId: string): Promise<CommandResult<UpdateWriteOpResult>> {
		const domain = await this.getOneById(domainId);
		if (!domain) return CommandResult.Error(`Domain not found`, 404);

		const server = await ServerHandler.getOneById(newServerId);
		if (!server) return CommandResult.Error(`Server not found`, 404);

		await AuditLogHandler.Audit(auditor, `Moved a domain to ${newServerId}`, {
			affectsDomain: domainId,
			affectsServer: newServerId
		});

		return CommandResult.Ok(await this.db.updateOne({ _id: domainId }, { server: newServerId }));
	}

	static async deleteDomain(auditor: string, domainId: string): Promise<CommandResult<GatewayDomain>> {
		this.LogWarning(`deleteDomain: ${domainId}`);

		const deletedDomain = await this.db.findOneAndDelete({ _id: domainId });
		if (!deletedDomain) return CommandResult.Error(`Failed to delete domain ${domainId}: the domain doesn't exist.`, 404);

		await AuditLogHandler.Audit(auditor, 'Deleted a domain', {
			affectsDomain: domainId,
			extraData: deletedDomain?.toJSON()
		});

		return CommandResult.Ok<GatewayDomain>(deletedDomain, 'The domain has been deleted.');
	}

	static async deleteDomainsByServerId(auditor: string, serverId: string): Promise<CommandResult<DeleteResult>> {
		this.LogWarning(`deleteDomainsByServerId: ${serverId}`);

		const domains = (await this.getDomainsOfServer(serverId)).map((s) => s.toJSON());
		if (!domains.length) return CommandResult.Error(`Failed to delete the domains of ${serverId}: none were found.`, 404);

		await AuditLogHandler.Audit(auditor, 'Deleted domains of server', {
			affectsServer: serverId,
			extraData: domains
		});

		return CommandResult.Ok(await this.db.deleteMany({ server: serverId }));
	}

	static async getOneByValue(value: string): Promise<GatewayDomain | null> {
		return await this.db.findOne({ value });
	}
}
