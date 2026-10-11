// ============================================================================
// 🪼 水母娱乐系统 V2.0：深海电子宠物生态引擎
// 基于 CodeX 规范设计：三阶进化形态、绝对坐标全长页漫游、三段柔性触角与丝绸口腕
// ============================================================================
(function() {
  const canvas = document.getElementById('jellyfishCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // 1. 全长页绝对坐标尺寸管理
  let pageW = (canvas.width = window.innerWidth);
  let pageH = (canvas.height = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight
  ));

  function updateCanvasDimensions() {
    pageW = canvas.width = window.innerWidth;
    pageH = canvas.height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );
  }

  window.addEventListener('resize', updateCanvasDimensions);
  window.addEventListener('load', updateCanvasDimensions);

  // 页面动态变化监听
  const resizeObserver = new ResizeObserver(() => {
    updateCanvasDimensions();
  });
  if (document.body) {
    resizeObserver.observe(document.body);
  }

  // 2. 鼠标长按与点击（支持页面滚动偏移）
  const mouse = {
    x: -2000,
    y: -2000,
    isDown: false,
    downStartTime: 0,
    downX: -2000,
    downY: -2000
  };

  // 3. 浮游食物系统
  const foods = [];
  function spawnFood(px, py) {
    if (foods.length > 10) foods.shift();
    foods.push({
      x: px,
      y: py,
      vy: 0.12 + Math.random() * 0.18,
      vx: (Math.random() - 0.5) * 0.2,
      radius: 4.5,
      glowPhase: Math.random() * Math.PI * 2,
      life: 1.0,
      decay: 0.0006
    });
  }

  // 4. 浮游与受惊气泡系统
  const bubbles = [];
  function spawnBubble(px, py, count = 1, isScared = false) {
    for (let i = 0; i < count; i++) {
      if (bubbles.length > 50) bubbles.shift();
      bubbles.push({
        x: px + (Math.random() - 0.5) * 12,
        y: py + (Math.random() - 0.5) * 12,
        r: isScared ? 1.5 + Math.random() * 2.8 : 1.0 + Math.random() * 2.0,
        vy: -(0.5 + Math.random() * (isScared ? 1.8 : 0.9)),
        vx: (Math.random() - 0.5) * (isScared ? 1.2 : 0.5),
        alpha: isScared ? 0.75 : 0.5
      });
    }
  }

  // 5. 主题颜色取色器（完美适配现有 7 套主题）
  function getThemeColor() {
    const theme = document.documentElement.getAttribute('data-theme') || 'cloud-dancer';
    const mode = document.documentElement.getAttribute('data-mode') || 'light';
    const isDark = (mode === 'dark') || (mode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const themeColors = {
      'cloud-dancer': isDark ? { r: 160, g: 195, b: 240, alpha: 0.85 } : { r: 100, g: 155, b: 225, alpha: 0.8 },
      'blossom-dream': isDark ? { r: 235, g: 160, b: 205, alpha: 0.85 } : { r: 210, g: 130, b: 180, alpha: 0.8 },
      'corundum-blue': isDark ? { r: 140, g: 190, b: 255, alpha: 0.85 } : { r: 70, g: 135, b: 230, alpha: 0.8 },
      'kiwi-green': isDark ? { r: 160, g: 225, b: 175, alpha: 0.85 } : { r: 90, g: 195, b: 120, alpha: 0.8 },
      'spicy-red': isDark ? { r: 255, g: 155, b: 155, alpha: 0.85 } : { r: 225, g: 95, b: 95, alpha: 0.8 },
      'teal-water': isDark ? { r: 140, g: 225, b: 225, alpha: 0.85 } : { r: 60, g: 185, b: 185, alpha: 0.8 },
      'geist': isDark ? { r: 220, g: 225, b: 235, alpha: 0.85 } : { r: 120, g: 130, b: 145, alpha: 0.8 }
    };

    return themeColors[theme] || themeColors['cloud-dancer'];
  }

  // ============================================================================
  // 6. 核心水母类 (Jellyfish Entity)
  // ============================================================================
  class Jellyfish {
    constructor(x, y) {
      this.x = x;
      this.y = y;

      // 进食与进化体系
      this.feedCount = 0; // 累计进食次数
      this.stage = 'baby'; // 'baby' | 'teen' | 'elder'

      // 物理与运动属性
      this.baseRadius = 15 + Math.random() * 2.5; // 幼年体基准 14-18px
      this.radius = this.baseRadius;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(0.2 + Math.random() * 0.3);
      this.angle = -Math.PI / 2; // 默认朝上游动
      this.targetAngle = this.angle;

      // 脉动周期 (0~1)
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.038; // 幼年体最快，随阶段变慢

      // 受惊与进食散开计时器
      this.scaredTimer = 0;
      this.scaredAngle = 0;
      this.dispersalTimer = 0;
      this.dispersalAngle = 0;

      // 初始化骨骼与触手
      this.tentacles = [];
      this.oralArms = [];
      this.initAppendages();
    }

    // 根据当前 feedCount 更新成长阶段与形态参数
    updateStageParams() {
      if (this.feedCount >= 4) {
        this.stage = 'elder';
        this.baseRadius = 29 + Math.min(4, (this.feedCount - 4) * 0.8); // 28-34px
        this.pulseSpeed = 0.020;
      } else if (this.feedCount >= 2) {
        this.stage = 'teen';
        this.baseRadius = 21 + (this.feedCount - 2) * 2.0; // 20-24px
        this.pulseSpeed = 0.028;
      } else {
        this.stage = 'baby';
        this.baseRadius = 15 + this.feedCount * 1.5; // 14-18px
        this.pulseSpeed = 0.038;
      }
      this.radius = this.baseRadius;
    }

    // 初始化/更新触手与口腕骨骼节点
    initAppendages() {
      this.updateStageParams();

      const tentacleCount = this.stage === 'baby' ? 4 : (this.stage === 'teen' ? 6 : 7);
      const segCount = this.stage === 'baby' ? 6 : (this.stage === 'teen' ? 7 : 8);

      this.tentacles = [];
      for (let i = 0; i < tentacleCount; i++) {
        const segs = [];
        for (let j = 0; j < segCount; j++) {
          segs.push({
            x: this.x,
            y: this.y + j * 5,
            vx: 0,
            vy: 0
          });
        }
        this.tentacles.push({
          segments: segs,
          phaseOffset: i * 0.95 + Math.random() * 0.4,
          freqMult: 0.9 + Math.random() * 0.25
        });
      }

      // 口腕（完全体专属：2条中央丝带）
      this.oralArms = [];
      if (this.stage === 'elder') {
        for (let i = 0; i < 2; i++) {
          const armSegs = [];
          for (let j = 0; j < 8; j++) {
            armSegs.push({
              x: this.x,
              y: this.y + j * 6,
              vx: 0,
              vy: 0
            });
          }
          this.oralArms.push({
            segments: armSegs,
            phaseOffset: i * Math.PI + Math.random() * 0.5
          });
        }
      }
    }

    // 每一帧更新状态与物理
    update(allJellies) {
      this.updateStageParams();

      // 1. 脉动周期与推水爆发 (Thrust vs Glide)
      this.pulsePhase += this.pulseSpeed;
      const pulseCycle = (Math.sin(this.pulsePhase) + 1) / 2;

      // 处于收缩喷射的瞬间 (峰值爆发点)
      const isContracting = Math.cos(this.pulsePhase) > 0.88;
      let thrustScale = this.stage === 'baby' ? 0.45 : (this.stage === 'teen' ? 0.36 : 0.28);

      if (isContracting) {
        const pushThrust = thrustScale * (0.75 + Math.random() * 0.25);
        this.vx += Math.cos(this.angle) * pushThrust;
        this.vy += Math.sin(this.angle) * pushThrust;

        // 伴随微小气泡喷出
        if (Math.random() < 0.25) {
          spawnBubble(this.x - Math.cos(this.angle) * this.radius, this.y - Math.sin(this.angle) * this.radius, 1, false);
        }
      }

      // 2. 行为 AI 状态机 (优先级：抢食散开 > 受惊逃跑 > 寻找食物 > 鼠标长按 > 自由巡航)
      const foodPerceptionRadius = this.stage === 'baby' ? 300 : (this.stage === 'teen' ? 500 : 700);

      if (this.dispersalTimer > 0) {
        // A. 抢食吞食完毕：即刻反向散开，绝不原地重叠
        this.dispersalTimer--;
        this.targetAngle = this.dispersalAngle;
        this.vx += Math.cos(this.dispersalAngle) * 0.22;
        this.vy += Math.sin(this.dispersalAngle) * 0.22;
      } else if (this.scaredTimer > 0) {
        // B. 点触受惊：反向避让 150-200px
        this.scaredTimer--;
        this.targetAngle = this.scaredAngle;
        this.vx += Math.cos(this.scaredAngle) * 0.28;
        this.vy += Math.sin(this.scaredAngle) * 0.28;
        if (this.scaredTimer % 8 === 0) {
          spawnBubble(this.x, this.y, 2, true);
        }
      } else {
        // C. 食物感知雷达
        let nearestFood = null;
        let nearestDist = Infinity;

        for (let i = 0; i < foods.length; i++) {
          const f = foods[i];
          const dist = Math.hypot(f.x - this.x, f.y - this.y);
          if (dist < foodPerceptionRadius && dist < nearestDist) {
            nearestDist = dist;
            nearestFood = f;
          }
        }

        if (nearestFood) {
          // 朝食物加速逼近
          this.targetAngle = Math.atan2(nearestFood.y - this.y, nearestFood.x - this.x);
          const approachSpeed = (this.stage === 'baby' ? 0.16 : (this.stage === 'teen' ? 0.12 : 0.09));
          this.vx += Math.cos(this.targetAngle) * approachSpeed;
          this.vy += Math.sin(this.targetAngle) * approachSpeed;

          // 吞食判定
          if (nearestDist < this.radius * 1.25) {
            const fIdx = foods.indexOf(nearestFood);
            if (fIdx !== -1) {
              foods.splice(fIdx, 1);
              this.feedCount++;
              // 重新检查触手形态是否升级
              this.initAppendages();

              // 激发【抢食吞食散开冲量】
              this.dispersalTimer = 45;
              this.dispersalAngle = this.angle + Math.PI + (Math.random() - 0.5) * 0.8;
              spawnBubble(this.x, this.y, 4, true);
            }
          }
        } else if (mouse.isDown && mouse.x > 0) {
          // D. 鼠标长按：温柔伴游
          const mDist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
          if (mDist < 800) {
            this.targetAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            if (mDist > this.radius * 2.2) {
              this.vx += Math.cos(this.targetAngle) * 0.18;
              this.vy += Math.sin(this.targetAngle) * 0.18;
            } else {
              this.vx *= 0.88;
              this.vy *= 0.88;
            }
          }
        } else {
          // E. 自由从容巡航
          if (Math.random() < 0.015) {
            this.targetAngle += (Math.random() - 0.5) * 0.7;
          }
        }
      }

      // 3. 同伴排斥场 (Social Distance - 绝不挤压重叠)
      for (const other of allJellies) {
        if (other === this) continue;
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dist = Math.hypot(dx, dy);
        const minDist = (this.radius + other.radius) * 2.5;

        if (dist > 0 && dist < minDist) {
          const repelForce = (1 - dist / minDist) * 0.35;
          const repAngle = Math.atan2(dy, dx);
          this.vx += Math.cos(repAngle) * repelForce;
          this.vy += Math.sin(repAngle) * repelForce;
        }
      }

      // 4. 航向平滑转向 (Lerp)
      let diff = this.targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * (this.stage === 'baby' ? 0.09 : 0.05);

      // 阻尼衰减
      const drag = this.stage === 'baby' ? 0.88 : (this.stage === 'teen' ? 0.87 : 0.85);
      this.vx *= drag;
      this.vy *= drag;

      this.x += this.vx;
      this.y += this.vy;

      // 5. 网页绝对坐标柔性边界弹回（四向软边界，到底到底儿了彻底反向调头漫游，绝不反复顶墙蹭墙）
      const pad = this.radius * 2.5;

      // 左边界：被弹回后，彻底将目标航向锁死向右漫游（-60° ~ +60°）
      if (this.x < pad) {
        this.x = pad;
        this.vx = Math.abs(this.vx) * 0.8 + 0.35;
        this.targetAngle = (Math.random() - 0.5) * 1.2; // 明确朝右侧开阔水域游
        this.angle = this.targetAngle;
      } 
      // 右边界：被弹回后，彻底将目标航向锁死向左漫游（120° ~ 240°）
      else if (this.x > pageW - pad) {
        this.x = pageW - pad;
        this.vx = -Math.abs(this.vx) * 0.8 - 0.35;
        this.targetAngle = Math.PI + (Math.random() - 0.5) * 1.2; // 明确朝左侧开阔水域游
        this.angle = this.targetAngle;
      }

      // 顶边界：触顶弹回后，彻底将目标航向锁死向下漫游（30° ~ 150°）
      if (this.y < pad) {
        this.y = pad;
        this.vy = Math.abs(this.vy) * 0.8 + 0.4;
        this.targetAngle = Math.PI / 2 + (Math.random() - 0.5) * 1.0; // 明确朝下方深海游
        this.angle = this.targetAngle;
      } 
      // 底边界：触底到底儿了，彻底将目标航向锁死向上漫游（-150° ~ -30°）
      else if (this.y > pageH - pad) {
        this.y = pageH - pad;
        this.vy = -Math.abs(this.vy) * 0.8 - 0.45;
        this.targetAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.0; // 明确朝上方漫游回游
        this.angle = this.targetAngle;
      }

      // 6. 更新骨骼：触手与口腕
      this.updateSkeleton(pulseCycle);
    }

    // 骨骼与连杆物理运算 (Verlet 柔性节点)
    updateSkeleton(pulseCycle) {
      const r = this.radius;
      const tailDirX = -Math.cos(this.angle);
      const tailDirY = -Math.sin(this.angle);
      const perpAngle = this.angle + Math.PI / 2;
      const perpX = Math.cos(perpAngle);
      const perpY = Math.sin(perpAngle);

      // A. 更新普通触手
      const tCount = this.tentacles.length;
      this.tentacles.forEach((tObj, tIdx) => {
        const segs = tObj.segments;
        // 伞盖边缘扇形分布 (±42°)
        const normIdx = (tIdx - (tCount - 1) / 2);
        const spreadOffset = normIdx * (r * (0.84 / (tCount / 2)));
        const rootX = this.x - Math.cos(this.angle) * (r * 0.15) + perpX * spreadOffset;
        const rootY = this.y - Math.sin(this.angle) * (r * 0.15) + perpY * spreadOffset;

        segs[0].x = rootX;
        segs[0].y = rootY;

        const splayPower = Math.abs(normIdx) * 0.38;
        const segDist = r * 0.22;

        for (let j = 1; j < segs.length; j++) {
          const seg = segs[j];
          const prev = segs[j - 1];

          // 向外扇形导流
          const splayDecay = Math.max(0, 1 - j * 0.16);
          const outwardX = perpX * normIdx * splayPower * splayDecay * segDist * 0.65;
          const outwardY = perpY * normIdx * splayPower * splayDecay * segDist * 0.65;

          const targetX = prev.x + tailDirX * segDist + outwardX;
          const targetY = prev.y + tailDirY * segDist + outwardY;

          seg.x += (targetX - seg.x) * 0.22;
          seg.y += (targetY - seg.y) * 0.22;

          // 双重正弦柔性涟漪
          const wavePhase = this.pulsePhase * 1.8 + j * 0.75 + tObj.phaseOffset;
          const waveAmp = (0.4 + j * 0.14);
          seg.x += perpX * Math.sin(wavePhase) * waveAmp;
          seg.y += perpY * Math.sin(wavePhase) * waveAmp;
        }
      });

      // B. 更新口腕丝带 (完全体专属)
      if (this.stage === 'elder') {
        this.oralArms.forEach((armObj, aIdx) => {
          const armSegs = armObj.segments;
          const armOffset = (aIdx === 0 ? -1 : 1) * (r * 0.22);
          const rootX = this.x + perpX * armOffset;
          const rootY = this.y + perpY * armOffset;

          armSegs[0].x = rootX;
          armSegs[0].y = rootY;

          const armSegDist = r * 0.25;
          for (let j = 1; j < armSegs.length; j++) {
            const seg = armSegs[j];
            const prev = armSegs[j - 1];

            // 丝绸大 S 形摆荡
            const sWave = Math.sin(this.pulsePhase * 1.3 + j * 0.45 + armObj.phaseOffset) * (j * 0.85);
            const targetX = prev.x + tailDirX * armSegDist + perpX * sWave;
            const targetY = prev.y + tailDirY * armSegDist + perpY * sWave;

            seg.x += (targetX - seg.x) * 0.18;
            seg.y += (targetY - seg.y) * 0.18;
          }
        });
      }
    }

    // ========================================================================
    // 绘制管道：按 CodeX 规范分层渲染
    // 01·外伞流光 -> 02·后层口腕 -> 03·普通触手 -> 04·主伞盖与花边 -> 05·生殖腺与晶核
    // ========================================================================
    draw(themeColor) {
      const r = this.radius;
      const pulseCycle = (Math.sin(this.pulsePhase) + 1) / 2;
      const squishX = 0.88 + (1 - pulseCycle) * 0.22;
      const squishY = 1.15 - (1 - pulseCycle) * 0.28;

      ctx.save();

      // 1. 完全体：双层流光外伞发光层 (Outer Glow)
      if (this.stage === 'elder') {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        const glowR = r * 1.5;
        const radialGlow = ctx.createRadialGradient(0, -r * 0.3, r * 0.4, 0, -r * 0.3, glowR);
        radialGlow.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.22)`);
        radialGlow.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(0, -r * 0.3, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. 完全体：中央 2 条丝绸口腕长飘带 (Oral Arms)
      if (this.stage === 'elder') {
        this.oralArms.forEach((armObj, aIdx) => {
          const armSegs = armObj.segments;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(armSegs[0].x, armSegs[0].y);
          for (let j = 1; j < armSegs.length - 1; j++) {
            const xc = (armSegs[j].x + armSegs[j + 1].x) / 2;
            const yc = (armSegs[j].y + armSegs[j + 1].y) / 2;
            ctx.quadraticCurveTo(armSegs[j].x, armSegs[j].y, xc, yc);
          }
          const last = armSegs[armSegs.length - 1];
          ctx.lineTo(last.x, last.y);

          // 宽带状丝绸质感
          ctx.strokeStyle = `rgba(255, 235, 190, 0.42)`;
          ctx.lineWidth = Math.max(2.8, r * 0.16);
          ctx.lineCap = 'round';
          ctx.stroke();

          // 丝绸中央亮脊线
          ctx.strokeStyle = `rgba(255, 255, 255, 0.65)`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
          ctx.restore();
        });
      }

      // 3. 普通触手 (4 / 6 / 7 根)
      this.tentacles.forEach((tObj, tIdx) => {
        const segs = tObj.segments;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(segs[0].x, segs[0].y);
        for (let j = 1; j < segs.length - 1; j++) {
          const xc = (segs[j].x + segs[j + 1].x) / 2;
          const yc = (segs[j].y + segs[j + 1].y) / 2;
          ctx.quadraticCurveTo(segs[j].x, segs[j].y, xc, yc);
        }
        const last = segs[segs.length - 1];
        ctx.lineTo(last.x, last.y);

        const tAlpha = themeColor.alpha * (tIdx % 2 === 0 ? 0.75 : 0.55);
        ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${tAlpha})`;
        ctx.lineWidth = Math.max(0.9, r * 0.08);
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      });

      // 4. 伞盖主轮廓与边缘花边 (Bell & Ripple Rim)
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);

      const bw = r * squishX;
      const bh = r * squishY * 1.12;

      ctx.beginPath();
      ctx.moveTo(-bw, 0);
      // 上半球外伞拱形曲线 (高宽比 1.5~1.8)
      ctx.bezierCurveTo(-bw * 1.06, -bh * 1.38, bw * 1.06, -bh * 1.38, bw, 0);

      // 下边缘：按阶段生成波浪花边 (Ripple Hem)
      if (this.stage === 'baby') {
        // 幼年体：4~6个细小柔和褶皱
        const ripples = 5;
        const step = (bw * 2) / ripples;
        for (let i = ripples; i >= 0; i--) {
          const rx = -bw + i * step;
          const ry = Math.sin(i * Math.PI + this.pulsePhase * 1.5) * 1.5;
          if (i === ripples) ctx.lineTo(rx, ry);
          else ctx.quadraticCurveTo(rx + step / 2, ry + 2, rx, ry);
        }
      } else if (this.stage === 'teen') {
        // 成长体：8~10个波浪荷叶边 (Lotus Leaf Edge)
        const ripples = 8;
        const step = (bw * 2) / ripples;
        for (let i = ripples; i >= 0; i--) {
          const rx = -bw + i * step;
          const ry = Math.sin(i * Math.PI + this.pulsePhase * 2.0) * 3.2;
          if (i === ripples) ctx.lineTo(rx, ry);
          else ctx.quadraticCurveTo(rx + step / 2, ry + 4, rx, ry);
        }
      } else {
        // 完全体：12~14个层叠双重花边
        const ripples = 12;
        const step = (bw * 2) / ripples;
        for (let i = ripples; i >= 0; i--) {
          const rx = -bw + i * step;
          const ry = Math.sin(i * Math.PI + this.pulsePhase * 2.2) * 4.2;
          if (i === ripples) ctx.lineTo(rx, ry);
          else ctx.quadraticCurveTo(rx + step / 2, ry + 5, rx, ry);
        }
      }
      ctx.closePath();

      // 多层透明渐变果冻质感填充
      const bellGrad = ctx.createRadialGradient(0, -bh * 0.45, 1, 0, -bh * 0.2, bw * 1.18);
      if (this.stage === 'baby') {
        bellGrad.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.85)`);
        bellGrad.addColorStop(0.5, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.42)`);
        bellGrad.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.15)`);
      } else if (this.stage === 'teen') {
        bellGrad.addColorStop(0, `rgba(235, 175, 255, 0.90)`);
        bellGrad.addColorStop(0.5, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.50)`);
        bellGrad.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.18)`);
      } else {
        bellGrad.addColorStop(0, `rgba(255, 230, 170, 0.95)`);
        bellGrad.addColorStop(0.4, `rgba(240, 185, 255, 0.55)`);
        bellGrad.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.20)`);
      }
      ctx.fillStyle = bellGrad;
      ctx.fill();

      // 顶部边缘晶莹高光线
      ctx.strokeStyle = `rgba(255, 255, 255, 0.75)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 5. 内囊与生殖腺晶核 (Nucleus & Gonads)
      if (this.stage === 'baby') {
        // 幼年体：纯净小微光内囊
        ctx.beginPath();
        ctx.arc(0, -bh * 0.38, r * 0.28 * squishX, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      } else if (this.stage === 'teen') {
        // 成长体：四叶草生殖腺 (Four-Leaf Clover Gonads)
        const cloverR = r * 0.24 * squishX;
        const cDist = r * 0.22;
        ctx.fillStyle = 'rgba(255, 210, 245, 0.78)';
        for (let a = 0; a < 4; a++) {
          const ang = (a * Math.PI) / 2 + Math.PI / 4;
          const cx = Math.cos(ang) * cDist;
          const cy = -bh * 0.38 + Math.sin(ang) * cDist;
          ctx.beginPath();
          ctx.arc(cx, cy, cloverR, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // 完全体：花瓣晶体多层发光晶核 (Crystal Core Glow)
        const coreDist = r * 0.26;
        ctx.fillStyle = 'rgba(255, 245, 210, 0.88)';
        for (let a = 0; a < 4; a++) {
          const ang = (a * Math.PI) / 2;
          const cx = Math.cos(ang) * coreDist;
          const cy = -bh * 0.38 + Math.sin(ang) * coreDist;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.22 * squishX, 0, Math.PI * 2);
          ctx.fill();
        }

        // 中心高亮能量光点
        ctx.beginPath();
        ctx.arc(0, -bh * 0.38, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    }
  }

  // ============================================================================
  // 7. 水母集群管理与全局初始化
  // ============================================================================
  const jellyfishes = [];
  let currentCount = 4;

  try {
    const saved = localStorage.getItem('hub_jellyfish_count');
    if (saved !== null) {
      currentCount = Math.max(0, Math.min(15, parseInt(saved, 10) || 4));
    }
  } catch(e) {}

  // 初始化水母（出生在当前视口核心区域，随滚轮自然上下划走）
  function initJellyfishes() {
    jellyfishes.length = 0;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    for (let i = 0; i < currentCount; i++) {
      // 错开分布在当前屏幕 100px ~ 420px 之间，保证刷新出来一眼看到
      const spawnX = (pageW * 0.15) + (i / Math.max(1, currentCount - 1)) * (pageW * 0.70) + (Math.random() - 0.5) * 60;
      const spawnY = scrollY + 110 + (i * 75) + (Math.random() - 0.5) * 30;
      jellyfishes.push(new Jellyfish(spawnX, spawnY));
    }
  }

  initJellyfishes();

  // 数量步进器接口
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

    const countDisplay = document.getElementById('jellyfishCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `${newCount} 只`;
    }
  }

  // ============================================================================
  // 8. 全局用户交互监听 (点击受惊 / 投喂 / 长按)
  // ============================================================================
  window.addEventListener('mousedown', (e) => {
    // 忽略在弹窗或按钮上的点击
    if (e.target.closest('.chatflow-modal-overlay, button, input, a, .work-detail-view')) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    mouse.x = e.clientX;
    mouse.y = e.clientY + scrollY; // 映射至网页绝对坐标
    mouse.isDown = true;
    mouse.downStartTime = performance.now();
    mouse.downX = mouse.x;
    mouse.downY = mouse.y;
  });

  window.addEventListener('mousemove', (e) => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    mouse.x = e.clientX;
    mouse.y = e.clientY + scrollY;
  });

  window.addEventListener('mouseup', (e) => {
    if (!mouse.isDown) return;
    mouse.isDown = false;
    const pressDuration = performance.now() - mouse.downStartTime;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const upX = e.clientX;
    const upY = e.clientY + scrollY;

    // A. 判定是否精准点击在某只水母身上 -> 触发点触受惊 (Scared Flee)
    let clickedJelly = false;
    for (const j of jellyfishes) {
      const dist = Math.hypot(upX - j.x, upY - j.y);
      if (dist < j.radius * 2.0) {
        j.scaredTimer = 40; // 持续约 0.6s
        j.scaredAngle = Math.atan2(j.y - upY, j.x - upX);
        j.vx += Math.cos(j.scaredAngle) * 3.2;
        j.vy += Math.sin(j.scaredAngle) * 3.2;
        spawnBubble(j.x, j.y, 4, true);
        clickedJelly = true;
        break;
      }
    }

    // B. 若未点击在水母上且为短按 -> 投喂浮游食物
    if (!clickedJelly && pressDuration < 320) {
      if (!e.target.closest('.chatflow-modal-overlay, button, input, a, .work-detail-view, .work-card')) {
        spawnFood(upX, upY);
      }
    }
  });

  // 绑定外观设置中的步进器
  document.addEventListener('DOMContentLoaded', () => {
    const decBtn = document.getElementById('jellyfishDecBtn');
    const incBtn = document.getElementById('jellyfishIncBtn');
    const countDisplay = document.getElementById('jellyfishCountDisplay');

    if (countDisplay) {
      countDisplay.textContent = `${currentCount} 只`;
    }

    if (decBtn) {
      decBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setJellyfishCount(Math.max(0, jellyfishes.length - 1));
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setJellyfishCount(Math.min(15, jellyfishes.length + 1));
      });
    }
  });

  // ============================================================================
  // 9. 主动画循环 (Main Render Loop - 60 FPS)
  // ============================================================================
  function animate() {
    ctx.clearRect(0, 0, pageW, pageH);
    const themeColor = getThemeColor();

    // 1. 渲染气泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.alpha -= 0.008;

      if (b.alpha <= 0) {
        bubbles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.75})`;
      ctx.fill();
      ctx.restore();
    }

    // 2. 渲染食物粒（小金豆）
    for (let i = foods.length - 1; i >= 0; i--) {
      const f = foods[i];
      f.y += f.vy;
      f.x += f.vx;
      f.glowPhase += 0.05;
      f.life -= f.decay;

      if (f.life <= 0 || f.y > pageH) {
        foods.splice(i, 1);
        continue;
      }

      ctx.save();
      const glowScale = 1.0 + Math.sin(f.glowPhase) * 0.35;
      // 外光晕
      const fGlow = ctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, f.radius * 2.8 * glowScale);
      fGlow.addColorStop(0, 'rgba(255, 215, 120, 0.95)');
      fGlow.addColorStop(1, 'rgba(255, 180, 50, 0)');
      ctx.fillStyle = fGlow;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius * 2.8 * glowScale, 0, Math.PI * 2);
      ctx.fill();

      // 核心金粒
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = '#fff8e7';
      ctx.fill();
      ctx.restore();
    }

    // 3. 渲染所有水母实体
    for (const j of jellyfishes) {
      j.update(jellyfishes);
      j.draw(themeColor);
    }

    requestAnimationFrame(animate);
  }

  animate();

  // 暴露调试句柄
  window.jellyfishesRef = jellyfishes;
  window.foodsRef = foods;
  window.setJellyfishCount = setJellyfishCount;
})();
