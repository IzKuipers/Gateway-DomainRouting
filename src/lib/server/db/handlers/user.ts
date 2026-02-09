import { CommandResult } from '$lib/result';
import argon2 from 'argon2';
import type { DeleteResult, UpdateWriteOpResult } from 'mongoose';
import { type GatewayUser, Users } from '../../models/user';
import { DatabaseHandler } from '../handler';
import { AuditLogHandler } from './auditlog';
import { TokenHandler } from './token';

export class UserHandler extends DatabaseHandler<GatewayUser>() {
	static db = Users;

	static async getOneByUsername(username: string) {
		return await this.db.findOne({ username: this.normalizeUsername(username) });
	}

	static async createUser(username: string, password: string): Promise<CommandResult<GatewayUser>> {
		this.LogInfo(`createUser: ${username}`);

		const enabledUsersCount = await this.db.countDocuments({ enabled: true });

		try {
			const result = await this.db.create({
				username: this.normalizeUsername(username),
				passwordHash: await this.hashPassword(password),
				enabled: enabledUsersCount === 0
			});

			return CommandResult.Ok<GatewayUser>(result);
		} catch (e) {
			return CommandResult.Error(`Failed to create user account: ${e}`);
		}
	}

	static async deleteUser(auditor: string, userId: string) {
		this.LogWarning(`deleteUser: ${userId}`);

		const user = await this.getOneById(userId);
		if (!user) return CommandResult.Error('User not found');

		await AuditLogHandler.Audit(auditor, `Deleted user ${userId}`);
		await TokenHandler.deleteUserTokens(auditor, userId);

		return CommandResult.Ok<DeleteResult>(await this.db.deleteOne({ _id: userId }));
	}

	static async resetUserPassword(auditor: string, userId: string, newPassword: string) {
		this.LogWarning(`resetUserPassword: ${userId}`);

		const user = await this.getOneById(userId);
		if (!user) return CommandResult.Error('User not found');

		await AuditLogHandler.Audit(auditor, `Reset password of user ${userId}`);

		return CommandResult.Ok<UpdateWriteOpResult>(await this.db.updateOne({ _id: userId }, { passwordHash: await this.hashPassword(newPassword) }));
	}

	static async enableUser(auditor: string, userId: string): Promise<CommandResult<UpdateWriteOpResult>> {
		const existing = await this.db.findOne({ _id: userId });
		const user = await this.getOneById(userId);

		if (!user) return CommandResult.Error('User not found');
		if (auditor == userId) return CommandResult.Error('Enablement on yourself is illegal.');
		if (!existing || existing.enabled) return CommandResult.Error("Can't enable a user that is already enabled");

		const result = await this.db.updateOne({ _id: userId }, { enabled: true });

		await AuditLogHandler.Audit(auditor, 'Enabled a user', { extraData: { userId } });

		return CommandResult.Ok<UpdateWriteOpResult>(result);
	}

	static async disableUser(auditor: string, userId: string): Promise<CommandResult<UpdateWriteOpResult>> {
		const existing = await this.db.findOne({ _id: userId });

		const user = await this.getOneById(userId);
		if (!user) return CommandResult.Error('User not found');
		if (auditor == userId) return CommandResult.Error('Enablement on yourself is illegal.');
		if (!existing || !existing.enabled) return CommandResult.Error("Can't disable a user that is already disabled");

		const result = await this.db.updateOne({ _id: userId }, { enabled: false });

		await AuditLogHandler.Audit(auditor, 'Disabled a user', { extraData: { userId } });

		return CommandResult.Ok<UpdateWriteOpResult>(result);
	}

	static async hashPassword(password: string) {
		this.LogVerbose(`hashPassword`);

		return await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16,
			timeCost: 2,
			hashLength: 16
		});
	}

	static normalizeUsername(username: string) {
		this.LogVerbose(`normalizeUsername`);

		return username.toLowerCase().trim();
	}
}
