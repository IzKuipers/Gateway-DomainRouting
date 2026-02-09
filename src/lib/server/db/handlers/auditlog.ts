/**
 * Audit logging is to be considered to only contain GET and CREATE operations, there's
 * no updating or deleting stuff here without manually altering the database.
 */

import { CommandResult } from '$lib/result';
import type { Model } from 'mongoose';
import {
    AuditLogs,
    DefaultAuditOptions,
    type AuditLog,
    type AuditOptions,
    type ExpandedAuditLog
} from '../../models/auditlog';
import type { GatewayDomain } from '../../models/domain';
import type { GatewayServer } from '../../models/server';
import type { GatewayUser } from '../../models/user';
import { DomainHandler } from './domain';
import { DatabaseHandler } from '../handler';
import { ServerHandler } from './server';
import { UserHandler } from './user';

export class AuditLogHandler extends DatabaseHandler {
	static db: Model<AuditLog> = AuditLogs;

	static async getAuditLog(): Promise<CommandResult<ExpandedAuditLog[]>> {
		this.LogDebug('getAuditLog');

		try {
			const logs = await this.db.find({});
			const users = await UserHandler.getAllSerializable<GatewayUser>();
			const domains = await DomainHandler.getAllSerializable<GatewayDomain>();
			const servers = await ServerHandler.getAllSerializable<GatewayServer>();

			const expanded: ExpandedAuditLog[] = logs.map((l) => ({
				_id: l._id.toString(),
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
	static async Audit(
		auditor: string,
		operation: string,
		options: AuditOptions = DefaultAuditOptions
	) {
		this.LogInfo(`Audit: ${auditor} did ${operation}`);

		return await this.db.create({
			userId: auditor,
			operation,
			affectsServer: options.affectsServer,
			affectsDomain: options.affectsDomain,
			extraData: options.extraData
		});
	}
}
