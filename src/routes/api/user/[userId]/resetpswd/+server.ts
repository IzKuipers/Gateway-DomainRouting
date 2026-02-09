import { UserHandler } from '$lib/server/db/handlers/user';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params: { userId } }) => {
	const user = await AssumeAuthorization(request);
	const { newPassword } = await request.json();
	if (!newPassword) throw error(400, 'Missing new password');

	const resetResult = await UserHandler.resetUserPassword(user._id.toString(), userId, newPassword);
	if (!resetResult.success) throw error(400, resetResult.errorMessage ?? "Unknown error while resetting user's password");

	return json(resetResult.result!);
};
