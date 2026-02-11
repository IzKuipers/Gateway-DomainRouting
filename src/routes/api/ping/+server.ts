import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import packageJson from '../../../../package.json';

export const GET: RequestHandler = async () => {
	return json({
		ping: 'Pong!',
		version: packageJson.version
	});
};
