import { Generator } from '$lib/server/generator';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	await AssumeAuthorization(request);
	const generateResult = await Generator.generateConfiguration();

	if (!generateResult.success) throw error(400, generateResult.errorMessage ?? 'Unknown error while generating NGiNX configuration');

	return text(generateResult.result!);
};
