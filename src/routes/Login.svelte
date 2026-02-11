<script lang="ts">
	import { Backend } from '$lib/client/api';
	import { Authorization } from '$lib/client/auth';
	import { Logo } from '$lib/client/images';
	import BlockingLoader from './BlockingLoader.svelte';

	const { version } = Backend;
	let username = $state<string>();
	let password = $state<string>();
	let visible = $state<boolean>(false);
	let loading = $state<boolean>(false);

	async function login() {
		if (!username || !password) return;

		loading = true;
		const result = await Authorization.authenticateWithCredentials(username, password);

		if (!result.success) alert(result.errorMessage ?? 'unknown error');
		loading = false;
	}

	setTimeout(() => {
		visible = true;
	}, 100);
</script>

<div class="login-wrapper" class:visible>
	<img src={Logo} alt="" />
	<div class="login">
		<h1>
			<span class="gateway">Gateway</span>
			<span class="routing">Domain Routing</span>
		</h1>
		<input type="text" placeholder="Username" bind:value={username} />
		<input type="password" placeholder="Password" bind:value={password} />
		<button class="login" onclick={login} disabled={!username || !password}>Login</button>
		<button class="register" disabled>Register</button>
		<BlockingLoader visible={loading} />
	</div>
	<div class="version">v{$version} &mdash; © IzKuipers</div>
</div>
