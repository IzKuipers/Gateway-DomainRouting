import { Document, model, Schema } from 'mongoose';

export interface GatewayUser extends Document {
	username: string;
	passwordHash: string;
	createdAt: string;
	updatedAt: string;
	enabled: boolean;
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
		},
		enabled: {
			type: Boolean,
			required: false
		}
	},
	{ timestamps: true }
);

export const Users = model<GatewayUser>('user', schema);
