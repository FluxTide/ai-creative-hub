document.addEventListener('DOMContentLoaded', () => {
  const cardsGrid = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const categoryTabs = document.getElementById('categoryTabs');
  const detailDrawer = document.getElementById('detailDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerCategory = document.getElementById('drawerCategory');
  const drawerBody = document.getElementById('drawerBody');
  const workDetailView = document.getElementById('workDetailView');
  const detailNavTitle = document.getElementById('detailNavTitle');
  const detailBackBtn = document.getElementById('detailBackBtn');
  const detailGridLayout = document.getElementById('detailGridLayout');
  const toast = document.getElementById('toast');

  let currentCategory = 'all';
  let searchQuery = '';

  // 统计数量更新
  function updateCounts() {
    document.getElementById('countAll').innerText = CREATIVE_WORKS.length;
    document.getElementById('countVideo').innerText = CREATIVE_WORKS.filter(w => w.category === 'video').length;
    document.getElementById('countImage').innerText = CREATIVE_WORKS.filter(w => w.category === 'image').length;
    document.getElementById('countWorkflow').innerText = CREATIVE_WORKS.filter(w => w.category === 'workflow').length;
  }

  // 渲染作品卡片流
  function renderCards() {
    const filtered = CREATIVE_WORKS.filter(work => {
      const matchCat = (currentCategory === 'all' || work.category === currentCategory);
      const matchSearch = !searchQuery || 
        work.title.toLowerCase().includes(searchQuery) ||
        work.desc.toLowerCase().includes(searchQuery) ||
        (work.promptEn && work.promptEn.toLowerCase().includes(searchQuery)) ||
        (work.promptZh && work.promptZh.toLowerCase().includes(searchQuery)) ||
        (work.prompt && work.prompt.toLowerCase().includes(searchQuery)) ||
        work.tags.some(t => t.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      cardsGrid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    cardsGrid.innerHTML = filtered.map(item => {
      const isVideo = Boolean(item.video);
      return `
        <article class="work-card ${isVideo ? 'has-video' : ''}" data-id="${item.id}">
          <div class="card-media-wrap">
            <img src="${item.cover}" alt="${item.title}" class="card-cover" loading="lazy">
            ${isVideo ? `
              <video class="card-video-preview" src="${item.video}" muted loop playsinline preload="none"></video>
              <div class="media-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                动态视频
              </div>
            ` : `
              <div class="media-badge">
                ${item.category === 'image' ? '📸 高清图' : '⚡ 工作流'}
              </div>
            `}
          </div>

          <div class="card-content">
            <div class="card-meta-row">
              <span class="card-id">${item.id}</span>
              <span class="card-rec">${item.recommend}</span>
            </div>
            <h2 class="card-title">${item.title}</h2>
            <p class="card-desc">${item.desc}</p>
            <div class="card-tags">
              ${item.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // 绑定悬停动态播放视频（sael.net 交互）
    document.querySelectorAll('.work-card.has-video').forEach(card => {
      const video = card.querySelector('.card-video-preview');
      if (video) {
        card.addEventListener('mouseenter', () => {
          video.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      }
    });

    // 点击打开详情抽屉
    document.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        openDetail(id);
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 打开作品详情（整页视图，对标四个专属区域）
  function openDetail(id) {
    const item = CREATIVE_WORKS.find(w => w.id === id);
    if (!item) return;

    if (detailNavTitle) {
      detailNavTitle.innerText = `${item.categoryName} · ${item.title}`;
    }

    // 区域 1：视频/大图演示区
    const area1Html = `
      <div class="detail-area-video">
        <div class="detail-video-card">
          ${item.video ? `
            <video class="detail-video" src="${item.video}" poster="${item.cover}" controls autoplay loop muted playsinline></video>
          ` : `
            <img class="detail-image" src="${item.cover}" alt="${item.title}">
          `}
        </div>

        <div class="detail-work-intro">
          <div class="detail-work-id-badge">
            <span>${item.id}</span>
            <span>•</span>
            <span style="color: var(--morandi-purple);">${item.recommend}</span>
            <span>•</span>
            <span>${item.categoryName}</span>
          </div>
          <h1 class="detail-work-title">${item.title}</h1>
          <p class="detail-work-desc">${item.desc}</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
            ${(item.tags || []).map(t => `<span class="badge">#${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    // 区域 2：展示那个链接（体验与互动链接，如 GPT-6 Astra、Opus 5.5 Artifact）
    const linksList = [];

    if (item.links && item.links.length > 0) {
      item.links.forEach((l, idx) => {
        linksList.push(`
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="detail-action-link ${idx === 0 ? 'primary' : 'secondary'}">
            <div style="display: flex; align-items: center; gap: 10px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>${l.name}</span>
            </div>
            <span>↗</span>
          </a>
        `);
      });
    } else if (item.toolUrl) {
      linksList.push(`
        <a href="${item.toolUrl}" target="_blank" rel="noopener noreferrer" class="detail-action-link primary">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span>⚡ 体验工具/模型直达</span>
          </div>
          <span>↗</span>
        </a>
      `);
    }

    const area2Html = `
      <div class="detail-area-links">
        <div class="detail-section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span>体验与互动链接</span>
        </div>
        <div class="detail-links-group">
          ${linksList.join('')}
        </div>
      </div>
    `;

    // 区域 3：展示提示词（默认展示中文翻译版，若无则回退到英文/默认）
    const currentPromptText = item.promptZh || item.promptEn || item.prompt || '';
    const hasEnPrompt = !!(item.promptEn && item.promptZh);

    const area3Html = `
      <div class="detail-area-prompt">
        <div class="prompt-box-header">
          <div class="prompt-box-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span id="promptBoxLabel">完整提示词 (PROMPT)</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${hasEnPrompt ? `
              <div class="prompt-lang-tabs" id="promptLangTabs">
                <button class="prompt-lang-btn active" data-lang="zh">中文版</button>
                <button class="prompt-lang-btn" data-lang="en">英文版</button>
              </div>
            ` : ''}

            <button class="btn-copy-code" id="copyPromptBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>一键复制</span>
            </button>
          </div>
        </div>
        <pre class="prompt-code-wrap"><code id="promptCodeDisplay">${escapeHtml(currentPromptText)}</code></pre>

        ${item.negativePrompt ? `
          <div class="prompt-box-header" style="margin-top: 18px;">
            <div class="prompt-box-title" style="color: var(--text-muted);">
              <span>反向提示词 (Negative Prompt)</span>
            </div>
            <button class="btn-copy-code" id="copyNegBtn">
              <span>复制反向</span>
            </button>
          </div>
          <pre class="prompt-code-wrap"><code>${escapeHtml(item.negativePrompt)}</code></pre>
        ` : ''}
      </div>
    `;

    detailGridLayout.innerHTML = `
      ${area1Html}
      <div class="detail-area-sidebar">
        ${area2Html}
        ${area3Html}
      </div>
    `;

    workDetailView.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 绑定一键复制与中英文切换事件（默认中文版）
    let currentActiveLang = 'zh';
    const promptCodeDisplay = document.getElementById('promptCodeDisplay');
    const promptLangTabs = document.getElementById('promptLangTabs');

    if (promptLangTabs) {
      promptLangTabs.querySelectorAll('.prompt-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          promptLangTabs.querySelectorAll('.prompt-lang-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentActiveLang = btn.getAttribute('data-lang');
          if (currentActiveLang === 'zh') {
            promptCodeDisplay.textContent = item.promptZh || item.prompt || '';
          } else {
            promptCodeDisplay.textContent = item.promptEn || item.prompt || '';
          }
        });
      });
    }

    const copyPromptBtn = document.getElementById('copyPromptBtn');
    if (copyPromptBtn) {
      copyPromptBtn.addEventListener('click', () => {
        const textToCopy = currentActiveLang === 'zh' ? (item.promptZh || item.prompt) : (item.promptEn || item.prompt);
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(currentActiveLang === 'zh' ? '✨ 中文版提示词已复制！' : '✨ 英文版提示词已复制！');
        }).catch(() => {
          showToast('❌ 复制失败，请手动选取');
        });
      });
    }
    if (copyNegBtn) {
      copyNegBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(item.negativePrompt).then(() => {
          showToast('负向提示词已复制到剪贴板！');
        });
      });
    }
  }

  function closeDetail() {
    workDetailView.classList.remove('active');
    document.body.style.overflow = '';
    const video = workDetailView.querySelector('video');
    if (video) video.pause();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  // 监听关闭
  if (detailBackBtn) detailBackBtn.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
  });

  // 分类切换
  categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderCards();
    });
  });

  // 搜索监听
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderCards();
  });

  // 3D 空间全景微弧度视差（鼠标移动时视差平移 + 空间曲率视角转向）
  const bannerWrapper = document.getElementById('bannerWrapper');
  const banner3dScene = document.getElementById('banner3dScene');
  const bannerImg = document.getElementById('bannerImg');

  if (bannerWrapper && banner3dScene && bannerImg) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isHovering = false;
    let rafId = null;

    bannerWrapper.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    bannerWrapper.addEventListener('mousemove', (e) => {
      const rect = bannerWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0 ~ 1
      const y = (e.clientY - rect.top) / rect.height; // 0 ~ 1
      
      // 计算归一化偏离中心 [-1, 1]
      targetX = (x - 0.5) * 2;
      targetY = (y - 0.5) * 2;
    });

    bannerWrapper.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
    });

    function updateParallax() {
      // 提升响应速度：factor 提高至 0.16，动作更灵动干脆
      const factor = isHovering ? 0.16 : 0.08;
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;

      // 加强立体透视度与转动幅度
      const translateX = -currentX * 48; // 横向位移增大至 ±48px
      const translateY = -currentY * 20; // 纵向位移增大至 ±20px
      const rotateY = currentX * 14.5;   // 水平曲率旋转幅度加深至 ±14.5 deg
      const rotateX = -currentY * 7.5;   // 纵向俯仰角加深至 ±7.5 deg

      banner3dScene.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      bannerImg.style.transform = `translate3d(${translateX}px, ${translateY}px, 35px) scale(1.08)`;

      requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);
  }

  // 初始化
  updateCounts();
  renderCards();
  initChatflowThemeEvents();
});

/* ================= ChatFlow 7大色调外观系统逻辑 ================= */
const CHATFLOW_THEMES = [
  {
    id: 'cloud-dancer',
    name: '云上舞白',
    codeLabel: 'Pantone 2026 年度色',
    dotColor: '#8B7355',
    previewBg: '#F0EEE9',
    badgeBg: '#8B7355'
  },
  {
    id: 'blossom-dream',
    name: '繁花如梦',
    codeLabel: '晨曦花境 · 夜阑幽梦',
    dotColor: '#D4849A',
    previewBg: 'linear-gradient(135deg, #FAF4F8 0%, #F5EDF2 100%)',
    badgeBg: 'linear-gradient(135deg, #E8A8BC 0%, #C46D88 100%)'
  },
  {
    id: 'corundum-blue',
    name: '刚玉蓝',
    codeLabel: 'RAL 220 40 10',
    dotColor: '#4A6670',
    previewBg: '#E8EEF0',
    badgeBg: '#4A6670'
  },
  {
    id: 'kiwi-green',
    name: '冰猕猴桃汁绿',
    codeLabel: 'RAL 120 90 20',
    dotColor: '#7A9A5C',
    previewBg: '#E8F0E4',
    badgeBg: '#7A9A5C'
  },
  {
    id: 'spicy-red',
    name: '辛辣红',
    codeLabel: 'RAL 030 40 40',
    dotColor: '#8B4049',
    previewBg: '#F0E8E8',
    badgeBg: '#8B4049'
  },
  {
    id: 'teal-water',
    name: '明水鸭色',
    codeLabel: 'RAL 180 80 10',
    dotColor: '#5A8A8A',
    previewBg: '#E4F0F0',
    badgeBg: '#5A8A8A'
  },
  {
    id: 'geist',
    name: 'Geist',
    codeLabel: 'Vercel · 极简黑白',
    dotColor: '#000000',
    previewBg: '#FFFFFF',
    badgeBg: '#000000'
  }
];

let currentThemeId = localStorage.getItem('cf_theme_id') || 'cloud-dancer';
let currentThemeMode = localStorage.getItem('cf_theme_mode') || 'system';

function applyChatflowThemeDOM() {
  const root = document.documentElement;
  root.setAttribute('data-theme', currentThemeId);

  let effectiveMode = currentThemeMode;
  if (effectiveMode === 'system') {
    effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-mode', effectiveMode);

  // 更新触发器按钮展示
  const foundTheme = CHATFLOW_THEMES.find(t => t.id === currentThemeId) || CHATFLOW_THEMES[0];
  const triggerDot = document.getElementById('themeTriggerDot');
  const triggerLabel = document.getElementById('themeTriggerLabel');
  if (triggerDot) triggerDot.style.background = foundTheme.dotColor;
  if (triggerLabel) triggerLabel.textContent = foundTheme.name;

  // 更新弹窗内部状态
  updateThemeModalUI();
}

function updateThemeModalUI() {
  // 模式按钮激活态
  ['light', 'dark', 'system'].forEach(m => {
    const btn = document.getElementById(`mode${m.charAt(0).toUpperCase() + m.slice(1)}Btn`);
    if (btn) {
      if (currentThemeMode === m) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  // 渲染主题卡片网格
  const grid = document.getElementById('chatflowThemesGrid');
  if (!grid) return;

  grid.innerHTML = CHATFLOW_THEMES.map(t => {
    const isActive = t.id === currentThemeId;
    return `
      <div class="chatflow-theme-card ${isActive ? 'active' : ''}" 
           data-theme-id="${t.id}"
           style="background: ${t.previewBg};">
        ${isActive ? '<div class="chatflow-check-badge">✓</div>' : ''}
        <div style="padding-right: 18px;">
          <div style="font-size: 12px; font-weight: 700; color: #2D2D2D; line-height: 1.2;">${t.name}</div>
          <div style="font-size: 9.5px; color: #787878; margin-top: 3px; line-height: 1.2;">${t.codeLabel}</div>
        </div>
        <div class="chatflow-color-dot" style="background: ${t.dotColor};"></div>
      </div>
    `;
  }).join('');

  // 绑定卡片点击
  grid.querySelectorAll('.chatflow-theme-card').forEach(card => {
    card.addEventListener('click', () => {
      const tid = card.getAttribute('data-theme-id');
      currentThemeId = tid;
      localStorage.setItem('cf_theme_id', tid);
      applyChatflowThemeDOM();
      const themeObj = CHATFLOW_THEMES.find(t => t.id === tid);
      showToast(`已切换至「${themeObj ? themeObj.name : tid}」色调`);
    });
  });
}

function initChatflowThemeEvents() {
  // 监听系统色彩偏好变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentThemeMode === 'system') {
      applyChatflowThemeDOM();
    }
  });

  const modalOverlay = document.getElementById('themeModalOverlay');
  const triggerBtn = document.getElementById('themeTriggerBtn');
  const closeBtn = document.getElementById('themeModalCloseBtn');

  if (triggerBtn && modalOverlay) {
    triggerBtn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
      updateThemeModalUI();
    });
  }

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // 模式切换按钮
  ['light', 'dark', 'system'].forEach(m => {
    const btn = document.getElementById(`mode${m.charAt(0).toUpperCase() + m.slice(1)}Btn`);
    if (btn) {
      btn.addEventListener('click', () => {
        currentThemeMode = m;
        localStorage.setItem('cf_theme_mode', m);
        applyChatflowThemeDOM();
        const modeLabels = { light: '浅色模式', dark: '深色模式', system: '跟随系统' };
        showToast(`已切换为${modeLabels[m]}`);
      });
    }
  });

  // 初始应用
  applyChatflowThemeDOM();
}
