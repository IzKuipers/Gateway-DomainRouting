<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import SideBar from './SideBar.svelte';
	import TopBar from './TopBar.svelte';
	import { DataCache } from '$lib/client/api/cache';
	import BlockingLoader from './BlockingLoader.svelte';

	const { children }: { children: Snippet } = $props();
	const { loading } = DataCache;

	onMount(async () => {
		await DataCache.refreshAll();
	});
</script>

<TopBar />
{#if !$loading}
	<div class="page">
		<SideBar />
		<div class="content">
			{@render children()}
		</div>
	</div>
{:else}
	<BlockingLoader visible />
{/if}
