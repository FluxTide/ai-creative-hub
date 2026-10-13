/**
 * pullcord.js - A ceiling pull-cord with a real Verlet rope physics simulation.
 * Pure Vanilla JS + SVG implementation adapted from mortspace/pullcord (React/Motion).
 * 0 dependencies, 60fps physics, multi-touch/mouse support, Morandi-theme integrated.
 */

(function () {
  'use strict';

  // --- Geometry Constants ---
  const W = 160;
  const ANCHOR_X = 80;
  const REST_Y = 160;
  const SVG_H = 260;
  const NUM_NODES = 12;
  const REST_SEG = REST_Y / (NUM_NODES - 1);
  const KNOB_R = 9.5;
  const HIT = 44;

  const DEFAULT_CONFIG = {
    gravity: 1250,
    damping: 0.94,
    iterations: 20,
    stretchMax: 30,
    stretchToggle: 20,
    maxVelocity: 24,
    sleepVelocity: 0.15,
  };

  function makeNodes() {
    const nodes = [];
    for (let i = 0; i < NUM_NODES; i++) {
      const y = (REST_Y / (NUM_NODES - 1)) * i;
      nodes.push({ x: ANCHOR_X, y, ox: ANCHOR_X, oy: y, fixed: i === 0 });
    }
    return nodes;
  }

  function buildPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = ((pts[i].x + pts[i + 1].x) / 2).toFixed(2);
      const my = ((pts[i].y + pts[i + 1].y) / 2).toFixed(2);
      d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${mx} ${my}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    return d;
  }

  // --- Web Audio Click Sound Synthesizer (清脆机械微动开关声) ---
  function playClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) {}
  }

  class PullCordComponent {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          top: '0px',
          right: '28px',
          zIndex: 80,
          onPull: null,
        },
        options
      );

      this.config = Object.assign({}, DEFAULT_CONFIG, options.config || {});
      this.pts = makeNodes();
      this.dragging = false;
      this.didDrag = false;
      this.clicked = false;
      this.running = false;
      this.prevT = 0;
      this.prevDt = 0;
      this.raf = 0;
      this.target = { x: ANCHOR_X, y: REST_Y };
      this.dragStartPos = { x: 0, y: 0 };

      this.initDOM();
      this.initEvents();
      this.startDropAnimation();
    }

    initDOM() {
      // 外部固定容器
      this.el = document.createElement('div');
      this.el.className = 'pullcord-wrapper';
      this.el.setAttribute('aria-label', '拉绳切换主题色调');
      this.el.style.cssText = `
        position: fixed;
        top: ${this.options.top};
        right: ${this.options.right};
        z-index: ${this.options.zIndex};
        width: ${W}px;
        height: ${SVG_H}px;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
      `;

      // 内部动画挂载层
      this.inner = document.createElement('div');
      this.inner.className = 'pullcord-inner pullcord-inner--drop';

      // SVG
      this.inner.innerHTML = `
        <svg viewBox="0 0 ${W} ${SVG_H}" width="${W}" height="${SVG_H}" aria-hidden="true" style="overflow: visible; display: block;">
          <defs>
            <linearGradient id="pc-knob-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="60%" stop-color="#E8E3DC" />
              <stop offset="100%" stop-color="#D9D4E5" />
            </linearGradient>
            <filter id="pc-knob-shadow" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="2.2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.35)" />
            </filter>
          </defs>

          <!-- 绳索路径 -->
          <path id="pc-rope-path"
            d="${buildPath(this.pts)}"
            stroke="var(--text-secondary, #8B7355)"
            stroke-opacity="0.65"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />

          <!-- 末端水滴/圆环拉坠 -->
          <g id="pc-knob-group">
            <g filter="url(#pc-knob-shadow)">
              <!-- 顶部金属固定环扣 -->
              <circle cx="${ANCHOR_X}" cy="0" r="3.2" fill="var(--morandi-purple, #D9D4E5)" opacity="0.9" />
              <!-- 下拉手柄圆球 -->
              <circle cx="${ANCHOR_X}" cy="${REST_Y}" r="${KNOB_R}" fill="url(#pc-knob-grad)" stroke="var(--border-subtle, rgba(0,0,0,0.15))" stroke-width="0.8" />
              <!-- 中心莫兰迪主题装饰小微晶核 -->
              <circle id="pc-knob-core" cx="${ANCHOR_X}" cy="${REST_Y}" r="4.2" fill="var(--accent-glow, #8B7355)" opacity="0.85" />
            </g>
          </g>
        </svg>

        <!-- 增大点击/拖拽热区的透明按钮 -->
        <button id="pc-knob-hit" type="button" aria-label="拉绳切换主题" title="拉动绳索切换色调主题" style="
          position: absolute;
          left: ${ANCHOR_X - HIT / 2}px;
          top: ${REST_Y - HIT / 2}px;
          width: ${HIT}px;
          height: ${HIT}px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: grab;
          touch-action: none;
          pointer-events: auto;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        "></button>
      `;

      this.el.appendChild(this.inner);
      document.body.appendChild(this.el);

      this.pathEl = this.inner.querySelector('#pc-rope-path');
      this.groupEl = this.inner.querySelector('#pc-knob-group');
      this.knobHit = this.inner.querySelector('#pc-knob-hit');
      this.knobCore = this.inner.querySelector('#pc-knob-core');
    }

    startDropAnimation() {
      // 首次加载轻微从天花板坠落并赋予微物理晃动
      setTimeout(() => {
        this.inner.classList.remove('pullcord-inner--drop');
        const last = this.pts.length - 1;
        this.pts[last].oy -= 14; // 向下继续过冲
        this.pts[last].ox -= 6;  // 侧向微摆
        this.wake();
      }, 950);
    }

    render() {
      const last = this.pts.length - 1;
      this.pathEl.setAttribute('d', buildPath(this.pts));
      const dx = (this.pts[last].x - ANCHOR_X).toFixed(2);
      const dy = (this.pts[last].y - REST_Y).toFixed(2);
      this.groupEl.setAttribute('transform', `translate(${dx} ${dy})`);
      this.knobHit.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    step(now) {
      const { gravity, damping, iterations, sleepVelocity } = this.config;
      const dt = this.prevT ? Math.min(0.04, Math.max(0.004, (now - this.prevT) / 1000)) : 1 / 60;
      this.prevT = now;
      const tc = this.prevDt > 0 ? dt / this.prevDt : 1;
      const velCoef = tc * Math.pow(damping, dt * 60);
      const accCoef = dt * dt;

      const last = this.pts.length - 1;
      this.pts[last].fixed = this.dragging;

      // Verlet 积分
      for (let i = 1; i < this.pts.length; i++) {
        const p = this.pts[i];
        if (p.fixed) continue;
        const vx = p.x - p.ox;
        const vy = p.y - p.oy;
        p.ox = p.x;
        p.oy = p.y;
        p.x += vx * velCoef;
        p.y += vy * velCoef + gravity * accCoef;
      }

      this.pts[0].x = ANCHOR_X;
      this.pts[0].y = 0;

      if (this.dragging) {
        this.pts[last].ox = this.pts[last].x;
        this.pts[last].oy = this.pts[last].y;
        this.pts[last].x = this.target.x;
        this.pts[last].y = this.target.y;
      }

      // 弹簧距离约束求解器
      for (let k = 0; k < iterations; k++) {
        for (let i = 0; i < last; i++) {
          const a = this.pts[i];
          const b = this.pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = ((REST_SEG - dist) / dist) * 0.5;
          const ox = dx * diff;
          const oy = dy * diff;
          if (!a.fixed) {
            a.x -= ox;
            a.y -= oy;
          }
          if (!b.fixed) {
            b.x += ox;
            b.y += oy;
          }
        }
      }

      this.prevDt = dt;
      this.render();

      // 休眠检测
      let speed = 0;
      for (let i = 1; i < this.pts.length; i++) {
        speed += Math.abs(this.pts[i].x - this.pts[i].ox) + Math.abs(this.pts[i].y - this.pts[i].oy);
      }

      if (!this.dragging && speed < sleepVelocity * dt * 60) {
        this.render();
        this.running = false;
        return;
      }

      this.raf = requestAnimationFrame((t) => this.step(t));
    }

    wake() {
      if (this.running) return;
      this.running = true;
      this.prevT = 0;
      this.prevDt = 0;
      this.raf = requestAnimationFrame((t) => this.step(t));
    }

    triggerPull() {
      playClickSound();
      if (typeof this.options.onPull === 'function') {
        this.options.onPull();
      }
    }

    scriptedPull() {
      this.triggerPull();
      const last = this.pts.length - 1;
      this.pts[last].oy -= 26; // 向下拉力脉冲
      this.wake();
    }

    initEvents() {
      const onPointerDown = (e) => {
        this.dragging = true;
        this.didDrag = false;
        this.clicked = false;
        this.knobHit.style.cursor = 'grabbing';
        this.dragStartPos = { x: e.clientX, y: e.clientY };
        this.wake();

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
      };

      const onPointerMove = (e) => {
        if (!this.dragging) return;
        this.didDrag = true;
        const offsetX = e.clientX - this.dragStartPos.x;
        const offsetY = e.clientY - this.dragStartPos.y;

        const { stretchMax, stretchToggle } = this.config;
        const rx = offsetX;
        const ry = REST_Y + offsetY;
        const dist = Math.hypot(rx, ry) || 0.0001;
        const maxD = REST_Y + stretchMax;
        const k = dist > maxD ? maxD / dist : 1;

        this.target = { x: ANCHOR_X + rx * k, y: ry * k };

        // 拉扯超过临界触发点时，发出卡哒机械微动咔嗒声并切换
        const clickAt = Math.min(stretchToggle, stretchMax - 1);
        if (!this.clicked && dist - REST_Y >= clickAt) {
          this.clicked = true;
          this.triggerPull();
        }
      };

      const onPointerUp = () => {
        if (!this.dragging) return;
        this.dragging = false;
        this.knobHit.style.cursor = 'grab';

        const { maxVelocity } = this.config;
        const last = this.pts.length - 1;
        const p = this.pts[last];
        const vx = p.x - p.ox;
        const vy = p.y - p.oy;
        const v = Math.hypot(vx, vy);
        if (v > maxVelocity) {
          const k = maxVelocity / v;
          p.ox = p.x - vx * k;
          p.oy = p.y - vy * k;
        }

        this.wake();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        setTimeout(() => {
          this.didDrag = false;
        }, 50);
      };

      this.knobHit.addEventListener('pointerdown', onPointerDown);

      // 单击也可以模拟轻拉一下
      this.knobHit.addEventListener('click', (e) => {
        if (this.didDrag) return;
        this.scriptedPull();
      });
    }
  }

  // 挂载到全局
  window.PullCord = PullCordComponent;
})();
