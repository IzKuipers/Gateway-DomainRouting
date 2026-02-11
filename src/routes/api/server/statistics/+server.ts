import { ServerHandler } from '$lib/server/db/handlers/server';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	await AssumeAuthorization(request);

	const statisticsResult = await ServerHandler.getStatistics();
	if (!statisticsResult.success)
		throw error(statisticsResult.statusCode ?? 500, statisticsResult.errorMessage ?? 'Unknown error while obtaining server statistics');

	return json(statisticsResult.result);
};
