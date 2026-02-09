import { error } from '@sveltejs/kit';
import { TokenHandler } from './db/handlers/token';
import type { GatewayUser } from './models/user';

export async function AssumeAuthorization(request: Request): Promise<GatewayUser> {
	const authorization = request.headers.get('Authorization');
	if (!authorization?.startsWith('Bearer ')) throw error(401, 'Unauthorized');

	const token = authorization.replace('Bearer', '').trim();
	const userResult = await TokenHandler.getUserByToken(token);

	if (!userResult?.success) throw error(403, userResult.errorMessage ?? 'Unknown error');

	return userResult.result!;
}

export async function AssumeAuthorization_ReturnsToken(request: Request): Promise<string> {
	const authorization = request.headers.get('Authorization');
	if (!authorization?.startsWith('Bearer ')) throw error(401, 'Unauthorized');

	const token = authorization.replace('Bearer', '').trim();
	const userResult = await TokenHandler.getUserByToken(token);

	if (!userResult?.success) throw error(403, userResult.errorMessage ?? 'Unknown error');

	return token;
}
