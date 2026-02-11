<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { DataCache } from '$lib/client/api/cache';

	const { ServerList } = DataCache;
</script>

<div class="sidebar">
	<section class="servers">
		<h1>Servers</h1>
		{#each $ServerList as server, i (server._id)}
			<button class="server" onclick={() => goto(`/server/${server._id}`)} class:selected={page.url.pathname.includes(`/server/${server._id}`)}>
				<span class="lucide icon-monitor"></span>
				<span class="display-name">{server.displayName}</span>
				<span class="server-name">{server.serverName}</span>
			</button>
		{/each}
	</section>
</div>
