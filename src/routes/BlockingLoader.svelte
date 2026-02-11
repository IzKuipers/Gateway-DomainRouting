<script lang="ts">
	import { Spinner } from '$lib/client/images';

	const { visible = false, fixed = false, className = '' }: { visible?: boolean; fixed?: boolean; className?: string } = $props();
</script>

<div class="blocking-loader {className}" class:visible class:fixed>
	<img src={Spinner} alt="" />
</div>
