import { CommandResult } from '$lib/result';
import type { UpdateWriteOpResult } from 'mongoose';
import { type GatewayServer, Servers } from '../models/server';
import { Audit } from './auditlog';
import { deleteDomainsByServerId } from './domain';

export async function getAllServers() {
	return await Servers.find({});
}

export async function createServer(
	auditor: string,
	displayName: string,
	serverName: string,
	address: string,
	port: number
): Promise<CommandResult<GatewayServer>> {
	try {
		const result = await Servers.create({
			displayName,
			serverName,
			address,
			port
		});

		await Audit(auditor, 'Created a server', result._id.toString());

		return CommandResult.Ok<GatewayServer>(result);
	} catch (e) {
		return CommandResult.Error(`Failed to create server entry: ${e}`);
	}
}

export async function updateDomain(
	auditor: string,
	domainId: string,
	update: Partial<GatewayServer>
): Promise<CommandResult<UpdateWriteOpResult>> {
	await Audit(auditor, 'Updated a domain', undefined, domainId);

	return CommandResult.Ok(await Servers.updateOne({ _id: domainId }, update));
}

export async function deleteServerById(auditor: string, serverId: string) {
	await deleteDomainsByServerId(auditor, serverId);
	await Servers.deleteOne({ _id: serverId });

	await Audit(auditor, 'Deleted a server', serverId);
}
