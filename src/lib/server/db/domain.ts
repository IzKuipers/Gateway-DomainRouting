import { CommandResult } from '$lib/result';
import type { UpdateWriteOpResult } from 'mongoose';
import { Domains, type GatewayDomain } from '../models/domain';
import { Audit } from './auditlog';

export async function getAllDomains() {
	return await Domains.find({});
}

export async function getDomainsOfServer(serverId: string) {
	return await Domains.find({ serverId });
}

export async function createDomain(
	auditor: string,
	serverId: string,
	value: string,
	comment?: string
): Promise<CommandResult<GatewayDomain>> {
	try {
		const result = await Domains.create({
			server: serverId,
			value,
			comment: comment ?? ''
		});

		await Audit(auditor, 'Created a domain', undefined, result._id.toString());

		return CommandResult.Ok(result);
	} catch (e) {
		return CommandResult.Error(`Failed to create domain entry: ${e}`);
	}
}

export async function updateDomain(
	auditor: string,
	domainId: string,
	update: Partial<GatewayDomain>
): Promise<CommandResult<UpdateWriteOpResult>> {
	if (update.server) return CommandResult.Error(`The server of a domain can't be changed.`);

	await Audit(auditor, 'Updated a domain', undefined, domainId);

	return CommandResult.Ok(await Domains.updateOne({ _id: domainId }, update));
}

export async function moveDomain(auditor: string, domainId: string, newServerId: string) {
	await Audit(auditor, `Moved a domain to ${newServerId}`, undefined, domainId);

	return CommandResult.Ok(await Domains.updateOne({ _id: domainId }, { serverId: newServerId }));
}

export async function deleteDomain(auditor: string, domainId: string) {
	await Audit(auditor, 'Deleted a domain', undefined, domainId);

	return await Domains.deleteOne({ _id: domainId });
}

export async function deleteDomainsByServerId(auditor: string, serverId: string) {
	await Audit(auditor, 'Deleted domains of server', serverId);

	return await Domains.deleteMany({ serverId });
}
