// ==========================================
// 陪伴水母 Canvas 2D 物理动力学模拟引擎
// ==========================================
(function() {
  const canvas = document.getElementById('jellyfishCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 鼠标追踪
  const mouse = {
    x: -1000,
    y: -1000,
    isDown: false,
    lastClickX: -1000,
    lastClickY: -1000
  };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mousedown', e => {
    mouse.isDown = true;
    spawnBubbles(e.clientX, e.clientY, 5);
  });

  window.addEventListener('mouseup', () => {
    mouse.isDown = false;
  });

  // 获取当前主题色彩
  function getThemeColor() {
    const theme = document.documentElement.getAttribute('data-theme') || 'cloud-dancer';
    const mode = document.documentElement.getAttribute('data-mode') || 'light';

    const colors = {
      'cloud-dancer': { r: 212, g: 175, b: 122 }, // 暖米金
      'floral-dream': { r: 218, g: 140, b: 180 }, // 晨曦玫瑰粉
      'corundum-blue': { r: 90, g: 155, b: 245 }, // 科技克莱因蓝
      'kiwi-green': { r: 120, g: 195, b: 150 }, // 清新奇异果绿
      'spicy-red': { r: 235, g: 110, b: 110 }, // 肉桂暖红
      'teal-duck': { r: 80, g: 195, b: 195 }, // 莫兰迪水鸭绿
      'geist': { r: 180, g: 185, b: 195 } // 极简银白灰
    };

    const c = colors[theme] || colors['cloud-dancer'];
    const alpha = mode === 'dark' ? 0.65 : 0.45;
    return { ...c, alpha };
  }

  // 浮动小气泡粒子
  const bubbles = [];
  function spawnBubbles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -1 - Math.random() * 1.5,
        radius: 1.5 + Math.random() * 3,
        alpha: 0.6 + Math.random() * 0.3,
        life: 1
      });
    }
  }

  // 单只水母物理实体
  class Jellyfish {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : (Math.random() < 0.5 ? -40 : width + 40);
      this.y = Math.random() * height;
      this.radius = 16 + Math.random() * 16; // 16px ~ 32px 尺寸
      this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8; // 大致向上游
      this.targetAngle = this.angle;
      this.vx = 0;
      this.vy = 0;
      this.pulseTimer = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.035 + Math.random() * 0.02; // 心跳频率
      this.isContracting = false;
      this.fleeCooldown = 0;

      // 触手系统（4 ~ 6 根触手，每根 6 节）
      this.tentacleCount = 4 + Math.floor(Math.random() * 3);
      this.tentacles = [];
      for (let i = 0; i < this.tentacleCount; i++) {
        const segs = [];
        const segCount = 6;
        for (let j = 0; j < segCount; j++) {
          segs.push({ x: this.x, y: this.y + j * 6 });
        }
        this.tentacles.push(segs);
      }
    }

    update() {
      this.pulseTimer += this.pulseSpeed;
      const pulseCycle = Math.sin(this.pulseTimer);

      // 伞帽收缩推进动力学
      if (pulseCycle > 0.6 && !this.isContracting) {
        this.isContracting = true;
        // 向前推射
        const thrust = 1.6 + Math.random() * 0.8;
        this.vx += Math.cos(this.angle) * thrust;
        this.vy += Math.sin(this.angle) * thrust;

        // 偶发小气泡
        if (Math.random() < 0.25) {
          spawnBubbles(this.x, this.y, 2);
        }
      } else if (pulseCycle <= 0.6) {
        this.isContracting = false;
      }

      // 阻力（流体阻尼）
      this.vx *= 0.96;
      this.vy *= 0.96;
      // 微弱浮力向上
      this.vy -= 0.015;

      // 鼠标交互：惊吓逃跑
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        // 感知到光标，急促加速反向游开！
        const fleeAngle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
        this.targetAngle = fleeAngle;
        const fleeThrust = (1 - dist / 130) * 2.2;
        this.vx += Math.cos(fleeAngle) * fleeThrust;
        this.vy += Math.sin(fleeAngle) * fleeThrust;
      } else if (mouse.isDown && dist < 360) {
        // 长按鼠标，好奇靠近！
        const attractAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        this.targetAngle = attractAngle;
        this.vx += Math.cos(attractAngle) * 0.25;
        this.vy += Math.sin(attractAngle) * 0.25;
      } else {
        // 随机巡航微摆
        this.targetAngle += (Math.random() - 0.5) * 0.05;
      }

      // 转向平滑
      let angleDiff = this.targetAngle - this.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.angle += angleDiff * 0.06;

      // 位移更新
      this.x += this.vx;
      this.y += this.vy;

      // 边缘环绕 / 平滑回弹
      if (this.x < -60) this.x = width + 60;
      if (this.x > width + 60) this.x = -60;
      if (this.y < -60) this.y = height + 60;
      if (this.y > height + 60) this.y = -60;

      // 触手跟随滞后物理（Verlet / Spring 模拟）
      const bellBaseX = this.x - Math.cos(this.angle) * (this.radius * 0.3);
      const bellBaseY = this.y - Math.sin(this.angle) * (this.radius * 0.3);

      this.tentacles.forEach((tentacle, tIdx) => {
        const spread = (tIdx - (this.tentacleCount - 1) / 2) * (this.radius * 0.45);
        const normAngle = this.angle + Math.PI / 2;
        const rootX = bellBaseX + Math.cos(normAngle) * spread;
        const rootY = bellBaseY + Math.sin(normAngle) * spread;

        tentacle[0].x = rootX;
        tentacle[0].y = rootY;

        for (let j = 1; j < tentacle.length; j++) {
          const seg = tentacle[j];
          const prev = tentacle[j - 1];
          const segDx = seg.x - prev.x;
          const segDy = seg.y - prev.y;
          const targetDist = 7 + j * 1.5;

          const curDist = Math.sqrt(segDx * segDx + segDy * segDy) || 1;
          const factor = (targetDist - curDist) / curDist * 0.5;

          seg.x += segDx * factor;
          seg.y += segDy * factor + 0.35; // 稍微下沉重力

          // 拖尾延迟
          seg.x += (prev.x - seg.x) * 0.15;
          seg.y += (prev.y - seg.y) * 0.15;
        }
      });
    }

    draw(themeColor) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);

      const pulse = Math.sin(this.pulseTimer);
      // 收缩时，宽度收窄、高度拉长
      const squishX = 1 - pulse * 0.18;
      const squishY = 1 + pulse * 0.15;
      const r = this.radius;

      // 1. 绘制触手
      ctx.restore();
      ctx.save();
      this.tentacles.forEach(tentacle => {
        ctx.beginPath();
        ctx.moveTo(tentacle[0].x, tentacle[0].y);
        for (let j = 1; j < tentacle.length - 1; j++) {
          const xc = (tentacle[j].x + tentacle[j + 1].x) / 2;
          const yc = (tentacle[j].y + tentacle[j + 1].y) / 2;
          ctx.quadraticCurveTo(tentacle[j].x, tentacle[j].y, xc, yc);
        }
        ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      ctx.restore();

      // 2. 绘制水母伞帽（贝塞尔流线）
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);

      const w = r * squishX;
      const h = r * squishY * 1.1;

      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.bezierCurveTo(-w, -h * 1.3, w, -h * 1.3, w, 0);
      // 伞帽底沿波浪
      ctx.bezierCurveTo(w * 0.5, h * 0.2, 0, -h * 0.1, -w, 0);
      ctx.closePath();

      // 渐变填充（透明果冻光泽）
      const grad = ctx.createRadialGradient(0, -h * 0.4, 1, 0, -h * 0.2, w * 1.2);
      grad.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.85})`);
      grad.addColorStop(0.5, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.15})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // 伞帽高光边框
      ctx.strokeStyle = `rgba(255, 255, 255, ${themeColor.alpha * 0.7})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 内层微光心脏
      ctx.beginPath();
      ctx.arc(0, -h * 0.3, r * 0.28 * squishX, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${themeColor.alpha * 0.6})`;
      ctx.fill();

      ctx.restore();
    }
  }

  // 水母集群管理
  let jellyfishes = [];
  let currentCount = parseInt(localStorage.getItem('hub_jellyfish_count') || '5', 10);
  if (isNaN(currentCount)) currentCount = 5;

  function setJellyfishCount(targetCount) {
    targetCount = Math.max(0, Math.min(15, targetCount));
    currentCount = targetCount;
    localStorage.setItem('hub_jellyfish_count', currentCount);

    while (jellyfishes.length < currentCount) {
      jellyfishes.push(new Jellyfish());
    }
    while (jellyfishes.length > currentCount) {
      jellyfishes.pop();
    }

    // 更新弹窗中的计数器显示
    const countDisplay = document.getElementById('jellyfishCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `${currentCount} 只`;
    }
  }

  // 初始化水母群
  setJellyfishCount(currentCount);

  // 主循环
  function animate() {
    ctx.clearRect(0, 0, width, height);

    const themeColor = getThemeColor();

    // 绘制并更新水母
    jellyfishes.forEach(j => {
      j.update();
      j.draw(themeColor);
    });

    // 绘制并更新小气泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life -= 0.012;

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * b.life})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${b.alpha * b.life * 0.8})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (b.life <= 0) {
        bubbles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // 绑定弹窗控制按钮
  window.addEventListener('DOMContentLoaded', () => {
    const decBtn = document.getElementById('jellyfishDecBtn');
    const incBtn = document.getElementById('jellyfishIncBtn');
    const countDisplay = document.getElementById('jellyfishCountDisplay');

    if (countDisplay) {
      countDisplay.textContent = `${currentCount} 只`;
    }

    if (decBtn) {
      decBtn.addEventListener('click', e => {
        e.stopPropagation();
        setJellyfishCount(currentCount - 1);
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', e => {
        e.stopPropagation();
        setJellyfishCount(currentCount + 1);
      });
    }
  });

  // 对外暴露快速设置接口
  window.setJellyfishCount = setJellyfishCount;
})();
