import { DomainHandler } from '$lib/server/db/handlers/domain';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, params: { domainId } }) => {
	const user = await AssumeAuthorization(request);
	const deleteResult = await DomainHandler.deleteDomain(user._id.toString(), domainId);

	if (!deleteResult.success) throw error(400, deleteResult.errorMessage ?? 'Unknown error while deleting domain');

	return json(deleteResult.result!);
};
