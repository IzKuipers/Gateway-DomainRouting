<script lang="ts">
	import { Backend } from '$lib/client/api';
	import { Authorization } from '$lib/client/auth';
	import { Spinner } from '$lib/client/images';
	import { onMount } from 'svelte';
	import '../css/main.css';
	import DialogRenderer from './DialogRenderer.svelte';
	import Login from './Login.svelte';
	import SideBar from './SideBar.svelte';
	import TopBar from './TopBar.svelte';
	import Authenticated from './Authenticated.svelte';
	import BlockingLoader from './BlockingLoader.svelte';

	let { children } = $props();
	const { authenticated, loading } = Authorization;

	onMount(async () => {
		await Backend.ping();
		await Authorization.loadToken();
		$loading = false;
	});
</script>

{#if $loading}
	<BlockingLoader fixed visible />
{:else if $authenticated}
	<Authenticated>
		{@render children()}
	</Authenticated>
{:else}
	<Login />
{/if}

<DialogRenderer />
