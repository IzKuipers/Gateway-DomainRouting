<script>
	import { Logo } from '$lib/client/images';
</script>

<div class="topbar">
	<div class="header">
		<img src={Logo} alt="" />
		<h1 class="branding">
			<span class="gateway">Gateway</span>
			<span class="routing">Domain Routing</span>
		</h1>
	</div>
	<div class="actions">
		<button class="add-server">Add server</button>
		<button class="add-server">View generated</button>
		<!-- <button class="add-server">Refresh</button> -->
	</div>
	<button class="deploy">Deploy NGiNX</button>
</div>
