import { AssumeAuthorization } from '$lib/server/helpers';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const user = await AssumeAuthorization(request);

	return json({
		username: user.username,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		enabled: user.enabled
	});
};
