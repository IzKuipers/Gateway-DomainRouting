import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserHandler } from '$lib/server/db/handlers/user';

export const POST: RequestHandler = async ({ request }) => {
	const { username, password } = await request.json();
	if (!username || !password) throw error(400, 'Missing username or password');

	const createResult = await UserHandler.createUser(username, password);
	if (!createResult.success) throw error(createResult.statusCode ?? 500, createResult.errorMessage ?? 'Unknown error while creating user');

	return json({
		username: createResult.result!.username,
		enabled: createResult.result!.enabled,
		createdAt: createResult.result!.createdAt,
		updatedAt: createResult.result!.updatedAt
	});
};
