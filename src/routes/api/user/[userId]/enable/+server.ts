import { UserHandler } from '$lib/server/db/handlers/user';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params: { userId } }) => {
	const user = await AssumeAuthorization(request);
	const enableResult = await UserHandler.enableUser(user._id.toString(), userId);

	if (!enableResult.success) throw error(400, enableResult.errorMessage ?? 'Unknown error while enabling user');

	return new Response();
};
