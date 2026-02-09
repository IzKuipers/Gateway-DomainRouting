import { Document, model, Schema } from 'mongoose';
import type { GatewayDomain } from './domain';
import type { GatewayServer } from './server';
import type { GatewayUser } from './user';

export interface AuditLog extends Document {
	userId: string; // -> GatewayUser._id
	operation: string;
	affectsServer?: string; // -> GatewayServer._id
	affectsDomain?: string; // -> GatewayDomain._id
	createdAt: string;
	updatedAt: string;
	extraData?: object;
}

export interface ExpandedAuditLog {
    _id: string;
	user: GatewayUser;
	affectedServer?: GatewayServer;
	affectedDomain?: GatewayDomain;
	userId: string; // -> GatewayUser._id
	operation: string;
	affectsServer?: string; // -> GatewayServer._id
	affectsDomain?: string; // -> GatewayDomain._id
	createdAt: string;
	updatedAt: string;
	extraData?: object;
}

export interface AuditOptions {
	affectsServer?: string;
	affectsDomain?: string;
	extraData?: object;
}

export const DefaultAuditOptions: AuditOptions = {};

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
		},
		extraData: {
			type: Object,
			default: {}
		}
	},
	{ timestamps: true }
);

export const AuditLogs = model<AuditLog>('auditlog', schema);
