const CREATIVE_WORKS = [
  {
    "id": "AI-VID-012",
    "title": "毛绒小水母",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/plush-jellyfish-cover.jpg",
    "video": "assets/plush-jellyfish.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒小水母微缩玩具交互系统，包含粉萌波点伞帽、慢速脉动心跳力学、柔性触手随动摆动与手指引力拖拽交互。",
    "tools": ["Claude Opus 5.5", "Three.js / WebGL", "Physics Engine"],
    "tags": [
      "小水母",
      "3D 互动",
      "毛绒水母",
      "Three.js",
      "Web3D",
      "触手力学",
      "水母"
    ],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Plush Jellyfish' — a single self-contained HTML page using Three.js/WebGL with dynamic soft-body and cloth physics simulation.\n\n- Concept: MATERIAL STUDIES / NO. 013 — \"A puff of mushy on a slow heartbeat, trailing plush tentacles through still air. Lend it a finger.\"\n- Specimen Anatomy: Soft pastel plush bell/dome with cute embroidered face and white polka dots; multicolored flowing fabric ribbon tentacles.\n- Control Panel (THE SPECIMEN / fig. 21):\n  * Tool Selection: Hand, Finger, Comb;\n  * Fur/Color Swatches: Blush (pink), Lavender (purple), Sea Glass (blue-green);\n  * Sliders: STUFFING (0.45), PULSE speed (fast to slow), PULSE style (shaped to shaggy), DENSITY (fluffy);\n  * Action Buttons: Boop, Twirl, Toss, Smooth fur, Reset;\n  * Options: 1% speed, Mesh mode, Pause.\n- Bottom Data Stats: MASS = 53 g, VOLUME = 96.0 cm³, PULSE = 33 bpm, CLIMBING = 0 tentacles.\n- Interactions: Grab the bell and pull it about, or take hold of a single tentacle and tow it; scroll/second finger to twist; drag empty space to orbit camera.\nSelf-contained HTML file, responsive, running at 60fps.",
    "promptZh": "构建一个可交互的 3D Web 微缩玩具模型场景：“毛绒小水母 (Plush Jellyfish)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成柔性软体与织物动力学引擎。\n\n【核心功能与特征】\n- 视觉概念：MATERIAL STUDIES / NO. 013 标本——“慢心跳节奏下的蓬松小水母，在静止空气中拖曳着毛绒触手。伸出一根手指让它依偎。”\n- 主体建模：柔和马卡龙粉色/粉紫色的绒毛圆顶伞帽，带有精致刺绣腮红笑脸与白色圆点波纹；下部垂挂多色编织触手（粉、金黄、淡紫）。\n- 标本控制面板 (THE SPECIMEN / fig. 21)：\n  * 工具切换：手掌抚摸 (Hand)、单指逗弄 (Finger)、小毛梳梳理 (Comb)；\n  * 面料颜色：腮红粉 (Blush)、薰衣草紫 (Lavender)、海玻璃蓝 (Sea Glass)；\n  * 物理滑块：填充度 (STUFFING: 0.45)、脉动频率 (PULSE: 快至慢)、绒毛形态 (shaped 至 shaggy 33 bpm)、蓬松密度 (fluffy)；\n  * 交互按钮：轻戳 (Boop)、旋转 (Twirl)、抛起 (Toss)、顺毛抚平 (Smooth fur)、重置 (Reset)；\n  * 模拟选项：慢放 (1% speed)、线框网格 (Mesh)、暂停 (Pause)。\n- 标本运行数据：质量 53g、体积 96.0 cm³、心跳脉动 33 次/分、缠绕触手 0 根。\n- 鼠标微交互：抓取伞帽拖拽并观察弹性回弹；拉扯单根触手拖拽；两指扭转；拖拽空白区域 360 度视角旋转。\n全场景封装于单一 HTML，自适应响应式布局。",
    "negativePrompt": null,
    "links": [
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/MR4xiFtXmTkzXruQdeGvAt"
      }
    ],
    "toolUrl": "https://claude.ai/artifact/MR4xiFtXmTkzXruQdeGvAt",
    "assetUrl": null
  },
  {
    "id": "AI-VID-001",
    "title": "果冻海",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/atoll-jelly-cover.jpg",
    "video": "assets/atoll-jelly.mp4",
    "desc": "使用原生 WebGPU + WGSL 模拟的马尔代夫果冻海微缩景观交互系统，包含水上木屋群、巡航水上飞机、珊瑚礁鱼群与流体动力学交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "WebGPU / WGSL", "Three.js"],
    "tags": ["3D 互动", "果冻海", "WebGPU", "Claude 5.5", "GPT-6"],
    "recommend": "精选",
    "promptEn": "Build \"Atoll Jelly\" — a single self-contained HTML file featuring a tiny Maldives-style sandbar diorama with crystalline water rendered entirely in WebGPU + WGSL.\n\nKey scene requirements:\n- Water: Caustic reflections, subsurface scattering, gentle rolling waves driven by customized compute shaders, transparent turquoise gradient from shore to depth.\n- Island features: Stilt water bungalows with thatched roofs, wooden boardwalks, coconut palms, sea turtles and manta rays swimming in loops.\n- Interactivity:\n  - Time of day slider (Dawn, Noon, Golden Hour, Bioluminescent Night).\n  - Tide height & wave energy controllers.\n  - Click to drop pebble creating radial ripples.\n  - OrbitControls for 360-degree free inspection.\n- Soundscapes: Optional WebAudio procedural ocean swells and gentle breeze.\nEverything packed into one clean, zero-dependency HTML document with responsive viewport sizing.",
    "promptZh": "构建“环礁果冻 (Atoll Jelly)”——单文件自包含 HTML，原生 WebGPU + WGSL 编写的马尔代夫微缩沙洲 3D 果冻海水景模型。\n\n【核心场景要求】\n- 水体效果：定制计算着色器驱动的高保真水下焦散 (Caustics)、次表面散射、柔和波浪起伏，浅滩至深海的通透绿松石渐变水色。\n- 海岛细节：茅草屋顶水上木屋群、木质栈道、椰子树、海龟与蝠鲼循环游弋动画。\n- 交互功能：\n  - 昼夜光照滑块（日出、正午、黄昏暖金、夜间生物荧光蓝）。\n  - 潮汐高度与波浪动力学滑块。\n  - 点击水面投掷小石子引发物理径向涟漪。\n  - 360 度自由旋转与缩放的 OrbitControls 视角控制。\n- 空间音效：可选的 WebAudio 纯代码程序化海浪声与微风环境音。\n全场景封装于单一无外部依赖的 HTML 文件中，完美适配各尺寸屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://atoll-jelly-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/Kt28UAQ5RzfGBgNFX1Nh7R"
      }
    ],
    "toolUrl": "https://atoll-jelly-astra.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-002",
    "title": "毛绒小鲨鱼",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/shark-cover.jpg",
    "video": "assets/shark-opus-vs-astra.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒小鲨鱼微缩玩具交互系统，包含手工缝线布料材质、柔性摆动尾巴、多维抚摸戳碰工具与物理动力学交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Physics Engine"],
    "tags": ["3D 互动", "模型对比", "Three.js", "小鲨鱼", "毛绒鲨鱼", "Web3D"],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Plush Shark' — a single self-contained HTML page using Three.js/WebGL with physical interactions.\n\nFeatures:\n- Main subject: A tactile plush shark toy with soft felt seams, stuffed body dynamics, flexible wagging tail, and cartoon felt teeth.\n- Physics & controls:\n  - Realistic wagging and swimming dynamics with adjustable stiffness.\n- Interaction panel:\n  - Tools: Hand (squash/pet), Finger (poke), Comb (groom fur fibers).\n  - Material toggles: Color options (Pink, Classic Blue, Soft Grey), stuffing softness slider (0.0 - 1.0), tail beat frequency.\n  - Action buttons: Feed fish, Turbo swim, Bite, Smooth fur, Reset, Pause.\n- State machine: Seamless transitions between Idle, Cruising, Eating/Biting, and Excited behaviors. Clean retro-modern frosted-glass control layout with responsive canvas.",
    "promptZh": "构建一个可交互的 3D Web 微缩玩具模型场景：“毛绒小鲨鱼 (Plush Shark)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成物理交互引擎。\n\n【核心功能与特征】\n- 主体建模：高质感触觉毛绒小鲨鱼玩具，包含柔软羊毛毡缝线、充填棉花动力学形变、柔性可弯折摆动鱼尾以及卡通毛毡牙齿。\n- 物理控制：\n  - 摆尾与游动流体动力学：根据设定的物理参数呈现逼真的摇尾与波浪状游动动态。\n- 右侧交互控制面板：\n  - 互动工具库：小手掌（戳碰 / 抚摸）、手指指尖、小梳子（梳理毛绒毛发）。\n  - 外观与质感调节：三色色块切换（粉色、经典蓝、浅灰），充填物软硬度滑块 (0.0 - 1.0)，尾部摆动频率滑块。\n  - 动作行为触发器：投喂小鱼、极速冲刺、开嘴咬人、温柔顺毛、重置场景、暂停动态。\n- 状态机设计：在待机闲置、巡航游弋、进食捕食与开心兴奋等多种情绪反应之间平滑自然过渡。界面采用复古现代兼具的半透明毛玻璃高质感排版，完全响应式适配。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://plush-shark-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/FX5735w1ZmshBxZWWrvCv5"
      }
    ],
    "toolUrl": "https://plush-shark-astra.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-003",
    "title": "毛绒小螃蟹",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/crab-cover.jpg",
    "video": "assets/crab-opus-vs-sonnet.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒小螃蟹微缩玩具交互系统，包含柔软双螯、内置金属丝折弯八足、眼柄力学追踪与物理动力学抓捏交互。",
    "tools": ["Claude Opus 5.5", "Claude Sonnet 5.5", "Three.js / WebGL", "Physics Engine"],
    "tags": ["3D 互动", "模型对比", "Three.js", "小螃蟹", "毛绒螃蟹", "Web3D"],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Plush Crab' — a single self-contained HTML page using Three.js/WebGL with physical interactions.\n\nFeatures:\n- Main subject: A tactile plush crab toy with coral/felt fuzzy body, two soft pinchers/claws, eight articulated legs with internal bendable wire mechanics, and eyes on stalks that gaze towards user cursor.\n- Interaction controls:\n  - Toolset: Hand (squash/toss), Finger (poke), Comb (smooth fur fibers).\n  - Material & Fur: Color options (Coral, Sand, Blue), Stuffing slider (0.0 - 1.0), Pile height (5mm - 10mm), Wire stiffness.\n  - Action buttons: Scuttle, Sip-sip, Hide, Wave claws, Straighten, Smooth fur, Reset.\n  - Dragging/pinching legs or body stretches and deforms with physics feedback.\n- Clean retro-modern laboratory diorama dashboard with specimen details and live mass/volume readouts.",
    "promptZh": "构建一个可交互的 3D Web 微缩玩具模型场景：“毛绒小螃蟹 (Plush Crab)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成物理交互引擎。\n\n【核心功能与特征】\n- 主体建模：高拟真触感毛绒小螃蟹玩具，具备珊瑚红毛毡毛绒外壳、两只柔软蟹螯、八条内置可弯折金属丝骨骼的活动蟹足，以及长在眼柄上会随鼠标视线跟随的灵动双眼。\n- 交互控制面板：\n  - 交互工具库：手掌工具（挤压抓取 / 抛掷悬停）、手指工具（单点戳碰）、小毛梳（顺平绒毛）。\n  - 材质与绒毛参数调节：三色绒毛切换（珊瑚红 Coral、沙滩黄 Sand、经典蓝 Blue），填充物软硬度滑块 (Stuffing: 0.0 - 1.0)，绒毛长度滑块 (Pile: 5mm - 10mm)，内部金属丝刚度滑块 (Wire)。\n  - 动作行为触发器：横向快爬 (Scuttle)、小口吐泡 (Sip-sip)、缩壳躲藏 (Hide)、挥动蟹螯 (Wave claws)、伸展复原 (Straighten)、抚平毛发 (Smooth fur)、重置场景 (Reset)。\n  - 物理抓捏与动力学：鼠标拖拽肢体或躯干时产生弹性质感变形，松开后依据金属丝形状保持或回弹。\n- 界面风格：复古现代风格的标本研究室展示台，附带标本编号与物理质量/体积实时读数面板。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ Sonnet 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/5zJeJvdatJ2u7VHgL6oTkT"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/1jT1qw5GvEm8bFGw55Gjsg"
      }
    ],
    "toolUrl": "https://claude.ai/artifact/5zJeJvdatJ2u7VHgL6oTkT",
    "assetUrl": null
  },
  {
    "id": "AI-VID-004",
    "title": "果冻锦鲤池",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/jelly-koi-cover.jpg",
    "video": "assets/jelly-koi-pond.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 果冻锦鲤池塘微缩交互系统，包含高透软体水质物理、荷叶青蛙共振、锦鲤游弋动力学与拖拽拉伸微交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Soft-Body Physics"],
    "tags": ["3D 互动", "模型对比", "Three.js", "青蛙池塘", "果冻池塘", "软体物理"],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Jelly Koi Pond' — a single self-contained HTML page using Three.js/WebGL and soft-body spring physics.\n\nFeatures & Requirements:\n- Visual concept: 'A LITTLE POCKET OF CALM — A pond with a softer side.' Minimalist pastel aesthetics with a floating translucent gelatinous water slab.\n- Water body: Soft-body jelly simulation with refractive shader, internal pebbles, lily pads floating on surface, and distinct swimming koi fish beneath.\n- Characters: A cute green frog perched on a lily pad reacting with physics resonance and wobble when the pond is disturbed.\n- Interactivity & Controls:\n  - Drag to stretch the jelly body; tap to trigger radial ripples.\n  - Bottom toolbar controls: 'Drop', 'Wobble', 'Jelly softness' slider, and palette swatches (Blue, Pink, Coral).\n  - Secondary controls: Scroll to zoom, drag to rotate / lift and release to bounce back.\n- Clean typography and calming retro-modern poster layout in responsive viewport.",
    "promptZh": "构建一个可交互的 3D Web 微缩场景：“果冻锦鲤池塘 (Jelly Koi Pond)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成软体弹簧物理引擎。\n\n【核心功能与特征】\n- 视觉概念：“极简治愈角落——柔软质感的微缩水体世界 (A pond with a softer side)”。悬浮的半透明高弹性凝胶水体块，通透莫兰迪低饱和色调。\n- 水体物理模拟：高透度果冻软体仿真，带有次表面折射着色器、底层沉着的小鹅卵石、浮动荷叶以及在果冻内部穿梭游弋的花斑锦鲤。\n- 生态角色：一只停留在荷叶上的憨厚绿色小青蛙，当水体被晃动、拉伸时，小青蛙会产生强烈的共振抖动与抓地物理反馈。\n- 交互控制面板：\n  - 核心手势：鼠标拖拽即可拉伸形变（DRAG TO STRETCH），轻击水面触发径向震颤涟漪（TAP TO RIPPLE）。\n  - 底部工具条：晃动（Wobble）、下落释放（Drop）、果冻软硬度滑块（Jelly softness）及三色材质切换（冰川蓝、樱花粉、珊瑚色）。\n  - 辅助视角：滚轮平滑缩放、自由环视旋转，支持抓起悬停与回弹物理。\n全场景封装为单一 HTML，排版具备高级杂志海报质感，完美自适应各端屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://jelly-koi-pond.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/X94CbU7i3DddLNMNEcFo1N"
      }
    ],
    "toolUrl": "https://jelly-koi-pond.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-005",
    "title": "锤头鲨",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/hammerhead-shark-cover.jpg",
    "video": "assets/hammerhead-shark.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒双髻锤头鲨微缩交互系统，包含独特的锤形头部两极力学、柔性 S 形摆动躯干、多种梳理抚摸工具与两极眼部视线追踪交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Physics Engine"],
    "tags": [
      "3D 互动",
      "模型对比",
      "Three.js",
      "锤头鲨",
      "毛绒鲨鱼",
      "双髻鲨",
      "Web3D"
    ],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Plush Hammerhead' — a single self-contained HTML page using Three.js/WebGL with physical interactions.\n\nFeatures:\n- Main subject: A tactile plush hammerhead shark toy with felt/suede material, distinct T-shaped head structure with eyes on lateral ends, stuffed body that flexes in a natural S-curve, and flexible fins.\n- Interaction & Controls:\n  - Toolset: Hand (squash/grab/pet), Finger (poke), Comb (stroke fur pile to change light reflection).\n  - Material toggles: Color options (Teal, Warm Grey, Coral/Pink), Stuffing softness slider (0.0 - 1.0), Pile height and texture sliders.\n  - Action buttons: Feed, Dash, Scan, Charge, Smooth fur, Reset, Pause.\n  - Interactive mechanics: Dragging the hammerhead by either lateral head lobe rotates and swings with inertia; stroking back aligns fiber sheen.\n- Diorama UI: Clean retro-modern specimen laboratory diorama with live mass/volume telemetry and responsive layout.",
    "promptZh": "构建一个可交互的 3D Web 微缩玩具模型场景：“毛绒双髻锤头鲨 (Plush Hammerhead)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成物理交互引擎。\n\n【核心功能与特征】\n- 主体建模：高拟真触感毛绒双髻锤头鲨玩具，具备毛毡/翻毛皮质感外壳，独特的横向 T 形锤头构造（双眼位于两侧端点），呈柔缓 S 形摆动的充填躯干以及自然柔韧的鱼鳍。\n- 交互控制面板：\n  - 交互工具库：手掌工具（挤压抓取 / 拖曳悬停）、手指工具（单点戳碰）、小毛梳（顺平绒毛纤维以改变反光方向）。\n  - 材质与外观调节：三色色块切换（冷灰蓝 Teal、温暖浅灰 Grey、珊瑚粉 Pink），充填物软硬度滑块 (Stuffing: 0.0 - 1.0)，绒毛长度与粗糙度滑块。\n  - 动作行为触发器：投喂 (Feed)、冲刺 (Dash)、扫描分析 (Scan)、充能 (Charge)、抚平毛发 (Smooth fur)、重置场景 (Reset)、暂停动态 (Pause)。\n  - 物理动力学互动：抓住锤头任意一侧拖动时产生带惯性的摆动与回正力矩；轻抚背部可平整毛流改变光泽。\n- 界面风格：高级复古现代标本实验台风格，附带标本编号与物理质量/体积实时读数面板，完全自适应各端屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://plush-hammerhead-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/7zG6yzy4GW5tFefxjv5q5E"
      }
    ],
    "toolUrl": "https://plush-hammerhead-astra.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-006",
    "title": "果冻海盗岛",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/pirate-island-cover.jpg",
    "video": "assets/pirate-island.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 果冻海盗岛微缩交互系统，包含巨型骷髅岩洞、海盗帆船动力学、地层截面剖切与多维波浪流体交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Physics Engine"],
    "tags": [
      "3D 互动",
      "模型对比",
      "Three.js",
      "海盗岛",
      "果冻岛",
      "海盗船",
      "Web3D"
    ],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Pirate Jelly' — a single self-contained HTML page using Three.js/WebGL with dynamic fluid simulation and physics.\n\n[Visual Concept]\n- An isometric square block of a vibrant tropical pirate island floating in deep translucent jelly water with visible earth/rock cross-section strata below.\n- Center features: A huge white skull rock landmark on the beach, a classic pirate galleon with black flag and cannons, palm trees, treasure chests, and campfire by the shore.\n\n[Controls & Interactions]\n- Interactive Tools: 'Fire a gun', 'Drop anchor', 'Cannons', 'Board ship'.\n- Environmental Sliders: Time of day (daylight to dusk/darkness), Wave damping, Water opacity/viscosity.\n- Material/Flavor Palette: Blue lagoon, Sunset orange, Twilight purple.\n- Camera Controls: Full 360 orbit, smooth zoom, Reset view, Pause dynamics.",
    "promptZh": "构建一个可交互的 3D Web 微缩场景：“果冻海盗岛 (Pirate Jelly)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成流体动力学与物理引擎。\n\n【核心功能与特征】\n- 视觉概念：等距视角的方形浮岛方块，悬浮在深色半透明果冻水体中，底部展示清晰的地层泥土岩石横截面结构。\n- 场景主体要素：沙滩边缘的巨型白骨骷髅岩石地标、停泊在波浪中的全装海盗帆船（带火炮与黑旗）、热带椰子树群、散落的藏宝箱与海滩篝火营地。\n- 控制面板与交互：\n  - 交互动作触发器：开炮射击 (Fire a gun)、抛锚停泊 (Drop anchor)、火炮轰击 (Cannons)、登船突袭 (Board ship)。\n  - 环境滑块调节：时间切换 (Time of day - 晨曦至黑夜)、波浪阻尼 (Wave damping)、水体黏度与透明度。\n  - 场景主题调色盘：热带碧蓝 (Blue lagoon)、落日橙金 (Sunset orange)、暮光幽紫 (Twilight purple)。\n  - 镜头与仿真控制：360度自由旋转观察、平滑缩放、视角重置、动画暂停。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://pirate-jelly-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/4zSANtbVRCBXd6K9wFyaez"
      }
    ],
    "toolUrl": "https://pirate-jelly-astra.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-007",
    "title": "毛绒奶牛",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/plush-cow-cover.jpg",
    "video": "assets/plush-cow.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒奶牛微缩交互系统，包含独特的粉色履带驱动轮、柔软蓬松绒毛纤维、物理揉捏按压与倒地回正动力学交互。",
    "tools": ["Claude Opus 5.5", "Three.js / WebGL", "Soft-body Physics", "Shader Fur"],
    "tags": [
      "3D 互动",
      "Three.js",
      "奶牛跑跑",
      "毛绒奶牛",
      "动力学",
      "玩具交互",
      "Web3D"
    ],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web toy specimen: 'Plush Cow' (Material Studies / No. 029) — a single self-contained HTML page using Three.js/WebGL and physics.\n\n[Concept & Character]\n- A stuffed plush cow running on her treads. She trots, she gallops, she moos — and always gets back up when toppled.\n- Fluffy soft white fabric with realistic spotted patterns, cute pink muzzle, big shiny black eyes, and four mechanical pink treads instead of traditional legs.\n\n[Interactive Tools & Controls]\n- Tools: Hand tool (grab, squash, lift and drop on side), Finger tool (poke, pull ears), Comb tool (groom fur to adjust specular highlight direction).\n- Fur Customization: Albion, Jersey, Shorthorn spot patterns; Stuffing softness (0.0 - 1.0), Pile length (5 mm), Table friction coefficient (mu: 0.19).\n- Action Buttons: Trot, Gallop, Hop, Moo, Topple, Smooth fur, Reset, 1/2 speed toggle, Pause.\n- UI: Minimalist specimen laboratory aesthetic with real-time Mass (~13g), Volume, Steps and Moos data readouts.",
    "promptZh": "构建一个可交互的 3D Web 玩具标本场景：“毛绒奶牛 (Plush Cow / 标本 No.029)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成软体物理。\n\n【核心功能与特征】\n- 角色设定：一只在粉色履带轮上疾驰的毛绒奶牛玩具。她会小跑、飞奔、发出哞哞叫声，即使被推倒侧翻也能靠履带自己重新站立。\n- 材质外观：逼真蓬松的奶牛斑点布料绒毛、粉色小鼻子、水灵大黑眼珠，四肢被改造成极富趣味的机械粉色履带驱动轮。\n- 交互工具库：\n  - 手掌工具 (Hand)：抓起奶牛揉捏挤压，或推倒在桌面上观察其自动翻滚回正；拽住耳朵拉扯牵引。\n  - 手指工具 (Finger)：单点戳碰测试局部柔软形变弹性。\n  - 毛梳工具 (Comb)：给奶牛梳毛，理顺绒毛以实时改变漫反射光泽。\n- 参数调节面板：\n  - 毛皮花色切换：阿尔比恩 (Albion)、泽西 (Jersey)、短角 (Shorthorn)。\n  - 物理参数滑块：填充物软硬度 (Stuffing: 0.45)、绒毛厚度 (Pile: 5mm)、台面摩擦系数 (μ: 0.19)。\n  - 动作触发按键：小跑 (Trot)、疾驰 (Gallop)、跳跃 (Hop)、哞叫 (Moo)、倾倒 (Topple)、顺毛 (Smooth fur)、重置 (Reset)。\n- 界面风格：复古极简生物机械标本实验台风格，附带实时质量 (≈13g)、体积、步数与叫声次数数据读数。",
    "negativePrompt": null,
    "links": [
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/NowCbxcqsq79CfZhVhibe2"
      }
    ],
    "toolUrl": "https://claude.ai/artifact/NowCbxcqsq79CfZhVhibe2",
    "assetUrl": null
  },
  {
    "id": "AI-VID-008",
    "title": "果冻浮岛",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/castle-jelly-cover.jpg",
    "video": "assets/castle-jelly.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 果冻浮岛城堡微缩交互系统，包含粉蓝尖顶童话城堡、崖壁断层流体瀑布、巡航帆船水波与多层地质切片微缩景观。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Fluid Dynamics"],
    "tags": [
      "3D 互动",
      "模型对比",
      "Three.js",
      "果冻城堡",
      "浮岛城堡",
      "童话城堡",
      "Web3D"
    ],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: 'Castle Jelly' — a single self-contained HTML page using Three.js/WebGL with dynamic waterfall fluid physics.\n\n[Visual Concept]\n- A fairytale white castle on a floating grassy cliff island with multi-tower pink and light blue conical spires, surrounded by a cube of vibrant translucent purple/blue jelly water.\n- A waterfall cascades from the cliff down directly into the jelly pool, creating ripples and foam; a white sailboat cruises across the jelly water leaving a wake.\n- Earth and rock strata cross-section revealed beneath the jelly block like a layered dessert.\n\n[Interactive Panel & Controls]\n- Castle Actions: 'Fireworks', 'Lower bridge' / 'Raise bridge', 'Royal salute', 'Watering can' / 'Moat'.\n- Flavors / Theme Colors: Grape / Blueberry (purple), Rose / Strawberry (pink), Lime / Garden (emerald).\n- Sliders: Fireworks intensity, Gravity/Waterfall flow speed, Water damping ripple dissipation, Time of day.\n- Camera Controls: Full 360 degree orbit diorama view, zoom, Reset view, Pause.",
    "promptZh": "构建一个可交互的 3D Web 微缩场景：“果冻浮岛城堡 (Castle Jelly)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成瀑布水体流体物理引擎。\n\n【核心功能与特征】\n- 视觉概念：高耸在悬崖草甸浮岛上的童话白色城堡，拥有粉色与浅蓝色锥形尖顶塔楼群，四周被整块晶莹剔透的紫色/碧蓝色果冻水体环绕。\n- 流体细节：一道水流从城堡崖壁倾泻而下注入果冻池中激起白色水花涟漪，一艘精致的白色帆船在果冻水面巡航并留下航行波痕；底部呈现层叠甜品般的地质切片。\n- 控制面板与交互：\n  - 皇家动作触发：城堡烟花盛放 (Fireworks)、升降吊桥 (Bridge)、皇家礼炮 (Royal salute)、护城河浇灌 (Watering can)。\n  - 风味主题切换：葡萄/蓝莓紫 (Grape/Blueberry)、玫瑰/草莓粉 (Rose/Strawberry)、青柠/花园绿 (Lime/Garden)。\n  - 环境滑块调节：烟花规模 (Fireworks)、重力与瀑布流速 (Gravity/Waterfall)、水波阻尼扩散 (Water damping)、昼夜交替 (Time of day)。\n  - 观察与控制：360度全景等距环绕观察、平滑缩放、视角重置、暂停动态。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://castle-jelly-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/MLKuCSyYBUqaRpsxCVaqvk"
      }
    ],
    "toolUrl": "https://castle-jelly-astra.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-009",
    "title": "北极极光岛",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/arctic-jelly-cover.jpg",
    "video": "assets/arctic-jelly.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 北极极地果冻海微缩交互系统，包含极地冰川断层、极光天幕渲染、鲸鱼游弋呼唤、积雪暴风与水体流体阻尼动力学交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Fluid Physics"],
    "tags": ["北极果冻", "3D 互动", "模型对比", "Three.js", "极光", "Frostbay"],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: \"Frostbay\" — a single self-contained HTML page using Three.js/WebGL with physical water damping and polar weather simulation.\n\n【Core Features】\n- Concept: A pocket of the polar sea, set in a block of clear water on a slab of jelly. Deep, translucent blue water with layered ice base.\n- Central Island: Rocky arctic outcrop topped with a snowy dome observatory and a tiny red flag. Floating ice floes on surface; whales swimming beneath.\n- Weather & Aurora: Dynamic sky states including daylight, polar blizzard snowfall, and dancing northern lights (Aurora).\n- Control Panel:\n  * Buttons: Call the whale, Calm the sea, Weather presets (Snowfall, Foggy, Aurora);\n  * Sliders: Windiness, Wave damping, Tide height;\n  * Utilities: Pause, Reset diorama, Reset camera view;\n- Interactions: Orbit controls (drag to rotate, right drag to pan, wheel to zoom). Click surface to create jelly-like fluid ripples; drag diorama to observe elastic soft-body jelly deformation.\nSingle file, zero external assets, fully responsive.",
    "promptZh": "构建一个可交互的 3D Web 微缩极地场景：“霜湾极光果冻海 (Frostbay)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成水体流体阻尼与极地天气物理引擎。\n\n【核心功能与特征】\n- 视觉概念：“极地冰冷微缩世界——厚重果冻水体包裹的极地断层 (A pocket of the polar sea, set in a block of clear water on a slab of jelly)”。\n- 冰川与浮岛：中央玄武岩极地岛屿，覆盖积雪圆顶观测站/因纽特雪屋，悬挂微缩红旗；四周散落浮冰块，水下可见深海巨鲸游弋巡航。\n- 极光与天幕：支持昼夜与天气切换（晴空、极地暴风雪、幽蓝极光 Aurora 律动）。\n- 控制面板 (THE BAY / THE SEA)：\n  * 按钮：呼唤巨鲸 (Call the whale)、平息风浪 (Calm the sea)、极光天气切换；\n  * 滑块：风力调节 (Wind)、波浪阻尼 (Wave damping)、潮汐高度 (Tide)；\n  * 镜头控制：暂停 (Pause)、重置 (Reset)、重置视角 (Reset view)；\n- 物理交互：鼠标左键拖拽旋转视角（OrbitControls），右键平移，滚轮缩放；点击水面激起果冻涟漪，拖拽水体观察果冻弹性形变。\n全场景纯代码实现，无外部重依赖，完美适配响应式屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://frostbay.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/YPojEhRuro4NAqh37q757Q"
      }
    ],
    "toolUrl": "https://frostbay.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-010",
    "title": "毛绒旗鱼",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/torpedo-marlin-cover.jpg",
    "video": "assets/torpedo-marlin.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒小鱼雷旗鱼微缩玩具交互系统，包含鱼雷流线体裁、大眼萌系表情、手工缝线织物材质、多维梳毛与拖拽冲刺物理动力学交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Physics Engine"],
    "tags": ["小鱼雷", "旗鱼", "3D 互动", "模型对比", "Three.js", "Plush Marlin"],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: \"Plush Marlin\" — a single self-contained HTML page using Three.js/WebGL with textile physics and procedural interactions.\n\n【Core Features】\n- Concept: MATERIAL STUDIES / NO. 118 — \"A very serious fish. Zero serious thoughts. Big eyes. Long bill. Tiny attention span.\"\n- Specimen Modeling: Navy blue fabric body with plush white belly, elongated torpedo silhouette, sail dorsal fin, pointed bill, and oversized cartoonish eyes.\n- Control Panel (THE SPECIMEN):\n  * Tools: Hand (drag), Finger (poke), Comb (groom);\n  * Color Swatches: Blue, Pink, Purple;\n  * Sliders: STIFFNESS, PILE (fur length), TENSILE STRENGTH;\n  * Actions: Feed, Dash, Stash, Light-up stripes, Smooth fur, Reset;\n- Interactions: Grab anywhere and pull — tail yields high resistance; release to snap back and swim away. Rotate and orbit freely in empty space.\nSingle file self-contained, fully responsive.",
    "promptZh": "构建一个可交互的 3D Web 标本微缩玩具场景：“毛绒小鱼雷旗鱼 (Plush Marlin)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成织物力学与拖拽拉伸物理引擎。\n\n【核心功能与特征】\n- 视觉概念：MATERIAL STUDIES / NO. 118 - “一条严肃又毫无深沉心思的小鱼雷旗鱼 (A very serious fish. Zero serious thoughts. Big eyes. Long bill)”。\n- 主体建模：\n  * 深蓝与雪白肚皮拼色毛绒布料，流线型鱼雷身躯，突出的背鳍与修长剑吻；\n  * 夸张圆润的大纽扣眼睛，自带呆萌反差感表情。\n- 控制面板 (THE SPECIMEN)：\n  * 互动工具：大手抓取 (Hand)、手指轻戳 (Finger)、毛梳梳理 (Comb)；\n  * 面料染料：经典深蓝 (Blue)、樱花粉 (Pink)、神秘紫 (Purple)；\n  * 材质滑块：刚性硬度 (STIFFNESS)、绒毛长度 (PILE 4mm)、抗拉伸强度 (TENSILE STRENGTH)；\n  * 物理动作按钮：投喂 (Feed)、冲刺 (Dash)、发光 (Light-up)、顺毛 (Smooth fur)、重置 (Reset)；\n- 物理交互：抓取任意部位拖拽拉伸，尾部具备强烈弹性回弹阻尼；释放后向前冲刺游弋；空处按住鼠标旋转视角。\n全场景纯代码单文件自包含，无外部素材依赖，完美适配响应式屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://plush-marlin-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/YAtNNHhS8HfwCE4owENLz1"
      }
    ],
    "toolUrl": "https://plush-marlin-astra.vercel.app",
    "assetUrl": null
  },
  {
    "id": "AI-VID-011",
    "title": "毛绒小鱿鱼",
    "category": "video",
    "categoryName": "赛博小玩具",
    "cover": "assets/plush-squid-cover.jpg",
    "video": "assets/plush-squid.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 毛绒小鱿鱼微缩玩具交互系统，包含柔软触手动力学解算、羊毛毡/毛绒材质切换、手指缠绕依附与喷射游弋微交互。",
    "tools": ["Claude Opus 5.5", "GPT-6 Astra", "Three.js / WebGL", "Tentacle Physics"],
    "tags": ["小鱿鱼", "乌贼", "3D 互动", "模型对比", "Three.js", "Plush Squid"],
    "recommend": "精选",
    "promptEn": "Build an interactive 3D Web diorama: \"Plush Squid\" — a single self-contained HTML page using Three.js/WebGL with flexible tentacle chain dynamics and fabric simulation.\n\n【Core Features】\n- Concept: MATERIAL STUDIES / NO. 017 — \"Eight arms. Two tentacles. A little rocket, mostly made of fluff. Lead in a finger.\"\n- Specimen Anatomy: Soft pastel plush body with button eyes; segmented soft-body tentacles with inverse kinematics (IK) physics.\n- Control Panel:\n  * Tools: Hand, Finger, Comb;\n  * Material Swatches: Clay, Plush, Felt;\n  * Sliders: STIFFNESS, PILE, STRETCHABILITY;\n  * Behaviors: Jet propulsion, Tentacle clinging strike, Startle, Smooth fur, Reset;\n- Interactions: Reach in with finger to have tentacles cling and curl around it; pull the mantle to swing and deform with elastic damping; full OrbitControls camera.\nSelf-contained HTML, responsive and high-performance.",
    "promptZh": "构建一个可交互的 3D Web 标本微缩玩具场景：“毛绒小鱿鱼 (Plush Squid)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成柔性触手链条动力学与织物物理引擎。\n\n【核心功能与特征】\n- 视觉概念：MATERIAL STUDIES / NO. 017 - “八腕两触须，由绒毛填充的微型火箭软体小生灵 (A little rocket, mostly made of fluff)”。\n- 主体建模：\n  * 柔和蜜桃橙/浅紫波点毛绒面料，高光纽扣圆眼；\n  * 头部内含松软棉花填充形变，下垂多根柔性分节触手，支持骨骼链条逆向运动学 (IK) 解算。\n- 控制面板 (THE SPECIMEN / Fig. 017)：\n  * 互动工具：大手抓取 (Hand)、手指伸出引逗 (Finger)、小毛梳 (Comb)；\n  * 材质工艺：黏土感 (Clay)、长毛绒 (Plush)、羊毛毡 (Felt)；\n  * 物理滑块：填充硬度 (STIFFNESS)、毛绒长度 (PILE)、柔韧延展度 (STRETCHABILITY)；\n  * 行为触发：喷射加速 (Jet)、触手缠绕 (Strike/Suction)、受惊回缩 (Startle)、顺毛 (Smooth fur)、重置 (Reset)；\n- 物理交互：伸出手指，多条柔性触手会主动向手指吸附缠绕；拖拽外套膜可上下摇晃并产生软体形变；自由 3D 旋转视角。\n全场景纯代码自包含，完美适配桌面与移动端屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "⚡ GPT-6 Astra 体验版",
        "url": "https://plush-marlin-astra.vercel.app"
      },
      {
        "name": "🔮 Opus 5.5 Artifact 体验",
        "url": "https://claude.ai/artifact/YAtNNHhS8HfwCE4owENLz1"
      }
    ],
    "toolUrl": "https://plush-marlin-astra.vercel.app",
    "assetUrl": null
  }
];
