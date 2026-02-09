import { TokenHandler } from '$lib/server/db/handlers/token';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { username, password } = await request.json();
	if (!username || !password) throw error(400, 'Missing username or password');

	const tokenResult = await TokenHandler.createTokenWithCredentials(username, password);
	if (!tokenResult.success) throw error(403, tokenResult.errorMessage ?? 'Unknown error');

	return json(tokenResult.result!);
};
