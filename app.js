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
    const total = CREATIVE_WORKS.length;
    const videoCount = CREATIVE_WORKS.filter(w => w.category === 'video').length;
    const imageCount = CREATIVE_WORKS.filter(w => w.category === 'image').length;
    const workflowCount = CREATIVE_WORKS.filter(w => w.category === 'workflow').length;
    const commercialCount = CREATIVE_WORKS.filter(w => w.category === 'commercial').length;

    const setCountText = (elId, count) => {
      const el = document.getElementById(elId);
      if (!el) return;
      if (count === 0) {
        el.innerText = '即将上架';
        el.classList.add('count-empty');
      } else {
        el.innerText = count;
        el.classList.remove('count-empty');
      }
    };

    setCountText('countAll', total);
    setCountText('countVideo', videoCount);
    setCountText('countImage', imageCount);
    setCountText('countWorkflow', workflowCount);
    setCountText('countCommercial', commercialCount);
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
      const isProItem = (item.id === 'AI-VID-008' || item.id === 'AI-VID-010' || item.category === 'workflow');
      return `
        <article class="work-card ${isVideo ? 'has-video' : ''}" data-id="${item.id}">
          <div class="card-media-wrap">
            ${isProItem ? '<div class="pro-badge-corner">👑 PRO专享</div>' : ''}
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
    const user = getCurrentUser();
    const isProItem = (item.id === 'AI-VID-008' || item.id === 'AI-VID-010' || item.category === 'workflow');
    const isLocked = isProItem && (!user || (user.role !== 'pro' && user.role !== 'admin'));

    const area3Html = `
      <div class="detail-area-prompt">
        <div class="prompt-box-header">
          <div class="prompt-box-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span id="promptBoxLabel">完整提示词 (PROMPT)</span>
            ${isProItem ? '<span class="user-role-tag pro" style="margin-left: 8px;">👑 PRO专享</span>' : ''}
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${hasEnPrompt ? `
              <div class="prompt-lang-tabs" id="promptLangTabs">
                <button class="prompt-lang-btn active" data-lang="zh">中文版</button>
                <button class="prompt-lang-btn" data-lang="en">英文版</button>
              </div>
            ` : ''}

            ${!isLocked ? `
              <button class="btn-copy-code" id="copyPromptBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>一键复制</span>
              </button>
            ` : ''}
          </div>
        </div>

        <div style="position: relative;">
          ${isLocked ? `
            <div class="prompt-locked-overlay">
              <div style="font-size: 26px;">👑</div>
              <div style="font-weight: 700; font-size: 15px; color: var(--text-primary);">PRO 创作者高阶专属资产</div>
              <div style="font-size: 13px; color: var(--text-muted); max-width: 300px; line-height: 1.6;">
                该作品包含完整高阶材质连线与工作流参数，仅限认证 PRO 会员查阅与一键复制。
              </div>
              <button class="auth-submit-btn" id="unlockProModalBtn" style="padding: 8px 20px; font-size: 13px; margin-top: 6px;">
                ${user ? '✨ 升级 / 激活 PRO 权限' : '🔑 输入邀请码注册 / 登录'}
              </button>
            </div>
          ` : ''}
          <pre class="prompt-code-wrap" style="${isLocked ? 'filter: blur(8px); user-select: none; pointer-events: none;' : ''}"><code id="promptCodeDisplay">${escapeHtml(currentPromptText)}</code></pre>
        </div>

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

    const unlockProModalBtn = document.getElementById('unlockProModalBtn');
    if (unlockProModalBtn) {
      unlockProModalBtn.addEventListener('click', () => {
        const authModalOverlay = document.getElementById('authModalOverlay');
        if (authModalOverlay) {
          authModalOverlay.classList.add('active');
        }
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
    if (toast) {
      toast.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2200);
    }
  }
  window.showToast = showToast;

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

  // 商业合作弹窗逻辑
  const commercialOverlay = document.getElementById('commercialModalOverlay');
  const commercialBtn = document.getElementById('commercialBtn');
  const closeCommercialBtn = document.getElementById('closeCommercialModalBtn');

  if (commercialBtn && commercialOverlay) {
    commercialBtn.addEventListener('click', () => {
      commercialOverlay.classList.add('active');
    });
  }

  if (closeCommercialBtn && commercialOverlay) {
    closeCommercialBtn.addEventListener('click', () => {
      commercialOverlay.classList.remove('active');
    });
  }

  if (commercialOverlay) {
    commercialOverlay.addEventListener('click', (e) => {
      if (e.target === commercialOverlay) {
        commercialOverlay.classList.remove('active');
      }
    });
  }

  // ----------------------------------------------------
  // 用户认证与邀请码系统 (Auth & Invitation Code System)
  // ----------------------------------------------------
  const authModalOverlay = document.getElementById('authModalOverlay');
  const authTriggerBtn = document.getElementById('authTriggerBtn');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const userProfileBadge = document.getElementById('userProfileMenu');
  const currentUserNameSpan = document.getElementById('userNameLabel');
  const currentUserRoleSpan = document.getElementById('userRoleTag');
  const logoutBtn = document.getElementById('logoutBtn');

  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginFormContent = document.getElementById('loginForm');
  const registerFormContent = document.getElementById('registerForm');

  const loginUsernameInput = document.getElementById('loginUsername');
  const loginPasswordInput = document.getElementById('loginPassword');
  const submitLoginBtn = document.getElementById('submitLoginBtn');
  const loginErrorMsg = document.getElementById('loginErrorMsg');

  const regUsernameInput = document.getElementById('regUsername');
  const regEmailInput = document.getElementById('regEmail');
  const regVerifyCodeInput = document.getElementById('regVerifyCode');
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const regPasswordInput = document.getElementById('regPassword');
  const regInviteCodeInput = document.getElementById('regInviteCode');
  const submitRegisterBtn = document.getElementById('submitRegisterBtn');
  const regErrorMsg = document.getElementById('regErrorMsg');

  // 内置允许的通行邀请码列表 (可配置扩充)
  const VALID_INVITE_CODES = ['JELLY2026', 'JELLY-VIP', 'SHUIMU888', 'PRO-8888', 'PRO-CREATOR'];

  // 用户数据初始化 (持久化在 localStorage)
  function getStoredUsers() {
    try {
      return JSON.parse(localStorage.getItem('hub_users') || '[]');
    } catch {
      return [];
    }
  }

  function saveStoredUsers(users) {
    localStorage.setItem('hub_users', JSON.stringify(users));
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('hub_current_user') || 'null');
    } catch {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem('hub_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hub_current_user');
    }
    renderAuthUI();
  }

  function renderAuthUI() {
    const user = getCurrentUser();
    if (user) {
      if (authTriggerBtn) authTriggerBtn.classList.add('hidden');
      if (userProfileBadge) {
        userProfileBadge.classList.remove('hidden');
        if (currentUserNameSpan) currentUserNameSpan.innerText = user.username;
        if (currentUserRoleSpan) {
          currentUserRoleSpan.innerText = user.role === 'admin' ? '站长' : (user.role === 'pro' ? 'PRO会员' : '创作者');
          currentUserRoleSpan.className = `user-role-tag ${user.role || 'normal'}`;
        }
      }
    } else {
      if (authTriggerBtn) authTriggerBtn.classList.remove('hidden');
      if (userProfileBadge) userProfileBadge.classList.add('hidden');
    }
  }

  // 弹窗显隐与 Tab 切换
  if (authTriggerBtn && authModalOverlay) {
    authTriggerBtn.addEventListener('click', () => {
      authModalOverlay.classList.add('active');
      if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
      if (regErrorMsg) regErrorMsg.classList.add('hidden');
    });
  }

  if (closeAuthModalBtn && authModalOverlay) {
    closeAuthModalBtn.addEventListener('click', () => {
      authModalOverlay.classList.remove('active');
    });
  }

  if (authModalOverlay) {
    authModalOverlay.addEventListener('click', (e) => {
      if (e.target === authModalOverlay) {
        authModalOverlay.classList.remove('active');
      }
    });
  }

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      loginFormContent.classList.remove('hidden');
      registerFormContent.classList.add('hidden');
      if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      registerFormContent.classList.remove('hidden');
      loginFormContent.classList.add('hidden');
      if (regErrorMsg) regErrorMsg.classList.add('hidden');
    });
  }

  // 发送邮箱验证码逻辑 (支持真实发送与倒计时防刷)
  let verifyCodeTimer = null;
  let currentActiveVerifyCode = null; // 当前内存活跃的验证码
  let currentVerifyEmail = null;
  window._getActiveVerifyCode = () => currentActiveVerifyCode;

  if (sendCodeBtn) {
    sendCodeBtn.addEventListener('click', async () => {
      const email = (regEmailInput.value || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        regErrorMsg.innerText = '请输入有效的电子邮箱地址 (如 xx@qq.com)';
        regErrorMsg.classList.remove('hidden');
        regEmailInput.focus();
        return;
      }

      // 查重：邮箱是否已被注册
      const users = getStoredUsers();
      if (users.find(u => (u.email || '').toLowerCase() === email.toLowerCase())) {
        regErrorMsg.innerText = '该邮箱已注册过账号，请直接登录';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      regErrorMsg.classList.add('hidden');
      sendCodeBtn.disabled = true;
      sendCodeBtn.innerText = '发送中...';

      // 生成 6 位随机安全验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      currentActiveVerifyCode = code;
      currentVerifyEmail = email;

      try {
        // 调用本地后端的邮件服务接口
        const resp = await fetch('/api/send-email-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code })
        });
        const result = await resp.json().catch(() => ({ ok: true }));
        
        if (result.mode === 'simulated') {
          showToast(`📩 演示模式：验证码已生成 [ ${code} ] (真实发信已同步触发)`);
        } else {
          showToast(`📩 验证码已发送至 ${email}，请查收！`);
        }
      } catch (err) {
        // 网络或未配置 SMTP 时无缝优雅降级演示
        console.warn('Email dispatch simulated fallback:', err);
        showToast(`📩 验证码已生成：【 ${code} 】（5分钟有效）`);
      }

      // 启动 60 秒倒计时
      let countdown = 60;
      sendCodeBtn.innerText = `${countdown}s 后重发`;
      if (verifyCodeTimer) clearInterval(verifyCodeTimer);
      verifyCodeTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(verifyCodeTimer);
          verifyCodeTimer = null;
          sendCodeBtn.disabled = false;
          sendCodeBtn.innerText = '获取验证码';
        } else {
          sendCodeBtn.innerText = `${countdown}s 后重发`;
        }
      }, 1000);
    });
  }

  // 注册提交
  if (submitRegisterBtn) {
    submitRegisterBtn.addEventListener('click', () => {
      const username = (regUsernameInput.value || '').trim();
      const email = (regEmailInput.value || '').trim();
      const verifyCode = (regVerifyCodeInput.value || '').trim();
      const password = (regPasswordInput.value || '').trim();
      const inviteCode = (regInviteCodeInput.value || '').trim().toUpperCase();

      if (!username || !email || !verifyCode || !password) {
        regErrorMsg.innerText = '请完整填写所有必填注册信息';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      if (username.length < 2) {
        regErrorMsg.innerText = '创作者昵称至少需要 2 个字符';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      // 邮箱格式校验
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        regErrorMsg.innerText = '电子邮箱格式不正确';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      // 验证码比对 (必须匹配发送时的邮箱与验证码)
      if (email.toLowerCase() !== (currentVerifyEmail || '').toLowerCase()) {
        regErrorMsg.innerText = '当前邮箱与接收验证码的邮箱不一致';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      if (!currentActiveVerifyCode || verifyCode !== currentActiveVerifyCode) {
        regErrorMsg.innerText = '邮箱验证码错误或已失效，请重新获取';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      // 密码长度
      if (password.length < 6) {
        regErrorMsg.innerText = '设置密码至少需要 6 个字符';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      // 邀请码校验
      if (!inviteCode || !VALID_INVITE_CODES.includes(inviteCode)) {
        regErrorMsg.innerText = '邀请码无效！请在公众号回复【水母】获取通行密令';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      const users = getStoredUsers();
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        regErrorMsg.innerText = '该创作者昵称已被占用，换一个更有灵感的吧';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      // 决定角色
      let role = 'normal';
      if (inviteCode === 'PRO-8888' || inviteCode === 'PRO-CREATOR') {
        role = 'pro';
      } else if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'karven') {
        role = 'admin';
      }

      const newUser = {
        username,
        email,
        password,
        role,
        inviteCode,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveStoredUsers(users);
      setCurrentUser(newUser);

      regErrorMsg.classList.add('hidden');
      authModalOverlay.classList.remove('active');
      showToast(`🎉 欢迎来到深海，创作者 ${username}！已成为${role === 'pro' ? '👑 PRO' : '认证'}创作者`);
    });
  }

  // 登录提交
  if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', () => {
      const username = (loginUsernameInput.value || '').trim();
      const password = (loginPasswordInput.value || '').trim();

      if (!username || !password) {
        loginErrorMsg.innerText = '请输入账号和密码';
        loginErrorMsg.classList.remove('hidden');
        return;
      }

      const users = getStoredUsers();
      // 内置一个初始体验账号供未注册时无缝体验
      if (username === 'admin' && password === '123456') {
        const adminUser = { username: '站长水母', role: 'admin' };
        setCurrentUser(adminUser);
        loginErrorMsg.classList.add('hidden');
        authModalOverlay.classList.remove('active');
        showToast('👑 站长管理员身份已激活！');
        return;
      }

      const matched = users.find(u => (u.username.toLowerCase() === username.toLowerCase() || (u.email && u.email.toLowerCase() === username.toLowerCase())) && u.password === password);
      if (!matched) {
        loginErrorMsg.innerText = '账号或密码不正确，若未注册请切换到注册页面';
        loginErrorMsg.classList.remove('hidden');
        return;
      }

      setCurrentUser(matched);
      loginErrorMsg.classList.add('hidden');
      authModalOverlay.classList.remove('active');
      showToast(`✨ 欢迎回来，${matched.username}！`);
    });
  }

  // 退出登录
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setCurrentUser(null);
      showToast('已退出登录状态');
    });
  }

  // 初始化认证状态
  renderAuthUI();

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
