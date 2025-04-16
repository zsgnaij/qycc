<script lang="ts">
	import '../app.css';

	export const ssr = false;
	let { children } = $props();
</script>
<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>

{@render children()}
