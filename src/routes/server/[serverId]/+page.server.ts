import type { PageServerLoad } from './$types';

export const load = (async ({ params: { serverId } }) => {
	return { serverId };
}) satisfies PageServerLoad;
