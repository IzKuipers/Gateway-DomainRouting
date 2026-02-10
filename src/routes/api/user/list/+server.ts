import { UserHandler } from '$lib/server/db/handlers/user';
import { AssumeAuthorization } from '$lib/server/helpers';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	await AssumeAuthorization(request);
	const users = await UserHandler.getAllSerializable({ passwordHash: 0, __v: 0 });

	return json(users);
};
