import { ServerHandler } from '$lib/server/db/handlers/server';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, params: { serverId } }) => {
	const user = await AssumeAuthorization(request);
	const deleteResult = await ServerHandler.deleteServerById(user._id.toString(), serverId);

	if (!deleteResult.success) throw error(400, deleteResult.errorMessage ?? 'Unknown error while deleting server');

	return new Response();
};
