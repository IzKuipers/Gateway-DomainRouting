import { ConnectDatabase } from '$lib/server/db/connect';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	await ConnectDatabase();
};
