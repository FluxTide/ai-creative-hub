// ==========================================
// 🪼 水母物理伴游引擎 V3.0 (全局网页空间漫游 + 生物级贝塞尔多节柔性动力学)
// ==========================================

(() => {
  const canvas = document.getElementById('jellyfishCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let currentCount = 4;
  try {
    const saved = localStorage.getItem('hub_jellyfish_count');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) currentCount = parsed;
    }
  } catch(e) {}

  let pageW = window.innerWidth;
  let pageH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

  function resizeCanvas() {
    pageW = window.innerWidth;
    pageH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = pageW * dpr;
    canvas.height = pageH * dpr;
    canvas.style.width = pageW + 'px';
    canvas.style.height = pageH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
  window.addEventListener('load', () => {
    resizeCanvas();
  });
  // DOM 内容加载和高度变化时同步调整
  const ro = new ResizeObserver(() => {
    const newH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
    if (Math.abs(newH - pageH) > 50) {
      resizeCanvas();
    }
  });
  ro.observe(document.body);
  resizeCanvas();

  // 鼠标在全局页面坐标系下的位置
  let mouse = { x: pageW / 2, y: 300, isDown: false, downStartTime: 0 };
  let foods = [];
  let bubbles = [];

  function getPageCoords(e) {
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    return {
      x: e.clientX + scrollX,
      y: e.clientY + scrollY
    };
  }

  window.addEventListener('mousemove', e => {
    const p = getPageCoords(e);
    mouse.x = p.x;
    mouse.y = p.y;
  });

  window.addEventListener('mousedown', e => {
    const p = getPageCoords(e);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.isDown = true;
    mouse.downStartTime = performance.now();
  });

  window.addEventListener('mouseup', e => {
    const p = getPageCoords(e);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.isDown = false;
    const pressDuration = performance.now() - mouse.downStartTime;

    // 短击逻辑
    if (pressDuration < 280) {
      // 检查是否点中了水母
      let hitJelly = false;
      for (const j of jellyfishes) {
        const dx = j.x - p.x;
        const dy = j.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < j.radius * 1.8) {
          hitJelly = true;
          j.triggerFlee(Math.atan2(dy, dx));
          spawnBubbles(j.x, j.y, 10);
        }
      }

      // 如果没点中水母，且不在可交互 UI 按钮/弹窗上，则投喂浮游小鱼粮
      if (!hitJelly) {
        const target = e.target;
        if (target && !target.closest('.modal-overlay, button, input, a, .work-card, .theme-card, .detail-action-link')) {
          spawnFood(p.x, p.y);
          spawnBubbles(p.x, p.y, 5);
        }
      }
    }
  });

  function spawnFood(x, y) {
    foods.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      vy: 0.15 + Math.random() * 0.25,
      vx: (Math.random() - 0.5) * 0.2,
      radius: 3.5,
      life: 900,
      maxLife: 900,
      glow: 0
    });
    if (foods.length > 25) foods.shift();
  }

  function spawnBubbles(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.5 + Math.random() * 0.9),
        radius: 1.2 + Math.random() * 2.2,
        alpha: 0.6 + Math.random() * 0.3,
        life: 40 + Math.random() * 30
      });
    }
  }

  function getThemeColor() {
    const theme = document.documentElement.getAttribute('data-theme') || 'cloud-dancer';
    const mode = document.documentElement.getAttribute('data-mode') || 'light';
    const isDark = (mode === 'dark');

    const themeMap = {
      'cloud-dancer': { r: 185, g: 165, b: 140 },
      'blossom-dream': { r: 215, g: 155, b: 175 },
      'corundum-blue': { r: 120, g: 165, b: 185 },
      'kiwi-green': { r: 145, g: 180, b: 130 },
      'spicy-red': { r: 215, g: 135, b: 125 },
      'teal-water': { r: 110, g: 180, b: 185 },
      'geist': { r: 160, g: 160, b: 165 }
    };

    const base = themeMap[theme] || themeMap['cloud-dancer'];
    return {
      r: base.r,
      g: base.g,
      b: base.b,
      alpha: isDark ? 0.85 : 0.65,
      glowAlpha: isDark ? 0.35 : 0.20
    };
  }

  // ==========================================
  // 单只水母实体类
  // ==========================================
  class Jellyfish {
    constructor(x, y) {
      this.x = x || Math.random() * pageW;
      this.y = y || Math.random() * pageH;
      this.baseRadius = 14 + Math.random() * 3.5;
      this.growth = 0;
      this.maxGrowth = 16;
      this.radius = this.baseRadius;

      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(0.3 + Math.random() * 0.4);
      this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      this.targetAngle = this.angle;

      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.038 + Math.random() * 0.015;

      this.scaredTimer = 0;
      this.scaredAngle = 0;

      // 触角参数
      this.tentacleCount = 5;
      this.tentacles = [];
      const baseLen = 42 + Math.random() * 12;

      for (let i = 0; i < this.tentacleCount; i++) {
        const offsetPercent = (i / (this.tentacleCount - 1) - 0.5) * 1.5;
        this.tentacles.push({
          offsetPercent: offsetPercent,
          length: baseLen * (0.85 + Math.random() * 0.3),
          phase: Math.random() * Math.PI * 2,
          frequency: 0.85 + Math.random() * 0.4,
          amplitude: 4.5 + Math.random() * 2.5,
          lag: 0.16 + (i * 0.02),
          flexibility: 0.75 + Math.random() * 0.2,
          damping: 0.88,
          // 控制点历史位置用于平滑延迟跟随 (Root, Mid, Tip)
          midX: this.x,
          midY: this.y,
          tipX: this.x,
          tipY: this.y,
          midVx: 0,
          midVy: 0,
          tipVx: 0,
          tipVy: 0
        });
      }
    }

    triggerFlee(fleeAngle) {
      this.scaredTimer = 45;
      this.scaredAngle = fleeAngle;
      const fleeForce = 2.4;
      this.vx = Math.cos(fleeAngle) * fleeForce;
      this.vy = Math.sin(fleeAngle) * fleeForce;
      this.targetAngle = fleeAngle;
    }

    update() {
      this.radius = this.baseRadius + this.growth;
      this.pulsePhase += this.pulseSpeed;

      const pulseCycle = (Math.sin(this.pulsePhase) + 1) / 2;
      const isContracting = pulseCycle > 0.82;

      // --- 行为决策系统 ---
      if (this.scaredTimer > 0) {
        // 1. 受惊避让状态
        this.scaredTimer--;
        this.targetAngle = this.scaredAngle;
        if (isContracting) {
          this.vx += Math.cos(this.scaredAngle) * 0.45;
          this.vy += Math.sin(this.scaredAngle) * 0.45;
        }
      } else {
        // 2. 觅食巡航 / 鼠标长按陪伴 / 自由漫游
        let nearestFood = null;
        let minDist = 480;
        for (let i = 0; i < foods.length; i++) {
          const f = foods[i];
          const d = Math.hypot(f.x - this.x, f.y - this.y);
          if (d < minDist) {
            minDist = d;
            nearestFood = { food: f, dist: d, index: i };
          }
        }

        if (nearestFood) {
          const fx = nearestFood.food.x;
          const fy = nearestFood.food.y;
          this.targetAngle = Math.atan2(fy - this.y, fx - this.x);

          if (isContracting) {
            const thrust = 1.35;
            this.vx += Math.cos(this.targetAngle) * thrust;
            this.vy += Math.sin(this.targetAngle) * thrust;
          }

          // 吃到食物判定
          if (nearestFood.dist < this.radius * 1.1) {
            foods.splice(nearestFood.index, 1);
            if (this.growth < this.maxGrowth) {
              this.growth += 1.8;
            }
            spawnBubbles(this.x, this.y, 8);
          }
        } else if (mouse.isDown) {
          // 鼠标长按伴游
          const mDist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
          if (mDist > 85) {
            this.targetAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            if (isContracting) {
              this.vx += Math.cos(this.targetAngle) * 0.95;
              this.vy += Math.sin(this.targetAngle) * 0.95;
            }
          } else {
            this.vx *= 0.88;
            this.vy *= 0.88;
          }
        } else {
          // 自由自然漫游：向上缓慢浮动
          if (Math.random() < 0.02) {
            this.targetAngle += (Math.random() - 0.5) * 0.6;
          }
          if (isContracting) {
            const pushThrust = 1.25 + Math.random() * 0.35;
            this.vx += Math.cos(this.targetAngle) * pushThrust;
            this.vy += Math.sin(this.targetAngle) * pushThrust;
          }
        }
      }

      // --- 水母个体间排斥力 (避免重叠，吃完分散) ---
      for (const other of jellyfishes) {
        if (other === this) continue;
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dist = Math.hypot(dx, dy);
        const minDist = (this.radius + other.radius) * 1.85;
        if (dist > 0 && dist < minDist) {
          const overlap = minDist - dist;
          const repelForce = (overlap / minDist) * 0.22;
          const repelAngle = Math.atan2(dy, dx);
          this.vx += Math.cos(repelAngle) * repelForce;
          this.vy += Math.sin(repelAngle) * repelForce;
        }
      }

      // 角度平滑旋转
      let angleDiff = this.targetAngle - this.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.angle += angleDiff * 0.06;

      // 流体阻尼与滑行
      this.vx *= 0.935;
      this.vy *= 0.935;
      this.x += this.vx;
      this.y += this.vy;

      // 页面边界柔和回弹 (布满整个垂直页面)
      const pad = this.radius * 2;
      if (this.x < pad) { this.x = pad; this.vx = Math.abs(this.vx) * 0.8; this.targetAngle = 0; }
      if (this.x > pageW - pad) { this.x = pageW - pad; this.vx = -Math.abs(this.vx) * 0.8; this.targetAngle = Math.PI; }
      if (this.y < pad) { this.y = pad; this.vy = Math.abs(this.vy) * 0.8; this.targetAngle = Math.PI / 2; }
      if (this.y > pageH - pad) { this.y = pageH - pad; this.vy = -Math.abs(this.vy) * 0.8; this.targetAngle = -Math.PI / 2; }

      // --- 触角多节点物理模拟 (Root -> Mid -> Tip 延迟与弯曲) ---
      const tailDirX = -Math.cos(this.angle);
      const tailDirY = -Math.sin(this.angle);
      const perpAngle = this.angle + Math.PI / 2;
      const perpX = Math.cos(perpAngle);
      const perpY = Math.sin(perpAngle);

      for (let i = 0; i < this.tentacles.length; i++) {
        const t = this.tentacles[i];
        // 1. 根部 Root 牢固锁定在伞盖下方弧面
        const rootOffset = t.offsetPercent * this.radius * 0.72;
        const rootX = this.x + perpX * rootOffset;
        const rootY = this.y + perpY * rootOffset;

        // 基础自然摆动波动量 (低频周期函数)
        const timeFactor = this.pulsePhase * t.frequency + t.phase;
        const naturalSway = Math.sin(timeFactor) * t.amplitude;

        // 速度拖拽偏移量 (主体反向)
        const dragX = -this.vx * 7.5;
        const dragY = -this.vy * 7.5;

        // 2. 中段 Body 目标位置 (半长位置 + 惯性弯曲)
        const targetMidX = rootX + tailDirX * (t.length * 0.48) + perpX * naturalSway + dragX * 0.4;
        const targetMidY = rootY + tailDirY * (t.length * 0.48) + perpY * naturalSway + dragY * 0.4;

        // 弹簧阻尼跟随
        t.midVx = (t.midVx + (targetMidX - t.midX) * 0.12) * t.damping;
        t.midVy = (t.midVy + (targetMidY - t.midY) * 0.12) * t.damping;
        t.midX += t.midVx;
        t.midY += t.midVy;

        // 3. 末端 Tip 目标位置 (全长位置 + 更大延迟 + 末端回摆)
        const tipSway = Math.sin(timeFactor + 0.8) * (t.amplitude * 1.85);
        const targetTipX = t.midX + tailDirX * (t.length * 0.55) + perpX * tipSway + dragX * 0.85;
        const targetTipY = t.midY + tailDirY * (t.length * 0.55) + perpY * tipSway + dragY * 0.85;

        t.tipVx = (t.tipVx + (targetTipX - t.tipX) * 0.08) * t.damping;
        t.tipVy = (t.tipVy + (targetTipY - t.tipY) * 0.08) * t.damping;
        t.tipX += t.tipVx;
        t.tipY += t.tipVy;
      }
    }

    draw(themeColor) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);

      const pulseCycle = (Math.sin(this.pulsePhase) + 1) / 2;
      const r = this.radius;
      // 脉冲收缩形变
      const squish = 1 - pulseCycle * 0.24;
      const stretch = 1 + pulseCycle * 0.20;

      // 1. 伞盖发光外晕
      const gradGlow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.8);
      gradGlow.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.glowAlpha * 1.2})`);
      gradGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradGlow;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 2. 伞盖主体 (半透明柔润莫兰迪玻璃体)
      ctx.beginPath();
      ctx.moveTo(-r * squish, 0);
      ctx.bezierCurveTo(
        -r * squish, -r * 1.45 * stretch,
        r * squish, -r * 1.45 * stretch,
        r * squish, 0
      );
      // 下边缘内凹弧线
      ctx.bezierCurveTo(
        r * 0.5 * squish, -r * 0.28,
        -r * 0.5 * squish, -r * 0.28,
        -r * squish, 0
      );
      ctx.closePath();

      const bellGrad = ctx.createLinearGradient(0, -r * 1.4 * stretch, 0, 0);
      bellGrad.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.95})`);
      bellGrad.addColorStop(0.65, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.65})`);
      bellGrad.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.25})`);
      ctx.fillStyle = bellGrad;
      ctx.fill();

      ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.9})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. 伞盖内核心发光体 (小水母的心脏)
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.55 * stretch, r * 0.35 * squish, r * 0.45 * stretch, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.55})`;
      ctx.fill();

      ctx.restore();

      // 4. 触角绘制 (在全局世界坐标系下使用二次贝塞尔平滑渲染，确保连贯自然)
      for (let i = 0; i < this.tentacles.length; i++) {
        const t = this.tentacles[i];
        const perpAngle = this.angle + Math.PI / 2;
        const perpX = Math.cos(perpAngle);
        const perpY = Math.sin(perpAngle);
        const rootOffset = t.offsetPercent * this.radius * 0.72;
        const rootX = this.x + perpX * rootOffset;
        const rootY = this.y + perpY * rootOffset;

        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        // 二次贝塞尔曲线：根部 -> 中段控制点 -> 末端
        ctx.quadraticCurveTo(t.midX, t.midY, t.tipX, t.tipY);

        const tentacleAlpha = (themeColor.alpha * (i % 2 === 0 ? 0.75 : 0.55));
        ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${tentacleAlpha})`;
        ctx.lineWidth = Math.max(1.0, (this.radius * 0.085));
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    }
  }

  // ==========================================
  // 水母集群管理
  // ==========================================
  let jellyfishes = [];

  function initJellyfishes(count) {
    jellyfishes = [];
    for (let i = 0; i < count; i++) {
      // 在整个页面垂直跨度内均匀随机初始化分布
      const rx = 80 + Math.random() * (pageW - 160);
      const ry = 120 + (i / Math.max(1, count)) * (pageH - 240) + (Math.random() - 0.5) * 200;
      jellyfishes.push(new Jellyfish(rx, Math.min(pageH - 120, Math.max(100, ry))));
    }
  }

  function setJellyfishCount(newCount) {
    newCount = Math.max(0, Math.min(15, newCount));
    currentCount = newCount;
    try {
      localStorage.setItem('hub_jellyfish_count', newCount.toString());
    } catch(e) {}

    while (jellyfishes.length < newCount) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const spawnY = scrollY + 100 + Math.random() * (window.innerHeight - 200);
      jellyfishes.push(new Jellyfish(Math.random() * pageW, spawnY));
    }
    while (jellyfishes.length > newCount) {
      jellyfishes.pop();
    }

    window.jellyfishesRef = jellyfishes;

    const countDisplay = document.getElementById('jellyfishCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `${newCount} 只`;
    }
  }

  initJellyfishes(currentCount);
  window.setJellyfishCount = setJellyfishCount;
  window.jellyfishesRef = jellyfishes;

  // 绑定外观设置面板中的步进按钮
  window.addEventListener('DOMContentLoaded', () => {
    const decBtn = document.getElementById('jellyfishDecBtn');
    const incBtn = document.getElementById('jellyfishIncBtn');
    const countDisplay = document.getElementById('jellyfishCountDisplay');

    if (countDisplay) {
      countDisplay.textContent = `${jellyfishes.length} 只`;
    }

    if (decBtn) {
      decBtn.addEventListener('click', e => {
        e.stopPropagation();
        setJellyfishCount(Math.max(0, jellyfishes.length - 1));
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', e => {
        e.stopPropagation();
        setJellyfishCount(Math.min(15, jellyfishes.length + 1));
      });
    }
  });

  // ==========================================
  // 主渲染循环
  // ==========================================
  function animate() {
    ctx.clearRect(0, 0, pageW, pageH);
    const themeColor = getThemeColor();

    // 1. 渲染小鱼粮食物
    for (let i = foods.length - 1; i >= 0; i--) {
      const f = foods[i];
      f.y += f.vy;
      f.x += f.vx;
      f.life--;

      if (f.life <= 0 || f.y > pageH) {
        foods.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 175, 75, ${Math.min(1, f.life / 60) * 0.9})`;
      ctx.shadowColor = 'rgba(245, 175, 75, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // 2. 渲染气泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;
      b.alpha *= 0.98;

      if (b.life <= 0 || b.y < 0) {
        bubbles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.7})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    }

    // 3. 渲染所有水母
    for (const j of jellyfishes) {
      j.update();
      j.draw(themeColor);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
