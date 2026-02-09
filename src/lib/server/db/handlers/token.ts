import { CommandResult } from '$lib/result';
import { randomUUID } from 'crypto';
import { Tokens, type GatewayToken } from '../../models/token';
import { type GatewayUser, Users } from '../../models/user';
import { AuditLogHandler } from './auditlog';
import { DatabaseHandler } from '../handler';

export class TokenHandler extends DatabaseHandler<GatewayToken>() {
    static db = Tokens;

	static async createToken(userId: string) {
        this.LogInfo(`createToken: ${userId}`);

		return await this.db.create({
			userId,
			value: randomUUID()
		});
	}

	static async getUserByToken(value: string) {
        this.LogInfo(`getUserByToken: ${value}`);

		const token = await this.db.findOne({ value });
		if (!token) return CommandResult.Error(`Invalid token`);

		const user = await Users.findOne({ _id: token.userId });
		if (!user) return CommandResult.Error(`User associated with token not found`);

		return CommandResult.Ok<GatewayUser>(user);
	}

	static async deleteAllTokens(auditor: string) {
		await AuditLogHandler.Audit(auditor, 'Deleted all tokens');

		return await this.db.deleteMany({});
	}

	static async deleteUserTokens(auditor: string, userId: string) {
		await AuditLogHandler.Audit(auditor, `Deleted tokens of ${userId}`);

		return await this.db.deleteMany({ userId });
	}
}
