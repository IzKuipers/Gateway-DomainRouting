import { CommandResult } from '$lib/result';
import { verify } from 'argon2';
import { randomUUID } from 'crypto';
import type { DeleteResult } from 'mongoose';
import { Tokens, type GatewayToken } from '../../models/token';
import { Users, type GatewayUser } from '../../models/user';
import { DatabaseHandler } from '../handler';
import { AuditLogHandler } from './auditlog';
import { UserHandler } from './user';

export class TokenHandler extends DatabaseHandler<GatewayToken>() {
	static db = Tokens;

	static async createToken(userId: string): Promise<CommandResult<GatewayToken>> {
		this.LogInfo(`createToken: ${userId}`);

		const user = await UserHandler.getOneById(userId);
		if (!user?.enabled) return CommandResult.Error(`User not found`, 403);

		return CommandResult.Ok<GatewayToken>(
			(
				await this.db.create({
					userId,
					value: randomUUID()
				})
			).toJSON()
		);
	}

	static async createTokenWithCredentials(username: string, password: string): Promise<CommandResult<GatewayToken>> {
		const user = await UserHandler.getOneByUsername(username);
		if (!user?.enabled) return CommandResult.Error(`User not found`, 403);

		const passwordValid = await verify(user.passwordHash, password);
		if (!passwordValid) return CommandResult.Error(`The password is incorrect`, 403);

		return await this.createToken(user._id.toString());
	}

	static async getUserByToken(value: string): Promise<CommandResult<GatewayUser>> {
		this.LogVerbose(`getUserByToken: ${value}`);

		const token = await this.db.findOne({ value });
		if (!token) return CommandResult.Error(`Invalid token`, 403);

		const user = await Users.findOne({ _id: token.userId });
		if (!user?.enabled) return CommandResult.Error(`User associated with token not found`, 403);

		await this.db.updateOne({ _id: token._id.toString() }, { createdAt: Date.now() }); // Refresh the token

		return CommandResult.Ok<GatewayUser>(user);
	}

	static async deleteAllTokens(auditor: string) {
		this.LogWarning(`deleteAllTokens`);

		await AuditLogHandler.Audit(auditor, 'Deleted all tokens');

		return await this.db.deleteMany({});
	}

	static async deleteUserTokens(auditor: string, userId: string) {
		this.LogWarning(`deleteUserTokens: ${userId}`);

		await AuditLogHandler.Audit(auditor, `Deleted tokens of ${userId}`);

		return await this.db.deleteMany({ userId });
	}

	static async deleteTokenByValue(value: string) {
		const token = await this.db.findOne({ value });
		if (!token) return CommandResult.Error('Invalid token', 404);

		return CommandResult.Ok<DeleteResult>(await this.db.deleteOne({ value }));
	}
}
