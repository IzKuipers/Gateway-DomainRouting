import { DomainHandler } from '$lib/server/db/handlers/domain';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const user = await AssumeAuthorization(request);
	const { serverId, value, comment } = await request.json();
	if (!serverId || !value) throw error(400, 'Missing serverId or value');

	const createResult = await DomainHandler.createDomain(user._id.toString(), serverId, value, comment ?? '');
	if (!createResult.success) throw error(400, createResult.errorMessage ?? 'Unknown error while creating domain');

	return json(createResult.result?.toJSON()!);
};
