import { Document, model, Schema } from 'mongoose';

export interface GatewayToken extends Document {
	userId: string;
	value: string;
	createdAt: Date;
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
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: 3600 * 24 // records expire after 24 hours (3600*24 seconds)
		}
	},
	{ timestamps: true }
);

export const Tokens = model<GatewayToken>('token', schema);
