import { Generator } from '$lib/server/generator';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const user = await AssumeAuthorization(request);
	const updateResult = await Generator.updateNGiNX(user._id.toString());

	if (!updateResult.success) throw error(400, updateResult.errorMessage ?? 'Unknown error while updating NGiNX configuration');

	return text(updateResult.result!);
};
