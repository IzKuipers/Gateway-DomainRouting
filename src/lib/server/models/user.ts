import { Document, model, Schema } from 'mongoose';

export interface GatewayUser extends Document {
	username: string;
	passwordHash: string;
	createdAt: string;
	updatedAt: string;
}

const schema = new Schema<GatewayUser>(
	{
		username: {
			type: String,
			unique: true,
			required: true
		},
		passwordHash: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export const Users = model<GatewayUser>('user', schema);
