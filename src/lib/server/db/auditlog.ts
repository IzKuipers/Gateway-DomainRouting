/**
 * Audit logging is to be considered to only contain GET and CREATE operations, there's
 * no updating or deleting stuff here without manually altering the database.
 */

import { CommandResult } from '$lib/result';
import { AuditLogs, type ExpandedAuditLog } from '../models/auditlog';
import { getAllDomains } from './domain';
import { getAllServers } from './server';
import { getAllUsers } from './user';

export async function getAuditLog(): Promise<CommandResult<ExpandedAuditLog[]>> {
	try {
		const logs = await AuditLogs.find({});
		const users = await getAllUsers();
		const domains = await getAllDomains();
		const servers = await getAllServers();

		const expanded: ExpandedAuditLog[] = logs.map((l) => ({
			userId: l.userId,
			operation: l.operation,
			affectsServer: l.affectsServer,
			affectsdomain: l.affectsServer,
			createdAt: l.createdAt,
			updatedAt: l.updatedAt,

			// expansion:
			user: users.find((u) => u._id.toString() === l.userId)!,
			affectedServer: servers.find((s) => s._id.toString() === l.affectsServer),
			affectedDomain: domains.find((d) => d._id.toString() === l.affectsDomain)
		}));

		return CommandResult.Ok<ExpandedAuditLog[]>(expanded);
	} catch (e) {
		return CommandResult.Error(`Failed to obtain audit log: ${e}`);
	}
}

/**
 * @throws
 */
export async function Audit(
	auditor: string,
	operation: string,
	affectsServer?: string,
	affectsDomain?: string
) {
	return await AuditLogs.create({
		userId: auditor,
		operation,
		affectsServer,
		affectsDomain
	});
}
