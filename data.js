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
    "tags": ["Three.js", "3D互动", "小水母"],
    "recommend": "精选",
    "promptEn": "Build \"Plush Jellyfish\" — Material Studies No. 013: a single self-contained HTML file, native WebGPU, fully procedural (no assets, no libraries), in the same editorial style as the series (serif masthead, side specimen panel, live readouts, \"Inside the experiment\" notes).\n\nThe specimen: a plush jellyfish floating in still air above a table.\n- Bell: a fuzzy minky dome with a scalloped rim and a paler sewn-on underside with a running stitch. Soft white spots on the crown, glossy bead eyes, blushing cheeks, a stitched smile.\n- Underneath: 10 plush tentacles — stuffed, slightly flattened minky tubes, half of them sewn into loose corkscrews — and 4 wide ruffled fleece frills in the middle.\n\nPhysics:\n- Bell:\n  - XPBD soft body on a hex-cell lattice (co-rotational shape matching + tetrahedral volume), 60 Hz, 6 substeps.\n  - Neutral buoyancy: no gravity, strong medium drag, a hover spring with a slow bob.\n  - Pulse: the rest shapes of the lower bell's cells squeeze in and stretch up (rest volumes follow); each beat gives an upward thrust.\n  - Boop startles it into a faster rhythm; Twirl spins it.\n- Tentacles and frills:\n  - One XPBD cloth: narrow grids sewn to points embedded in the bell lattice, with stretch/shear/bend links, long-range tethers, a drifting current and low weight.\n  - Frills are cut longer at the edges so they ruffle. Curly tentacles keep a corkscrew rest shape, so they spring back.\n  - Every point has a thickness.\n- Collision with the bell:\n  - The ribbons never pass through the bell. Each substep, every point is taken into the bell's best-fit rigid frame (shape-matching rotation of the lattice) and tested against the bell's own signed distance field.\n  - A point closer than its thickness plus the pile is pushed out along the SDF normal, with a little friction along the surface.\n  - Rows right at the seam are exempt, the next ones softened.\n  - The check runs again after the bell is tugged.\n- Holding a tentacle:\n  - When a tentacle is held — by the hand, or wound round the finger — and pulled taut, the tether overrun goes to the seam and tows the whole bell.\n  - The finger is a capsule reaching in from the viewer's side. Tentacles drift against it, wind round it and cling when pressed.\n\nRendering:\n- Shell fur: base + N instanced shells, alpha-to-coverage under 4× MSAA.\n  - The fur lie is carried by the deformation gradient, with a damped-spring tip lag.\n  - Kajiya–Kay highlights, velvet sheen, a comb tool.\n- Tentacles: elliptical tubes swept each frame along the centre of their cloth strip, so twists and curls carry through. They wear the same shell fur with a shorter pile in their own colour.\n- Frills: matte fleece with a picot edge.\n- Lighting: soft key-light shadows, studio floor, Khronos PBR Neutral tone mapping.\n- NaN-safe WGSL: clamped pow and smoothstep, clamped post.\n\nInteraction:\n- Tools:\n  - Hand: grab the bell, or a single tentacle to tow it.\n  - Finger: tentacles wind round it, and the jellyfish follows.\n  - Comb: brush the pile.\n- Buttons: Boop, Twirl, Toss, Smooth fur, Reset.\n- Sliders: Stuffing, Pile, Pulse rate.\n- Palettes: Blush, Lavender, Sea glass.\n- Readouts: mass, volume % of rest, pulse /min, clinging tentacles.\n- Orbit and zoom; responsive stacked layout on phones; adaptive quality; reduced-motion support.",
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
    "tags": ["WebGPU", "3D互动"],
    "recommend": "精选",
    "promptEn": "Build \"Atoll Jelly\" — one self-contained HTML file, native WebGPU + WGSL, sim in plain JS, no external requests. An entry in the editorial \"MATERIAL STUDIES\" series of interactive jelly dioramas: a square cut-out block of turquoise jelly lagoon in the Maldives with a palm islet, a jetty of overwater bungalows, a seaplane that runs its own day, and reef life under the jelly.\n\nPAGE: warm paper (#ece9e3), ink #241f1d, accent #12a2a6, italic serif H1 \"Atoll / Jelly.\", eyebrow \"MATERIAL STUDIES\", caption \"Six bungalows on stilts, a seaplane that comes and goes, and eagle rays gliding through the jelly below.\" Status pill \"WEBGPU · LIVE\". Right glass panel: \"THE LAGOON\" with three dark buttons \"Seaplane\", \"Feed the fish\", \"Float ring\", a thin meter, tally \"Landings · Fed · Afloat\"; \"FLAVOUR\" swatches Turquoise / Sapphire / Lime; sliders Firmness, Wave damping, Tide (±10 cm); Reset · Pause · Reset view. Bottom-left \"HOW TO PLAY\": \"Stir the lagoon. Feed the fish. Wave the seaplane off.\" + one grey line of gestures. Mobile bottom sheet, touch orbit/pinch, WebGPU fallback card, no scroll, no console errors.\n\nSCENE (block 5.2², sea level 1.3): white-sand lagoon ~0.3 deep sloping into a deep \"blue hole\" near the front corner; eight coral heads (bumps) dressed with brain corals, branching corals and sea fans in pink/purple/orange/yellow/teal that sway slightly; a sandy islet in the back-left corner (beach ring, low wooded hump, gummy shrubs, two thatched parasols with loungers) with 8 lush coconut palms (16 arching pinnate fronds each + dry hanging fronds); an open lobby pavilion under a big hipped thatch roof. A plank jetty on thin stilts runs from the islet diagonally across the lagoon with low lamp posts; five bungalows hang off it on alternating sides plus a larger one at the end: plank decks on stilts, pale timber huts with glass doors to the sea, hipped thatched roofs (banded straw texture), plunge pool, two loungers, a steel ladder into the water. A floating seaplane pontoon with a tiny thatched shade, linked to the islet's south beach by a stilted walk. Block cut faces show candy strata (sand, shell band, caramel, chocolate) under translucent jelly walls.\n\nWATER (as \"Island Jelly\"): linear shallow-water sim (168² staggered grid, 120 Hz, √(g·depth) wave speed, small surface tension, damping), finger stirring, block tilting with slosh, floating bodies hand displaced volume back to the sea, splash craters + bubbles, a foam field (white water that fades and laces), caustics, light shafts, refraction, Beer–Lambert flavour absorption, shoreline lace.\n\nSEAPLANE (twin-engine floatplane: white with teal cheatline, high wing with teal tips, struts, twin floats, 3-bladed propellers spinning in the vertex shader): a fixed daily loop — wait at the pontoon → pivot 180° on its floats → taxi out → take-off run (spray) → climb → a racetrack circuit around the diorama at ~3.1 height with banking → approach → touchdown with crater, white water and a jolt → landing run → turn → taxi back to the pontoon. On water it rides the jelly: four float samples set height, pitch and roll; its floats push volume into the sim (wake) and foam. \"Seaplane\" button: leave now if waiting, or hurry the circuit to land early. Counts landings.\n\nREEF LIFE: 42 boids fish in four colour kinds (yellow tang, blue with yellow tail, black-white banded, orange with white bars), schooling with their own kind, wandering, kept in the water (off the floor, under the surface, out of the shallows, inside the block), tails beating in the vertex shader; 3 spotted eagle rays gliding near the floor with wave-flapping wings and whip tails. A finger in the water, any splash, or the seaplane's floats rushing by scatter them. \"Feed the fish\" scatters 16 pellets that float, then sink; fish and rays home in and eat them (counted as Fed).\n\nFLOAT RINGS: inflatable candy-striped rings (pink / orange / blue with white) — light, float high, lie flat on the waves, damped so they never pop out of the jelly, shoved aside by the seaplane; pick up and throw; land on decks and beach too.\n\nQA: hook window.__aj; checks for the full seaplane cycle and one landing, altitude > 2.8, floats riding the surface, touchdown foam + waves, fish always in water, feeding brings fish and gets eaten, a finger scatters a school, rings float flat, stirring makes waves that die down, tilt sloshes and settles, flavours/sliders/pause/orbit/zoom, stress, sim \\x3C 5 ms, no network, no errors, mobile, fallback.",
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
    "tags": ["Three.js", "3D互动", "模型对比"],
    "recommend": "精选",
    "promptEn": "Build a single-file WebGPU interactive experience featuring a soft, squishy plush shark.\n\nDesign the shark with a recognizable silhouette: a rounded body, pointed snout, dorsal fin, side fins, and a powerful tail. Give it a blue fabric exterior, cream belly, glossy black button eyes, stitched gills, and a playful mouth with small felt teeth. Make the fabric visibly fuzzy, with subtle seams and soft shadows.\n\nInteractions:\n- Grab and drag any part of the shark. Its body should stretch, squash, wobble, and settle naturally.\n- Pull its tail and release to make it dash forward.\n- Boop its nose for a cute reaction.\n- Brush its fur with a comb tool.\n- Feed it little fish and animate it chasing and eating them.\n- Let it swim in gentle circles when idle.\n\nUse convincing soft-body physics with volume preservation, springy recovery, and responsive fins and tail. Avoid rigid movement or excessive jitter.\n\nInclude controls for stuffing firmness, fur length, swimming speed, and color palettes. Add reset, feed, dash, and wireframe buttons.\n\nPresent everything in a polished minimalist interface with a warm off-white background, elegant typography, a compact settings panel, and the title “Plush Shark.”\n\nDeliver one self-contained HTML file with all code and assets embedded. Use WebGPU for rendering, support mouse and touch, and keep the experience smooth and responsive.",
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
    "tags": ["Three.js", "3D互动", "模型对比"],
    "recommend": "精选",
    "promptEn": "Create a self-contained interactive WebGPU page \"Plush Crab\" in the existing Material Studies plush series\n(No. 020, fig. 20), matching the series' editorial layout: serif masthead, specimen control panel, live\nreadouts, collapsible \"Inside the experiment\" notes, English UI, works on mobile, graceful no-WebGPU fallback.\n\nTHE TOY: a cute plush crab sitting on a studio table. A wide, puffy domed shell with a flat seat and a soft\nbrow; two eyes on short stalks, each a fuzzy eyeball with a round white felt patch and a glossy safety eye;\nan embroidered smile and soft blush cheeks; pale spots scattered over the top of the shell; a paler\nunderside; stitched seams where legs are sewn on. Real-time shell-texture fur (many shells, alpha-to-coverage,\nMSAA) that lags behind jiggles and can be combed. Palettes: Coral (default), Sand, Blue (with red claw tips).\n\nBODY: one SDF meshed with surface nets, simulated as an XPBD soft body (hex lattice, shape matching +\ntetrahedral volume) under gravity and friction; it breathes, rights itself, can be grabbed, squashed,\nlifted and thrown, and lands softly.\n\nLEGS AND CLAWS: eight walking legs and two arms are rods with a plastic \"wire\" inside — posed toward\nblended targets (sit, stand, hide, wave, hang), and bent legs keep the new shape until \"Straighten\".\nEach arm ends in a chunky claw with two fat fingers that hang from the arm tip in the claw's own frame;\nopening and closing is a single angle. Legs get pale joint bands and toes; claw fingers get dark tips.\n\nBEHAVIOUR: \"Scuttle\" walks sideways (keeps its side to the goal) with an alternating gait and footholds;\n\"Snip snip\" raises both claws and snaps them a beat apart (count snips in a readout); \"Hide\" pulls the legs in\nand covers its eyes with the claws, then peeks out; \"Wave claws\" raises them high. With the Finger tool it\nscuttles toward a held-out finger, turns to face it, reaches with its claws and gives a gentle pinch (toast);\npoking the shell makes it hide. Held up in the air, legs dangle and paddle. Idle: small scuttles, snips, waves.\n\nCONTROLS: tools Hand / Finger / Comb; sliders Stuffing, Pile, Wire; buttons Scuttle, Snip snip, Hide,\nWave claws, Straighten, Smooth fur, Reset; ¼ speed, Mesh, Pause. Readouts: Mass, Volume (% of rest),\nSteps, Snips. Single HTML file, no external models or textures.",
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
    "tags": ["Three.js", "3D互动", "模型对比", "物理模拟"],
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
    "tags": ["Three.js", "3D互动", "模型对比"],
    "recommend": "精选",
    "promptEn": "Build a single-file interactive WebGPU page called \"Plush Hammerhead\".\n\nPage: an editorial layout with a big two-line title \"Plush / Hammerhead.\", a warm studio-grey background, a control panel on the right, live readouts and collapsible technical notes. English UI.\n\nThe toy: a plush hammerhead shark. It has a wide, flat hammer-shaped head (cephalofoil) whose ends sweep back a little, with a shallow notch at the middle of the front edge. A glass eye sits on each tip of the hammer, looking out sideways. It has a tall sickle-shaped dorsal fin, two pectoral fins and a tail with a long upper lobe and a small lower one. A cream belly panel is sewn on below a seam along each flank, with embroidered gill lines. A smiling mouth is cut in under the hammer, lined with felt and set with soft white felt teeth; its lower jaw swings open on a hinge.\n\nSimulation:\n- Body, hammer and fins are one signed distance field filled with a soft-body XPBD lattice: shape-matched hexahedral cells and tetrahedral volume preservation. It is skinned to a high-res surface-nets mesh.\n- It swims with a travelling S-wave that bends the cells' rest shapes side to side, more toward the tail, and steers by turning its head, the body curving into each turn.\n- Fur is drawn as alpha-to-coverage shells over minky pile. The pile lags behind each jiggle on a spring and can be combed.\n\nBehaviour:\n- It circles its space.\n- Scan: it sweeps its hammer side to side over the floor the way real hammerheads hunt. It also does this on its own now and then, and a little while hunting.\n- Feed drops in a felt fish: it turns, closes in faster, opens wide and snaps it up.\n- Dash is a burst of fast tail beats; Chomp opens the mouth and snaps it shut.\n- Grab it by the tail and it thrashes; let go and it shoots off.\n- Boop the middle of the hammer with the finger and it wriggles and blushes.\n\nTools: Hand, Finger, Comb.\n\nControls:\n- Buttons: Feed, Dash, Scan, Chomp, Smooth fur, Reset, Pause.\n- Toggles: Circle, quarter speed, Mesh.\n- Sliders: Stuffing, Pile, Tail beat.\n- Three fabrics: Bronze, Lagoon, Sunset.\n- Readouts: mass, volume, beats per minute, fish eaten.\n- Phone layout with a stacked panel.",
    "promptZh": "构建一个可交互的 3D Web 微缩玩具模型场景：“毛绒双髻锤头鲨 (Plush Hammerhead)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成物理交互引擎。\n\n【核心功能与特征】\n- 主体建模：高拟真触感毛绒双髻锤头鲨玩具，具备毛毡/翻毛皮质感外壳，独特的横向 T 形锤头构造（双眼位于两侧端点），呈柔缓 S 形摆动的充填躯干以及自然柔韧的鱼鳍。\n- 交互控制面板：\n  - 交互工具库：手掌工具（挤压抓取 / 拖曳悬停）、手指工具（单点戳碰）、小毛梳（顺平绒毛纤维以改变反光方向）。\n  - 材质与外观调节：三色色块切换（冷灰蓝 Teal、温暖浅灰 Grey、珊瑚粉 Pink），充填物软硬度滑块 (Stuffing: 0.0 - 1.0)，绒毛长度与粗糙度滑块。\n  - 动作行为触发器：投喂 (Feed)、冲刺 (Dash)、扫描分析 (Scan)、充能 (Charge)、抚平毛发 (Smooth fur)、重置场景 (Reset)、暂停动态 (Pause)。\n  - 物理动力学互动：抓住锤头任意一侧拖动时产生带惯性的摆动与回正力矩；轻抚背部可平整毛流改变光泽。\n- 界面风格：高级复古现代标本实验台风格，附带标本编号与物理质量/体积实时读数面板，完全自适应各端屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "ChatGPT-6 Astra 体验",
        "url": "https://plush-hammerhead-astra.vercel.app/"
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
    "tags": ["Three.js", "3D互动", "模型对比"],
    "recommend": "精选",
    "promptEn": "Create a self-contained interactive WebGPU/WGSL page \"Pirate Jelly\" — part of a \"Material Studies\" series of jelly dioramas. Single HTML file, no external models, textures, fonts or libraries; everything procedural. English UI.\n\nLOOK & LAYOUT\n- A square block of translucent jelly sea (≈5.2 × 5.2 units) standing on a paper-studio floor; the camera looks in at the front corner at ~27°. The block's cut faces show candy strata (chocolate bedrock, caramel clay, a shell band, vanilla sand); the sea surface and walls refract and tint what's behind them, with caustics on the sea floor, light shafts, a tinted caustic shadow on the floor, foam lace on the shoreline and a bright meniscus on the cut edges.\n- A small tropical island toward the back: sandy beach, a cove facing the viewer, a mossy jungle hump with ~9 gummy palms (ringed caramel trunks, translucent fronds that flutter), lumpy gummy bushes with flowers, ferns, beach grass, rocks around the shore.\n- SKULL ROCK at the island's west tip, standing in the shallows: a cartoon skull sculpted as a signed-distance field (cranium, cheekbones, jaws, deep eye sockets, heart-shaped nose, crack on the crown, rock strata and noise, moss on top, a wet band at the waterline), meshed with surface nets; two rows of separate box teeth set into a carved grin. At night its eye sockets glow like a candle-lit cave.\n- A PIRATE SHIP riding at anchor in front of the island, seen at three-quarters from the stern: black hull with an ochre gunport strake, red bottom, gunports with cannons, raised quarterdeck with lit stern windows and a stern lantern, three masts (square courses and topsails on fore and main, a gaff sail on the mizzen, a jib to the bowsprit), shrouds and stays, and a Jolly Roger (skull and crossed bones drawn procedurally in the shader) streaming aft. Her anchor chain runs from the bow down through the jelly to an anchor lying on the sea floor.\n- The camp on the cove beach: a campfire (stone ring, teepee of logs with glowing ends, embers, a tripod with a pot, two seating logs), an iron-bound treasure chest under a leaning palm with a hinged lid and a heap of gold and gems inside, a shovel in a sand heap, barrels, a crate, a pyramid of round shot, a rum bottle, a rowing boat pulled up with its bow on the sand, and an \"X\" scored in the sand.\n- On the sea floor: the bow half of an old wreck lying on its side with ribs showing and its broken mast beside it, swaying kelp, a few doubloons, bubbles caught in the jelly.\n\nSIMULATION\n- Linear shallow-water waves on a staggered grid with a little surface tension (springy jelly); the block can be tipped and the sea sloshes and the jelly wobbles (shear + squash).\n- The ship floats on 10 buoyancy points (heave, pitch, roll), is pushed by a gently veering offshore breeze, held by an elastic anchor rode at the bow, and weathervanes into the wind. Her displaced volume is handed back to the sea, so she makes a wake.\n- Rigid bodies: cannonballs (dense, fly in a clean arc, punch a crater, sink and roll on the floor), barrels (float on their side), doubloons (flutter down and settle flat). All interact with the sea (buoyancy, drag, splashes, bubbles), the terrain, the skull, the props, the palm trunks and the ship's hull.\n- One particle system: fire flames (additive), embers, woodsmoke, muzzle flash, white gunsmoke, sea spray, sand puffs, gold glints over the open chest, fireflies at night.\n\nINTERACTION\n- Tap the ship → fire the next gun on the side facing the viewer (ball, flash, smoke, recoil heel). Drag the ship → tow her against the rode; release → she drifts back to her anchor.\n- Tap the chest → lid swings open/shut with a bounce; gold glitters. Tap the fire → it roars and throws sparks. Tap the X → three doubloons pop out of the sand.\n- Drag across the water to make waves; drag a side of the block to tip it; pick up and throw balls/barrels/coins; drag a palm to bend it; drag empty space or right-drag to orbit; wheel/pinch to zoom.\n\nTIME OF DAY\n- A slider from Noon → Afternoon → Golden hour → Sunset → Dusk → Night → Midnight. The sun lowers and warms, the backdrop turns peach, then the moon takes over (dim blue), stars appear on the backdrop, the page UI switches to a dark theme, and the campfire becomes the main light: a flickering point light that warms the sand, palms, sails and gold, reflects in the water, and lights the smoke from below. Stern windows and lantern glow.\n\nUI (editorial, like the series)\n- Top-left masthead: eyebrow \"MATERIAL STUDIES\", big italic serif title \"Pirate / Jelly.\", a short line of copy.\n- Status pill (WebGPU · Live / Paused / Unavailable).\n- Right glass panel: \"The cove\" — buttons Fire a gun / Doubloons / Barrel, a liveliness meter, tally Shots · Afloat · Sunk; \"Flavour\" — Turquoise, Rum (amber), Kraken (violet) jelly palettes; sliders Firmness, Wave damping, Time of day; Reset / Pause / Reset view.\n- Bottom-left \"How to play\" line plus small instructions. Space fires a gun.\n- Mobile: the panel becomes a bottom sheet; touch orbit and pinch zoom.\n- Fallback card when WebGPU (or an adapter) isn't available. Respect prefers-reduced-motion.",
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
    "tags": ["Three.js", "3D互动", "交互玩具", "物理模拟"],
    "recommend": "精选",
    "promptEn": "Build a single-file WebGPU \"material study\" page called \"Plush Cow\" in the same studio style as my previous plush toys (plush goat / crab / shark / penguin): editorial layout, large italic serif title \"Plush / Cow.\", kicker \"Material Studies / No. 029\", live status chip, specimen panel with tools and sliders, stats row (Mass, Volume, Steps, Moos), collapsible \"Inside the experiment\" notes. UI in English, works on mobile (no horizontal scroll).\n\nThe toy: a round stuffed Holstein cow (inspired by the cartoon cow that runs on its udder) who stands and runs on the four teats of her big pink udder — the splayed teats are her only legs. Body = one smooth SDF (round barrel body, big head, wide hot-pink muzzle, rounded udder with a crease, four teats ending in felt pads, a rope tail with a black shaggy tuft) meshed with surface nets. Black Holstein spots with wobbly edges (one around an eye), glossy button eyes, stubby cream felt horns, embroidered oval nostrils and a smile, pink blush, and two cloth ears sewn on sticking straight out at the sides (white outside, pink inside) that flap like wings.\n\nPhysics: XPBD soft body on a hex lattice (shape-matched cells + tetrahedral volume preservation, volume readout ~100%), skinned to the mesh. Posture-driven locomotion: teat nodes are feet with footing targets, swing lift and a lead point; trot in diagonal pairs (front-left + back-right, then the others). Behaviours: Trot (wanders), Gallop (bouncy laps), Hop (airborne, ears beat like wings), Moo (WebAudio low sawtooth \"mmm-OOO\" through an opening/closing lowpass, ears flick up, slow head toss), Topple (falls on her side and rocks back up), Smooth fur, Reset. Booping her nose with the finger makes her moo.\n\nFur: real-time shell fur with per-vertex pile (soft coat, short head, velvety pink muzzle and udder, long tail tuft and forelock), combable with the Comb tool. Tools: Hand (grab & squash, pull ears), Finger (poke / she follows it), Comb. Sliders: Stuffing, Pile (mm), Table friction (felt ↔️ ice). Palettes: Holstein, Jersey, Strawberry. 60 fps.",
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
    "tags": ["Three.js", "3D互动", "模型对比"],
    "recommend": "精选",
    "promptEn": "Build a single-file WebGPU \"material study\" page called \"Castle Jelly\", in the style of my jelly diorama series (Pirate Jelly / Island Jelly): a square block of wobbly jelly lake on a table in a paper studio, cut faces showing candy strata, italic serif masthead \"Castle / Jelly.\", glass control panel on the right, \"How to play\" line at the bottom-left, UI in English, mobile bottom-sheet layout.\nThe diorama: a fairy-tale castle on a cliff. The back-left of the block is a plateau whose front is a sheer wall of candy-striped rock (layer-cake strata that match the block's cut faces, a talus under the lake), meshed from an SDF with surface nets, mossy where it faces up. On the lawn: a cream castle with round towers, glossy pink/lilac/blue cone roofs, gold finials, fluttering pennants, crenellated walls, a great hall, arched windows (dark glass by day, lamplight at night), a gatehouse with a drawbridge, a brazier by the gate, gummy pines, flowering bushes, reeds. A river wells up from a spring, runs past the gate under the drawbridge and pours off the lip as a waterfall that arcs down into the jelly lake — and keeps going inside the jelly: a fraying plume, bubbles driven down then rising, bright threads of current streaming along the lake floor. The falls pound the surface (shallow-water waves, foam, spray, mist). A little royal galleon (blue hull, white sails, crown standard) sails laps of the lake.\nInteractions: Fireworks (rockets off the towers, coloured bursts that light the castle and the lake; automatic at night), Lower/Raise bridge, Royal salute (ship fires, splash), Wishing coins (into the pool under the falls); tap a tower / the gate / the brazier / the ship, drag the water to make waves, tip the block, throw coins and balls, bend the pines. Sliders: Firmness, Waterfall (flow), Wave damping, Time of day (noon → sunset → night with stars). Flavours: Glacier, Rose, Lilac. Shadows, caustics, refraction through the jelly, fixed-step physics.",
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
      },
      {
        "name": "体验地址",
        "url": "https://www.perplexity.ai/search/76db86b6-de61-496b-8b91-1ad04020de11?preview=1"
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
    "tags": ["Three.js", "3D互动", "模型对比"],
    "recommend": "精选",
    "promptEn": "Create \"Frostbay.\" — an interactive miniature Arctic diorama as ONE self-contained HTML file using native WebGPU (WGSL). Everything procedural: no libraries, no imported models, no image textures, no network requests.\n\nSCENE\n- A clear rectangular block of cold sea (≈10 × 7 units, ~1.6 deep) resting on a thick, glossy jelly foundation with rounded edges and soft layered bands of icy blue and pale lavender.\n- A snowy rock island toward the back: wet dark rock at the tide line, a cut \"core-sample\" cross-section where it meets the glass, a few rounded boulders on the sea floor.\n- An igloo built from individual curved snow blocks (rows offset like brickwork), a block entrance tunnel, a warm amber ice window and a glowing interior.\n- A wooden plank pier on posts with a hanging lantern; a fluttering red-and-white flag on a pole.\n- An orange kayak with a double-bladed paddle; ~10 irregular ice floes; a larger ice raft.\n- Two harbour seals (spotted, pale muzzle): one basking on a shore ledge of the island, one lying on the raft.\n- A humpback whale: one smooth continuous lofted body, pale throat pleats and belly, mouth line, eyes, knobbly rostrum, very long pale flippers, small dorsal fin, wide flukes.\n- Calm editorial backdrop; the diorama casts a soft shadow on an unseen floor.\n\nWATER (a real simulation, not a shader trick)\n- Height-field long-wave sim (∂²h/∂t² = ∇·(g·depth ∇h)) on a ~200×140 grid, flux form (volume-conserving), fixed 180 Hz substeps, damping + light viscosity + hard clamps: stable at every slider setting and during frantic drags.\n- Waves slow and steepen over the shallows, wrap around the island, reflect off the glass and settle.\n- Press = a soft plunger making a deep hollow with a raised, volume-neutral rim; dragging sweeps it (speed-limited) and leaves real 3D wakes. Hover never makes waves. Touch supported.\n- Dragging a glass side tilts and slides the block on its jelly (damped springs that wobble back) and the sea sloshes toward the new level; a local soft bulge follows the hand. Pulling a jelly edge stretches it locally, then it wobbles home.\n- Floating things follow local height and averaged slope, drift, bump each other, avoid shallows and glass.\n\nLIFE\n- Kayak: draggable (with a wake). A strong local wave — high swing AND steep averaged slope across the hull — rolls it 180° and leaves it upside down; ordinary ripples and blizzard chop only rock it; never capsizes while held.\n- Raft seal: breathes, looks around, articulated flippers. Strong waves make it lose balance, slip off head-first, fall in with a splash, then swim — head up, coordinated hind-flipper strokes, steering away from shallows and glass — and later hauls itself back onto the raft.\n- Shore seal: breathes, gazes, scratches with a fore flipper, lifts its head when big waves come.\n- Whale: its spine follows the path its head has swum, so it always moves head-first and bends through turns, never sliding backward. \"Call the whale\" (button or double-click / double-tap) brings it up to the surface, it blows a misty spout, its back heaves the water, then it dives with the flukes rolling under.\n\nLOOK\n- Opaque pass to HDR with 4× MSAA plus a distance buffer; water pass with screen-space refraction (wave-driven), depth absorption (deep cold blue, no tropical turquoise), Fresnel sky reflection, restrained soft highlights, foam on crests and shallows, side walls showing the underwater cross-section with a crisp waterline and total internal reflection.\n- Moving caustics on everything under the surface, focused by the live wave curvature; soft key-light shadows; neutral tone mapping.\n- Modes: Daylight, Snowfall (overcast, falling snow), Aurora night (green/violet curtains, twinkling stars, warm igloo and lantern light with reflections on the water). Blizzard toggle: dense wind-driven snow, gusts and chop on the sea.\n\nUI\n- Restrained editorial layout: large italic serif \"Frostbay.\", short atmospheric subtitle, live status pill, compact panel (weather segments, blizzard switch, jelly firmness, wave damping, tide, Call the whale, Pause, Reset, Camera), concise hints, readouts for seal, kayak, whale and swell; orbit and zoom (pinch on touch).\n- Pause freezes all motion; Reset restores sea, block, raft seal and upright kayak.\n- Mobile: stacked layout, collapsible controls, ≥44 px touch targets. Clear fallback card if WebGPU is unavailable.\n\nTest water interaction, stability, animals, kayak drag and capsize, whale call, weather modes, pause/reset, shader compilation and mobile layout. Return the finished HTML only.",
    "promptZh": "构建一个可交互的 3D Web 微缩极地场景：“霜湾极光果冻海 (Frostbay)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成水体流体阻尼与极地天气物理引擎。\n\n【核心功能与特征】\n- 视觉概念：“极地冰冷微缩世界——厚重果冻水体包裹的极地断层 (A pocket of the polar sea, set in a block of clear water on a slab of jelly)”。\n- 冰川与浮岛：中央玄武岩极地岛屿，覆盖积雪圆顶观测站/因纽特雪屋，悬挂微缩红旗；四周散落浮冰块，水下可见深海巨鲸游弋巡航。\n- 极光与天幕：支持昼夜与天气切换（晴空、极地暴风雪、幽蓝极光 Aurora 律动）。\n- 控制面板 (THE BAY / THE SEA)：\n  * 按钮：呼唤巨鲸 (Call the whale)、平息风浪 (Calm the sea)、极光天气切换；\n  * 滑块：风力调节 (Wind)、波浪阻尼 (Wave damping)、潮汐高度 (Tide)；\n  * 镜头控制：暂停 (Pause)、重置 (Reset)、重置视角 (Reset view)；\n- 物理交互：鼠标左键拖拽旋转视角（OrbitControls），右键平移，滚轮缩放；点击水面激起果冻涟漪，拖拽水体观察果冻弹性形变。\n全场景纯代码实现，无外部重依赖，完美适配响应式屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "ChatGPT-6 Astra 体验",
        "url": "https://frostbay.vercel.app/"
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
    "tags": ["Three.js", "3D互动", "模型对比", "小鱼雷"],
    "recommend": "精选",
    "promptEn": "Build a single-file WebGPU \"material study\" page called \"Plush Marlin\" in the same studio style as my plush hammerhead / plush shark: editorial layout, italic serif title \"Plush / Marlin.\", kicker \"Material Studies / No. 030\", live status chip, specimen panel (tools, fur palettes, sliders, action buttons), stats row (Mass, Volume, Beat, Fish eaten), collapsible \"Inside the experiment\" notes. UI in English, works on mobile.\n\nThe toy: a plush blue marlin, normal and realistic in proportion (not a meme). One SDF body meshed with surface nets: a long fusiform body, deep behind the head and slender at the tail stock, laterally compressed; a long tapering felt bill (spear) from the upper jaw, slightly upturned; a tall sail-like first dorsal fin raked back from a high peak over the head and running low down the back; a small second dorsal and anal fin; long narrow scythe pectorals and thin pelvic fins; a tall crescent (lunate) tail with the notch scooped out; big glass eyes; a small mouth slit under the bill with a lower jaw that swings open on a hinge.\n\nPhysics: XPBD soft body on a hex lattice (shape-matched cells + tet volume preservation), skinned to the mesh. It swims with a stiff travelling wave mostly in its back third, circles, banks into turns. Behaviours: Feed (a felt fish drops in; it hunts it down and snaps it up), Dash, Slash (quick side-to-side swipes of the bill, like a marlin stunning prey), Light up (its flank bars glow electric blue; they also flash when you touch its bill or when it eats). Grab it by the tail and it thrashes.\n\nFur: real-time shell fur — cobalt back, silver belly panel below a seam, pale vertical bars on the flanks, dark spots on the sail, an embroidered gill-cover seam, bare felt bill. Tools: Hand, Finger, Comb. Sliders: Stuffing, Pile, Tail beat. Palettes: Blue, Black, Indigo. 60 fps.",
    "promptZh": "构建一个可交互的 3D Web 标本微缩玩具场景：“毛绒小鱼雷旗鱼 (Plush Marlin)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成织物力学与拖拽拉伸物理引擎。\n\n【核心功能与特征】\n- 视觉概念：MATERIAL STUDIES / NO. 118 - “一条严肃又毫无深沉心思的小鱼雷旗鱼 (A very serious fish. Zero serious thoughts. Big eyes. Long bill)”。\n- 主体建模：\n  * 深蓝与雪白肚皮拼色毛绒布料，流线型鱼雷身躯，突出的背鳍与修长剑吻；\n  * 夸张圆润的大纽扣眼睛，自带呆萌反差感表情。\n- 控制面板 (THE SPECIMEN)：\n  * 互动工具：大手抓取 (Hand)、手指轻戳 (Finger)、毛梳梳理 (Comb)；\n  * 面料染料：经典深蓝 (Blue)、樱花粉 (Pink)、神秘紫 (Purple)；\n  * 材质滑块：刚性硬度 (STIFFNESS)、绒毛长度 (PILE 4mm)、抗拉伸强度 (TENSILE STRENGTH)；\n  * 物理动作按钮：投喂 (Feed)、冲刺 (Dash)、发光 (Light-up)、顺毛 (Smooth fur)、重置 (Reset)；\n- 物理交互：抓取任意部位拖拽拉伸，尾部具备强烈弹性回弹阻尼；释放后向前冲刺游弋；空处按住鼠标旋转视角。\n全场景纯代码单文件自包含，无外部素材依赖，完美适配响应式屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "ChatGPT-6 Astra 体验",
        "url": "https://plush-marlin-astra.vercel.app/"
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
    "tags": ["Three.js", "3D互动", "模型对比", "小鱿鱼"],
    "recommend": "精选",
    "promptEn": "Build a single-file WebGPU \"material study\" page called \"Plush Marlin\" in the same studio style as my plush hammerhead / plush shark: editorial layout, italic serif title \"Plush / Marlin.\", kicker \"Material Studies / No. 030\", live status chip, specimen panel (tools, fur palettes, sliders, action buttons), stats row (Mass, Volume, Beat, Fish eaten), collapsible \"Inside the experiment\" notes. UI in English, works on mobile.\n\nThe toy: a plush blue marlin, normal and realistic in proportion (not a meme). One SDF body meshed with surface nets: a long fusiform body, deep behind the head and slender at the tail stock, laterally compressed; a long tapering felt bill (spear) from the upper jaw, slightly upturned; a tall sail-like first dorsal fin raked back from a high peak over the head and running low down the back; a small second dorsal and anal fin; long narrow scythe pectorals and thin pelvic fins; a tall crescent (lunate) tail with the notch scooped out; big glass eyes; a small mouth slit under the bill with a lower jaw that swings open on a hinge.\n\nPhysics: XPBD soft body on a hex lattice (shape-matched cells + tet volume preservation), skinned to the mesh. It swims with a stiff travelling wave mostly in its back third, circles, banks into turns. Behaviours: Feed (a felt fish drops in; it hunts it down and snaps it up), Dash, Slash (quick side-to-side swipes of the bill, like a marlin stunning prey), Light up (its flank bars glow electric blue; they also flash when you touch its bill or when it eats). Grab it by the tail and it thrashes.\n\nFur: real-time shell fur — cobalt back, silver belly panel below a seam, pale vertical bars on the flanks, dark spots on the sail, an embroidered gill-cover seam, bare felt bill. Tools: Hand, Finger, Comb. Sliders: Stuffing, Pile, Tail beat. Palettes: Blue, Black, Indigo. 60 fps.",
    "promptZh": "构建一个可交互的 3D Web 标本微缩玩具场景：“毛绒小鱿鱼 (Plush Squid)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成柔性触手链条动力学与织物物理引擎。\n\n【核心功能与特征】\n- 视觉概念：MATERIAL STUDIES / NO. 017 - “八腕两触须，由绒毛填充的微型火箭软体小生灵 (A little rocket, mostly made of fluff)”。\n- 主体建模：\n  * 柔和蜜桃橙/浅紫波点毛绒面料，高光纽扣圆眼；\n  * 头部内含松软棉花填充形变，下垂多根柔性分节触手，支持骨骼链条逆向运动学 (IK) 解算。\n- 控制面板 (THE SPECIMEN / Fig. 017)：\n  * 互动工具：大手抓取 (Hand)、手指伸出引逗 (Finger)、小毛梳 (Comb)；\n  * 材质工艺：黏土感 (Clay)、长毛绒 (Plush)、羊毛毡 (Felt)；\n  * 物理滑块：填充硬度 (STIFFNESS)、毛绒长度 (PILE)、柔韧延展度 (STRETCHABILITY)；\n  * 行为触发：喷射加速 (Jet)、触手缠绕 (Strike/Suction)、受惊回缩 (Startle)、顺毛 (Smooth fur)、重置 (Reset)；\n- 物理交互：伸出手指，多条柔性触手会主动向手指吸附缠绕；拖拽外套膜可上下摇晃并产生软体形变；自由 3D 旋转视角。\n全场景纯代码自包含，完美适配桌面与移动端屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "ChatGPT-6 Astra 体验",
        "url": "https://plush-marlin-astra.vercel.app/"
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
    "id": "AI-VID-014",
    "title": "毛绒鲸鱼",
    "category": "赛博小玩具",
    "categoryName": "赛博小玩具",
    "cover": "assets/2112487852156063849.jpg",
    "video": "assets/2112487852156063849.mp4",
    "desc": "使用原生 Three.js + WebGL 搭建的 3D 治愈毛绒大翅鲸交互系统，包含手工毛毡双重接缝线、尾鳍摆动流体力学，支持水面上浮换气与星空游弋微交互。",
    "tools": [],
    "tags": ["3D互动", "毛绒系", "毛绒鲸鱼"],
    "recommend": "普通",
    "promptEn": "Build an interactive 3D plush whale playground in the browser. Make it round, fluffy, and hilariously goofy, with oversized googly eyes, a wide opening mouth, tiny fins, and a floppy tail. No thoughts, just krill.\n\nUse soft-body physics so the whale squishes, stretches, wobbles, and springs back when dragged. Let me grab its fins and tail, poke its belly, comb its fur, feed it krill, trigger a tiny fountain, and make it do a ridiculous flip.\n\nRender dense plush fur, visible stitching, soft shadows, and a fabric-lined mouth. Add blue, orca, and lavender color options, plus controls for stuffing firmness, fur length, and animation speed.\n\nPresent it as a playful material study on a warm cream background, with elegant serif typography and a compact control panel. Keep the whale as the main focus. All interactions should work, and the result should feel tactile, polished, and genuinely funny.",
    "promptZh": "构建一个可交互的 3D Web 治愈系手工毛毡玩具场景：“毛绒座头鲸 (Plush Humpback Whale)”——单文件自包含 HTML，使用 Three.js/WebGL 渲染并集成手工缝线网格与大翅鲸游弋流体力学。\n\n【核心功能与特征】\n- 主体建模与毛毡工艺：\n  * 粗羊毛粗纺面料，背部墨蓝毛呢，腹部带有平行棱条米白毛毡拼接缝线；\n  * 宽大修长的大翅胸鳍与扇形带波浪凹凸外缘的水平尾鳍，纯手缝针脚细节。\n- 游动动力学与交互反馈：\n  * 优雅下潜起伏步态：大翅鳍随身体柔性舒展，尾鳍上下规律拍打形成真实鲸跃律动；\n  * 互动反馈：抚摸鲸头触发它发出空灵低沉的深海鲸鸣音效，同时背部喷出毛毡小水花。\n- 交互控制面板 (The Specimen / No. 072)：\n  * 动作按钮：深海跃升 (Breach)、翻滚下潜 (Dive)、喷发水雾 (Spout)、温柔顺毛；\n  * 面料颜色切换：深邃墨蓝、烟灰石墨、雪白白化鲸；\n  * 参数调节：游动速度、毛绒蓬松度、海水阻尼。\n全场景纯代码自包含，完美适配桌面与移动端屏幕。",
    "negativePrompt": null,
    "links": [
      {
        "name": "Claude Opus 5.5 体验",
        "url": "https://claude.ai/artifact/41Hi4UgDJsZLQz3eNYmjj6"
      },
      {
        "name": "ChatGPT-6 Astra 体验",
        "url": "https://plush-meme-whale.vercel.app/"
      }
    ],
    "toolUrl": "https://claude.ai/artifact/41Hi4UgDJsZLQz3eNYmjj6",
    "assetUrl": null
  },
  {
    "id": "AI-VID-013",
    "title": "果冻石榴",
    "category": "web",
    "categoryName": "赛博小玩具",
    "cover": "assets/2114311516698886225.jpg",
    "video": "assets/2114311516698886225.mp4",
    "desc": "使用原生 WebGPU + XPBD + SDF 模拟的 3D 果冻石榴微缩玩具交互系统，包含透光折射果肉与切面籽粒、四面体软体共旋形变力学、散落籽粒刚体碰撞弹跳与软抓取拉拽拔籽交互。",
    "tools": [],
    "tags": ["3D互动", "果冻系", "物理模拟", "石榴"],
    "recommend": "普通",
    "promptEn": "Build a single-file WebGPU page \"Pomegranate Jelly\" (Material Studies No. 040): half a pomegranate made of jelly, cut lengthwise through its crown and lying on its rind in a pale photo studio.\n\nSimulation: an XPBD tetrahedral soft body built from a signed-distance fruit on a snapped hex lattice (5 tets per cell), with co-rotational shape matching, volume constraints, edge damping, floor friction and a soft grab with wheel or two-finger twist. The rind is firm; the interior is soft.\n\nGeometry and look:\n- body: a slightly shouldered round fruit with a hollow half-crown and sepals at one end and a stem dimple at the other\n- surface: a thin red skin with lenticels and paler blush, a cream rind with a yellow lining\n- inside: white membranes as wobbled Voronoi bisectors of 13 chamber seeds (running mostly lengthwise, flaring into the rind), a short core at the stem end, and clear ruby juice just below the cut\n- the shader rebuilds the same fields per pixel from rest-space coordinates; the body is rendered with refraction and Beer-Lambert absorption using back-face thickness\n\nArils:\n- ~330 faceted, slightly pointed arils packed into the chambers: largest-fit hex sweep on top, then random fill below\n- each is embedded in the tets and rides the wobble\n- fake translucency: refract the view ray, measure the chord through the aril and its closest pass to the pale seed; deep where thick, bright where thin, wet glossy highlights\n- pulling an aril tugs the jelly until a break distance, then it pops into the hand\n- loose arils are rigid bodies that bounce, roll with facet friction and collide with each other, with arils still in the fruit, and with the fruit itself (tet lookup, mapped to rest space, SDF push-out along the deformed normal, momentum exchange with the jelly)\n- a \"Shake a few loose\" button\n\nUI: three varieties (Crimson, Rose, Ivory), firmness and damping sliders, reset, quarter speed, show mesh, pause; readouts for mass, volume and loose arils; an \"Inside the experiment\" notes panel; a stacked mobile layout.",
    "promptZh": "构建一个单文件 WebGPU 页面「Pomegranate Jelly」（材质研究第 040 号）：一颗用果冻做的半个石榴，沿冠部纵向切开，以果皮朝下的姿态躺在一个浅色摄影棚里。\n\n**模拟**：XPBD 四面体软体，从 SDF 果实构建，铺在 snapped 六边形晶格上（每格 5 个四面体）；带共旋形状匹配（co-rotational shape matching）、体积约束、边阻尼、地面摩擦，以及用滚轮或双指扭转实现的软抓取（soft grab）。外皮硬，内部软。\n\n**几何与外观**：\n- 主体：略带肩部的圆形果实，一端是空心的半冠加萼片，另一端是茎窝\n- 表面：薄薄的红皮，带气孔（lenticels）和更浅的红晕；奶油色外皮，内衬偏黄\n- 内部：白色隔膜，用 13 个腔室种子点的 Voronoi 二分面（加扰动）生成，大多纵向延伸、向外皮外张；茎端有一段短芯；切口正下方是清亮的红宝石色汁液\n- 着色器按像素从静息空间坐标重建同一组场；果体用折射 + Beer–Lambert 吸收渲染，厚度取自背面\n\n**籽粒（arils）**：\n- 约 330 颗带切面、略尖的籽，塞满各腔室：上层用 largest-fit 六边形扫描排布，下层随机填充\n- 每颗都嵌在四面体网格里，跟着晃动一起动\n- 假半透明：折射视线方向，量出穿过籽粒的弦长，以及视线与浅色种子的最近距离；厚的部分深、薄的部分亮，再加湿润高光\n- 拉动一颗籽会拽动果冻，直到达到断裂距离，然后「啵」地弹进手里\n- 散落的籽是刚体：会弹跳、带切面摩擦地滚动，并与彼此、与果内剩余的籽、与果实本体碰撞（四面体查找 → 映射回静息空间 → 沿形变后法线做 SDF 推出 → 与果冻交换动量）\n- 有一个「Shake a few loose」按钮\n\n**界面**：三种品种（Crimson 绯红 / Rosé 桃红 / Ivory 象牙白）、硬度与阻尼滑杆、重置、¼ 速度、显示网格、暂停；质量、体积、散落籽数量的读数；一个「Inside the experiment」说明面板；移动端采用堆叠布局。",
    "negativePrompt": null,
    "links": [
      {
        "name": "体验地址",
        "url": "https://claude.ai/artifact/AX1qpMoR4a8EPXnkX282qK"
      }
    ],
    "toolUrl": "https://claude.ai/artifact/AX1qpMoR4a8EPXnkX282qK",
    "assetUrl": null
  }
];
