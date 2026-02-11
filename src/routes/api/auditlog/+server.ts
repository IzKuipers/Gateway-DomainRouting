import { AuditLogHandler } from '$lib/server/db/handlers/auditlog';
import { AssumeAuthorization } from '$lib/server/helpers';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	await AssumeAuthorization(request);
	const logResult = await AuditLogHandler.getAuditLog();

	if (!logResult.success) throw error(logResult.statusCode ?? 500, logResult.errorMessage ?? 'Unknown error obtaining audit log');

	return json(logResult.result);
};
