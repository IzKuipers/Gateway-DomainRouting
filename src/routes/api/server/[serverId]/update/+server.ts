import { ServerHandler } from '$lib/server/db/handlers/server';
import { AssumeAuthorization } from '$lib/server/helpers';
import type { GatewayServer } from '$lib/server/models/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params: { serverId } }) => {
	const user = await AssumeAuthorization(request);
	const { displayName, serverName, address, port, enabled } = await request.json();
	const update: Partial<GatewayServer> = {};

	if (displayName != undefined && typeof displayName === 'string') update.displayName = displayName;
	if (serverName != undefined && typeof serverName === 'string') update.serverName = serverName;
	if (address != undefined && typeof address === 'string') update.address = address;
	if (port != undefined && typeof port === 'number' && !Number.isNaN(port)) update.port = port;
	if (enabled != undefined && typeof enabled === 'boolean') update.enabled = enabled;

	const updateResult = await ServerHandler.updateServer(user._id.toString(), serverId, update);
	if (!updateResult.success) throw error(updateResult.statusCode ?? 400, updateResult.errorMessage ?? 'Unknown error while updating server');

	return json(updateResult.result!);
};
