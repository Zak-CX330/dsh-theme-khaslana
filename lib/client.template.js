/**
 * dsh-theme-khaslana —— 白厄（卡厄斯兰那）同人主题 · 浏览器端
 *
 * v0.5.0 · 三形态
 *   white —— 白厄 · 白昼（冰蓝白，亮色，☁）——「人」的形态
 *   sun   —— 卡厄斯兰那 · 曜日（黑金 + 日轮，☀）——「神性」形态
 *   moon  —— 盗火行者 · 星渊（深蓝紫 + 星云辉光 + 冷白，☾）
 *
 * 跟随时间：每 8 小时轮换（06–14 white，14–22 sun，22–06 moon）。
 * 手动切换：右下角浮动按钮。选择持久化在 localStorage。
 *
 * 机制与 dsh-theme-firefly / dsh-cyrene-theme 相同：
 *   window.__ModuleLoader__.load() → { isPlugin, inject: ["theme"], apply }
 *   apply 里 ctx.theme.register(三套) + setTheme(当前) + 注入作用域样式。
 */
window.__ModuleLoader__.load({
	id: "dsh-theme-khaslana",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;

		const React = require("react");
		const VERSION = "__VERSION__";
		const THEME_ID = "dsh-theme-khaslana";
		const ATTR = "data-dsh-khaslana";
		const FORM_ATTR = "data-khaslana-form";
		const LS_KEY = "khaslana.form.v2";

		// 立绘数据（构建时由 scripts/inject-art.mjs 注入 data:image/webp;base64）
		const ART = {
			phainon: "__ART_PHAINON__",
			sun: "__ART_SUN__",
			reaver: "__ART_REAVER__",
		};

		// ═══════════ 1. 三套设计令牌 ═══════════
		// 三个形态各有一套强调色：白厄冰蓝（人）、卡厄斯兰那金（神性）、盗火行者蓝紫（星渊）。
		const WHITE = {
			"--dsw-alias-bg-base": "rgba(246, 250, 255, 0.30)",
			"--dsw-alias-bg-layer-1": "rgba(250, 253, 255, 0.86)",
			"--dsw-alias-bg-layer-2": "rgba(252, 254, 255, 0.94)",
			"--dsw-alias-bg-layer-3": "rgba(238, 246, 254, 0.97)",
			"--dsw-alias-bg-overlay": "rgba(233, 242, 253, 0.98)",
			"--dsw-alias-bg-module-platform": "rgba(248, 251, 255, 0.96)",
			"--dsw-alias-bg-multi-select": "rgba(252, 254, 255, 0.98)",
			"--dsw-alias-bg-skeleton": "rgba(79, 143, 224, 0.08)",
			"--dsw-alias-bg-mask-1": "rgba(20, 40, 70, 0.35)",
			"--dsw-alias-bg-mask-2": "rgba(20, 40, 70, 0.18)",
			"--dsw-alias-bg-mask-drop": "rgba(20, 40, 70, 0.42)",

			"--dsw-alias-label-primary": "#10202f",
			"--dsw-alias-label-secondary": "#3d556e",
			"--dsw-alias-label-tertiary": "#6f859c",
			"--dsw-alias-label-caption": "#55708a",
			"--dsw-alias-label-dimmed": "#93a8bd",
			"--dsw-alias-label-primary-foreground": "#ffffff",
			"--dsw-alias-label-primary-inverted": "#f4f8ff",

			"--dsw-alias-brand-primary": "#2f6fbf",
			"--dsw-alias-brand-text": "#1f5aa8",
			"--dsw-alias-brand-primary-invert": "#f2f8ff",

			"--dsw-alias-button-primary-fill": "#3f7fd0",
			"--dsw-alias-button-primary-hover": "#5f9be6",
			"--dsw-alias-button-primary-dimmed": "rgba(63, 127, 208, 0.14)",
			"--dsw-alias-button-contrast-fill": "#ffffff",
			"--dsw-alias-button-elevated-fill": "#ffffff",
			"--dsw-alias-button-floating-fill": "#ffffff",
			"--dsw-alias-button-floating-hover": "#eef5fd",
			"--dsw-alias-button-ghost-active-fill": "#e8f1fb",
			"--dsw-alias-button-ghost-active-hover": "#dfeaf7",
			"--dsw-alias-button-info-fill": "#2f6fbf",
			"--dsw-alias-button-info-hover": "#4f8fe0",
			"--dsw-alias-button-tool-bar-fill": "rgba(63, 127, 208, 0.10)",
			"--dsw-alias-button-tool-bar-hover": "rgba(63, 127, 208, 0.18)",
			"--dsw-alias-button-ghost-active-border": "#3f7fd0",

			"--dsw-alias-interactive-bg-hover": "rgba(63, 127, 208, 0.08)",
			"--dsw-alias-interactive-bg-active": "rgba(63, 127, 208, 0.14)",
			"--dsw-alias-interactive-bg-hover-accent": "rgba(63, 127, 208, 0.12)",
			"--dsw-alias-interactive-bg-hover-danger": "rgba(190, 70, 80, 0.12)",

			"--dsw-alias-border-l1": "rgba(45, 90, 140, 0.16)",
			"--dsw-alias-border-l2": "rgba(45, 90, 140, 0.24)",
			"--dsw-alias-border-l2-darkmode-thin": "rgba(45, 90, 140, 0.12)",
			"--dsw-alias-border-l3": "rgba(45, 90, 140, 0.32)",
			"--dsw-alias-border-l4": "rgba(45, 90, 140, 0.42)",

			"--dsw-alias-state-success-primary": "#2f8f5e",
			"--dsw-alias-state-success-secondary": "rgba(47, 143, 94, 0.14)",
			"--dsw-alias-state-success-tertiary": "rgba(47, 143, 94, 0.07)",
			"--dsw-alias-state-error-primary": "#b8404e",
			"--dsw-alias-state-error-secondary": "rgba(184, 64, 78, 0.14)",
			"--dsw-alias-state-warn-primary": "#a8771f",
			"--dsw-alias-state-warn-secondary": "rgba(168, 119, 31, 0.14)",
			"--dsw-alias-state-business-primary": "#3f7fd0",
			"--dsw-alias-state-business-tertiary": "rgba(63, 127, 208, 0.10)",

			"--dsw-alias-toast-bg": "rgba(255, 255, 255, 0.96)",
			"--dsw-alias-tooltip-bg": "rgba(255, 255, 255, 0.98)",
			"--dsw-alias-markdown-inline-code": "rgba(63, 127, 208, 0.10)",
			"--dsw-alias-markdown-code-block": "rgba(238, 244, 251, 0.90)",
			"--dsw-alias-markdown-code-block-banner": "rgba(63, 127, 208, 0.07)",
			"--dsw-alias-scrollbar-bg-l1": "rgba(63, 127, 208, 0.18)",
			"--dsw-alias-scrollbar-bg-l2": "rgba(63, 127, 208, 0.26)",
			"--dsw-alias-scrollbar-hover-l1": "rgba(63, 127, 208, 0.30)",
			"--dsw-alias-scrollbar-hover-l2": "rgba(63, 127, 208, 0.40)",

			"--dsw-specific-sidebar-fill": "rgba(248, 251, 255, 0.92)",
			"--dsw-specific-sidebar-nav-item-active": "rgba(63, 127, 208, 0.14)",
			"--dsw-specific-sidebar-nav-item-active-accent": "#2f6fbf",
			"--dsw-specific-sidebar-nav-item-hover": "rgba(63, 127, 208, 0.08)",
			"--dsw-specific-bubble": "rgba(255, 255, 255, 0.94)",
			"--dsw-specific-bubble-highlight": "rgba(63, 127, 208, 0.10)",
			"--dsw-specific-input-major": "rgba(255, 255, 255, 0.92)",
			"--dsw-specific-menu": "rgba(230, 240, 252, 0.98)",
			"--dsw-specific-selector": "rgba(226, 237, 251, 0.96)",
		};

		const SUN = {
			"--dsw-alias-bg-base": "rgba(20, 14, 8, 0.55)",
			"--dsw-alias-bg-layer-1": "rgba(28, 20, 12, 0.76)",
			"--dsw-alias-bg-layer-2": "rgba(36, 26, 15, 0.87)",
			"--dsw-alias-bg-layer-3": "rgba(44, 32, 18, 0.93)",
			"--dsw-alias-bg-overlay": "rgba(30, 22, 13, 0.96)",
			"--dsw-alias-bg-module-platform": "rgba(22, 16, 9, 0.93)",
			"--dsw-alias-bg-multi-select": "rgba(36, 26, 15, 0.95)",
			"--dsw-alias-bg-skeleton": "rgba(240, 199, 102, 0.10)",
			"--dsw-alias-bg-mask-1": "rgba(8, 5, 2, 0.74)",
			"--dsw-alias-bg-mask-2": "rgba(8, 5, 2, 0.44)",
			"--dsw-alias-bg-mask-drop": "rgba(10, 6, 2, 0.76)",

			"--dsw-alias-label-primary": "#fff1d6",
			"--dsw-alias-label-secondary": "#dcc39a",
			"--dsw-alias-label-tertiary": "#a98f66",
			"--dsw-alias-label-caption": "#c4ab84",
			"--dsw-alias-label-dimmed": "#8a7350",
			"--dsw-alias-label-primary-foreground": "#201505",
			"--dsw-alias-label-primary-inverted": "#201505",

			"--dsw-alias-brand-primary": "#ffc857",
			"--dsw-alias-brand-text": "#ffdf9a",
			"--dsw-alias-brand-primary-invert": "#2a1a06",

			"--dsw-alias-button-primary-fill": "#e0ac4a",
			"--dsw-alias-button-primary-hover": "#f6cd74",
			"--dsw-alias-button-primary-dimmed": "rgba(240, 199, 102, 0.18)",
			"--dsw-alias-button-contrast-fill": "#fff6e2",
			"--dsw-alias-button-elevated-fill": "#1c1409",
			"--dsw-alias-button-floating-fill": "#191207",
			"--dsw-alias-button-floating-hover": "#241a0c",
			"--dsw-alias-button-ghost-active-fill": "#2a1f10",
			"--dsw-alias-button-ghost-active-hover": "#332611",
			"--dsw-alias-button-info-fill": "#c99536",
			"--dsw-alias-button-info-hover": "#e0ac4a",
			"--dsw-alias-button-tool-bar-fill": "rgba(240, 199, 102, 0.12)",
			"--dsw-alias-button-tool-bar-hover": "rgba(240, 199, 102, 0.20)",
			"--dsw-alias-button-ghost-active-border": "#e0ac4a",

			"--dsw-alias-interactive-bg-hover": "rgba(240, 199, 102, 0.10)",
			"--dsw-alias-interactive-bg-active": "rgba(240, 199, 102, 0.18)",
			"--dsw-alias-interactive-bg-hover-accent": "rgba(240, 199, 102, 0.16)",
			"--dsw-alias-interactive-bg-hover-danger": "rgba(226, 112, 95, 0.16)",

			"--dsw-alias-border-l1": "rgba(240, 199, 102, 0.14)",
			"--dsw-alias-border-l2": "rgba(240, 199, 102, 0.24)",
			"--dsw-alias-border-l2-darkmode-thin": "rgba(240, 199, 102, 0.11)",
			"--dsw-alias-border-l3": "rgba(240, 199, 102, 0.34)",
			"--dsw-alias-border-l4": "rgba(240, 199, 102, 0.46)",

			"--dsw-alias-state-success-primary": "#9fd08a",
			"--dsw-alias-state-success-secondary": "rgba(159, 208, 138, 0.16)",
			"--dsw-alias-state-success-tertiary": "rgba(159, 208, 138, 0.08)",
			"--dsw-alias-state-error-primary": "#e2705f",
			"--dsw-alias-state-error-secondary": "rgba(226, 112, 95, 0.16)",
			"--dsw-alias-state-warn-primary": "#f0c766",
			"--dsw-alias-state-warn-secondary": "rgba(240, 199, 102, 0.16)",
			"--dsw-alias-state-business-primary": "#ffc857",
			"--dsw-alias-state-business-tertiary": "rgba(255, 200, 87, 0.10)",

			"--dsw-alias-toast-bg": "rgba(26, 18, 9, 0.95)",
			"--dsw-alias-tooltip-bg": "rgba(26, 18, 9, 0.97)",
			"--dsw-alias-markdown-inline-code": "rgba(240, 199, 102, 0.16)",
			"--dsw-alias-markdown-code-block": "rgba(14, 9, 4, 0.72)",
			"--dsw-alias-markdown-code-block-banner": "rgba(240, 199, 102, 0.07)",
			"--dsw-alias-scrollbar-bg-l1": "rgba(240, 199, 102, 0.16)",
			"--dsw-alias-scrollbar-bg-l2": "rgba(240, 199, 102, 0.26)",
			"--dsw-alias-scrollbar-hover-l1": "rgba(240, 199, 102, 0.34)",
			"--dsw-alias-scrollbar-hover-l2": "rgba(240, 199, 102, 0.46)",

			"--dsw-specific-sidebar-fill": "rgba(18, 13, 6, 0.88)",
			"--dsw-specific-sidebar-nav-item-active": "rgba(240, 199, 102, 0.14)",
			"--dsw-specific-sidebar-nav-item-active-accent": "#f0c766",
			"--dsw-specific-sidebar-nav-item-hover": "rgba(240, 199, 102, 0.08)",
			"--dsw-specific-bubble": "rgba(32, 23, 13, 0.92)",
			"--dsw-specific-bubble-highlight": "rgba(240, 199, 102, 0.10)",
			"--dsw-specific-input-major": "rgba(20, 14, 8, 0.88)",
			"--dsw-specific-menu": "rgba(26, 18, 9, 0.96)",
			"--dsw-specific-selector": "rgba(30, 21, 9, 0.94)",
		};

		const MOON = {
			"--dsw-alias-bg-base": "rgba(10, 12, 32, 0.32)",
			"--dsw-alias-bg-layer-1": "rgba(16, 20, 48, 0.76)",
			"--dsw-alias-bg-layer-2": "rgba(22, 27, 62, 0.87)",
			"--dsw-alias-bg-layer-3": "rgba(30, 38, 82, 0.97)",
			"--dsw-alias-bg-overlay": "rgba(22, 28, 60, 0.98)",
			"--dsw-alias-bg-module-platform": "rgba(12, 15, 36, 0.93)",
			"--dsw-alias-bg-multi-select": "rgba(22, 27, 62, 0.95)",
			"--dsw-alias-bg-skeleton": "rgba(142, 166, 255, 0.08)",
			"--dsw-alias-bg-mask-1": "rgba(3, 4, 12, 0.74)",
			"--dsw-alias-bg-mask-2": "rgba(3, 4, 12, 0.44)",
			"--dsw-alias-bg-mask-drop": "rgba(4, 5, 14, 0.76)",

			"--dsw-alias-label-primary": "#eef2ff",
			"--dsw-alias-label-secondary": "#bcc6ea",
			"--dsw-alias-label-tertiary": "#8590b8",
			"--dsw-alias-label-caption": "#9ea9d0",
			"--dsw-alias-label-dimmed": "#616b91",
			"--dsw-alias-label-primary-foreground": "#0a0d20",
			"--dsw-alias-label-primary-inverted": "#0a0d20",

			"--dsw-alias-brand-primary": "#8ea6ff",
			"--dsw-alias-brand-text": "#b8c8ff",
			"--dsw-alias-brand-primary-invert": "#0f1430",

			"--dsw-alias-button-primary-fill": "#6f86ff",
			"--dsw-alias-button-primary-hover": "#93a6ff",
			"--dsw-alias-button-primary-dimmed": "rgba(142, 166, 255, 0.18)",
			"--dsw-alias-button-contrast-fill": "#f3f6ff",
			"--dsw-alias-button-elevated-fill": "#141a3a",
			"--dsw-alias-button-floating-fill": "#101430",
			"--dsw-alias-button-floating-hover": "#1a2148",
			"--dsw-alias-button-ghost-active-fill": "#1d2550",
			"--dsw-alias-button-ghost-active-hover": "#26305f",
			"--dsw-alias-button-info-fill": "#5f74e8",
			"--dsw-alias-button-info-hover": "#7d92ff",
			"--dsw-alias-button-tool-bar-fill": "rgba(142, 166, 255, 0.12)",
			"--dsw-alias-button-tool-bar-hover": "rgba(142, 166, 255, 0.20)",
			"--dsw-alias-button-ghost-active-border": "#6f86ff",

			"--dsw-alias-interactive-bg-hover": "rgba(142, 166, 255, 0.10)",
			"--dsw-alias-interactive-bg-active": "rgba(142, 166, 255, 0.18)",
			"--dsw-alias-interactive-bg-hover-accent": "rgba(142, 166, 255, 0.16)",
			"--dsw-alias-interactive-bg-hover-danger": "rgba(224, 112, 150, 0.16)",

			"--dsw-alias-border-l1": "rgba(142, 166, 255, 0.14)",
			"--dsw-alias-border-l2": "rgba(142, 166, 255, 0.24)",
			"--dsw-alias-border-l2-darkmode-thin": "rgba(142, 166, 255, 0.11)",
			"--dsw-alias-border-l3": "rgba(142, 166, 255, 0.32)",
			"--dsw-alias-border-l4": "rgba(142, 166, 255, 0.44)",

			"--dsw-alias-state-success-primary": "#7fd6b0",
			"--dsw-alias-state-success-secondary": "rgba(127, 214, 176, 0.16)",
			"--dsw-alias-state-success-tertiary": "rgba(127, 214, 176, 0.08)",
			"--dsw-alias-state-error-primary": "#e0709a",
			"--dsw-alias-state-error-secondary": "rgba(224, 112, 154, 0.16)",
			"--dsw-alias-state-warn-primary": "#e6c06a",
			"--dsw-alias-state-warn-secondary": "rgba(230, 192, 106, 0.16)",
			"--dsw-alias-state-business-primary": "#8ea6ff",
			"--dsw-alias-state-business-tertiary": "rgba(142, 166, 255, 0.10)",

			"--dsw-alias-toast-bg": "rgba(20, 25, 56, 0.95)",
			"--dsw-alias-tooltip-bg": "rgba(20, 25, 56, 0.97)",
			"--dsw-alias-markdown-inline-code": "rgba(142, 166, 255, 0.16)",
			"--dsw-alias-markdown-code-block": "rgba(6, 8, 20, 0.72)",
			"--dsw-alias-markdown-code-block-banner": "rgba(142, 166, 255, 0.07)",
			"--dsw-alias-scrollbar-bg-l1": "rgba(142, 166, 255, 0.16)",
			"--dsw-alias-scrollbar-bg-l2": "rgba(142, 166, 255, 0.26)",
			"--dsw-alias-scrollbar-hover-l1": "rgba(142, 166, 255, 0.34)",
			"--dsw-alias-scrollbar-hover-l2": "rgba(142, 166, 255, 0.46)",

			"--dsw-specific-sidebar-fill": "rgba(8, 10, 26, 0.88)",
			"--dsw-specific-sidebar-nav-item-active": "rgba(142, 166, 255, 0.14)",
			"--dsw-specific-sidebar-nav-item-active-accent": "#8ea6ff",
			"--dsw-specific-sidebar-nav-item-hover": "rgba(142, 166, 255, 0.08)",
			"--dsw-specific-bubble": "rgba(22, 27, 62, 0.90)",
			"--dsw-specific-bubble-highlight": "rgba(142, 166, 255, 0.10)",
			"--dsw-specific-input-major": "rgba(10, 12, 32, 0.88)",
			"--dsw-specific-menu": "rgba(24, 31, 68, 0.98)",
			"--dsw-specific-selector": "rgba(28, 35, 76, 0.96)",
		};

		// ═══════════ 2. 形态定义 ═══════════
		const BUILD = "b1";
		const FORMS = {
			white: { id: `${THEME_ID}-white-${BUILD}`, scheme: "light", tokens: WHITE, label: "白厄", icon: "☁", sub: "白昼" },
			sun: { id: `${THEME_ID}-sun-${BUILD}`, scheme: "dark", tokens: SUN, label: "卡厄斯兰那", icon: "☀", sub: "曜日" },
			moon: { id: `${THEME_ID}-moon-${BUILD}`, scheme: "dark", tokens: MOON, label: "盗火行者", icon: "☾", sub: "星渊" },
		};

		// 时间表：三个形态各占 8 小时。
		//   06–14 白厄        —— 晨光、人间、白衣少年
		//   14–22 卡厄斯兰那  —— 日轮当空到黄昏，神性最盛
		//   22–06 盗火行者    —— 长夜、星渊、紫焰
		// 想换时段只改这里的 from 和顺序即可。
		const SCHEDULE = [
			{ from: 6, form: "white" },
			{ from: 14, form: "sun" },
			{ from: 22, form: "moon" },
		];

		function autoForm() {
			const hour = new Date().getHours();
			let pick = SCHEDULE[SCHEDULE.length - 1].form;
			for (const slot of SCHEDULE) {
				if (hour >= slot.from) pick = slot.form;
			}
			return pick;
		}

		function normalizeForm(value) {
			// 兼容 v1 的旧值
			if (value === "ink") return "moon";
			if (value === "ivory") return "white";
			return value === "white" || value === "sun" || value === "moon" ? value : "moon";
		}

		function readState() {
			try {
				const raw = localStorage.getItem(LS_KEY);
				const now = autoForm();
				if (raw === null) return { mode: "manual", form: "moon", lastAuto: now };
				const parsed = JSON.parse(raw);
				const mode = parsed.mode === "auto" ? "auto" : "manual";
				// 自动模式下：跨过时段边界就用新时段，否则保留手动挑选的那个形态
				const form = mode === "auto" && parsed.autoAt !== now ? now : normalizeForm(parsed.form);
				return { mode, form, lastAuto: now };
			} catch {
				return { mode: "manual", form: "moon", lastAuto: autoForm() };
			}
		}

		function writeState(state) {
			try {
				localStorage.setItem(LS_KEY, JSON.stringify({ ...state, autoAt: autoForm() }));
			} catch {
				/* localStorage 不可用时静默降级 */
			}
		}

		// 界面设置（与形态选择分开存）
		const LS_SETTINGS = "khaslana.settings.v1";
		const DEFAULT_SETTINGS = {
			artOpacity: 55,
			artSize: 82,
			effects: true,
			particles: true,
			wallpaperOn: false,
			wallpaperRotate: false,
			wallpaperInterval: 15,
			wallpaperDim: 40,
			typingSound: false,
			typingVolume: 40,
			musicVolume: 50,
		};

		function readSettings() {
			try {
				const parsed = JSON.parse(localStorage.getItem(LS_SETTINGS) ?? "{}");
				const clamp = (v, min, max, fallback) =>
					Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
				return {
					artOpacity: clamp(parsed.artOpacity, 10, 100, DEFAULT_SETTINGS.artOpacity),
					artSize: clamp(parsed.artSize, 40, 100, DEFAULT_SETTINGS.artSize),
					effects: parsed.effects !== false,
					particles: parsed.particles !== false,
					wallpaperOn: parsed.wallpaperOn === true,
					wallpaperRotate: parsed.wallpaperRotate === true,
					wallpaperInterval: clamp(parsed.wallpaperInterval, 1, 180, DEFAULT_SETTINGS.wallpaperInterval),
					wallpaperDim: clamp(parsed.wallpaperDim, 0, 85, DEFAULT_SETTINGS.wallpaperDim),
					typingSound: parsed.typingSound === true,
					typingVolume: clamp(parsed.typingVolume, 0, 100, DEFAULT_SETTINGS.typingVolume),
					musicVolume: clamp(parsed.musicVolume, 0, 100, DEFAULT_SETTINGS.musicVolume),
				};
			} catch {
				return { ...DEFAULT_SETTINGS };
			}
		}

		function writeSettings(state) {
			try {
				localStorage.setItem(LS_SETTINGS, JSON.stringify(state));
			} catch {
				/* 忽略 */
			}
		}

		// ── 壁纸存储（IndexedDB，避免 localStorage 5MB 上限） ──
		const WALL_DB = "khaslana-wallpapers";
		function wallOpen() {
			return new Promise((resolve, reject) => {
				const req = indexedDB.open(WALL_DB, 2);
				req.onupgradeneeded = () => {
					const db = req.result;
					if (!db.objectStoreNames.contains("items")) db.createObjectStore("items", { keyPath: "id" });
					if (!db.objectStoreNames.contains("music")) db.createObjectStore("music", { keyPath: "id" });
				};
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
			});
		}
		async function wallAll() {
			try {
				const db = await wallOpen();
				return await new Promise((resolve, reject) => {
					const req = db.transaction("items", "readonly").objectStore("items").getAll();
					req.onsuccess = () => resolve(req.result ?? []);
					req.onerror = () => reject(req.error);
				});
			} catch {
				return [];
			}
		}
		async function wallPut(item) {
			try {
				const db = await wallOpen();
				await new Promise((resolve, reject) => {
					const tx = db.transaction("items", "readwrite");
					tx.objectStore("items").put(item);
					tx.oncomplete = resolve;
					tx.onerror = () => reject(tx.error);
				});
			} catch {
				/* 忽略 */
			}
		}
		async function wallDelete(id) {
			try {
				const db = await wallOpen();
				await new Promise((resolve, reject) => {
					const tx = db.transaction("items", "readwrite");
					tx.objectStore("items").delete(id);
					tx.oncomplete = resolve;
					tx.onerror = () => reject(tx.error);
				});
			} catch {
				/* 忽略 */
			}
		}

		async function musicAll() {
			try {
				const db = await wallOpen();
				return await new Promise((resolve, reject) => {
					const req = db.transaction("music", "readonly").objectStore("music").getAll();
					req.onsuccess = () => resolve(req.result ?? []);
					req.onerror = () => reject(req.error);
				});
			} catch {
				return [];
			}
		}
		async function musicPut(item) {
			try {
				const db = await wallOpen();
				await new Promise((resolve, reject) => {
					const tx = db.transaction("music", "readwrite");
					tx.objectStore("music").put(item);
					tx.oncomplete = resolve;
					tx.onerror = () => reject(tx.error);
				});
			} catch {
				/* 忽略 */
			}
		}

		// ═══════════ 3. 样式 ═══════════
		function identityCSS() {
			return `
html { background-color: #070708; }

body[${ATTR}] {
  --khaslana-accent: #8ea6ff;
  --khaslana-accent-soft: rgba(142, 166, 255, 0.16);
  --khaslana-remove: #6f86ff;
}
body[${ATTR}][${FORM_ATTR}="white"] {
  --khaslana-accent: #2f6fbf;
  --khaslana-accent-soft: rgba(47, 111, 191, 0.14);
  --khaslana-remove: #3f7fd0;
  background-color: transparent;
}
body[${ATTR}][${FORM_ATTR}="sun"] {
  --khaslana-accent: #ffc857;
  --khaslana-accent-soft: rgba(255, 200, 87, 0.18);
  --khaslana-remove: #b8862f;
}
body[${ATTR}][${FORM_ATTR}="moon"] {
  --khaslana-accent: #8ea6ff;
  --khaslana-accent-soft: rgba(142, 166, 255, 0.16);
  --khaslana-remove: #6f86ff;
}

/* ── 画布底色（立绘改挂在对话列内部） ── */
html:has(body[${ATTR}][${FORM_ATTR}="white"]) {
  background-color: #f4f8ff;
}
html:has(body[${ATTR}][${FORM_ATTR}="moon"]) {
  background-color: #05060f;
}

/* 对话列：强制半透明，让画布上的立绘透出来（不再依赖 token 是否刷新） */
body[${ATTR}][${FORM_ATTR}="white"] [class*="Dc7zOa_root"] {
  background: rgba(244, 248, 255, 0.42) !important;
}
body[${ATTR}][${FORM_ATTR}="moon"] [class*="Dc7zOa_root"] {
  background: rgba(8, 10, 26, 0.38) !important;
}

/* ── 白厄 · 白昼（冰蓝白） ── */
body[${ATTR}][${FORM_ATTR}="white"]::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    radial-gradient(1000px 720px at 86% -14%, rgba(120, 180, 255, 0.30), transparent 64%),
    radial-gradient(760px 560px at -6% 110%, rgba(140, 200, 255, 0.14), transparent 60%),
    linear-gradient(156deg, #ffffff 0%, #f2f7fd 48%, #e9f1fa 100%);
  background-size: auto, auto, auto;
  background-position: center, center, center;
  background-repeat: no-repeat;
}
body[${ATTR}][${FORM_ATTR}="white"]::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    radial-gradient(2px 2px at 78% 22%, rgba(217, 180, 106, 0.55), transparent 100%),
    radial-gradient(1.5px 1.5px at 22% 68%, rgba(217, 180, 106, 0.35), transparent 100%),
    linear-gradient(to right, transparent 0%, rgba(217, 180, 106, 0.45) 50%, transparent 100%),
    radial-gradient(120% 92% at 50% 0%, transparent 55%, rgba(30, 70, 120, 0.10) 100%),
    radial-gradient(rgba(60, 110, 170, 0.05) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 1px, 100% 100%, 3px 3px;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, repeat;
}

/* ── 卡厄斯兰那 · 曜日 ── */
body[${ATTR}][${FORM_ATTR}="sun"]::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(680px 680px at 78% -6%, rgba(255, 205, 110, 0.42), transparent 62%),
    radial-gradient(1100px 720px at 10% 106%, rgba(214, 120, 50, 0.16), transparent 66%),
    linear-gradient(160deg, #1c1308 0%, #120c05 52%, #0a0703 100%);
}
body[${ATTR}][${FORM_ATTR}="sun"]::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, transparent 0%, rgba(255, 205, 110, 0.35) 50%, transparent 100%),
    radial-gradient(120% 92% at 50% 0%, transparent 48%, rgba(0, 0, 0, 0.46) 100%),
    radial-gradient(rgba(255, 220, 150, 0.05) 1px, transparent 1px);
  background-size: 100% 1px, 100% 100%, 3px 3px;
  background-repeat: no-repeat, no-repeat, repeat;
}

/* ── 盗火行者 · 星渊（蓝紫星云） ── */
body[${ATTR}][${FORM_ATTR}="moon"]::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    radial-gradient(820px 640px at 72% -6%, rgba(96, 120, 255, 0.34), transparent 60%),
    radial-gradient(700px 560px at 8% 6%, rgba(150, 90, 240, 0.20), transparent 62%),
    radial-gradient(900px 700px at 92% 96%, rgba(120, 80, 220, 0.22), transparent 62%),
    radial-gradient(640px 520px at 28% 112%, rgba(60, 130, 255, 0.16), transparent 60%),
    linear-gradient(165deg, #0d1236 0%, #080a1c 55%, #05060f 100%);
  background-size: auto, auto, auto, auto, auto;
  background-position: center, center, center, center, center;
  background-repeat: no-repeat;
}
body[${ATTR}][${FORM_ATTR}="moon"]::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, transparent 0%, rgba(142, 166, 255, 0.34) 50%, transparent 100%),
    radial-gradient(120% 92% at 50% 0%, transparent 48%, rgba(0, 0, 0, 0.44) 100%),
    radial-gradient(rgba(200, 215, 255, 0.05) 1px, transparent 1px);
  background-size: 100% 1px, 100% 100%, 3px 3px;
  background-repeat: no-repeat, no-repeat, repeat;
}

body[${ATTR}] ::selection {
  background: var(--khaslana-accent-soft);
  color: var(--dsw-alias-label-primary);
}

/* ── 白厄的彩蛋：一点金（他的梦想与目标） ── */
body[${ATTR}][${FORM_ATTR}="white"] {
  --khaslana-spark: #d9b46a;
}
body[${ATTR}][${FORM_ATTR}="white"] ::selection {
  background: rgba(217, 180, 106, 0.28);
}
body[${ATTR}][${FORM_ATTR}="white"] input,
body[${ATTR}][${FORM_ATTR}="white"] textarea,
body[${ATTR}][${FORM_ATTR}="white"] [contenteditable="true"] {
  caret-color: var(--khaslana-spark);
}
body[${ATTR}][${FORM_ATTR}="white"] .khaslana-fab::after {
  content: "";
  position: absolute;
  top: 5px;
  right: 5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--khaslana-spark);
  box-shadow: 0 0 6px rgba(217, 180, 106, 0.8);
}
body[${ATTR}][${FORM_ATTR}="white"] .khaslana-fab:hover {
  border-color: var(--khaslana-spark);
}
body[${ATTR}][${FORM_ATTR}="white"] .khaslana-option[data-active="true"] {
  box-shadow: inset 2px 0 0 var(--khaslana-spark);
}

/* 账号名（侧栏账号按钮 / 设置卡片）：加粗；曜日/星渊用曜金，白厄用古金 */
body[${ATTR}] [class*="footArea"] [class*="trigger"] [class*="label"],
body[${ATTR}] [class*="avatar"] + [class*="label"],
body[${ATTR}] [class*="identityCopy"] [class*="name"] {
  color: #ffc857 !important;
  font-weight: 600 !important;
}
body[${ATTR}][${FORM_ATTR}="white"] [class*="footArea"] [class*="trigger"] [class*="label"],
body[${ATTR}][${FORM_ATTR}="white"] [class*="avatar"] + [class*="label"],
body[${ATTR}][${FORM_ATTR}="white"] [class*="identityCopy"] [class*="name"] {
  color: #d4a141 !important;
}

/* ── 品牌：默认跟形态强调色；白厄形态用“中间金” ── */
body[${ATTR}] [class*="brandIdentity"],
body[${ATTR}] [class*="logoRow"] [class*="brandMark"] {
  color: var(--khaslana-accent) !important;
}
body[${ATTR}][${FORM_ATTR}="white"] [class*="brandIdentity"],
body[${ATTR}][${FORM_ATTR}="white"] [class*="logoRow"] [class*="brandMark"] {
  color: #d4a141 !important;
}

/* 附件缩略图的删除按钮：白底上也必须看得见（原来白底白字） */
body[${ATTR}] [class*="imageItem"] [class*="_remove"],
body[${ATTR}] [class*="_card"] [class*="_remove"] {
  background: var(--khaslana-remove) !important;
  color: #ffffff !important;
  opacity: 0.32 !important;
  box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.55);
}
body[${ATTR}] [class*="imageItem"]:hover [class*="_remove"],
body[${ATTR}] [class*="_card"]:hover [class*="_remove"],
body[${ATTR}] [class*="imageItem"] [class*="_remove"]:focus-visible {
  opacity: 1 !important;
}

/* 弹层/对话框：加一道极细的形态色描边，避免白底融在一起 */
body[${ATTR}] [role="dialog"] {
  border: 1px solid var(--khaslana-accent-soft) !important;
}

/* ── 当前会话：保留选中填充，标题文字改金 ── */
body[${ATTR}] [class*="sessionRow"][class*="selected"] [class*="title"],
body[${ATTR}] [class*="sessionRow"][class*="selected"] [class*="title"] * {
  color: var(--khaslana-accent) !important;
}

/* ── 会话顶部标题：面包屑当前项 + 标题簇 ── */
body[${ATTR}] [class*="crumbCurrent"],
body[${ATTR}] [class*="crumbCurrent"] *,
body[${ATTR}] [class*="titleCluster"],
body[${ATTR}] [class*="titleCluster"] * {
  color: var(--khaslana-accent) !important;
}

/* ── 激活标签（对话 / 轨迹）：文字与下划线 ── */
body[${ATTR}] [class*="tabActive"] {
  color: var(--khaslana-accent) !important;
}
body[${ATTR}] [class*="tabActive"]::after {
  background: var(--khaslana-accent) !important;
}

/* ── 立绘层（不参与布局，避免撑出滚动区域） ── */
.khaslana-art {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-repeat: no-repeat;
  background-position: right -2vw bottom;
  background-size: auto var(--khaslana-art-size, 82vh);
  opacity: var(--khaslana-art-opacity, 0.55);
  transition: opacity 200ms ease;
}
.khaslana-art[hidden] { display: none; }

/* 欢迎页标题：按形态换字体与气质 */
.khaslana-hero-title {
  transition: color 240ms ease, text-shadow 240ms ease;
}
body[${ATTR}] [class*="previewBadge"] { display: none !important; }
body[${ATTR}][${FORM_ATTR}="white"] .khaslana-hero-title {
  font-family: "STKaiti", "KaiTi", "Noto Serif SC", serif;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #22314d;
}
body[${ATTR}][${FORM_ATTR}="sun"] .khaslana-hero-title {
  font-family: "STSong", "Songti SC", "Noto Serif SC", serif;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #d4a141;
  text-shadow: 0 0 22px rgba(212, 161, 65, 0.35);
}
body[${ATTR}][${FORM_ATTR}="moon"] .khaslana-hero-title {
  font-family: "Microsoft YaHei", "Segoe UI", sans-serif;
  font-weight: 300;
  letter-spacing: 0.16em;
  color: #cfd6ff;
  text-shadow: 0 0 24px rgba(120, 140, 255, 0.45);
}

/* 输入框外层：金色雕花边框 */
body[${ATTR}] .khaslana-composer {
  border: 1px solid rgba(212, 161, 65, 0.55) !important;
  border-radius: 18px !important;
  box-shadow:
    0 0 0 1px rgba(212, 161, 65, 0.18),
    0 0 26px rgba(212, 161, 65, 0.12),
    inset 0 0 24px rgba(212, 161, 65, 0.05) !important;
  position: relative;
}
body[${ATTR}] .khaslana-composer::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 14px;
  pointer-events: none;
  border: 1px solid rgba(212, 161, 65, 0.22);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 42%, transparent 58%, #000 100%);
  mask-image: linear-gradient(180deg, #000 0%, transparent 42%, transparent 58%, #000 100%);
}

.khaslana-particles {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  display: block;
}

.khaslana-wallpaper {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 300ms ease;
}
.khaslana-wallpaper[data-on="true"] { opacity: 1; }
.khaslana-wallpaper::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--khaslana-wall-shade, rgba(0, 0, 0, 0.4));
}

.khaslana-wall-list {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 2px;
  margin: 6px 0;
}
.khaslana-wall-thumb {
  width: 46px;
  height: 34px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background-size: cover;
  background-position: center;
  cursor: pointer;
  flex: none;
  padding: 0;
}
.khaslana-wall-thumb[data-active="true"] {
  border-color: var(--khaslana-accent);
  box-shadow: 0 0 0 1px var(--khaslana-accent);
}
.khaslana-wall-actions { display: flex; gap: 6px; margin: 4px 0 2px; }
.khaslana-mini {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.khaslana-mini:hover {
  border-color: var(--khaslana-accent);
  color: var(--khaslana-accent);
}

.khaslana-persona {
  width: 100%;
  min-height: 74px;
  resize: vertical;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  line-height: 1.5;
  box-sizing: border-box;
}
.khaslana-persona:focus {
  outline: none;
  border-color: var(--khaslana-accent);
}
.khaslana-persona-status {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  align-self: center;
}

.khaslana-music-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 96px;
  overflow-y: auto;
  margin: 4px 0;
}
.khaslana-music-item {
  text-align: left;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.khaslana-music-item:hover { background: var(--dsw-alias-interactive-bg-hover); }
.khaslana-music-item[data-active="true"] { color: var(--khaslana-accent); }

.khaslana-fab {
  position: fixed;
  right: 18px;
  bottom: 96px;
  z-index: 60;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--khaslana-accent-soft);
  background: color-mix(in srgb, var(--dsw-specific-menu) 82%, transparent);
  color: var(--khaslana-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
  transition: transform 160ms ease, border-color 160ms ease;
  font-size: 15px;
  line-height: 1;
  padding: 0;
}
.khaslana-fab:hover {
  transform: translateY(-1px) scale(1.04);
  border-color: var(--khaslana-accent);
}

.khaslana-panel {
  position: fixed;
  right: 62px;
  bottom: 88px;
  z-index: 60;
  width: 300px;
  max-height: 76vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--khaslana-accent-soft);
  background: color-mix(in srgb, var(--dsw-specific-menu) 94%, transparent);
  color: var(--dsw-alias-label-primary);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
  font: 13px/1.5 var(--dsw-font-family, system-ui, sans-serif);
  scrollbar-width: thin;
}
.khaslana-panel[hidden] { display: none; }

.khaslana-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--dsw-alias-label-secondary);
  margin: 2px 0 8px;
}
.khaslana-title::before {
  content: "";
  width: 3px;
  height: 12px;
  border-radius: 2px;
  background: var(--khaslana-accent);
  opacity: 0.85;
}
.khaslana-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

.khaslana-settings-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
}
.khaslana-settings-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.khaslana-settings-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--dsw-alias-label-secondary);
}
.khaslana-side-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.khaslana-side-btn:hover {
  border-color: var(--khaslana-accent);
  color: var(--khaslana-accent);
}

.khaslana-diag {
  margin-top: 10px;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}
.khaslana-diag summary {
  cursor: pointer;
  user-select: none;
}
.khaslana-diag-body {
  margin: 6px 0 0;
  padding: 8px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  white-space: pre-wrap;
  word-break: break-all;
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 11px;
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .khaslana-flash,
  .khaslana-art,
  .khaslana-wallpaper,
  .khaslana-panel {
    animation: none !important;
    transition: none !important;
  }
}
.khaslana-persona-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums;
}

.khaslana-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  margin-bottom: 6px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}
.khaslana-option:hover { background: var(--dsw-alias-interactive-bg-hover); }
.khaslana-option[data-active="true"] {
  border-color: var(--khaslana-accent-soft);
  background: var(--khaslana-accent-soft);
}
.khaslana-option .khaslana-glyph {
  width: 18px;
  text-align: center;
  color: var(--khaslana-accent);
  font-size: 14px;
}
.khaslana-option small {
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
}

.khaslana-auto {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}
.khaslana-auto input { accent-color: var(--khaslana-accent); }

.khaslana-schedule {
  margin: 8px 2px 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--dsw-alias-label-tertiary);
}

.khaslana-divider {
  height: 1px;
  margin: 12px 0;
  background: var(--dsw-alias-border-l1);
}

.khaslana-range {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 2px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}

.khaslana-range input[type="range"] {
  flex: 1;
  min-width: 0;
  accent-color: var(--khaslana-accent);
}

.khaslana-range output {
  width: 44px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-tertiary);
}

.khaslana-flash {
  position: fixed;
  inset: 0;
  z-index: 70;
  pointer-events: none;
  background:
    linear-gradient(105deg, transparent 32%, var(--khaslana-accent-soft) 50%, transparent 68%),
    radial-gradient(60% 50% at 50% 45%, var(--khaslana-accent-soft), transparent 72%);
  animation: khaslana-sweep 520ms ease-out forwards;
}
@keyframes khaslana-sweep {
  from { opacity: 0.95; transform: translateX(-14%); }
  to { opacity: 0; transform: translateX(14%); }
}
`;
		}

		// 新会话欢迎页的形象（替换默认的鱼）
		function KhaslanaHero() {
			// 占住欢迎页形象槽位但不渲染任何东西：默认那条鱼也不会回来
			return null;
		}

		let openPanelHook = null;

		function KhaslanaSettings() {
			return React.createElement(
				"div",
				{ className: "khaslana-settings-card" },
				React.createElement("p", { className: "khaslana-settings-title" }, "白厄 · 三形态主题"),
				React.createElement(
					"p",
					{ className: "khaslana-settings-desc" },
					"白昼 / 曜日 / 星渊三套配色，立绘、粒子、壁纸、人格与声音都在主题面板里调整。",
				),
				React.createElement(
					"button",
					{
						type: "button",
						className: "khaslana-mini",
						onClick: () => openPanelHook?.(),
					},
					"打开主题面板",
				),
			);
		}

		function KhaslanaSidebarAction() {
			return React.createElement(
				"button",
				{
					type: "button",
					className: "khaslana-side-btn",
					title: "白厄主题面板",
					onClick: () => openPanelHook?.(),
				},
				"☁ 白厄",
			);
		}

		// ═══════════ 4. apply ═══════════
		function apply(ctx) {
			ctx.effect(() => {
				const initial = readState();
				let form = initial.form;
				let mode = initial.mode;
				let lastAuto = initial.lastAuto;
				let timer = null;
				let panel = null;
				let fab = null;
				let settings = readSettings();
				const prefersReducedMotion = () =>
					window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
				const audio = new Audio();
				let music = [];
				let musicIndex = -1;
				let actx = null;
				audio.volume = settings.musicVolume / 100;
				audio.addEventListener("ended", () => playNext());

				document.body.setAttribute(ATTR, "");
				document.body.setAttribute(FORM_ATTR, form);

				// 单实例：DSH 重新挂载插件时旧实例不会被销毁，这里显式接管并清掉它的 UI 与立绘。
				const OWNER = `${THEME_ID}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
				window.__khaslanaOwner = OWNER;
				document.querySelectorAll(".khaslana-art, .khaslana-fab, .khaslana-panel").forEach((node) => node.remove());

				if (!document.querySelector("style[data-khaslana-theme]")) {
					const style = document.createElement("style");
					style.dataset.khaslanaTheme = THEME_ID;
					style.textContent = identityCSS();
					document.head.appendChild(style);
				}

				// 欢迎页形象：单占位槽，用 priority -1 盖住宿主（桌面端默认那条鱼）
				try {
					ctx.slots.inject("conversation.hero.brand.mark", () => {
						try {
							return ctx.slots.register(
								{ name: "conversation.hero.brand.mark", priority: -1 },
								KhaslanaHero,
							);
						} catch (error) {
							console.warn("khaslana: hero slot register failed", error);
							return () => {};
						}
					});
				} catch (error) {
					console.warn("khaslana: hero slot inject failed", error);
				}

				// 设置页入口（与侧栏按钮共用同一个悬浮面板）
				try {
					ctx.slots.inject("settings.section", () =>
						ctx.slots.register(
							{
								name: "settings.section",
								id: "khaslana-theme",
								order: 40,
								label: () => "白厄 · 主题",
							},
							KhaslanaSettings,
						),
					);
				} catch (error) {
					console.warn("khaslana: settings slot inject failed", error);
				}
				try {
					ctx.slots.inject("sidebar.footer.action", () =>
						ctx.slots.register(
							{
								name: "sidebar.footer.action",
								id: "khaslana-open",
								order: 20,
								label: () => "白厄",
							},
							KhaslanaSidebarAction,
						),
					);
				} catch (error) {
					console.warn("khaslana: sidebar slot inject failed", error);
				}

				for (const [name, def] of Object.entries(FORMS)) {
					try {
						ctx.theme.register({ id: def.id, colorScheme: def.scheme, tokens: def.tokens });
					} catch (error) {
						console.error(`dsh-theme-khaslana: register ${name} failed`, error);
					}
				}

				function applyScheme() {
					const def = FORMS[form];
					document.documentElement.style.colorScheme = def.scheme;
					if (def.scheme === "dark") {
						document.body.toggleAttribute("data-ds-dark-theme", true);
					} else {
						document.body.removeAttribute("data-ds-dark-theme");
					}
				}

				function applySettings() {
					document.body.style.setProperty("--khaslana-art-opacity", String(settings.artOpacity / 100));
					document.body.style.setProperty("--khaslana-art-size", `${settings.artSize}vh`);
				}

				function applyForm(next, { persist = true } = {}) {
					next = normalizeForm(next);
					const changed = next !== form;
					form = next;
					document.body.setAttribute(FORM_ATTR, form);
					try {
						ctx.theme.setTheme(FORMS[form].id);
					} catch (error) {
						console.error("dsh-theme-khaslana: setTheme failed", error);
					}
					applyScheme();
					updateArt(changed);
					syncParticles();
					paintWallpaper();
					if (persist) writeState({ mode, form });
					updateUI();
					if (changed) flash();
				}

				function flash() {
					if (!settings.effects || prefersReducedMotion()) return;
					const overlay = document.createElement("div");
					overlay.className = "khaslana-flash";
					document.body.appendChild(overlay);
					setTimeout(() => overlay.remove(), 460);
				}

				function buildUI() {
					fab = document.createElement("button");
					fab.type = "button";
					fab.className = "khaslana-fab";
					fab.title = "切换形态";
					fab.setAttribute("aria-label", "切换形态");
					fab.addEventListener("click", (event) => {
						event.stopPropagation();
						togglePanel();
					});

					panel = document.createElement("div");
					panel.className = "khaslana-panel";
					panel.hidden = true;
					panel.innerHTML = `
						<p class="khaslana-title">形态</p>
						${Object.entries(FORMS)
							.map(
								([key, def]) => `
							<button type="button" class="khaslana-option" data-form="${key}">
								<span class="khaslana-glyph">${def.icon}</span>
								<span>${def.label} <small>${def.sub}</small></span>
							</button>`,
							)
							.join("")}
						<label class="khaslana-auto">
							<input type="checkbox" />
							<span>跟随时间（每 8 小时轮换）</span>
						</label>
						<p class="khaslana-schedule">06–14 白厄 · 14–22 卡厄斯兰那 · 22–06 盗火行者</p>
						<div class="khaslana-divider"></div>
						<p class="khaslana-title">立绘</p>
						<label class="khaslana-range">
							<span>透明度</span>
							<input type="range" data-set="artOpacity" min="10" max="100" step="5" />
							<output></output>
						</label>
						<label class="khaslana-range">
							<span>大小</span>
							<input type="range" data-set="artSize" min="40" max="100" step="2" />
							<output></output>
						</label>
						<div class="khaslana-divider"></div>
						<p class="khaslana-title">动效</p>
						<label class="khaslana-auto">
							<input type="checkbox" data-set="effects" />
							<span>切换时闪光</span>
						</label>
						<label class="khaslana-auto">
							<input type="checkbox" data-set="particles" />
							<span>环境粒子</span>
						</label>
						<div class="khaslana-divider"></div>
						<p class="khaslana-title">壁纸</p>
						<label class="khaslana-auto">
							<input type="checkbox" data-set="wallpaperOn" />
							<span>显示壁纸</span>
						</label>
						<div class="khaslana-wall-list"></div>
						<div class="khaslana-wall-actions">
							<button type="button" class="khaslana-mini" data-wall="import">导入图片</button>
							<button type="button" class="khaslana-mini" data-wall="remove">移除当前</button>
						</div>
						<label class="khaslana-auto">
							<input type="checkbox" data-set="wallpaperRotate" />
							<span>随机轮换（分钟）</span>
						</label>
						<label class="khaslana-range">
							<span>间隔</span>
							<input type="range" data-set="wallpaperInterval" min="1" max="60" step="1" />
							<output></output>
						</label>
						<label class="khaslana-range">
							<span>浓度</span>
							<input type="range" data-set="wallpaperDim" min="0" max="85" step="5" />
							<output></output>
						</label>
						<div class="khaslana-divider"></div>
						<p class="khaslana-title">人格</p>
						<textarea class="khaslana-persona" rows="6" placeholder="写一段人格底稿；留空则使用随包的核心人格"></textarea>
						<div class="khaslana-wall-actions">
							<button type="button" class="khaslana-mini" data-persona-save>保存人格</button>
							<button type="button" class="khaslana-mini" data-persona-reset>恢复默认</button>
							<span class="khaslana-persona-count"></span>
						</div>
						<p class="khaslana-persona-status"></p>
						<div class="khaslana-divider"></div>
						<p class="khaslana-title">声音</p>
						<label class="khaslana-auto">
							<input type="checkbox" data-set="typingSound" />
							<span>打字音效</span>
						</label>
						<label class="khaslana-range">
							<span>打字音量</span>
							<input type="range" data-set="typingVolume" min="0" max="100" step="10" />
							<output></output>
						</label>
						<div class="khaslana-wall-actions">
							<button type="button" class="khaslana-mini" data-music="import">导入音乐</button>
							<button type="button" class="khaslana-mini" data-music="toggle">播放</button>
							<button type="button" class="khaslana-mini" data-music="next">下一首</button>
						</div>
						<div class="khaslana-music-list"></div>
						<label class="khaslana-range">
							<span>音乐音量</span>
							<input type="range" data-set="musicVolume" min="0" max="100" step="10" />
							<output></output>
						</label>
						<input type="file" class="khaslana-audio" accept="audio/*" multiple hidden />
						<input type="file" class="khaslana-file" accept="image/*" multiple hidden />
						<div class="khaslana-divider"></div>
						<div class="khaslana-wall-actions">
							<button type="button" class="khaslana-mini" data-config="export">导出配置</button>
							<button type="button" class="khaslana-mini" data-config="import">导入配置</button>
							<span class="khaslana-config-status"></span>
						</div>
						<input type="file" class="khaslana-config-file" accept="application/json" hidden />
						<details class="khaslana-diag">
							<summary>诊断</summary>
							<pre class="khaslana-diag-body"></pre>
						</details>
						<div class="khaslana-footer">
							<span>白厄 · v${VERSION}</span>
							<span>跟随时间可自动切换</span>
						</div>
					`;

					panel.querySelectorAll("[data-form]").forEach((button) => {
						button.addEventListener("click", () => {
							// 只切形态，不改「跟随时间」的开关：
							// 自动模式会保留这次手动选择，直到下一个 8 小时时段。
							applyForm(button.dataset.form);
						});
					});

					const autoInput = panel.querySelector(".khaslana-auto input");
					autoInput.checked = mode === "auto";
					autoInput.addEventListener("change", () => {
						mode = autoInput.checked ? "auto" : "manual";
						if (mode === "auto") {
							lastAuto = autoForm();
							applyForm(lastAuto);
						} else {
							writeState({ mode, form });
						}
						updateUI();
					});

					// 立绘/动效/壁纸设置
					panel.querySelectorAll("[data-set]").forEach((input) => {
						const key = input.dataset.set;
						const out = input.parentElement.querySelector("output");
						const suffix = key === "artSize" ? "vh" : key === "wallpaperInterval" ? "min" : "%";
						const label = () => {
							if (!out) return;
							out.textContent = `${input.value}${suffix}`;
						};
						const isSwitch = ["effects", "particles", "wallpaperOn", "wallpaperRotate", "typingSound"].includes(key);
						if (isSwitch) {
							input.checked = settings[key];
						} else {
							input.value = String(settings[key]);
							label();
						}
						const sync = () => {
							if (isSwitch) {
								settings[key] = input.checked;
							} else {
								settings[key] = Number(input.value);
								label();
							}
							writeSettings(settings);
							applySettings();
							if (key === "particles") syncParticles();
							if (key === "wallpaperOn" || key === "wallpaperDim") paintWallpaper();
							if (key === "wallpaperRotate" || key === "wallpaperInterval") scheduleWallTimer();
							if (key === "musicVolume") audio.volume = settings.musicVolume / 100;
						};
						input.addEventListener("input", sync);
						input.addEventListener("change", sync);
					});
					wireWallpaperUI();
					wireSoundUI();

					const personaBox = panel.querySelector(".khaslana-persona");
					const personaStatus = panel.querySelector(".khaslana-persona-status");
					const personaCount = panel.querySelector(".khaslana-persona-count");
					const savePersona = panel.querySelector("[data-persona-save]");
					const resetPersona = panel.querySelector("[data-persona-reset]");
					const countPersona = () => {
						if (personaCount && personaBox) personaCount.textContent = `${personaBox.value.length} 字`;
					};
					if (personaBox) {
						personaBox.addEventListener("input", countPersona);
						fetch("/khaslana/persona")
							.then((res) => res.json())
							.then((data) => {
								if (typeof data.persona === "string") personaBox.value = data.persona;
								countPersona();
							})
							.catch(() => {});
					}
					if (savePersona) {
						savePersona.addEventListener("click", async () => {
							if (personaStatus) personaStatus.textContent = "保存中…";
							try {
								const res = await fetch("/khaslana/persona", {
									method: "POST",
									headers: { "content-type": "application/json" },
									body: JSON.stringify({ persona: personaBox?.value ?? "" }),
								});
								if (personaStatus) personaStatus.textContent = res.ok ? "已保存，下一轮生效" : "保存失败";
							} catch {
								if (personaStatus) personaStatus.textContent = "保存失败";
							}
						});
					}
					if (resetPersona) {
						resetPersona.addEventListener("click", async () => {
							if (personaStatus) personaStatus.textContent = "恢复中…";
							try {
								const res = await fetch("/khaslana/persona", {
									method: "POST",
									headers: { "content-type": "application/json" },
									body: JSON.stringify({ persona: "" }),
								});
								const data = await res.json();
								if (personaBox && typeof data.persona === "string") personaBox.value = data.persona;
								countPersona();
								if (personaStatus) personaStatus.textContent = res.ok ? "已恢复随包人格，下一轮生效" : "恢复失败";
							} catch {
								if (personaStatus) personaStatus.textContent = "恢复失败";
							}
						});
					}

					// 导出 / 导入配置
					const configFile = panel.querySelector(".khaslana-config-file");
					const configStatus = panel.querySelector(".khaslana-config-status");
					const exportConfig = panel.querySelector('[data-config="export"]');
					const importConfig = panel.querySelector('[data-config="import"]');
					if (exportConfig) {
						exportConfig.addEventListener("click", async () => {
							let persona = "";
							try {
								const res = await fetch("/khaslana/persona");
								persona = (await res.json()).persona ?? "";
							} catch {
								/* ignore */
							}
							const payload = { version: VERSION, form, settings, persona };
							const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
							const link = document.createElement("a");
							link.href = URL.createObjectURL(blob);
							link.download = `khaslana-config-${Date.now()}.json`;
							link.click();
							setTimeout(() => URL.revokeObjectURL(link.href), 1000);
							if (configStatus) configStatus.textContent = "已导出";
						});
					}
					if (importConfig && configFile) importConfig.addEventListener("click", () => configFile.click());
					if (configFile) {
						configFile.addEventListener("change", async () => {
							const file = configFile.files?.[0];
							if (!file) return;
							try {
								const data = JSON.parse(await file.text());
								if (data.settings && typeof data.settings === "object") {
									panel.querySelectorAll("[data-set]").forEach((input) => {
										const key = input.dataset.set;
										if (!(key in data.settings)) return;
										const value = data.settings[key];
										if (input.type === "checkbox") input.checked = Boolean(value);
										else input.value = String(value);
										input.dispatchEvent(new Event("input", { bubbles: true }));
									});
								}
								if (typeof data.form === "string") applyForm(data.form);
								if (typeof data.persona === "string") {
									await fetch("/khaslana/persona", {
										method: "POST",
										headers: { "content-type": "application/json" },
										body: JSON.stringify({ persona: data.persona }),
									});
									if (personaBox) personaBox.value = data.persona;
									countPersona();
								}
								if (configStatus) configStatus.textContent = "已导入";
							} catch {
								if (configStatus) configStatus.textContent = "导入失败";
							}
							configFile.value = "";
						});
					}

					const diag = panel.querySelector(".khaslana-diag");
					const diagBody = panel.querySelector(".khaslana-diag-body");
					const renderDiag = () => {
						if (!diagBody) return;
						const artMode = String(ART.phainon).startsWith("data:") ? "内嵌" : "宿主路由";
						diagBody.textContent = [
							`版本 ${VERSION} · 形态 ${form} · ${mode === "auto" ? "跟随时间" : "手动"}`,
							`立绘 ${artMode} · 粒子 ${settings.particles ? (rafId ? "运行中" : "已暂停") : "关闭"}`,
							`粒子 ${motes.length} 颗 · 壁纸 ${walls.length} 张 · 音乐 ${music.length} 首`,
							`视口 ${window.innerWidth}×${window.innerHeight} · DPR ${window.devicePixelRatio || 1}`,
						].join("\n");
					};
					if (diag) diag.addEventListener("toggle", () => { if (diag.open) renderDiag(); });

					document.body.appendChild(fab);
					document.body.appendChild(panel);
				}

				function togglePanel() {
					if (!panel) return;
					panel.hidden = !panel.hidden;
					updateUI();
				}
				openPanelHook = togglePanel;

				function updateUI() {
					if (!fab || !panel) return;
					fab.textContent = FORMS[form].icon;
					panel.querySelectorAll("[data-form]").forEach((button) => {
						button.dataset.active = String(button.dataset.form === form);
					});
				}

				buildUI();
				const art = document.createElement("div");
				art.className = "khaslana-art";
				art.setAttribute("aria-hidden", "true");
				const canvas = document.createElement("canvas");
				canvas.className = "khaslana-particles";
				canvas.setAttribute("aria-hidden", "true");
				const wallpaper = document.createElement("div");
				wallpaper.className = "khaslana-wallpaper";
				wallpaper.setAttribute("aria-hidden", "true");
				let walls = [];
				let wallCurrent = null;
				let wallTimer = 0;
				const pctx = canvas.getContext("2d");
				const motes = [];
				let rafId = 0;
				const psize = { w: 0, h: 0 };
				let artHome = null;
				function placeArt() {
					const tabs = document.querySelector("[data-conversation-tabs]");
					if (!tabs) return false;
					document.querySelectorAll(".khaslana-art").forEach((node) => {
						if (node !== art) node.remove();
					});
					let el = tabs.parentElement;
					let root = null;
					while (el && el !== document.body) {
						if (el.clientHeight > window.innerHeight * 0.55 && el.clientWidth > 360) {
							root = el;
							break;
						}
						el = el.parentElement;
					}
					if (!root) return false;
					if (art.parentElement !== root) {
						root.style.isolation = "isolate";
						if (getComputedStyle(root).position === "static") root.style.position = "relative";
						root.insertBefore(art, root.firstChild);
					}
					if (wallpaper.parentElement !== root) root.insertBefore(wallpaper, art);
					if (canvas.parentElement !== root) root.appendChild(canvas);
					markComposer();
					retitleHero();
					artHome = root;
					return true;
				}

				function markComposer() {
					const field = document.querySelector("[data-composer-placeholder], [data-placeholder]");
					const card = field ? field.closest('[class*="_card"]') : null;
					document.querySelectorAll(".khaslana-composer").forEach((node) => {
						if (node !== card) node.classList.remove("khaslana-composer");
					});
					if (card) card.classList.add("khaslana-composer");
				}

				function retitleHero() {
					const group = document.querySelector('[class*="titleGroup"]');
					const span = group ? group.querySelector("span") : null;
					if (!span) return;
					if (span.textContent === "探索未至之境") span.textContent = "与我一同，成为英雄吧";
					span.classList.add("khaslana-hero-title");
				}

				function updateArt(animate = false) {
					const uri = form === "white" ? ART.phainon : form === "sun" ? ART.sun : ART.reaver;
					if (!placeArt()) setTimeout(placeArt, 700);
					if (!uri) {
						art.style.backgroundImage = "none";
						art.hidden = true;
						return;
					}
					if (animate && settings.effects) {
						// 过场：先淡出，换图后再淡入
						art.style.opacity = "0";
						setTimeout(() => {
							art.style.backgroundImage = `url("${uri}")`;
							art.hidden = false;
							art.style.opacity = "";
						}, 180);
						return;
					}
					art.style.backgroundImage = `url("${uri}")`;
					art.hidden = false;
				}

				// ── 形态粒子：白厄飘星点、卡厄斯兰那浮金尘、盗火行者升紫焰 ──
				function moteColors() {
					if (form === "white") return ["rgba(150,195,255,", "rgba(255,255,255,"];
					if (form === "sun") return ["rgba(255,200,90,", "rgba(255,238,190,"];
					return ["rgba(170,140,255,", "rgba(120,160,255,"];
				}
				function resizeMotes() {
					const host = canvas.parentElement;
					if (!host) return;
					const dpr = Math.min(2, window.devicePixelRatio || 1);
					psize.w = host.clientWidth;
					psize.h = host.clientHeight;
					canvas.width = Math.max(1, Math.floor(psize.w * dpr));
					canvas.height = Math.max(1, Math.floor(psize.h * dpr));
					pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				}
				function seedMotes() {
					motes.length = 0;
					const count = 44;
					for (let i = 0; i < count; i++) {
						motes.push({
							x: Math.random() * (psize.w || 1),
							y: Math.random() * (psize.h || 1),
							r: 0.6 + Math.random() * 1.6,
							vy: 0.12 + Math.random() * 0.38,
							sway: 0.15 + Math.random() * 0.5,
							phase: Math.random() * Math.PI * 2,
							warm: Math.random() < 0.25,
						});
					}
				}
				function drawMotes(t) {
					if (!psize.w || !psize.h) resizeMotes();
					pctx.clearRect(0, 0, psize.w, psize.h);
					const [cool, warm] = moteColors();
					for (const m of motes) {
						m.y -= m.vy;
						m.x += Math.sin(t / 1400 + m.phase) * m.sway * 0.3;
						if (m.y < -8) {
							m.y = psize.h + 8;
							m.x = Math.random() * psize.w;
						}
						const alpha = 0.16 + 0.3 * (0.5 + 0.5 * Math.sin(t / 900 + m.phase));
						pctx.fillStyle = (m.warm ? warm : cool) + alpha.toFixed(3) + ")";
						pctx.beginPath();
						pctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
						pctx.fill();
					}
					rafId = requestAnimationFrame(drawMotes);
				}
				function syncParticles() {
					if (!settings.particles || prefersReducedMotion()) {
						canvas.style.display = "none";
						if (rafId) cancelAnimationFrame(rafId);
						rafId = 0;
						return;
					}
					canvas.style.display = "block";
					if (!canvas.isConnected) placeArt();
					if (!psize.w || !psize.h) {
						resizeMotes();
						seedMotes();
					}
					if (!rafId) rafId = requestAnimationFrame(drawMotes);
				}
				function wallShade() {
					const alpha = Math.min(0.95, 0.15 + settings.wallpaperDim / 100);
					return form === "white"
						? `rgba(244,248,255,${alpha.toFixed(2)})`
						: `rgba(5,8,18,${alpha.toFixed(2)})`;
				}
				function paintWallpaper() {
					const item = walls.find((w) => w.id === wallCurrent);
					const on = settings.wallpaperOn && item !== undefined;
					wallpaper.style.backgroundImage = on ? `url("${item.data}")` : "none";
					wallpaper.dataset.on = String(on);
					document.body.style.setProperty("--khaslana-wall-shade", wallShade());
				}
				function renderWallList() {
					const list = panel ? panel.querySelector(".khaslana-wall-list") : null;
					if (!list) return;
					list.innerHTML = "";
					for (const item of walls) {
						const btn = document.createElement("button");
						btn.type = "button";
						btn.className = "khaslana-wall-thumb";
						btn.style.backgroundImage = `url("${item.data}")`;
						btn.dataset.active = String(item.id === wallCurrent);
						btn.addEventListener("click", () => {
							wallCurrent = item.id;
							renderWallList();
							paintWallpaper();
						});
						list.appendChild(btn);
					}
				}
				function scheduleWallTimer() {
					if (wallTimer) clearInterval(wallTimer);
					wallTimer = 0;
					if (!settings.wallpaperOn || !settings.wallpaperRotate || walls.length < 2) return;
					wallTimer = setInterval(() => {
						const index = walls.findIndex((w) => w.id === wallCurrent);
						wallCurrent = walls[(index + 1) % walls.length].id;
						renderWallList();
						paintWallpaper();
					}, settings.wallpaperInterval * 60_000);
				}
				function wireWallpaperUI() {
					if (!panel) return;
					const file = panel.querySelector(".khaslana-file");
					const importBtn = panel.querySelector('[data-wall="import"]');
					const removeBtn = panel.querySelector('[data-wall="remove"]');
					if (importBtn && file) importBtn.addEventListener("click", () => file.click());
					if (file) {
						file.addEventListener("change", async () => {
							const files = [...(file.files ?? [])];
							for (const f of files) {
								const data = await new Promise((resolve) => {
									const reader = new FileReader();
									reader.onload = () => resolve(reader.result);
									reader.readAsDataURL(f);
								});
								if (typeof data !== "string") continue;
								const item = {
									id: `w${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
									name: f.name,
									data,
								};
								walls.push(item);
								wallCurrent = item.id;
								await wallPut(item);
							}
							settings.wallpaperOn = true;
							writeSettings(settings);
							renderWallList();
							paintWallpaper();
							scheduleWallTimer();
							file.value = "";
						});
					}
					if (removeBtn) {
						removeBtn.addEventListener("click", async () => {
							if (!wallCurrent) return;
							const id = wallCurrent;
							walls = walls.filter((w) => w.id !== id);
							await wallDelete(id);
							wallCurrent = walls[0]?.id ?? null;
							renderWallList();
							paintWallpaper();
							scheduleWallTimer();
						});
					}
				}
				function wireSoundUI() {
					if (!panel) return;
					const audioInput = panel.querySelector(".khaslana-audio");
					const toggleBtn = panel.querySelector('[data-music="toggle"]');
					const nextBtn = panel.querySelector('[data-music="next"]');
					const importBtn = panel.querySelector('[data-music="import"]');

					const refresh = () => {
						if (toggleBtn) toggleBtn.textContent = audio.paused ? "播放" : "暂停";
						const list = panel.querySelector(".khaslana-music-list");
						if (!list) return;
						list.innerHTML = "";
						music.forEach((item, index) => {
							const btn = document.createElement("button");
							btn.type = "button";
							btn.className = "khaslana-music-item";
							btn.textContent = item.name || `曲目 ${index + 1}`;
							btn.dataset.active = String(index === musicIndex);
							btn.addEventListener("click", () => playIndex(index));
							list.appendChild(btn);
						});
					};
					refresh();
					window.__khaslanaRefreshMusic = refresh;

					if (importBtn && audioInput) importBtn.addEventListener("click", () => audioInput.click());
					if (audioInput) {
						audioInput.addEventListener("change", async () => {
							const files = [...(audioInput.files ?? [])];
							for (const f of files) {
								const data = await new Promise((resolve) => {
									const reader = new FileReader();
									reader.onload = () => resolve(reader.result);
									reader.readAsDataURL(f);
								});
								if (typeof data !== "string") continue;
								const item = {
									id: `m${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
									name: f.name.replace(/\.[^.]+$/, ""),
									data,
								};
								music.push(item);
								await musicPut(item);
							}
							if (musicIndex < 0 && music.length > 0) playIndex(0);
							else refresh();
							audioInput.value = "";
						});
					}
					if (toggleBtn) toggleBtn.addEventListener("click", () => toggleMusic());
					if (nextBtn) nextBtn.addEventListener("click", () => playIndex(musicIndex + 1));

					void musicAll().then((items) => {
						music = items;
						refresh();
					});
					document.addEventListener("keydown", onTypingKey, true);
				}

				function renderMusic() {
					if (typeof window.__khaslanaRefreshMusic === "function") window.__khaslanaRefreshMusic();
				}
				function playIndex(index) {
					if (music.length === 0) return;
					musicIndex = ((index % music.length) + music.length) % music.length;
					audio.src = music[musicIndex].data;
					void audio.play().catch(() => {});
					renderMusic();
				}
				function playNext() {
					if (music.length > 0) playIndex(musicIndex + 1);
				}
				function toggleMusic() {
					if (music.length === 0) return;
					if (audio.paused) {
						if (!audio.src) playIndex(0);
						else void audio.play().catch(() => {});
					} else {
						audio.pause();
					}
					renderMusic();
				}
				function clickSound() {
					try {
						actx ??= new (window.AudioContext ?? window.webkitAudioContext)();
						const now = actx.currentTime;
						const osc = actx.createOscillator();
						const gain = actx.createGain();
						osc.type = "triangle";
						osc.frequency.setValueAtTime(300 + Math.random() * 90, now);
						gain.gain.setValueAtTime(0, now);
						gain.gain.linearRampToValueAtTime((settings.typingVolume / 100) * 0.05, now + 0.005);
						gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
						osc.connect(gain);
						gain.connect(actx.destination);
						osc.start(now);
						osc.stop(now + 0.08);
					} catch {
						/* 音频不可用 */
					}
				}
				function onTypingKey(event) {
					if (!settings.typingSound) return;
					if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
					const target = event.target;
					if (!(target instanceof HTMLElement)) return;
					const editable =
						target.tagName === "TEXTAREA" ||
						target.tagName === "INPUT" ||
						target.isContentEditable === true;
					if (editable) clickSound();
				}

				const onResize = () => {
					if (!canvas.isConnected) return;
					resizeMotes();
					seedMotes();
				};
				window.addEventListener("resize", onResize);
				const onVisibility = () => {
					if (document.hidden) {
						if (rafId) cancelAnimationFrame(rafId);
						rafId = 0;
					} else {
						syncParticles();
					}
				};
				document.addEventListener("visibilitychange", onVisibility);

				applySettings();
				applyForm(form, { persist: false });
				void wallAll().then((items) => {
					walls = items;
					wallCurrent = items[0]?.id ?? null;
					renderWallList();
					paintWallpaper();
					scheduleWallTimer();
				});

				// 切换会话/工作区时，React 会重建对话列，把立绘节点一并移除。
				// 用 MutationObserver 只在 DOM 真的变化时补回，空闲时零开销。
				const artObserver = new MutationObserver(() => {
					if (window.__khaslanaOwner !== OWNER) return; // 已被新实例接管，旧实例不再插手
					markComposer();
					retitleHero();
					if (art.hidden) return;
					if (!art.isConnected || art.parentElement === null) {
						placeArt();
					} else if (artHome !== null && art.parentElement !== artHome) {
						placeArt();
					}
				});
				artObserver.observe(document.body, { childList: true, subtree: true });

				const onOutside = (event) => {
					if (panel === null || panel.hidden) return;
					if (panel.contains(event.target) || (fab && fab.contains(event.target))) return;
					panel.hidden = true;
				};
				const onEsc = (event) => {
					if (event.key === "Escape" && panel && !panel.hidden) {
						panel.hidden = true;
					}
				};
				document.addEventListener("pointerdown", onOutside, true);
				document.addEventListener("keydown", onEsc);

				// 跟随时间：每分钟检查一次；跨过时段边界时自动接管（手动选择只在当前时段内有效）
				timer = setInterval(() => {
					const now = autoForm();
					if (now === lastAuto) return;
					lastAuto = now;
					if (mode === "auto") applyForm(now);
				}, 60_000);

				// 主题服务若把深色标记改回去，按当前形态纠正
				const schemeObserver = new MutationObserver(() => {
					const wantDark = FORMS[form].scheme === "dark";
					const isDark = document.body.hasAttribute("data-ds-dark-theme");
					if (wantDark !== isDark) applyScheme();
				});
				schemeObserver.observe(document.body, {
					attributes: true,
					attributeFilter: ["data-ds-dark-theme"],
				});

				console.info(`[dsh-theme-khaslana] v${VERSION} applied · form=${form} · mode=${mode}`);

				return () => {
					if (timer !== null) clearInterval(timer);
					artObserver.disconnect();
					schemeObserver.disconnect();
					document.removeEventListener("pointerdown", onOutside, true);
					document.removeEventListener("keydown", onEsc);
					window.removeEventListener("resize", onResize);
					document.removeEventListener("visibilitychange", onVisibility);
					if (rafId) cancelAnimationFrame(rafId);
					if (wallTimer) clearInterval(wallTimer);
					audio.pause();
					audio.removeAttribute("src");
					document.removeEventListener("keydown", onTypingKey, true);
					if (actx) {
						try {
							void actx.close();
						} catch {
							/* ignore */
						}
						actx = null;
					}
					if (fab) fab.remove();
					if (panel) panel.remove();
					document.querySelectorAll(".khaslana-composer").forEach((node) => node.classList.remove("khaslana-composer"));
					art.remove();
					canvas.remove();
					wallpaper.remove();
					document.body.style.removeProperty("--khaslana-wall-shade");
					document.body.style.removeProperty("--khaslana-art-opacity");
					document.body.style.removeProperty("--khaslana-art-size");
					if (window.__khaslanaOwner === OWNER) delete window.__khaslanaOwner;
					document.body.removeAttribute(ATTR);
					document.body.removeAttribute(FORM_ATTR);
					document.body.removeAttribute("data-ds-dark-theme");
					document.querySelectorAll("style[data-khaslana-theme], .khaslana-flash").forEach((node) => node.remove());
				};
			}, "dsh-theme-khaslana: apply");
		}

		exports.isPlugin = true;
		exports.inject = ["theme", "slots"];
		exports.apply = apply;
		return module.exports;
	},
});
