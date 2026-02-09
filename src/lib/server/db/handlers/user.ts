import { CommandResult } from '$lib/result';
import argon2 from 'argon2';
import { type GatewayUser, Users } from '../../models/user';
import { DatabaseHandler } from '../handler';
import { AuditLogHandler } from './auditlog';
import { TokenHandler } from './token';

export class UserHandler extends DatabaseHandler<GatewayUser>() {
	static db = Users;

	static async createUser(username: string, password: string) {
		try {
			const result = await this.db.create({
				username,
				passwordHash: await this.hashPassword(password)
			});

			return CommandResult.Ok<GatewayUser>(result);
		} catch (e) {
			return CommandResult.Error(`Failed to create user account: ${e}`);
		}
	}

	static async deleteUser(auditor: string, userId: string) {
		await AuditLogHandler.Audit(auditor, `Deleted user ${userId}`);
		await TokenHandler.deleteUserTokens(auditor, userId);

		return await this.db.deleteOne({ _id: userId });
	}

	static async resetUserPassword(auditor: string, userId: string, newPassword: string) {
		await AuditLogHandler.Audit(auditor, `Reset password of user ${userId}`);

		return await this.db.updateOne({ _id: userId }, { passwordHash: await this.hashPassword(newPassword) });
	}

	static async hashPassword(password: string) {
		return await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16,
			timeCost: 2,
			hashLength: 16
		});
	}

	static normalizeUsername(username: string) {
		return username.toLowerCase().trim();
	}
}
