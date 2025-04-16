<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<nav>
	<a href="{base}/">home</a>
	<a href="{base}/about">about</a>
</nav>

{@render children()}
