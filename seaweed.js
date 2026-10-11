// ==========================================
// 底部水草生态带 Canvas 2D 动画系统 V2.0 (全景莫兰迪深海生态版)
// 规范：水流1/4极轻柔，摆动3/4灵动，密度4/5丰富，五大物种+岩石微光+发光浮游气泡
// ==========================================
(function() {
  const SEAWEED_CONFIG = {
    flowIntensity: 1,  // 水流强度 1/4 (极轻柔，偏转幅度小)
    motionSpeed: 3,    // 摆动速度 3/4 (自然偏灵动节奏)
    density: 4,        // 密度 4/5 (横向丰富且留白)
    swayAmpDeg: 6.0,   // 摆幅 ±5° - 8°
    swayFreqHz: 0.65,  // 主频 0.65 Hz
    tipLagSeconds: 0.24 // 叶尖延迟 0.24s
  };

  let plants = [];
  let seabedY = 3200;
  let lastTime = performance.now();
  let seabedRocks = [];
  let bubbles = [];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function initSeabed(width, height) {
    seabedY = height;
    plants = [];
    seabedRocks = [];
    bubbles = [];

    // 密度 4/5：约每 42-55px 分布一株，形成丰富层次
    const count = Math.max(20, Math.floor(width / 46));
    const step = width / count;

    for (let i = 0; i < count; i++) {
      const x = i * step + rand(-10, 10);
      const rSpecies = Math.random();
      let species = 'kelp'; // 1. 海带叶
      let targetH = rand(150, 240);
      let leafCount = Math.floor(rand(3, 5));

      if (rSpecies < 0.35) {
        species = 'kelp'; // 海带叶：高大舒展，深景主力
        targetH = rand(160, 250);
        leafCount = Math.floor(rand(3, 5));
      } else if (rSpecies < 0.60) {
        species = 'fine'; // 细叶草：轻柔层叠，修长
        targetH = rand(110, 180);
        leafCount = Math.floor(rand(4, 7));
      } else if (rSpecies < 0.78) {
        species = 'coral'; // 珊瑚草：分枝结构，丰富细节
        targetH = rand(85, 145);
        leafCount = Math.floor(rand(4, 6));
      } else if (rSpecies < 0.90) {
        species = 'spiral'; // 螺旋叶：曲线盘旋律动
        targetH = rand(100, 165);
        leafCount = Math.floor(rand(2, 4));
      } else {
        species = 'cluster'; // 海葵草：低矮丛生，点缀前景
        targetH = rand(35, 75);
        leafCount = Math.floor(rand(4, 7));
      }

      const layer = Math.random() < 0.35 ? 'back' : (Math.random() < 0.65 ? 'mid' : 'front');

      const leaves = [];
      for (let l = 0; l < leafCount; l++) {
        leaves.push({
          relH: rand(0.68, 1.05),
          relW: rand(0.8, 1.25),
          offsetPhase: rand(0, Math.PI * 2),
          angle: 0,
          targetAngle: 0,
          bendSign: (l % 2 === 0 ? 1 : -1) * (0.5 + Math.random() * 0.9)
        });
      }

      plants.push({
        x: x,
        baseY: seabedY + rand(-3, 6),
        height: targetH,
        baseWidth: rand(8, 15),
        species: species,
        layer: layer,
        phase: rand(0, Math.PI * 2),
        freq: SEAWEED_CONFIG.swayFreqHz + rand(-0.12, 0.16),
        amp: (SEAWEED_CONFIG.swayAmpDeg + rand(-1.0, 1.5)) * Math.PI / 180,
        leaves: leaves,
        interactAngle: 0,
        interactDecay: 0,
        coolDown: 0
      });
    }

    // 海底基石群 (海床暗礁生态)
    const rockCount = Math.floor(width / 110);
    for (let r = 0; r < rockCount; r++) {
      seabedRocks.push({
        x: r * 110 + rand(5, 75),
        y: seabedY + rand(0, 10),
        w: rand(45, 90),
        h: rand(16, 32),
        layer: Math.random() < 0.5 ? 'back' : 'mid'
      });
    }

    // 浮游微发光气泡 (22个)
    for (let b = 0; b < 22; b++) {
      bubbles.push({
        x: rand(0, width),
        y: seabedY - rand(10, 360),
        r: rand(1.4, 3.6),
        vy: rand(0.4, 0.95),
        vx: rand(-0.15, 0.15),
        phase: rand(0, Math.PI * 2),
        alpha: rand(0.25, 0.65)
      });
    }

    // 按后、中、前景严格层级排序
    plants.sort((a, b) => {
      const order = { back: 0, mid: 1, front: 2 };
      return order[a.layer] - order[b.layer];
    });
  }

  function getSeaweedPalette(themeColor) {
    const isDark = document.documentElement.getAttribute('data-mode') === 'dark';
    const r = themeColor ? themeColor.r : 160;
    const g = themeColor ? themeColor.g : 185;
    const b = themeColor ? themeColor.b : 195;

    // 低饱和莫兰迪深海调色盘：雾青、灰蓝、鼠尾草绿、灰紫
    return {
      // 1. 海带叶：深沉莫兰迪雾青
      kelpBase: isDark ? 'rgba(68, 138, 148, 0.38)' : 'rgba(92, 156, 168, 0.44)',
      kelpInner: isDark ? 'rgba(110, 195, 205, 0.22)' : 'rgba(135, 205, 215, 0.28)',
      kelpEdge: isDark ? 'rgba(175, 235, 245, 0.55)' : 'rgba(75, 142, 155, 0.60)',

      // 2. 细叶草：飘逸灰蓝
      fineBase: isDark ? 'rgba(88, 128, 168, 0.35)' : 'rgba(115, 152, 188, 0.42)',
      fineEdge: isDark ? 'rgba(165, 205, 245, 0.55)' : 'rgba(95, 138, 175, 0.58)',

      // 3. 珊瑚草：温润灰紫粉
      coralBase: isDark ? 'rgba(152, 122, 168, 0.36)' : 'rgba(168, 138, 185, 0.42)',
      coralEdge: isDark ? 'rgba(218, 185, 238, 0.55)' : 'rgba(142, 112, 160, 0.58)',

      // 4. 螺旋叶：浅海天青
      spiralBase: isDark ? 'rgba(72, 152, 165, 0.35)' : 'rgba(102, 168, 180, 0.42)',
      spiralEdge: isDark ? 'rgba(168, 232, 242, 0.55)' : 'rgba(82, 148, 160, 0.58)',

      // 5. 海葵草：鼠尾草柔绿
      clusterBase: isDark ? 'rgba(78, 148, 132, 0.38)' : 'rgba(105, 168, 152, 0.45)',
      clusterEdge: isDark ? 'rgba(158, 225, 210, 0.55)' : 'rgba(88, 152, 138, 0.58)',

      // 海床礁石与沙层
      seabedRock: isDark ? 'rgba(28, 36, 50, 0.82)' : 'rgba(188, 198, 210, 0.78)',
      seabedRockEdge: isDark ? 'rgba(70, 90, 115, 0.45)' : 'rgba(150, 165, 180, 0.50)',
      seabedSand: isDark ? 'rgba(16, 22, 32, 0.90)' : 'rgba(212, 222, 230, 0.88)',
      accentR: r, accentG: g, accentB: b
    };
  }

  function updateAndDrawSeaweeds(ctx, width, height, themeColor, jellyfishes) {
    const now = performance.now();
    const dt = Math.min(0.064, (now - lastTime) / 1000);
    lastTime = now;

    if (plants.length === 0 || Math.abs(seabedY - height) > 20) {
      initSeabed(width, height);
    }

    const pal = getSeaweedPalette(themeColor);
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const vH = window.innerHeight;

    // 与水母接近时的轻微交互响应（80-140px 半径，最大偏转 3°-5°）
    if (jellyfishes && jellyfishes.length) {
      for (const p of plants) {
        if (p.coolDown > 0) {
          p.coolDown -= dt;
        } else {
          for (const j of jellyfishes) {
            const dy = (p.baseY - p.height * 0.5) - j.y;
            const dx = p.x - j.x;
            const dist = Math.hypot(dx, dy);
            if (dist < 130) {
              const pushSign = dx >= 0 ? 1 : -1;
              const strength = (1 - dist / 130) * 0.11;
              p.interactAngle = pushSign * strength;
              p.interactDecay = 1.0;
              p.coolDown = 1.5;
              break;
            }
          }
        }

        if (p.interactDecay > 0) {
          p.interactDecay -= dt * 1.2;
          if (p.interactDecay <= 0) p.interactAngle = 0;
        }
      }
    }

    const tSec = now / 1000;
    ctx.save();

    // 1. 绘制海床暗礁基石群（带立体圆润边缘）
    for (const rock of seabedRocks) {
      ctx.fillStyle = pal.seabedRock;
      ctx.beginPath();
      ctx.ellipse(rock.x, rock.y, rock.w, rock.h, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = pal.seabedRockEdge;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // 2. 绘制各株水草（带视口裁剪优化）
    for (const p of plants) {
      const plantTop = p.baseY - p.height;
      if (p.baseY < scrollY - 60 || plantTop > scrollY + vH + 60) {
        continue;
      }

      const wavePhase = tSec * 2 * Math.PI * p.freq + p.phase;
      const baseSway = Math.sin(wavePhase) * p.amp;
      const totalStemAngle = baseSway + (p.interactAngle * (p.interactDecay || 0));

      // 叶尖指数平滑延迟
      const alpha = 1 - Math.exp(-dt / SEAWEED_CONFIG.tipLagSeconds);

      for (let idx = 0; idx < p.leaves.length; idx++) {
        const lf = p.leaves[idx];
        const leafTarget = totalStemAngle + Math.sin(wavePhase + lf.offsetPhase) * 0.04;
        lf.angle += (leafTarget - lf.angle) * alpha;

        const leafH = p.height * lf.relH;
        const leafW = p.baseWidth * lf.relW;

        const rootX = p.x + (idx - p.leaves.length * 0.5) * (leafW * 0.48);
        const rootY = p.baseY;

        // 叶尖位置
        const tipBendX = Math.sin(lf.angle) * leafH * 0.46 + (lf.bendSign * leafW * 1.15);
        const tipX = rootX + tipBendX;
        const tipY = rootY - leafH;

        // 中段弯曲控制点 (带微波流动)
        const midT = 0.52;
        const midX = rootX + tipBendX * midT + Math.sin(wavePhase * 1.5 + idx) * 3.8;
        const midY = rootY - leafH * midT;

        ctx.beginPath();
        ctx.moveTo(rootX, rootY);

        ctx.bezierCurveTo(
          rootX + (midX - rootX) * 0.4 - leafW * 0.72,
          rootY - leafH * 0.25,
          midX - leafW * 0.92,
          midY + leafH * 0.12,
          midX - leafW * 0.52,
          midY
        );

        ctx.bezierCurveTo(
          midX - leafW * 0.42,
          midY - leafH * 0.22,
          tipX - leafW * 0.25,
          tipY + leafH * 0.15,
          tipX,
          tipY
        );

        ctx.bezierCurveTo(
          tipX + leafW * 0.25,
          tipY + leafH * 0.15,
          midX + leafW * 0.42,
          midY - leafH * 0.22,
          midX + leafW * 0.52,
          midY
        );

        ctx.bezierCurveTo(
          midX + leafW * 0.92,
          midY + leafH * 0.12,
          rootX + (midX - rootX) * 0.4 + leafW * 0.72,
          rootY - leafH * 0.25,
          rootX,
          rootY
        );

        ctx.closePath();

        // 颜色分层：五大物种各自专属莫兰迪配色
        let fillCol = pal.kelpBase;
        let strokeCol = pal.kelpEdge;
        if (p.species === 'fine') {
          fillCol = pal.fineBase;
          strokeCol = pal.fineEdge;
        } else if (p.species === 'coral') {
          fillCol = pal.coralBase;
          strokeCol = pal.coralEdge;
        } else if (p.species === 'spiral') {
          fillCol = pal.spiralBase;
          strokeCol = pal.spiralEdge;
        } else if (p.species === 'cluster') {
          fillCol = pal.clusterBase;
          strokeCol = pal.clusterEdge;
        }

        ctx.fillStyle = fillCol;
        ctx.fill();

        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = Math.max(0.8, leafW * 0.09);
        ctx.stroke();

        // 中景与前景叶片中心柔光微叶脉 (透光胶质感)
        if (idx === 0 && p.layer !== 'back') {
          ctx.beginPath();
          ctx.moveTo(rootX, rootY);
          ctx.quadraticCurveTo(midX, midY, tipX, tipY);
          ctx.strokeStyle = 'rgba(' + pal.accentR + ', ' + pal.accentG + ', ' + pal.accentB + ', 0.32)';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }

    // 3. 海底微沙层基底
    ctx.fillStyle = pal.seabedSand;
    ctx.beginPath();
    ctx.rect(0, height - 16, width, 24);
    ctx.fill();

    // 4. 浮游发光气泡 (带外圈柔光与内部小光斑)
    for (const b of bubbles) {
      b.y -= b.vy;
      b.x += Math.sin(tSec * 1.5 + b.phase) * 0.4;
      if (b.y < height - 380) {
        b.y = height - rand(5, 20);
        b.x = rand(0, width);
      }

      // 气泡外圈
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + pal.accentR + ', ' + pal.accentG + ', ' + pal.accentB + ', ' + b.alpha + ')';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 气泡内层高光点
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (b.alpha * 0.8) + ')';
      ctx.fill();
    }

    ctx.restore();
  }

  function updateSeaweedSeabedY(newHeight) {
    if (Math.abs(seabedY - newHeight) > 10) {
      seabedY = newHeight;
      for (const p of plants) {
        p.baseY = newHeight;
      }
    }
  }

  window.updateAndDrawSeaweeds = updateAndDrawSeaweeds;
  window.updateSeaweedSeabedY = updateSeaweedSeabedY;
})();
