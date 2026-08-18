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

    console.log('🎯 千秩科技智能界面已加载完成');
    console.log('💡 提示：点击卡片进入对应子页面，点击右上角按钮切换主题');
})();
