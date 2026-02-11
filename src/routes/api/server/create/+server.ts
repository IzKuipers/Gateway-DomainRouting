import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServerHandler } from '$lib/server/db/handlers/server';

export const POST: RequestHandler = async ({ request }) => {
	const user = await AssumeAuthorization(request);
	const { displayName, serverName, address, port } = await request.json();
	if (!displayName || !serverName || !address || !port) throw error(400, 'Missing parameters');

	const createResult = await ServerHandler.createServer(user._id.toString(), displayName, serverName, address, +`${port}`);
	if (!createResult.success) throw error(createResult.statusCode ?? 500, createResult.errorMessage ?? 'Unknown result while creating server');

	return json(createResult.result!);
};
