import { DomainHandler } from '$lib/server/db/handlers/domain';
import { AssumeAuthorization } from '$lib/server/helpers';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, params: { serverId } }) => {
	await AssumeAuthorization(request);
	const domains = await DomainHandler.getDomainsOfServer(serverId);
    
	return json(domains);
};
