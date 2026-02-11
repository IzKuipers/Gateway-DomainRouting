<script>
	import { Authorization } from '$lib/client/auth';
</script>

{JSON.stringify(Authorization.userInfo(), null, 2)}
<button onclick={() => Authorization.logout()}>Logout</button>
