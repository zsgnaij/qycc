// 初始化WASM模块
let wasmModule;
const initWasm = async () => {
    try {
        wasmModule = await import('./image_compressor_wasm.js');
        wasmModule.default();
        enableUI();
        console.log('WASM模块加载成功');
    } catch (error) {
        console.error('WASM模块加载失败:', error);
        showError('无法加载图像压缩引擎');
    }
};

// 启用UI控件
function enableUI() {
    document.getElementById('compress-btn').disabled = false;
    document.getElementById('compress-btn').textContent = '压缩图像';
}

// 禁用UI控件
function disableUI() {
    document.getElementById('compress-btn').disabled = true;
    document.getElementById('compress-btn').textContent = '处理中...';
}

// 更新尺寸范围显示
document.getElementById('max-dimension').addEventListener('input', function() {
    document.getElementById('dimension-value').textContent = this.value;
});

// 更新质量范围显示
document.getElementById('quality').addEventListener('input', function() {
    document.getElementById('quality-value').textContent = this.value;
});

// 文件选择处理
document.getElementById('file-input').addEventListener('change', handleFileSelect);
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('drop', handleDrop);

// 压缩按钮点击事件
document.getElementById('compress-btn').addEventListener('click', compressImage);

// 文件拖放处理
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
}

// 文件选择处理
function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
    }
}

// 处理图像文件
function handleImageFile(file) {
    const previewImg = document.getElementById('original-img');
    
    // 预览原始图像
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewImg.onload = function() {
            // 显示原始图像信息
            const info = `尺寸: ${previewImg.naturalWidth}×${previewImg.naturalHeight}, 大小: ${formatFileSize(file.size)}`;
            document.getElementById('original-info').textContent = info;
        };
    };
    
    reader.readAsDataURL(file);
    document.getElementById('compress-btn').disabled = false;
}

// 格式化文件大小显示
function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1048576).toFixed(1)} MB`;
}

// 主压缩函数
async function compressImage() {
    if (!wasmModule) return;
    
    const fileInput = document.getElementById('file-input');
    if (!fileInput.files.length) {
        alert('请先选择图像文件');
        return;
    }
    
    disableUI();
    showLoading();
    
    try {
        const file = fileInput.files[0];
        const quality = parseInt(document.getElementById('quality').value);
        const maxDimension = parseInt(document.getElementById('max-dimension').value);
        
        // 读取文件为base64
        const base64 = await readAsDataURL(file);
        
        // 调用WASM压缩函数
        const result = wasmModule.compress_base64(base64, quality, maxDimension);
        
        // 处理结果
        if (result.size_after > 0) {
            const base64Result = result.base64;
            const compressedImg = document.getElementById('compressed-img');
            compressedImg.src = base64Result;
            
            // 显示压缩信息
            const compressionRatio = result.compression_ratio.toFixed(1);
            const info = `尺寸: ${result.width}×${result.height}, 
                          大小: ${formatFileSize(result.size_after)},
                          压缩比: ${compressionRatio}%`;
            
            document.getElementById('compressed-info').textContent = info;
        } else {
            showError('压缩失败，请尝试其他参数');
        }
    } catch (error) {
        console.error('压缩错误:', error);
        showError(`处理失败: ${error.message}`);
    } finally {
        enableUI();
        hideLoading();
    }
}

// 读取文件为base64
function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 显示错误
function showError(message) {
    const errorElem = document.createElement('div');
    errorElem.className = 'error-message';
    errorElem.textContent = message;
    
    document.querySelector('.container').appendChild(errorElem);
    setTimeout(() => errorElem.remove(), 3000);
}

// 显示加载状态
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading-overlay';
    loader.innerHTML = `<div class="loader"></div>`;
    document.body.appendChild(loader);
}

// 隐藏加载状态
function hideLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) loader.remove();
}

// 初始化WASM模块
initWasm();
