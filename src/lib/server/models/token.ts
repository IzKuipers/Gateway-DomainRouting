import { Document, model, Schema } from 'mongoose';

export interface GatewayToken extends Document {
	userId: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}

const schema = new Schema<GatewayToken>(
	{
		userId: {
			required: true,
			type: String
		},
		value: {
			required: true,
			type: String,
			unique: true
		}
	},
	{ timestamps: true }
);

export const Tokens = model<GatewayToken>('token', schema);
