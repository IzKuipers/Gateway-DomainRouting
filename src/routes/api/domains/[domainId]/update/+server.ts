import { DomainHandler } from '$lib/server/db/handlers/domain';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { GatewayDomain } from '$lib/server/models/domain';

export const PATCH: RequestHandler = async ({ request, params: { domainId } }) => {
	const user = await AssumeAuthorization(request);
	const { value, enabled, comment } = await request.json();
	const update: Partial<GatewayDomain> = {};

	if (value != undefined && typeof value === 'string') update.value = value;
	if (enabled != undefined && typeof enabled === 'boolean') update.enabled = enabled;
	if (comment != undefined && typeof comment === 'string') update.comment = comment;

	const result = await DomainHandler.updateDomain(user._id.toString(), domainId, update);
	if (!result.success) throw error(result.statusCode ?? 404, result.errorMessage ?? 'Unknown error while updating domain');

	return json(result.result!);
};
