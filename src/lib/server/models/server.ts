import { model, Schema } from 'mongoose';

export interface GatewayServer {
	_id: string;
	displayName: string;
	serverName: string;
	address: string;
	port: number;
	enabled: boolean;
	createdAt: string;
	updatedAt: string;
}

const schema = new Schema<GatewayServer>(
	{
		displayName: {
			required: true,
			type: String
		},
		serverName: {
			required: true,
			type: String
		},
		address: {
			required: true,
			type: String
		},
		port: {
			required: true,
			type: Number
		},
		enabled: {
			default: true,
			type: Boolean
		}
	},
	{ timestamps: true }
);

export const Servers = model<GatewayServer>('server', schema);
