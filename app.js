// 获取当前已登录用户（全局共享）
function getHubCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('hub_current_user') || 'null');
  } catch {
    return null;
  }
}

// ============================================================
// 收藏与账号：全文件共享（放在最外层，别塞进任何函数里）
// ------------------------------------------------------------
// 踩过的坑：这两个作用域各自封闭，函数声明只在自己那个作用域里提升。
// 收藏按钮在 renderCards 里渲染，认证按钮在另一个函数里绑定，
// 两边都要用同一批助手，所以只能提到全局。
// ============================================================
let favoriteIds = new Set();
let currentDetailId = '';

const AUTH_API = (window.AUTH_HUB_URL || 'http://127.0.0.1:8100') + '/api';
const GUEST_FAV_KEY = 'hub_guest_favorites';

function getToken() {
  try {
    return localStorage.getItem('hub_token') || '';
  } catch {
    return '';
  }
}

function setToken(token) {
  try {
    if (token) {
      localStorage.setItem('hub_token', token);
    } else {
      localStorage.removeItem('hub_token');
    }
  } catch {
    /* 隐私模式下写不进去就算了，不影响浏览 */
  }
}

// 调 auth-hub。失败时把后端给的人话原样抛出去，前端不再自己编提示，
// 这样「该用户名已被注册」这类提示只有一处定义，不会两边说法不一致。
async function authCall(method, path, payload) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  let resp;
  try {
    resp = await fetch(AUTH_API + path, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined
    });
  } catch {
    throw new Error('连不上账号服务，请确认 auth-hub 已经启动');
  }
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data.detail || '请求失败，请稍后再试');
  }
  return data;
}

function getGuestFavorites() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_FAV_KEY) || '[]');
  } catch {
    return [];
  }
}

function setGuestFavorites(list) {
  try {
    localStorage.setItem(GUEST_FAV_KEY, JSON.stringify(list));
  } catch {
    /* 同上 */
  }
}

function roleFromBackend(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'admin') return 'admin';
  if (r === 'pro') return 'pro';
  return 'normal';
}

function favBtnHtml(item) {
const on = favoriteIds.has(item.id);
return `<button class="card-fav-btn ${on ? 'is-fav' : ''}" data-fav="${item.id}"`
+ ` aria-label="收藏 ${item.title}" title="收藏">${on ? '★' : '☆'}</button>`;
}

function renderFavorites() {
document.querySelectorAll('.card-fav-btn').forEach(btn => {
const id = btn.getAttribute('data-fav');
const on = favoriteIds.has(id);
btn.classList.toggle('is-fav', on);
btn.textContent = on ? '★' : '☆';
});
const dbtn = document.getElementById('detailFavBtn');
if (dbtn) {
const on = currentDetailId && favoriteIds.has(currentDetailId);
dbtn.classList.toggle('is-fav', Boolean(on));
dbtn.textContent = on ? '★ 已收藏' : '☆ 收藏';
}
}

async function loadFavorites() {
if (!getToken()) {
favoriteIds = new Set(getGuestFavorites());
renderFavorites();
return;
}
try {
const guests = getGuestFavorites();
if (guests.length) {
  // 游客期间收藏的，登录后一次性并入账号
  const merged = await authCall('POST', '/favorites/merge', {
    app_id: 'jellyfish', item_ids: guests
  });
  setGuestFavorites([]);
  favoriteIds = new Set(merged.items || []);
} else {
  const fav = await authCall('GET', '/favorites?app_id=jellyfish');
  favoriteIds = new Set(fav.items || []);
}
} catch {
favoriteIds = new Set(getGuestFavorites());
}
renderFavorites();
}

async function toggleFavorite(itemId) {
if (!itemId) return;
if (!getToken()) {
const list = getGuestFavorites();
const at = list.indexOf(itemId);
if (at >= 0) list.splice(at, 1);
else list.push(itemId);
setGuestFavorites(list);
favoriteIds = new Set(list);
renderFavorites();
showToast(at >= 0 ? '已取消收藏' : '已收藏，登录后会自动同步到你的账号');
return;
}
try {
const data = await authCall('POST', '/favorites', {
  app_id: 'jellyfish', item_id: itemId
});
favoriteIds = new Set(data.items || []);
renderFavorites();
showToast(data.favored ? '已收藏 ★' : '已取消收藏');
} catch (err) {
showToast(err.message || '收藏失败，请稍后再试');
}
}


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
      const isProItem = false;
      return `
        <article class="work-card ${isVideo ? 'has-video' : ''}" data-id="${item.id}">
          <div class="card-media-wrap">
            ${isProItem ? '<div class="pro-badge-corner">👑 PRO专享</div>' : ''}
            ${favBtnHtml(item)}
            <img src="${item.cover}" alt="${item.title}" class="card-cover" loading="lazy">
            ${isVideo ? `
              <video class="card-video-preview" src="${item.video}" muted loop playsinline preload="none" onerror="this.style.display='none'"></video>
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

    // 点击打开详情抽屉（事件代理到 cardsGrid，保证无论何时点击均稳定捕获）
    cardsGrid.onclick = (e) => {
      const favBtn = e.target.closest('.card-fav-btn');
      if (favBtn) {
        e.stopPropagation();
        toggleFavorite(favBtn.getAttribute('data-fav'));
        return;
      }
      const card = e.target.closest('.work-card');
      if (!card) return;
      const id = card.getAttribute('data-id');
      if (id) {
        currentDetailId = id;
        openDetail(id);
        renderFavorites();
      }
    };
  }

  // 视频源不可用时（如部署包未携带 MP4）降级为封面图 + 在线体验按钮。
  // 说明：不能只靠 onerror —— 浏览器对 preload="none"/未进入视口的 video 可能根本不发请求，
  // 那样 error 事件永远不来。这里主动探测一次，并叠加 error / stalled / 超时三重兜底。
  window.__hubVideoFallback = function (videoEl) {
    if (!videoEl || videoEl.dataset.fallbackDone === '1') return;
    videoEl.dataset.fallbackDone = '1';
    const playUrl = videoEl.dataset.playUrl || '';
    const wrap = document.createElement('div');
    wrap.className = 'detail-video-fallback';
    wrap.innerHTML = `
      <img class="detail-image" src="${videoEl.getAttribute('poster') || ''}" alt="作品封面">
      ${playUrl ? `<a href="${playUrl}" target="_blank" rel="noopener noreferrer" class="detail-video-play-btn">▶ 点击在线体验（可交互）</a>` : ''}
    `;
    if (videoEl.parentNode) videoEl.parentNode.replaceChild(wrap, videoEl);
  };

  // 主动确认某个视频地址真的可用：HEAD 探测，失败或超时即降级
  window.__hubProbeVideo = function (videoEl) {
    if (!videoEl || videoEl.dataset.probeDone === '1') return;
    videoEl.dataset.probeDone = '1';
    const src = videoEl.getAttribute('src');
    if (!src) { window.__hubVideoFallback(videoEl); return; }

    let settled = false;
    const giveUp = () => {
      if (settled) return;
      settled = true;
      window.__hubVideoFallback(videoEl);
    };

    // 兜底 1：元素自身报错（如解码失败）
    videoEl.addEventListener('error', giveUp);
    // 兜底 2：加载卡死（网络挂起不发响应）
    videoEl.addEventListener('stalled', () => setTimeout(giveUp, 3000));
    // 兜底 3：探测请求本身超时
    const timer = setTimeout(giveUp, 8000);

    fetch(src, { method: 'HEAD' })
      .then(res => {
        clearTimeout(timer);
        if (settled) return;
        settled = true;
        const type = res.headers.get('content-type') || '';
        if (!res.ok || /text\/html/i.test(type)) {
          window.__hubVideoFallback(videoEl);
        }
      })
      .catch(() => { clearTimeout(timer); giveUp(); });
  };

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
            <video class="detail-video" src="${item.video}" poster="${item.cover}" controls autoplay loop muted playsinline
              data-play-url="${item.toolUrl || (item.links && item.links[0] ? item.links[0].url : '')}"
              onerror="window.__hubVideoFallback && window.__hubVideoFallback(this)"
              onloadedmetadata="window.__hubProbeVideo && window.__hubProbeVideo(this)"></video>
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
    const user = getHubCurrentUser();
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

    // 详情视图刚渲染，视频元素还没开始加载 —— 主动探测一次，缺文件就立刻降级
    const detailVideo = detailGridLayout.querySelector('.detail-video');
    if (detailVideo) window.__hubProbeVideo(detailVideo);

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
    const copyNegBtn = document.getElementById('copyNegBtn');
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
// 新访客默认浅色；深色或跟随系统由用户自己在「外观设置」里选
let currentThemeMode = localStorage.getItem('cf_theme_mode') || 'light';

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

  // 账号统一由 auth-hub 管（水母 / 拼豆 / 作品集共用一套账号）。
  // 这里只留一个令牌，绝不再本地存用户表或密码：localStorage 每个浏览器各存一份，
  // 既做不到「用户名唯一」，明文密码也等于摊在桌面上（开控制台就能看全）。
  function initDetailFavButton() {
    const title = document.getElementById('detailNavTitle');
    if (!title || document.getElementById('detailFavBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'detailFavBtn';
    btn.className = 'detail-fav-btn';
    btn.textContent = '☆ 收藏';
    btn.addEventListener('click', () => {
      if (currentDetailId) toggleFavorite(currentDetailId);
    });
    title.parentNode.appendChild(btn);
  }

  // 刷新页面后凭令牌恢复登录，不用重新登
  async function restoreSession() {
    if (!getToken()) {
      favoriteIds = new Set(getGuestFavorites());
      renderFavorites();
      return;
    }
    try {
      const me = await authCall('GET', '/auth/me');
      localStorage.setItem('hub_current_user', JSON.stringify({
        username: me.user.username,
        email: me.user.email,
        role: roleFromBackend(me.user.role)
      }));
      await loadFavorites();
    } catch {
      // 令牌过期或被作废了，当没登录处理，别把用户卡在一个假登录态里
      setToken('');
      localStorage.removeItem('hub_current_user');
      favoriteIds = new Set(getGuestFavorites());
      renderFavorites();
    }
    renderAuthUI();
    renderCards();
    renderFavorites();
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('hub_current_user') || 'null');
    } catch {
      return null;
    }
  }

  function setCurrentUser(user, token) {
    if (token !== undefined) setToken(token);
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

  // 发送邮箱验证码（真发还是落本地文件由 auth-hub 决定，前端不再自己生成码）
  let verifyCodeTimer = null;

  if (sendCodeBtn) {
    const sendBtnIdleText = sendCodeBtn.innerText;
    sendCodeBtn.addEventListener('click', async () => {
      const email = (regEmailInput.value || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        regErrorMsg.innerText = '请输入有效的电子邮箱地址 (如 xx@qq.com)';
        regErrorMsg.classList.remove('hidden');
        regEmailInput.focus();
        return;
      }

      regErrorMsg.classList.add('hidden');
      sendCodeBtn.disabled = true;
      sendCodeBtn.innerText = '发送中...';

      try {
        const data = await authCall('POST', '/auth/verify/send', { email });
        if (data.dev_code) {
          // 只在 auth-hub 没配 SMTP 时才会拿到这个，方便本地自测
          showToast(`📩 演示模式：验证码 ${data.dev_code}（真正上线会发到邮箱里）`);
        } else {
          showToast(`📩 验证码已发送至 ${email}，请查收！`);
        }
      } catch (err) {
        regErrorMsg.innerText = err.message || '验证码发送失败，请稍后再试';
        regErrorMsg.classList.remove('hidden');
        sendCodeBtn.disabled = false;
        sendCodeBtn.innerText = sendBtnIdleText;
        return;
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
          sendCodeBtn.innerText = sendBtnIdleText;
        } else {
          sendCodeBtn.innerText = `${countdown}s 后重发`;
        }
      }, 1000);
    });
  }

  // 注册提交（用户名是否被占用由后端说了算，前端不再自己查）
  if (submitRegisterBtn) {
    const regBtnIdleText = submitRegisterBtn.innerText;
    submitRegisterBtn.addEventListener('click', async () => {
      const username = (regUsernameInput.value || '').trim();
      const email = (regEmailInput.value || '').trim();
      const verifyCode = (regVerifyCodeInput.value || '').trim();
      const password = (regPasswordInput.value || '').trim();
      const inviteCode = (regInviteCodeInput.value || '').trim();

      if (!username || !password) {
        regErrorMsg.innerText = '请填写用户名和密码';
        regErrorMsg.classList.remove('hidden');
        return;
      }
      if (!email) {
        regErrorMsg.innerText = '请填写邮箱';
        regErrorMsg.classList.remove('hidden');
        return;
      }
      if (!verifyCode) {
        regErrorMsg.innerText = '请填写邮箱验证码（点「获取验证码」发到邮箱）';
        regErrorMsg.classList.remove('hidden');
        return;
      }

      regErrorMsg.classList.add('hidden');
      submitRegisterBtn.disabled = true;
      submitRegisterBtn.innerText = '注册中...';

      try {
        const data = await authCall('POST', '/auth/register', {
          username,
          password,
          email,
          code: verifyCode,
          invite_code: inviteCode
        });
        setCurrentUser({
          username: data.user.username,
          email: data.user.email,
          role: roleFromBackend(data.user.role)
        }, data.token);
        authModalOverlay.classList.remove('active');
        showToast(`🎉 欢迎来到深海，创作者 ${data.user.username}！`);
        await loadFavorites();
      } catch (err) {
        // 后端返回的原话（如「该用户名已被注册，换一个吧」）直接显示，
        // 前端不再自己维护一份用户名名单
        regErrorMsg.innerText = err.message || '注册失败，请稍后再试';
        regErrorMsg.classList.remove('hidden');
      } finally {
        submitRegisterBtn.disabled = false;
        submitRegisterBtn.innerText = regBtnIdleText;
      }
    });
  }

  // 登录提交（用户名或邮箱都能登，口令校验在后端，前端不存任何口令）
  if (submitLoginBtn) {
    const loginBtnIdleText = submitLoginBtn.innerText;
    submitLoginBtn.addEventListener('click', async () => {
      const identity = (loginUsernameInput.value || '').trim();
      const password = (loginPasswordInput.value || '').trim();

      if (!identity || !password) {
        loginErrorMsg.innerText = '请输入账号和密码';
        loginErrorMsg.classList.remove('hidden');
        return;
      }

      loginErrorMsg.classList.add('hidden');
      submitLoginBtn.disabled = true;
      submitLoginBtn.innerText = '登录中...';

      try {
        const data = await authCall('POST', '/auth/login', { identity, password });
        setCurrentUser({
          username: data.user.username,
          email: data.user.email,
          role: roleFromBackend(data.user.role)
        }, data.token);
        authModalOverlay.classList.remove('active');
        showToast(`✨ 欢迎回来，${data.user.username}！`);
        await loadFavorites();
      } catch (err) {
        loginErrorMsg.innerText = err.message || '登录失败，请稍后再试';
        loginErrorMsg.classList.remove('hidden');
      } finally {
        submitLoginBtn.disabled = false;
        submitLoginBtn.innerText = loginBtnIdleText;
      }
    });
  }

  // 退出登录（通知后端作废令牌，换台设备也登不进去）
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (getToken()) {
        try {
          await authCall('POST', '/auth/logout');
        } catch {
          /* 后端已经不可达也要把本地状态清干净 */
        }
      }
      setToken('');
      setCurrentUser(null);
      favoriteIds = new Set(getGuestFavorites());
      renderFavorites();
      showToast('已退出登录状态');
    });
  }

  // 初始化认证状态
  renderAuthUI();
  initDetailFavButton();
  restoreSession();

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

  // ── PullCord 复古天花板拉绳组件初始化 ──
  if (window.PullCord) {
    new window.PullCord({
      top: '0px',
      right: '24px',
      zIndex: 85,
      onPull: () => {
        // 轮播切换到下一个主题
        const currentIdx = CHATFLOW_THEMES.findIndex(t => t.id === currentThemeId);
        const nextIdx = (currentIdx + 1) % CHATFLOW_THEMES.length;
        const nextTheme = CHATFLOW_THEMES[nextIdx];

        currentThemeId = nextTheme.id;
        localStorage.setItem('cf_theme_id', nextTheme.id);
        applyChatflowThemeDOM();

        // 提示与微光反馈
        if (typeof showToast === 'function') {
          showToast(`🪼 拉绳切换：已切至「${nextTheme.name}」色调`);
        }
      }
    });
  }


  // ── 水母玩法说明弹窗 ──
  const jellyGuideBtn = document.getElementById('jellyGuideBtn');
  const jellyGuideOverlay = document.getElementById('jellyGuideOverlay');
  const jellyGuideCloseBtn = document.getElementById('jellyGuideCloseBtn');

  if (jellyGuideBtn && jellyGuideOverlay) {
    jellyGuideBtn.addEventListener('click', () => {
      // 说明盖在外观设置之上，关闭后回到外观设置，而不是直接关掉整个设置面板
      jellyGuideOverlay.classList.add('active');
    });
  }

  if (jellyGuideCloseBtn && jellyGuideOverlay) {
    jellyGuideCloseBtn.addEventListener('click', () => {
      jellyGuideOverlay.classList.remove('active');
    });
  }

  if (jellyGuideOverlay) {
    jellyGuideOverlay.addEventListener('click', (e) => {
      if (e.target === jellyGuideOverlay) {
        jellyGuideOverlay.classList.remove('active');
      }
    });
  }

  // 首屏就应用主题（之前被注释掉，导致 data-theme/data-mode 从未设置，所有人都吃深色兜底）
  applyChatflowThemeDOM();
}
