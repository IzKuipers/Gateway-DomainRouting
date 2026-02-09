import { Document, model, Schema } from 'mongoose';

export interface GatewayDomain extends Document {
	server: string; // -> GatewayServer._id
	value: string;
	enabled: boolean;
	comment: string;
	createdAt: string;
	updatedAt: string;
}

const schema = new Schema<GatewayDomain>(
	{
		server: {
			required: true,
			type: String
		},
		value: {
			required: true,
			type: String,
			unique: true
		},
		enabled: {
			default: true,
			type: Boolean
		},
		comment: {
			default: '',
			type: String
		}
	},
	{ timestamps: true }
);

export const Domains = model<GatewayDomain>('domain', schema);
