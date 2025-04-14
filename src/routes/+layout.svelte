<script lang="ts">
	import '../app.css';

	export const prerender = true;
	let { children } = $props();
</script>
<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>

{@render children()}
