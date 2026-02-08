import { model, Schema } from 'mongoose';
import type { GatewayDomain } from './domain';
import type { GatewayServer } from './server';
import type { GatewayUser } from './user';

export interface AuditLog {
	userId: string; // -> GatewayUser._id
	operation: string;
	affectsServer?: string; // -> GatewayServer._id
	affectsDomain?: string; // -> GatewayDomain._id
	createdAt: string;
	updatedAt: string;
}

export interface ExpandedAuditLog extends AuditLog {
	user: GatewayUser;
	affectedServer?: GatewayServer;
	affectedDomain?: GatewayDomain;
}

const schema = new Schema<AuditLog>(
	{
		operation: {
			type: String,
			required: true
		},
		userId: {
			type: String,
			required: true
		},
		affectsServer: {
			type: String
		},
		affectsDomain: {
			type: String
		}
	},
	{ timestamps: true }
);

export const AuditLogs = model<AuditLog>('auditlog', schema);
