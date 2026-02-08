import { CommandResult } from '$lib/result';
import { randomUUID } from 'crypto';
import { Tokens } from '../models/token';
import { type GatewayUser, Users } from '../models/user';
import { Audit } from './auditlog';

export async function createToken(userId: string) {
	return await Tokens.create({
		userId,
		value: randomUUID()
	});
}

export async function getUserByToken(value: string) {
	const token = await Tokens.findOne({ value });
	if (!token) return CommandResult.Error(`Invalid token`);

	const user = await Users.findOne({ _id: token.userId });
	if (!user) return CommandResult.Error(`User associated with token not found`);

	return CommandResult.Ok<GatewayUser>(user);
}

export async function deleteAllTokens(auditor: string) {
	await Audit(auditor, 'Deleted all tokens');

	return await Tokens.deleteMany({});
}

export async function deleteUserTokens(auditor: string, userId: string) {
	await Audit(auditor, `Deleted tokens of ${userId}`);

	return await Tokens.deleteMany({ userId });
}
