(function() {
    'use strict';

    // ---------- DOM 引用 ----------
    const navbar = document.getElementById('navbar');
    const cards = Array.from(document.querySelectorAll('.card'));
    const overlays = document.querySelectorAll('.subpage-overlay');
    const searchInput = document.getElementById('searchInput');
    const navLinks = document.querySelectorAll('.navbar-links a');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // ---------- 子页面数据映射 ----------
    const overlayMap = {
        school: document.getElementById('overlay-school'),
        cs: document.getElementById('overlay-cs'),
        elec: document.getElementById('overlay-elec'),
        mech: document.getElementById('overlay-mech'),
        practical: document.getElementById('overlay-practical'),
    };

    // ---------- 主题切换功能 ----------
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('qianzhi-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // 初始化主题（默认明亮）
    const savedTheme = localStorage.getItem('qianzhi-theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ---------- 导航栏滚动效果 ----------
    function handleScroll() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---------- 导航链接平滑滚动与高亮 ----------
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
            }
        });
    });

    // ---------- 子页面打开与关闭 ----------
    function openSubpage(overlayId) {
        const overlay = overlayMap[overlayId];
        if (!overlay) return;
        overlays.forEach(function(ov) { ov.classList.remove('active'); });
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeAllSubpages() {
        overlays.forEach(function(ov) { ov.classList.remove('active'); });
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-close]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSubpages();
        });
    });

    overlays.forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeAllSubpages();
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllSubpages();
        }
    });

    // ---------- 卡片点击打开子页面 ----------
    function handleCardActivate(card) {
        const id = card.getAttribute('data-id');
        openSubpage(id);
    }

    cards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            handleCardActivate(card);
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardActivate(card);
            }
        });
    });

    // ---------- 搜索过滤功能 ----------
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim().toLowerCase();
        cards.forEach(function(card) {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();
            const text = title + ' ' + desc;
            if (query === '' || text.includes(query)) {
                card.style.display = '';
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = 'cardAppear 0.4s ease both';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // ---------- 图片压缩工具功能 ----------
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressControls = document.getElementById('compressControls');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const compressBtn = document.getElementById('compressBtn');
    const imageList = document.getElementById('imageList');
    
    let selectedFiles = [];
    
    // 更新质量显示
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = qualitySlider.value;
    });
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    // 文件选择处理
    imageInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    // 处理选中的文件
    function handleFiles(files) {
        selectedFiles = files;
        compressControls.style.display = 'flex';
        imageList.innerHTML = '';
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageItem = createImageItem(file, e.target.result, index);
                imageList.appendChild(imageItem);
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 创建图片预览项
    function createImageItem(file, dataUrl, index) {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.dataset.index = index;
        
        div.innerHTML = `
            <div class="image-item-header">
                <span class="image-item-name">${file.name}</span>
                <span class="image-item-status">等待压缩</span>
            </div>
            <div class="image-item-preview">
                <div class="image-preview-box">
                    <img src="${dataUrl}" alt="${file.name}">
                </div>
                <div class="image-preview-info">
                    <span>原始大小：<strong>${formatFileSize(file.size)}</strong></span>
                    <span class="size-info compressed-size">压缩后：--</span>
                    <span class="saved-percent"></span>
                </div>
                <button class="image-download-btn" style="display:none;">下载</button>
            </div>
        `;
        
        return div;
    }
    
    // 压缩图片
    compressBtn.addEventListener('click', function() {
        if (selectedFiles.length === 0) return;
        
        const quality = qualitySlider.value / 100;
        compressBtn.disabled = true;
        compressBtn.textContent = '压缩中...';
        
        const promises = selectedFiles.map((file, index) => {
            return compressImage(file, quality, index);
        });
        
        Promise.all(promises).then(() => {
            compressBtn.disabled = false;
            compressBtn.textContent = '开始压缩';
        });
    });
    
    // 压缩单张图片
    function compressImage(file, quality, index) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    // 对于PNG图片，使用canvas.toBlob进行压缩
                    canvas.toBlob(function(blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        
                        const compressedUrl = URL.createObjectURL(blob);
                        updateImageItem(index, file.size, blob.size, compressedUrl, blob, file.name);
                        resolve();
                    }, file.type, quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 更新图片项显示
    function updateImageItem(index, originalSize, compressedSize, compressedUrl, blob, fileName) {
        const imageItems = imageList.querySelectorAll('.image-item');
        const targetItem = imageItems[index];
        
        if (!targetItem) return;
        
        const statusEl = targetItem.querySelector('.image-item-status');
        const compressedSizeEl = targetItem.querySelector('.compressed-size');
        const savedPercentEl = targetItem.querySelector('.saved-percent');
        const downloadBtn = targetItem.querySelector('.image-download-btn');
        const previewImg = targetItem.querySelector('.image-preview-box img');
        
        statusEl.textContent = '压缩完成';
        statusEl.style.color = '#10b981';
        
        compressedSizeEl.textContent = `压缩后：${formatFileSize(compressedSize)}`;
        
        const savedPercent = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        if (savedPercent > 0) {
            savedPercentEl.textContent = `节省 ${savedPercent}%`;
        } else {
            savedPercentEl.textContent = '文件已是最优大小';
            savedPercentEl.style.color = 'var(--text-light)';
        }
        
        // 更新预览图
        previewImg.src = compressedUrl;
        
        // 显示下载按钮
        downloadBtn.style.display = 'inline-block';
        downloadBtn.addEventListener('click', function() {
            const link = document.createElement('a');
            link.href = compressedUrl;
            link.download = `compressed_${fileName}`;
            link.click();
        });
    }
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    console.log('🎯 千秩科技智能界面已加载完成');
    console.log('💡 提示：点击卡片进入对应子页面，点击右上角按钮切换主题');
})();
