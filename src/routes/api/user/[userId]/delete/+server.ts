import { UserHandler } from '$lib/server/db/handlers/user';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, params: { userId } }) => {
	const user = await AssumeAuthorization(request);
	const deleteResult = await UserHandler.deleteUser(user._id.toString(), userId);
	if (!deleteResult.success) throw error(deleteResult.statusCode ?? 500, deleteResult.errorMessage ?? 'Unknown error while deleting user');

	return json(deleteResult.result!);
};
