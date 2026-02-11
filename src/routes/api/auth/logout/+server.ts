import { TokenHandler } from '$lib/server/db/handlers/token';
import { AssumeAuthorization_ReturnsToken } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const token = await AssumeAuthorization_ReturnsToken(request);
	const deleteResult = await TokenHandler.deleteTokenByValue(token);

	if (!deleteResult.success) throw error(deleteResult.statusCode ?? 500, deleteResult.errorMessage ?? 'Unknown error while deleting token');

	return json(deleteResult.result!);
};
