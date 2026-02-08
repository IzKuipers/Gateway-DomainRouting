import { CommandResult } from '$lib/result';
import argon2 from 'argon2';
import { type GatewayUser, Users } from '../models/user';
import { deleteUserTokens } from './token';
import { Audit } from './auditlog';

export async function getAllUsers() {
	return await Users.find({}, { passwordHash: 0 });
}

export async function createUser(username: string, password: string) {
	try {
		const result = await Users.create({
			username,
			passwordHash: await hashPassword(password)
		});

		return CommandResult.Ok<GatewayUser>(result);
	} catch (e) {
		return CommandResult.Error(`Failed to create user account: ${e}`);
	}
}

export async function deleteUser(auditor: string, userId: string) {
	await Audit(auditor, `Deleted user ${userId}`);
	await deleteUserTokens(auditor, userId);
    
	return await Users.deleteOne({ _id: userId });
}

export async function resetUserPassword(auditor: string, userId: string, newPassword: string) {
	await Audit(auditor, `Reset password of user ${userId}`);

	return await Users.updateOne({ _id: userId }, { passwordHash: await hashPassword(newPassword) });
}

export async function hashPassword(password: string) {
	return await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 2 ** 16,
		timeCost: 2,
		hashLength: 16
	});
}

export function normalizeUsername(username: string) {
	return username.toLowerCase().trim();
}
