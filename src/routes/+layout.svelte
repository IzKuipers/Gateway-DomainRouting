<script lang="ts">
	import { Backend } from '$lib/client/api';
	import { Authorization } from '$lib/client/auth';
	import { Logo } from '$lib/client/images';
	import { onMount } from 'svelte';
	import '../css/main.css';
	import Login from './Login.svelte';

	let { children } = $props();
	const { authenticated } = Authorization;
	const { version } = Backend;

	let loading = $state<boolean>(true);

	onMount(async () => {
		await Backend.ping();
		await Authorization.loadToken();
		loading = false;
	});
</script>

{#if loading}
	<div class="loading-screen">
		<img src={Logo} alt="" />
		<p class="version">{$version}</p>
	</div>
{:else if $authenticated}
	{@render children()}
{:else}
	<Login />
{/if}
