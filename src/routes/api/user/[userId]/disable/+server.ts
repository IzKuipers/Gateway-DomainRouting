import { UserHandler } from '$lib/server/db/handlers/user';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params: { userId } }) => {
	const user = await AssumeAuthorization(request);
	const disableResult = await UserHandler.disableUser(user._id.toString(), userId);

	if (!disableResult.success) throw error(400, disableResult.errorMessage ?? 'Unknown error while disabling user');

	return json(disableResult.result!);
};
