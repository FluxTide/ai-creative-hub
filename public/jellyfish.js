// ==========================================
// 陪伴水母 Canvas 2D 物理动力学与喂食系统 V2.0
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

  // 鼠标追踪与长按计时
  const mouse = {
    x: -1000,
    y: -1000,
    isDown: false,
    downStartTime: 0,
    downX: -1000,
    downY: -1000
  };

  // 食物列表
  const foods = [];

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mousedown', e => {
    mouse.isDown = true;
    mouse.downStartTime = performance.now();
    mouse.downX = e.clientX;
    mouse.downY = e.clientY;
  });

  window.addEventListener('mouseup', e => {
    const pressDuration = performance.now() - mouse.downStartTime;
    mouse.isDown = false;

    // 如果是轻触/单次点击（不是长按转圈），在点击位置投喂 1~2 颗水母小鱼粮/浮游食物！
    if (pressDuration < 280) {
      spawnFood(e.clientX, e.clientY);
      spawnBubbles(e.clientX, e.clientY, 4);
    }
  });

  // 投喂食物（漂浮的小金粒/星光水母粮）
  function spawnFood(x, y) {
    if (foods.length >= 25) foods.shift(); // 最多同时存在 25 颗
    foods.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vy: 0.15 + Math.random() * 0.25, // 缓缓下沉
      vx: (Math.random() - 0.5) * 0.3,
      radius: 4.5 + Math.random() * 2,
      life: 1.0,
      sparkle: Math.random() * Math.PI * 2
    });
  }

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
    const alpha = mode === 'dark' ? 0.8 : 0.6;
    return { ...c, alpha };
  }

  // 气泡粒子系统
  const bubbles = [];
  function spawnBubbles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        radius: 1.5 + Math.random() * 2.8,
        vy: -0.6 - Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        alpha: 0.4 + Math.random() * 0.4,
        life: 1.0
      });
    }
  }

  // ==========================================
  // 水母实体类
  // ==========================================
  class Jellyfish {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.baseRadius = 18 + Math.random() * 14; // 基础半径
      this.growth = 0; // 进食生长增量
      this.maxGrowth = 22; // 最大长大上限

      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 50;

      this.vx = 0;
      this.vy = -(0.2 + Math.random() * 0.3);
      this.angle = -Math.PI / 2; // 默认朝上游动
      this.targetAngle = -Math.PI / 2;
      this.orbitAngle = Math.random() * Math.PI * 2; // 绕鼠标转圈相位

      // 脉动心跳参数
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.024 + Math.random() * 0.012; // 缓慢温和
      this.squish = 1;
      this.isContracting = false;

      // 触手系统（柔性连杆）
      this.tentacleCount = 4 + Math.floor(Math.random() * 3); // 4~6条
      this.tentacles = [];
      const segmentCount = 9;

      for (let i = 0; i < this.tentacleCount; i++) {
        const segs = [];
        for (let j = 0; j < segmentCount; j++) {
          segs.push({
            x: this.x,
            y: this.y + j * 5,
            vx: 0,
            vy: 0
          });
        }
        this.tentacles.push(segs);
      }
    }

    get radius() {
      return this.baseRadius + this.growth;
    }

    eat(food) {
      if (this.growth < this.maxGrowth) {
        this.growth += 1.8; // 每次吃一颗长大一点点！
      }
      spawnBubbles(food.x, food.y, 4);
    }

    update() {
      // 1. 脉动心跳推进
      this.pulsePhase += this.pulseSpeed;
      const pulseCycle = (Math.sin(this.pulsePhase) + 1) / 2; // 0~1

      // 当收缩喷射时，赋予温和的前进推力
      if (pulseCycle > 0.85 && !this.isContracting) {
        this.isContracting = true;
        const thrust = 0.8 + Math.random() * 0.4;
        this.vx += Math.cos(this.angle) * thrust;
        this.vy += Math.sin(this.angle) * thrust;

        if (Math.random() < 0.2) {
          spawnBubbles(this.x, this.y, 1);
        }
      } else if (pulseCycle <= 0.85) {
        this.isContracting = false;
      }

      // 阻力（流体阻尼）与自然浮力
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.vy -= 0.01;

      // 2. 目标导向行为逻辑（优先级：吃食物 > 绕长按鼠标转圈 > 避障/巡航）
      let hasTarget = false;

      // 检查是否有附近的食物（寻食行为）
      if (foods.length > 0) {
        let nearestFood = null;
        let minDist = 450;

        for (let i = 0; i < foods.length; i++) {
          const f = foods[i];
          const fdx = f.x - this.x;
          const fdy = f.y - this.y;
          const dist = Math.sqrt(fdx * fdx + fdy * fdy);

          // 碰撞检测：吃到食物！
          if (dist < this.radius * 0.9) {
            this.eat(f);
            foods.splice(i, 1);
            break;
          }

          if (dist < minDist) {
            minDist = dist;
            nearestFood = f;
          }
        }

        if (nearestFood) {
          hasTarget = true;
          const foodAngle = Math.atan2(nearestFood.y - this.y, nearestFood.x - this.x);
          this.targetAngle = foodAngle;
          // 慢慢游向食物
          this.vx += Math.cos(foodAngle) * 0.18;
          this.vy += Math.sin(foodAngle) * 0.18;
        }
      }

      // 检查鼠标长按：慢慢游过来并绕着鼠标转圈！
      if (!hasTarget && mouse.isDown) {
        const mdx = mouse.x - this.x;
        const mdy = mouse.y - this.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        hasTarget = true;
        const targetRadius = 60 + (this.pulsePhase % 30); // 环绕半径

        if (mDist > targetRadius + 20) {
          // 较远时：慢慢游向鼠标周围
          const seekAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
          this.targetAngle = seekAngle;
          this.vx += Math.cos(seekAngle) * 0.22;
          this.vy += Math.sin(seekAngle) * 0.22;
        } else {
          // 靠近后：绕着鼠标长按位置优雅转圈！
          this.orbitAngle += 0.035;
          const orbitTargetX = mouse.x + Math.cos(this.orbitAngle) * targetRadius;
          const orbitTargetY = mouse.y + Math.sin(this.orbitAngle) * targetRadius;

          const toOrbitAngle = Math.atan2(orbitTargetY - this.y, orbitTargetX - this.x);
          this.targetAngle = toOrbitAngle;
          this.vx += Math.cos(toOrbitAngle) * 0.2;
          this.vy += Math.sin(toOrbitAngle) * 0.2;
        }
      }

      // 默认慢速巡航
      if (!hasTarget) {
        this.targetAngle += (Math.random() - 0.5) * 0.04;
      }

      // 3. 角度平滑插值
      let angleDiff = this.targetAngle - this.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.angle += angleDiff * 0.05;

      // 4. 更新坐标
      this.x += this.vx;
      this.y += this.vy;

      // 屏幕边界循环
      if (this.x < -70) this.x = width + 70;
      if (this.x > width + 70) this.x = -70;
      if (this.y < -70) this.y = height + 70;
      if (this.y > height + 70) this.y = -70;

      // 5. 重点：伞帽底沿与触手的精密无缝衔接
      // 伞帽底部中心点
      const r = this.radius;
      const baseCenterDistance = r * 0.15;
      const bellBottomX = this.x - Math.cos(this.angle) * baseCenterDistance;
      const bellBottomY = this.y - Math.sin(this.angle) * baseCenterDistance;

      // 触手横向排列轴垂直于游动方向
      const perpAngle = this.angle + Math.PI / 2;

      this.tentacles.forEach((tentacle, tIdx) => {
        // 沿伞帽下沿弧线均布根部
        const spreadOffset = (tIdx - (this.tentacleCount - 1) / 2) * (r * 0.38);
        const rootX = bellBottomX + Math.cos(perpAngle) * spreadOffset;
        const rootY = bellBottomY + Math.sin(perpAngle) * spreadOffset;

        // 根部 100% 锁死在伞帽底边缘，消除缝隙！
        tentacle[0].x = rootX;
        tentacle[0].y = rootY;

        // 柔性触手物理摆动（摆线物理模拟，自然柔美）
        const segDist = (r * 0.32);
        for (let j = 1; j < tentacle.length; j++) {
          const seg = tentacle[j];
          const prev = tentacle[j - 1];

          // 弹性阻尼向后拉动
          const dx = seg.x - prev.x;
          const dy = seg.y - prev.y;
          const curDist = Math.sqrt(dx * dx + dy * dy) || 1;
          const stretch = (curDist - segDist) / curDist;

          // 柔韧回弹
          seg.x -= dx * stretch * 0.45;
          seg.y -= dy * stretch * 0.45;

          // 随游动方向的流体阻力与波浪摆动
          const wave = Math.sin(this.pulsePhase * 1.5 + j * 0.4 + tIdx) * (0.4 + j * 0.15);
          seg.x += Math.cos(perpAngle) * wave - (this.vx * 0.55);
          seg.y += Math.sin(perpAngle) * wave - (this.vy * 0.55) + 0.12; // 柔和下垂感

          // 保持跟随父节
          seg.x += (prev.x - seg.x) * 0.22;
          seg.y += (prev.y - seg.y) * 0.22;
        }
      });
    }

    draw(themeColor) {
      const pulseCycle = (Math.sin(this.pulsePhase) + 1) / 2;
      const squishX = 0.88 + (1 - pulseCycle) * 0.22; // 0.88 ~ 1.1
      const squishY = 1.15 - (1 - pulseCycle) * 0.28; // 0.87 ~ 1.15
      const r = this.radius;

      ctx.save();

      // 1. 绘制柔性触手（平滑三次贝塞尔曲线）
      this.tentacles.forEach((tentacle, tIdx) => {
        ctx.beginPath();
        ctx.moveTo(tentacle[0].x, tentacle[0].y);

        for (let j = 1; j < tentacle.length - 1; j++) {
          const xc = (tentacle[j].x + tentacle[j + 1].x) / 2;
          const yc = (tentacle[j].y + tentacle[j + 1].y) / 2;
          ctx.quadraticCurveTo(tentacle[j].x, tentacle[j].y, xc, yc);
        }

        const last = tentacle[tentacle.length - 1];
        ctx.lineTo(last.x, last.y);

        // 渐变触手（从根部浓郁到尾尖透明消散）
        const tentacleAlpha = (themeColor.alpha * (tIdx % 2 === 0 ? 0.6 : 0.45));
        ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${tentacleAlpha})`;
        ctx.lineWidth = Math.max(0.8, (r * 0.065));
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // 2. 绘制水母伞帽（贝塞尔流线）
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);

      const w = r * squishX;
      const h = r * squishY * 1.05;

      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.bezierCurveTo(-w * 1.05, -h * 1.35, w * 1.05, -h * 1.35, w, 0);
      // 底沿波浪闭合
      ctx.bezierCurveTo(w * 0.5, h * 0.15, -w * 0.5, h * 0.15, -w, 0);
      ctx.closePath();

      // 伞帽渐变填充（温润透亮果冻质感）
      const grad = ctx.createRadialGradient(0, -h * 0.4, 1, 0, -h * 0.2, w * 1.1);
      grad.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.85})`);
      grad.addColorStop(0.5, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.45})`);
      grad.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.alpha * 0.2})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // 高光微光轮廓
      ctx.strokeStyle = `rgba(255, 255, 255, ${themeColor.alpha * 0.75})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 内部半透明发光核心（心脏）
      ctx.beginPath();
      ctx.arc(0, -h * 0.35, r * 0.26 * squishX, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${themeColor.alpha * 0.7})`;
      ctx.fill();

      ctx.restore();
    }
  }

  // ==========================================
  // 水母集群与食物管理
  // ==========================================
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

    const countDisplay = document.getElementById('jellyfishCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `${currentCount} 只`;
    }
  }

  setJellyfishCount(currentCount);

  // 主渲染循环
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const themeColor = getThemeColor();

    // 1. 绘制食物（投喂小金豆粒子）
    for (let i = foods.length - 1; i >= 0; i--) {
      const f = foods[i];
      f.y += f.vy;
      f.x += f.vx;
      f.sparkle += 0.08;

      // 闪烁微光食物粒子
      const glow = (Math.sin(f.sparkle) + 1) / 2 * 0.4 + 0.6;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 100, ${glow * 0.9})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${glow})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 食物触底或过慢消散
      if (f.y > height + 20) {
        foods.splice(i, 1);
      }
    }

    // 2. 绘制水母
    jellyfishes.forEach(j => {
      j.update();
      j.draw(themeColor);
    });

    // 3. 绘制升腾小气泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life -= 0.012;

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * b.life})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${b.alpha * b.life * 0.7})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (b.life <= 0) {
        bubbles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // 绑定外观设置弹窗控制按钮
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

  window.setJellyfishCount = setJellyfishCount;
})();
