<script>
	import { onMount } from 'svelte';
	onMount(() => {
		import('./main');
	});
</script>

<div class="container">
	<h1>WASM 图像压缩</h1>

	<div class="upload-area" id="drop-zone">
		<span>拖放图像文件或点击选择</span>
		<input type="file" id="file-input" accept="image/*" />
	</div>

	<div class="controls">
		<label>
			压缩质量: <span id="quality-value">85</span>%
			<input type="range" id="quality" min="1" max="100" value="85" />
		</label>

		<label>
			最大尺寸: <span id="dimension-value">1200</span>px
			<input type="range" id="max-dimension" min="100" max="4000" value="1200" />
		</label>

		<button id="compress-btn" disabled>压缩图像</button>
	</div>

	<div class="result-container">
		<div class="result original">
			<h2>原始图像</h2>
			<img
				id="original-img"
				src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
				alt="原始图像预览"
			/>
			<div class="image-info" id="original-info"></div>
		</div>

		<div class="result compressed">
			<h2>压缩结果</h2>
			<img
				id="compressed-img"
				src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
				alt="压缩图像预览"
			/>
			<div class="image-info" id="compressed-info"></div>
		</div>
	</div>
</div>

<style>
	@import './style.css';
</style>
