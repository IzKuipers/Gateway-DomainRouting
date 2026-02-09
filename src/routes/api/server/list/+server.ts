import { ServerHandler } from '$lib/server/db/handlers/server';
import { AssumeAuthorization } from '$lib/server/helpers';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	await AssumeAuthorization(request);
	const servers = await ServerHandler.getAllSerializable();

	return json(servers);
};
