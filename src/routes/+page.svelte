<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// 页面加载后立即跳转到compressor页面
	onMount(() => {
		goto('/qycc/compressor');
	});
</script>

<h1>Redirecting to compressor...</h1>

<style>
	h1 {
		text-align: center;
		margin-top: 2rem;
		color: #333;
	}
</style>