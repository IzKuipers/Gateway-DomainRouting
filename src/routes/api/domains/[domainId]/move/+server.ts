import { DomainHandler } from '$lib/server/db/handlers/domain';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params: { domainId } }) => {
	const user = await AssumeAuthorization(request);
	const { newServerId } = await request.json();
	const result = await DomainHandler.moveDomain(user._id.toString(), domainId, newServerId);

	if (!result.success) throw error(400, result.errorMessage ?? 'Unknown error while moving domain');

	return json(result.result!);
};
