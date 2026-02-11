<script lang="ts">
	import type { ClientTypes } from '$lib/types/client';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { DataCache } from '$lib/client/api/cache';
	import { Backend } from '$lib/client/api';

	let { data }: PageProps = $props();
	// svelte-ignore state_referenced_locally
	const { serverId } = data;

	let serverInfo = $state<ClientTypes.Response.Server>();
	let domains = $state<ClientTypes.Response.Domain[]>([]);

	onMount(async () => {
		serverInfo = DataCache.ServerList().find((s) => s._id === serverId);
		domains = DataCache.DomainList().filter((d) => d.server === serverId);
	});

	async function toggleServer() {
		if (!serverInfo) return;

		if (serverInfo.enabled) await Backend.updateServer(serverId, { enabled: false });
		else await Backend.updateServer(serverId, { enabled: true });

		location.reload();
	}
</script>

{#if serverInfo}
	<div class="server-header">
		<div class="info">
			<h1>
				<span class="display-name">{serverInfo.displayName}</span>
				<span class="display-name">{serverInfo.serverName}</span>
			</h1>
			<p class="ip">{serverInfo.address}:{serverInfo.port}</p>
		</div>
		<div class="actions">
			<button class="add-domain">Add domain</button>
			<button class:enable={!serverInfo.enabled} class:disabled={serverInfo.enabled} onclick={toggleServer}
				>{serverInfo.enabled ? 'Disable' : 'Enable'}</button
			>
			<button class="delete">Delete</button>
			<button class="edit">Edit...</button>
		</div>
	</div>
{:else}
	not found
{/if}
