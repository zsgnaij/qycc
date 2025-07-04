<script>
	import { onMount } from 'svelte';

	// 响应式变量
	let wasmModule = null;
	let originalImgSrc =
		'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	let compressedImgSrc =
		'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	let originalInfo = '';
	let compressedInfo = '';
	let quality = 85;
	let maxDimension = 1200;
	let file = null;
	let isLoading = false;
	let errorMessage = '';
	let downloadUrl = ''; // 用于下载的临时URL
	let downloadFileName = 'compressed-image.jpg'; // 固定的下载文件名

	// 初始化WASM模块
	const initWasm = async () => {
		try {
			const module = await import('./image_compressor_wasm.js');
			module.default();
			wasmModule = module;
			console.log('WASM模块加载成功');
		} catch (error) {
			console.error('WASM模块加载失败:', error);
			showError('无法加载图像压缩引擎');
		}
	};

	// 文件选择处理
	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			file = e.target.files[0];
			handleImageFile(file);
		}
	};

	// 文件拖放处理
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			file = e.dataTransfer.files[0];
			handleImageFile(file);
			revokeDownloadUrl();
		}
	};

	// 处理图像文件
	const handleImageFile = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			originalImgSrc = e.target.result;

			// 创建临时图像获取尺寸信息
			const img = new Image();
			img.onload = () => {
				originalInfo = `尺寸: ${img.naturalWidth}×${img.naturalHeight}, 大小: ${formatFileSize(file.size)}`;
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	};

	// 格式化文件大小显示
	const formatFileSize = (bytes) => {
		if (bytes < 1024) return `${bytes} bytes`;
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / 1048576).toFixed(1)} MB`;
	};

	// 主压缩函数
	const compressImage = async () => {
		if (!wasmModule || !file) {
			showError(file ? 'WASM模块未加载' : '请先选择图像文件');
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// 读取文件为base64
			const base64 = await readAsDataURL(file);

			// 调用WASM压缩函数
			const result = wasmModule.compress_base64(base64, quality, maxDimension);

			// 处理结果
			if (result.size_after > 0) {
				compressedImgSrc = result.base64;
				const compressionRatio = result.compression_ratio.toFixed(1);
				compressedInfo = `尺寸: ${result.width}×${result.height}, 大小: ${formatFileSize(result.size_after)}, 压缩比: ${compressionRatio}%`;
				prepareDownload(result.base64);
			} else {
				showError('压缩失败，请尝试其他参数');
			}
		} catch (error) {
			console.error('压缩错误:', error);
			showError(`处理失败: ${error.message}`);
		} finally {
			isLoading = false;
		}
	};

	// 读取文件为base64
	const readAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	// 显示错误
	const showError = (message) => {
		errorMessage = message;
		// 3秒后清除错误信息
		setTimeout(() => (errorMessage = ''), 3000);
	};

	// 当滑块值改变时更新显示
	$: qualityValue = quality;
	$: dimensionValue = maxDimension;

	// 准备下载链接
	const prepareDownload = (base64Data) => {
		try {
			// 1. 提取MIME类型和纯Base64数据
			const parts = base64Data.match(/^data:(image\/\w+);base64,(.*)$/);
			if (!parts || parts.length !== 3) return;

			const mimeType = parts[1];
			const imageData = parts[2];

			// 2. 转换Base64为Blob
			const byteCharacters = atob(imageData);
			const byteArrays = [];

			for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
				const slice = byteCharacters.slice(offset, offset + 1024);
				const byteNumbers = new Array(slice.length);

				for (let i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				byteArrays.push(new Uint8Array(byteNumbers));
			}

			// 3. 创建Blob对象
			const blob = new Blob(byteArrays, { type: mimeType });

			// 4. 创建临时URL用于下载
			downloadUrl = URL.createObjectURL(blob);
		} catch (error) {
			console.error('创建下载链接失败:', error);
			showError('无法创建下载链接');
		}
	};

	// 清理临时URL避免内存泄漏
	const revokeDownloadUrl = () => {
		if (downloadUrl) {
			URL.revokeObjectURL(downloadUrl);
			downloadUrl = '';
		}
	};

	// 初始化WASM
	onMount(initWasm);
</script>

<div class="container">
	<h1>WASM 图像压缩</h1>

	<!-- 错误消息 -->
	{#if errorMessage}
		<div class="error-message">{errorMessage}</div>
	{/if}

	<!-- 拖放区域 -->
	<div class="upload-area" on:dragover={handleDragOver} on:drop={handleDrop}>
		<span>拖放图像文件或点击选择</span>
		<input type="file" on:change={handleFileSelect} accept="image/*" />
	</div>

	<!-- 控制区域 -->
	<div class="controls">
		<label>
			压缩质量: {quality}%
			<input type="range" bind:value={quality} min="1" max="100" />
		</label>

		<label>
			最大尺寸: {maxDimension}px
			<input type="range" bind:value={maxDimension} min="100" max="4000" />
		</label>

		<button on:click={compressImage} disabled={isLoading || !wasmModule}>
			{isLoading ? '处理中...' : '压缩图像'}
		</button>
	</div>

	<!-- 加载状态 -->
	{#if isLoading}
		<div id="loading-overlay">
			<div class="loader"></div>
		</div>
	{/if}

	<!-- 结果区域 -->
	<div class="result-container">
		<div class="result original">
			<h2>原始图像</h2>
			<img src={originalImgSrc} alt="原始图像预览" />
			<div class="image-info">{originalInfo}</div>
		</div>

		<div class="result compressed">
			<h2>压缩结果</h2>
			<img src={compressedImgSrc} alt="压缩图像预览" />
			<div class="image-info">
				{compressedInfo}
				{#if compressedInfo}
					<a class="download" href={downloadUrl} download={downloadFileName}> 下载 </a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin: 0;
		padding: 0;
		background-color: #f5f7fa;
		color: #333;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	h1 {
		text-align: center;
		color: #2c3e50;
		margin-bottom: 30px;
	}

	.error-message {
		background-color: #ffebee;
		color: #d32f2f;
		padding: 10px 15px;
		border-radius: 4px;
		margin-bottom: 20px;
		text-align: center;
		transition: opacity 0.3s;
	}

	.upload-area {
		border: 2px dashed #3498db;
		border-radius: 8px;
		padding: 40px 20px;
		text-align: center;
		background-color: #f8f9fa;
		cursor: pointer;
		transition: all 0.3s;
		position: relative;
	}

	.upload-area:hover {
		background-color: #e3f2fd;
		border-color: #2980b9;
	}

	.upload-area input[type='file'] {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: 0;
		cursor: pointer;
	}

	.upload-area span {
		color: #3498db;
		font-size: 1.2em;
		font-weight: 500;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin: 30px 0;
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.controls label {
		flex: 1;
		min-width: 200px;
	}

	.controls input[type='range'] {
		width: 100%;
		margin-top: 8px;
	}

	.controls button {
		background-color: #3498db;
		color: white;
		border: none;
		padding: 12px 20px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1em;
		transition: background-color 0.3s;
		min-width: 150px;
	}

	.controls button:hover {
		background-color: #2980b9;
	}

	.controls button:disabled {
		background-color: #bdc3c7;
		cursor: not-allowed;
	}

	.result-container {
		display: flex;
		gap: 30px;
		margin-top: 20px;
		flex-wrap: wrap;
	}

	.result {
		flex: 1;
		min-width: 300px;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.result h2 {
		background-color: #3498db;
		color: white;
		margin: 0;
		padding: 15px;
		font-size: 1.2em;
	}

	.result img {
		width: 100%;
		height: auto;
		max-height: 400px;
		object-fit: contain;
		padding: 10px;
		display: block;
	}

	.image-info {
		padding: 15px;
		text-align: center;
		font-size: 0.9em;
		color: #555;
		border-top: 1px solid #eee;
		background-color: #f9f9f9;
	}

	#loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.loader {
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
	}

	.download {
		cursor: pointer;
		color: blue;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
