import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getServerFnById, c as __exportAll, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { A as noteFileKind, C as normalizeFolders, D as normalizeNotes, E as normalizeLudo, O as normalizePattern, S as normalizeFocus, T as normalizeLinks, a as defaultCoaching, b as normalizeCoaching, c as defaultFocus, d as defaultLudo, h as defaultTemplates, k as normalizeTemplates, m as defaultPrefs, o as defaultConfig, s as defaultExamPath, t as DEFAULT_CONFIG_ID, u as defaultJourney, w as normalizeJourney, x as normalizeExamPath } from "./types-XZVWHhWz.mjs";
import { A as setpaperAppForPath, B as upsertBucketPapers, E as remainingMs, F as stampCardFromItem, H as whyBlocked, I as startAway, O as rollingBucketsFromCards, P as splitResultIds, T as releaseWakeLock, a as authMiddleware, b as normalizeSessionSummary, i as asTemplateResult, j as showFocusNotice, m as holdWakeLock, o as blockLabel, u as formatDurationMin, v as mergeFocus, x as normalizeSessions, y as mergeSessionResults, z as tickFocus } from "./results-DOq2AZyk.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Separator2, i as Root2, n as Item2, o as Trigger, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { w as router_exports } from "./router-B0Z9kZGU.mjs";
import { t as authClient } from "./client-CVqXY6bk.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Menu, E as Radio, Et as BookMarked, J as Inbox, P as Monitor, Q as GraduationCap, S as Search, St as ChartColumn, T as RefreshCw, c as UserPlus, ct as EllipsisVertical, gt as CircleHelp, l as Undo2, m as StickyNote, mt as ClipboardList, p as Target, rt as FileUp, t as X, y as Settings } from "../_libs/lucide-react.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/html-store-DJ7vkWS1.js
var html_store_exports = /* @__PURE__ */ __exportAll({
	IDB_TEMPLATE_SENTINEL: () => IDB_TEMPLATE_SENTINEL,
	copyHtmlFile: () => copyHtmlFile,
	deleteHtmlFile: () => deleteHtmlFile,
	formatBytes: () => formatBytes,
	getHtmlFile: () => getHtmlFile,
	readHtmlFile: () => readHtmlFile,
	saveHtmlFile: () => saveHtmlFile,
	templateHtmlId: () => templateHtmlId
});
var DB_NAME$1 = "setpaper-html-v1";
var STORE$1 = "files";
var IDB_TEMPLATE_SENTINEL = "__IDB_TEMPLATE__";
function openDb$1() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME$1, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE$1)) db.createObjectStore(STORE$1, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("IndexedDB unavailable"));
	});
}
async function saveHtmlFile(file) {
	const db = await openDb$1();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE$1, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Could not save HTML"));
		tx.objectStore(STORE$1).put(file);
	});
	db.close();
}
async function getHtmlFile(id) {
	const db = await openDb$1();
	const row = await new Promise((resolve, reject) => {
		const req = db.transaction(STORE$1, "readonly").objectStore(STORE$1).get(id);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("Could not read HTML"));
	});
	db.close();
	return row ?? null;
}
async function deleteHtmlFile(id) {
	const db = await openDb$1();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE$1, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Could not delete HTML"));
		tx.objectStore(STORE$1).delete(id);
	});
	db.close();
}
function templateHtmlId(id) {
	return `template:${id}`;
}
async function copyHtmlFile(fromId, toId) {
	const src = await getHtmlFile(fromId);
	if (!src) return false;
	await saveHtmlFile({
		...src,
		id: toId,
		createdAt: Date.now()
	});
	return true;
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / 1048576).toFixed(1)} MB`;
}
/** Read an HTML file of any size off the main thread of the picker, with progress. */
function readHtmlFile(file, onProgress) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onprogress = (e) => {
			if (onProgress && e.lengthComputable && e.total > 0) onProgress(Math.min(100, Math.round(e.loaded / e.total * 100)));
		};
		reader.onload = () => resolve(String(reader.result ?? ""));
		reader.onerror = () => reject(reader.error ?? /* @__PURE__ */ new Error("Could not read this HTML file"));
		reader.readAsText(file);
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-36ldYvSH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var seed_questions_default = {
	deckName: "Rock Mechanics, Supports & Subsidence",
	description: "Overman/Sirdar practice — RMR, roof supports, subsidence, PPV. 115 MCQs.",
	questions: [
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "According to the classification of rocks by bedding planes, rocks are classified as \"Massive\" when the bedding planes are at a distance of:",
			"options": [
				"Less than 75 mm",
				"Between 75 mm and 1.2 m",
				"Exactly 1.0 m",
				"More than 1.2 m"
			],
			"correct": 3,
			"explanation": "Correct answer is D. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which of the following refers to the stress that remains even after the cause of the stress has been removed?",
			"options": [
				"Vertical stress",
				"Induced stress",
				"Residual stress",
				"Inherent stress"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the approximate density of rocks in Indian coal mines?",
			"options": [
				"1.500 t/m³",
				"2.306 t/m³",
				"3.105 t/m³",
				"4.000 t/m³"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The \"Immediate roof\" in a coal mine is generally considered to be up to what distance above the roof?",
			"options": [
				"2 meters",
				"3 meters",
				"6 meters",
				"10 meters"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The pressure that exists in the strata before any mining activity has started is called:",
			"options": [
				"Abutment Pressure",
				"Virgin Pressure",
				"Shear Pressure",
				"Tensile Pressure"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Where is \"Shear Pressure\" primarily developed after excavation?",
			"options": [
				"At the center of the excavation",
				"In the middle of the goaf",
				"Near the edges of the pillar and the jointing point of the excavated roof",
				"Only in the immediate floor"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In the pressure arch theory, the vacuum space created by the sagging beds is referred to as:",
			"options": [
				"Inflexion space",
				"Weber's space/cavity",
				"Tensile dome",
				"Critical area"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In Longwall (LW) mining, where is the Front Abutment pressure typically located?",
			"options": [
				"Exactly at the working face",
				"30m to 50m behind the face",
				"Slightly away from the face, usually half a pillar ahead or 3m to 10m ahead",
				"It disappears completely due to rock breaking"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The compressive strength of sandstone is approximately:",
			"options": [
				"2.25 kg/sq.mm",
				"13.5 kg/sq.mm",
				"20.0 kg/sq.mm",
				"5.5 kg/sq.mm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which test is used to measure the tensile strength of rocks?",
			"options": [
				"Compressive test",
				"Brazilian test",
				"Shear test",
				"Impact test"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The angle made by the line joining the edge of the working and the edge of subsidence with the vertical is called the:",
			"options": [
				"Angle of draw",
				"Angle of break",
				"Angle of inflexion",
				"Critical angle"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The Subsidence factor is defined as the ratio of:",
			"options": [
				"Maximum possible subsidence to the depth of the seam",
				"Maximum possible subsidence to the mining height",
				"Mining height to the gallery width",
				"Angle of draw to the angle of break"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What happens at the \"Point of inflexion\" during subsidence?",
			"options": [
				"Tensile stress is at its absolute maximum",
				"Compressive stress is at its absolute maximum",
				"Tensile strain changes into compressive strain (no compression or tension here)",
				"The surface cracks completely"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "An extraction area where maximum subsidence occurs at more than one point on the surface is known as a:",
			"options": [
				"Sub-critical area",
				"Super-critical area",
				"Critical area",
				"Virgin area"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the safe limit of strain for subsidence in India?",
			"options": [
				"5 mm/m",
				"10 mm/m",
				"15 mm/m",
				"20 mm/m"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which theory of subsidence applies specifically to loose mediums like sand?",
			"options": [
				"Beam/Plate theory",
				"Dome theory",
				"Particulate theory",
				"Trough theory"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Why must 0.6m of coal be left against a Shale roof?",
			"options": [
				"Because shale is extremely hard and damages drill bits",
				"Because shale disintegrates upon contact with water, making it a treacherous roof",
				"To increase the calorific value of the run-of-mine coal",
				"Because shale exerts very high lateral stress"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What does RQD stand for in rock mass classification?",
			"options": [
				"Rock Quality Designation",
				"Rock Quantity Determination",
				"Roof Quality Dimension",
				"Rock Quotient Data"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "An RQD value of 0-25% indicates that the rock quality is:",
			"options": [
				"Good",
				"Fair",
				"Very Poor",
				"Excellent"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The RMR (Rock Mass Rating) system for immediate roof stability evaluates the roof up to what height above the gallery?",
			"options": [
				"1 meter",
				"2 meters",
				"3 meters",
				"6 meters"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which parameter carries the maximum rating (30 points) in the CMRS/ISM Geomechanics Classification for RMR?",
			"options": [
				"Structural features",
				"Layer thickness",
				"Rock weatherability",
				"Ground water seepage"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If the RMR of a roof is 40 or less, which type of support is specifically recommended?",
			"options": [
				"Friction props",
				"Timber cogs",
				"Resin grouted bolts",
				"Steel arches"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For continuous miner operations, how is the RMR value adjusted?",
			"options": [
				"Reduced by 10%",
				"Increased by 10%",
				"Reduced by 30%",
				"No adjustment (Nil)"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "According to the Paul Committee report, the length of a roof bolt should be at least what fraction of the gallery width?",
			"options": [
				"1/2",
				"1/3",
				"1/4",
				"2/3"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "At junctions, the bolting density should be increased by:",
			"options": [
				"10%",
				"25%",
				"50%",
				"100%"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Rock Classification, Stresses, Subsidence Basics & Immediate Roof (Q1-Q25)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In anchorage testing of roof bolts, what percentage of installed bolts are subjected to a random pull test?",
			"options": [
				"1%",
				"5%",
				"10%",
				"20%"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "\"Quick setting\" for a roof bolt means it should develop an anchorage capacity of 10 KN in 30 minutes and approximately how much in 2 hours?",
			"options": [
				"20 KN",
				"30 KN",
				"50 KN",
				"100 KN"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A roof bolt must not fail in a tensile test up to a minimum load of:",
			"options": [
				"10 tonnes",
				"12 tonnes",
				"16 tonnes",
				"20 tonnes"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The diameter of the drilled hole for a roof bolt should not exceed the bolt's diameter by more than:",
			"options": [
				"2 to 5 mm",
				"8 to 12 mm",
				"15 to 20 mm",
				"25 mm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What type of prop setting is used in steep seams?",
			"options": [
				"Vertical",
				"Normal to the dip",
				"Underset Prop",
				"Horizontal"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The minimum length of a cogging member (for heights up to 3m) should not be less than:",
			"options": [
				"1.0 m",
				"1.2 m",
				"1.5 m",
				"2.0 m"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the load-bearing capacity of a Timber prop?",
			"options": [
				"1 to 2 tonnes",
				"5 to 6 tonnes",
				"10 to 12 tonnes",
				"15 to 20 tonnes"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the load-bearing capacity of a Resin grouted roof bolt?",
			"options": [
				"5 to 6 tonnes",
				"8 to 12 tonnes",
				"12 to 18 tonnes",
				"20 to 30 tonnes"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "According to DGMS, the minimum load-bearing capacity of a Steel prop should be:",
			"options": [
				"10 tonnes",
				"20 tonnes",
				"30 tonnes",
				"40 tonnes"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In a Yielding prop, the load at which the upper part of the prop starts to slide is called:",
			"options": [
				"Setting load",
				"Peak load",
				"Yield load",
				"Ultimate load"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which type of powered support has a caving shield attached to the rear but is unsuitable for weak roofs due to large gaps between the face and legs?",
			"options": [
				"Frame type",
				"Chock type",
				"Shield type",
				"Chock Shield type"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In a Chock Shield support, what mechanism ensures that the roof piece moves parallel to the floor?",
			"options": [
				"Hydraulic ram",
				"Lemniscate linkage",
				"Suspension beam",
				"Friction wedge"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In the Q-System formula for rock mass classification, what does \"Jn\" stand for?",
			"options": [
				"Joint roughness number",
				"Joint set number",
				"Joint alteration number",
				"Joint water reduction factor"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In the Q-System, what does the term (Jr / Ja) represent?",
			"options": [
				"Block size",
				"Active stress",
				"Shear strength or nature of the rock",
				"Groundwater seepage"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "An RMR value of 60-80 falls under which Class of roof?",
			"options": [
				"Class I (Very Good)",
				"Class II (Good)",
				"Class III (Fair)",
				"Class IV (Poor)"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "An RMR value of 0-20 represents which class of roof?",
			"options": [
				"Class V (Very Poor)",
				"Class IV (Poor)",
				"Class III (Fair)",
				"Class II (Good)"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For calculating RMR adjustments, if the depth of workings is between 400m and 600m, the RMR is reduced by:",
			"options": [
				"10%",
				"20%",
				"30%",
				"It is increased by 10%"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If there is a working above the current seam with a parting of 3m to 10m, the RMR can be reduced by up to:",
			"options": [
				"10%",
				"20%",
				"30%",
				"50%"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the most accepted criterion for evaluating blast damage to underground workings?",
			"options": [
				"Frequency of vibration",
				"Peak Particle Velocity (PPV)",
				"Decibel level",
				"Air overpressure"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which of the following damage categories includes superficial cracks on pillars/roof and cracks in isolation stoppings?",
			"options": [
				"No appreciable damage",
				"Threshold damage",
				"Minor damage",
				"Major damage"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which part of the underground structure experiences a faster \"attenuation\" (weakening) of vibration?",
			"options": [
				"Floor",
				"Roof",
				"Pillar",
				"Coal face"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A seismograph used for measuring blast vibrations underground should be capable of recording particle velocities up to:",
			"options": [
				"50 mm/s",
				"100 mm/s",
				"250 mm/s",
				"500 mm/s"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Where is the seismograph transducer typically placed for taking observations in an underground mine?",
			"options": [
				"At the center of the goaf",
				"At the roof junction, or inside the pillar at 0.5 to 0.6m depth",
				"Inside the sump",
				"On the haulage track"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For an RMR of 20-30, what is the Threshold PPV Value for a Pillar?",
			"options": [
				"20 mm/s",
				"30 mm/s",
				"50 mm/s",
				"100 mm/s"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For an RMR of 60-80, what is the Threshold PPV Value for the Roof?",
			"options": [
				"50 mm/s",
				"70 mm/s",
				"100 mm/s",
				"120 mm/s"
			],
			"correct": 3,
			"explanation": "Correct answer is D. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which is the most common, cheap, and easily available support used in Indian mines?",
			"options": [
				"Steel arch",
				"Powered support",
				"Dry and seasoned Sal (Hind - Sakhua) timber",
				"Resin bolts"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In metal mines, a timber prop is also commonly referred to as a:",
			"options": [
				"Stull",
				"Chock",
				"Cog",
				"Sprag"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The disease \"Dry rot\" in timber is caused by:",
			"options": [
				"High temperature",
				"Fungus attack",
				"Excessive water pressure",
				"Termites"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which type of timber is highly susceptible to both Dry and Wet rot?",
			"options": [
				"Seasoned timber",
				"Chemically treated timber",
				"Unseasoned timber (Green timber)",
				"Bamboo"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "According to the \"Suspension Theory\" of roof bolting, the dead weight of the loose strata is transferred to:",
			"options": [
				"The immediate floor",
				"The side pillars",
				"An upper strong anchor layer",
				"The wire mesh"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "RMR, Roof Bolting, Anchorage Testing & Support Capacities (Q26-Q55)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which roof bolting theory works by binding multiple layers of strata together to increase frictional effect and prevent tensile failure?",
			"options": [
				"Beam Building (Beam theory)",
				"Arching Action",
				"Keying Effect",
				"Suspension Theory"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The \"Keying Effect\" (Keystone Theory) is highly useful when the roof strata is:",
			"options": [
				"Massive and unbroken",
				"Extremely blocky and fractured",
				"Composed of pure sandstone",
				"Highly wet and muddy"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The main objective of the \"Arching Action\" theory in roof bolting is to:",
			"options": [
				"Suspend the roof like a pendulum",
				"Increase the compressive stress value in the roof to ignore tensile stress",
				"Create a void for gas accumulation",
				"Allow the roof to sag up to 2 meters"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In the Arching Action theory, what is recommended to support the weak zones between the bolts?",
			"options": [
				"Timber cogs",
				"Hydraulic props",
				"Wire mesh and Shotcrete",
				"Steel girders"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The width that can be extracted without causing any movement on the surface is called:",
			"options": [
				"Sub-critical width",
				"Critical width",
				"Non Effective Width (NEW)",
				"Super-critical width"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the approximate value of the Non Effective Width (NEW) in India relative to the depth of extraction?",
			"options": [
				"0.1 to 0.2 times the depth",
				"0.3 to 1.17 times the depth",
				"1.5 to 2.0 times the depth",
				"2.5 times the depth"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In subsidence control, \"Harmonic mining\" is a technique where:",
			"options": [
				"Only 10% of the coal is extracted",
				"The tensile stress of one seam neutralizes the compressive stress of another",
				"Mining is done only during rainy seasons",
				"The goaf is completely stowed with sand"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "According to the notes, flaggy rocks have bedding planes at a distance of:",
			"options": [
				"Less than 75 mm",
				"75 mm to 1.2 m",
				"1.2 m to 2.0 m",
				"More than 2.0 m"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The inherent stress in rocks is caused by:",
			"options": [
				"The weight of upper layers only",
				"Excavation of galleries",
				"Natural causes like folding, faulting, and igneous intrusions",
				"Blasting operations"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which stress acts at right angles to the burden stress and is significantly lesser than the vertical stress?",
			"options": [
				"Residual stress",
				"Lateral stress",
				"Shear stress",
				"Tensile stress"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Tensile stress in an excavation is maximum at the:",
			"options": [
				"Center of the excavation",
				"Corner points",
				"Immediate floor",
				"Goaf edge"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In a narrow Longwall face, the pressure arch is:",
			"options": [
				"Extremely massive",
				"Similar to that in Bord & Pillar (B&P)",
				"Non-existent",
				"Only located in the floor"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A rock's ability to resist deformation caused by slippage parallel to the applied tension is defined as its:",
			"options": [
				"Compressive strength",
				"Tensile strength",
				"Shear stress/strength",
				"Weatherability"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The compressive strength of coal is approximately:",
			"options": [
				"1.00 kg/sq.mm",
				"2.25 kg/sq.mm",
				"13.5 kg/sq.mm",
				"20.0 kg/sq.mm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the value of the constant 'K' in the strain formula (Strain = K * Smax / H) for India?",
			"options": [
				"0.5",
				"1",
				"1.5",
				"2.0"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In RMR classification, what is the maximum rating given to Ground water seepage?",
			"options": [
				"10",
				"15",
				"20",
				"30"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In RMR classification, what is the maximum rating given to the Strength of the roof rock?",
			"options": [
				"10",
				"15",
				"20",
				"25"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If the gallery span is between 4.5m and 6.0m, how is the RMR adjusted?",
			"options": [
				"It is increased by 10%",
				"It is reduced by 10-20%",
				"It is reduced by 30%",
				"There is no change"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The minimum length of a roof bolt should generally not be less than:",
			"options": [
				"0.5 meters",
				"1.0 meters",
				"1.5 meters",
				"2.0 meters"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For a \"Fair\" roof, what is the recommended bolting density?",
			"options": [
				"0.7 bolts/sqm",
				"1.0 bolts/sqm",
				"1.2 to 1.5 bolts/sqm",
				"2.0 bolts/sqm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For a \"Poor\" roof, what is the recommended bolting density?",
			"options": [
				"0.7 bolts/sqm",
				"1.0 bolts/sqm",
				"1.2 to 1.5 bolts/sqm",
				"0.5 bolts/sqm"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What percentage of installed roof bolts are subjected to destructive testing?",
			"options": [
				"1%",
				"5%",
				"10%",
				"15%"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The anchorage testing of roof bolts must be done under the supervision of:",
			"options": [
				"The Mining Mate",
				"The Assistant Manager / Under Manager (Bolting-Overman)",
				"The General Manager only",
				"The Chief Inspector of Mines"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The bearing plate for a roof bolt should be flat under a minimum load of:",
			"options": [
				"5 tonnes",
				"10 tonnes",
				"14 tonnes",
				"20 tonnes"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Roof bolts should not show any deterioration when subjected to an accelerated weathering test for:",
			"options": [
				"5 days",
				"10 days",
				"20 days",
				"30 days"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For a timber prop setting, the LID dimension should not be less than:",
			"options": [
				"25cm x 5cm x Prop dia",
				"50cm x 8cm x Prop dia",
				"75cm x 10cm x Prop dia",
				"100cm x 15cm x Prop dia"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the required setting load for vertical supports to prevent them from dislodging due to blasting?",
			"options": [
				"Minimum 2 tonnes",
				"Minimum 5 tonnes",
				"Minimum 10 tonnes",
				"Minimum 15 tonnes"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In Safari clamps/cross bar supports, what should be the minimum depth of the side hole?",
			"options": [
				"10 cm",
				"30 cm",
				"50 cm",
				"100 cm"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "According to DGMS, what is the minimum load-bearing capacity required for an Iron chock?",
			"options": [
				"10 tonnes",
				"20 tonnes",
				"30 tonnes",
				"40 tonnes"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the load-bearing capacity of a Timber chock?",
			"options": [
				"5 to 10 tonnes",
				"10 to 20 tonnes",
				"20 to 30 tonnes",
				"30 to 40 tonnes"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Powered Supports, Q-System, Blast Vibration & Timber Supports (Q56-Q85)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the load-bearing capacity of a Steel arch?",
			"options": [
				"10 to 15 tonnes",
				"15 to 20 tonnes",
				"20 to 25 tonnes",
				"30 to 40 tonnes"
			],
			"correct": 3,
			"explanation": "Correct answer is D. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In powered supports, the setting load is typically kept high at what percentage to resist lateral pressure from roof machinery?",
			"options": [
				"30% or more",
				"50% or more",
				"70% or more",
				"90% or more"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In the 6 stages of powered support (Portnov, 1972), stage 5 represents:",
			"options": [
				"Pressure drop due to valve closure",
				"Decelerated convergence",
				"Peak load (sharp increase when the cutter loader passes)",
				"Pressure drop upon releasing the prop"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In the Q-System, what does the (Jw / SRF) parameter represent?",
			"options": [
				"Active stress",
				"Block size",
				"Shear strength",
				"RQD"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Under the Q-System classification, a Q-value of 10 to 40 denotes the rock mass quality as:",
			"options": [
				"Poor",
				"Fair",
				"Good",
				"Very good"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If lateral stress in a mine is \"High\", the RMR value is adjusted by:",
			"options": [
				"Reducing by 10%",
				"Reducing by 20%",
				"Reducing by 30%",
				"Increasing by 10%"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If there is adjacent working in the same seam with an extraction of 20-40m, the RMR is reduced by:",
			"options": [
				"10%",
				"20%",
				"30%",
				"Nil"
			],
			"correct": 0,
			"explanation": "Correct answer is A. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The method of excavation known as \"Undercut and blasting\" requires what adjustment to the RMR?",
			"options": [
				"Increase by 10%",
				"Reduce by 10%",
				"Reduce by 20%",
				"Nil (No adjustment)"
			],
			"correct": 3,
			"explanation": "Correct answer is D. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In opencast blasting near underground workings, the frequency of vibration has:",
			"options": [
				"A major impact on underground mines",
				"No significant impact on underground mines",
				"A moderate impact only on pillars",
				"An impact only if the RMR is above 80"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For analyzing seismograph data, the Regression analysis method used is:",
			"options": [
				"Highest peak method",
				"Least mean square method and Square root scaling law",
				"Simple moving average",
				"Standard deviation law"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Which of the following is a factor affecting Peak Particle Velocity (PPV)?",
			"options": [
				"Type and quantity of explosive",
				"Distance from the blast site",
				"Geological and structural properties of the rock",
				"All of the above"
			],
			"correct": 3,
			"explanation": "Correct answer is D. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Regarding blast damage, which part of the underground working is more susceptible to cracking than the galleries?",
			"options": [
				"The goaf edges",
				"The junctions",
				"The solid coal pillars",
				"The floor"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "For an RMR of 40-50, the Threshold PPV Value for the Roof is:",
			"options": [
				"50-70 mm/s",
				"70-100 mm/s",
				"100-120 mm/s",
				"120 mm/s"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Seasoning of timber helps to evaporate which component, thereby preventing fungus attack?",
			"options": [
				"Lignin",
				"Sap",
				"Bark",
				"Cellulose"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If the gallery height is 1.2m to 1.5m, the recommended diameter for Sal props at the thick end is:",
			"options": [
				"50 mm to 75 mm",
				"100 mm to 125 mm",
				"150 mm to 175 mm",
				"175 mm to 225 mm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What is the approximate vertical stress at a depth of 200 meters?",
			"options": [
				"10 kg/sq.cm",
				"20 kg/sq.cm",
				"40 kg/sq.cm",
				"60 kg/sq.cm"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "What will be the approximate vertical stress at a depth of 500 meters?",
			"options": [
				"50 kg/sq.cm",
				"100 kg/sq.cm",
				"150 kg/sq.cm",
				"200 kg/sq.cm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In a 2-meter core run (200 cm), the lengths of core pieces greater than 10 cm are 15 cm, 25 cm, 12 cm, 30 cm, and 18 cm. What is the Rock Quality Designation (RQD)?",
			"options": [
				"25%",
				"50%",
				"75%",
				"100%"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "The unadjusted RMR of a roof is evaluated at 50. If the workings are at a depth of 450m, what will be the adjusted RMR considering only the depth factor?",
			"options": [
				"35",
				"40",
				"45",
				"50"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "An initial RMR calculation yields 60. The working involves a continuous miner and a gallery span of 5.0m. Applying these two adjustment factors, what is the final approximate RMR?",
			"options": [
				"48",
				"54",
				"59",
				"66"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A coal seam gallery has a width of 4.8 meters. According to the Paul Committee report, what should be the absolute minimum length of the roof bolt used?",
			"options": [
				"1.2 m",
				"1.5 m",
				"1.6 m",
				"2.0 m"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A gallery is 4.2 meters wide. What is the required minimum roof bolt length?",
			"options": [
				"1.2 m",
				"1.4 m",
				"1.5 m",
				"1.8 m"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A junction has a \"Fair\" roof requiring a base bolting density of 1.0 bolts/sqm. What must be the bolting density at this junction?",
			"options": [
				"1.00 bolts/sqm",
				"1.10 bolts/sqm",
				"1.25 bolts/sqm",
				"1.50 bolts/sqm"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "During a Brazilian test, a rock specimen fails at a load (F) of 3140 kg. The specimen has a diameter (D) of 10 cm and a length (L) of 5 cm. Using π ≈ 3.14, what is its tensile strength?",
			"options": [
				"20 kg/sq.cm",
				"40 kg/sq.cm",
				"60 kg/sq.cm",
				"80 kg/sq.cm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "In a subsidence calculation for an Indian mine (K=1), the maximum subsidence (Smax) is 1.5 meters and the depth of the seam (H) is 150 meters. What is the strain in mm/m?",
			"options": [
				"5 mm/m",
				"10 mm/m",
				"15 mm/m",
				"20 mm/m"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "Based on Indian standards for Non Effective Width (NEW), if a mine is at a depth of 200m, what is the maximum possible width that can be extracted without surface movement?",
			"options": [
				"60 meters",
				"100 meters",
				"150 meters",
				"234 meters"
			],
			"correct": 3,
			"explanation": "Correct answer is D. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A cement capsule used for roof bolting develops 3 tonnes of anchorage after 30 minutes, 5 tonnes after 2 hours, and 10 tonnes after 24 hours. What will be its strength after 28 days?",
			"options": [
				"10 tonnes",
				"12 tonnes",
				"15 tonnes",
				"20 tonnes"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A bearing plate (dome washer plate) for a roof bolt has dimensions of 150mm × 150mm × 8mm. What is the surface area of the flat square face of this plate?",
			"options": [
				"1200 sq.mm",
				"22500 sq.mm",
				"30000 sq.mm",
				"150000 sq.mm"
			],
			"correct": 1,
			"explanation": "Correct answer is B. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "If a gallery height is 2.0 meters, what is the required diameter of the Sal props to be used?",
			"options": [
				"50 mm to 100 mm",
				"100 mm to 125 mm",
				"150 mm to 175 mm",
				"175 mm to 225 mm"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		},
		{
			"type": "mcq",
			"rule": "Rock Mechanics, Supports, Subsidence & RMR / Overman's Handbook Notes",
			"question": "A support system offers a total Support Resistance of 45 tonnes/m². The calculated Rock Load is 15 tonnes/m². What is the Safety Factor?",
			"options": [
				"1.5",
				"2.0",
				"3.0",
				"4.5"
			],
			"correct": 2,
			"explanation": "Correct answer is C. As per the provided notes on Rock Mechanics, Roof Supports, Subsidence and RMR.",
			"sourceSection": "Advanced Supports, PPV Thresholds & Numerical Problems (Q86-Q115)"
		}
	]
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid$1() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
var DB_NAME = "setpaper-note-files-v1";
var STORE = "files";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("IndexedDB unavailable"));
	});
}
async function saveNoteFile(file) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Could not save file"));
		tx.objectStore(STORE).put(file);
	});
	db.close();
}
async function getNoteFile(id) {
	const db = await openDb();
	const row = await new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("Could not read file"));
	});
	db.close();
	return row ?? null;
}
async function deleteNoteFile(id) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Could not delete file"));
		tx.objectStore(STORE).delete(id);
	});
	db.close();
}
async function deleteNoteFiles(ids) {
	if (!ids.length) return;
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Could not delete files"));
		const store = tx.objectStore(STORE);
		for (const id of ids) store.delete(id);
	});
	db.close();
}
async function clearNoteFiles() {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Could not clear files"));
		tx.objectStore(STORE).clear();
	});
	db.close();
}
async function persistBrowserFile(file) {
	const id = uid$1();
	const mime = file.type || "application/octet-stream";
	await saveNoteFile({
		id,
		name: file.name,
		mime,
		size: file.size,
		blob: file,
		createdAt: Date.now()
	});
	return {
		id,
		name: file.name || "file",
		mime,
		size: file.size,
		kind: noteFileKind(mime, file.name)
	};
}
var MINUTE = 6e4;
var DAY = 864e5;
function dayKey(now, dayStartHour) {
	const d = new Date(now);
	if (d.getHours() < dayStartHour) d.setDate(d.getDate() - 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function ensureDaily(daily, dayStartHour, now = Date.now()) {
	const key = dayKey(now, dayStartHour);
	if (daily.day === key) return daily;
	return {
		day: key,
		byDeck: {}
	};
}
function ratingFromResult(item) {
	if (!item.isAttempted || !item.isCorrect) return "again";
	if (item.isMarked) return "hard";
	return "good";
}
function clampEase(ease) {
	return Math.max(1300, ease);
}
function nextLearnDue(steps, remainingAfter, now) {
	const idx = Math.max(0, steps.length - remainingAfter);
	return now + (steps[Math.min(idx, steps.length - 1)] ?? 10) * MINUTE;
}
function answerCard(card, rating, config, now = Date.now()) {
	const next = {
		...card,
		reps: card.reps + 1,
		modifiedAt: now,
		lastRating: rating
	};
	const learning = card.queue === "new" || card.queue === "learn" || card.queue === "relearn";
	const steps = card.queue === "relearn" ? config.relearnSteps : config.learnSteps;
	if (learning) {
		if (rating === "again") {
			next.queue = "learn";
			next.remainingSteps = steps.length;
			next.due = nextLearnDue(steps, next.remainingSteps, now);
			if (card.queue === "relearn" || card.queue === "review") next.lapses += 1;
			return next;
		}
		if (rating === "easy") {
			next.queue = "review";
			next.remainingSteps = 0;
			next.interval = config.easyInterval;
			next.ease = config.startingEase;
			next.due = now + next.interval * DAY;
			return next;
		}
		const remaining = card.queue === "new" ? steps.length : card.remainingSteps;
		if (rating === "hard") {
			next.queue = "learn";
			next.remainingSteps = Math.max(1, remaining);
			next.due = now + Math.max(steps[0] ?? 10, 1) * MINUTE * 1.5;
			return next;
		}
		const after = remaining - 1;
		if (after <= 0) {
			next.queue = "review";
			next.remainingSteps = 0;
			next.interval = config.graduatingInterval;
			next.ease = config.startingEase;
			next.due = now + next.interval * DAY;
			return next;
		}
		next.queue = "learn";
		next.remainingSteps = after;
		next.due = nextLearnDue(steps, after, now);
		return next;
	}
	if (rating === "again") {
		next.lapses += 1;
		next.queue = "relearn";
		next.remainingSteps = config.relearnSteps.length;
		next.interval = Math.max(config.minimumInterval, Math.round(card.interval * 0));
		next.ease = clampEase(card.ease - 200);
		next.due = nextLearnDue(config.relearnSteps, next.remainingSteps, now);
		if (next.lapses >= config.leechThreshold && config.leechAction === "suspend") {
			next.queue = "suspended";
			if (!next.tags.includes("leech")) next.tags = [...next.tags, "leech"];
		} else if (next.lapses >= config.leechThreshold) {
			if (!next.tags.includes("leech")) next.tags = [...next.tags, "leech"];
		}
		return next;
	}
	let interval = card.interval || 1;
	let ease = card.ease || config.startingEase;
	if (rating === "hard") {
		interval = Math.max(1, interval * config.hardInterval);
		ease = clampEase(ease - 150);
	} else if (rating === "good") interval = interval * (ease / 1e3) * config.intervalModifier;
	else {
		interval = interval * (ease / 1e3) * config.easyBonus * config.intervalModifier;
		ease = ease + 150;
	}
	interval = Math.min(config.maximumInterval, Math.max(config.minimumInterval, Math.round(interval)));
	next.queue = "review";
	next.interval = interval;
	next.ease = ease;
	next.due = now + interval * DAY;
	return next;
}
function deckCounts(cards, deckId, config, daily, prefs, now = Date.now()) {
	const mine = cards.filter((c) => c.deckId === deckId);
	const suspended = mine.filter((c) => c.queue === "suspended" || c.queue === "buried").length;
	const active = mine.filter((c) => c.queue !== "suspended" && c.queue !== "buried");
	const newAll = active.filter((c) => c.queue === "new").length;
	const studied = daily.byDeck[deckId]?.newStudied ?? 0;
	const newLeft = Math.max(0, Math.min(newAll, config.newPerDay - studied));
	const ahead = prefs.learnAheadMinutes * MINUTE;
	const learn = active.filter((c) => (c.queue === "learn" || c.queue === "relearn") && c.due <= now + ahead).length;
	const reviewsDue = active.filter((c) => c.queue === "review" && c.due <= now).length;
	const revStudied = daily.byDeck[deckId]?.reviewsStudied ?? 0;
	return {
		new: newLeft,
		learn,
		review: Math.max(0, Math.min(reviewsDue, config.reviewsPerDay - revStudied)),
		total: mine.length,
		suspended
	};
}
function buildStudyQueue(cards, deckId, config, daily, prefs, now = Date.now()) {
	const counts = deckCounts(cards, deckId, config, daily, prefs, now);
	const active = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended" && c.queue !== "buried");
	let news = active.filter((c) => c.queue === "new");
	if (config.newOrder === "random") news = shuffle(news);
	else news = news.slice().sort((a, b) => a.createdAt - b.createdAt);
	news = news.slice(0, counts.new);
	const learn = active.filter((c) => (c.queue === "learn" || c.queue === "relearn") && c.due <= now + prefs.learnAheadMinutes * 6e4).sort((a, b) => a.due - b.due);
	const reviews = active.filter((c) => c.queue === "review" && c.due <= now).sort((a, b) => a.due - b.due).slice(0, counts.review);
	if (prefs.newPosition === "before") return [
		...news,
		...learn,
		...reviews
	];
	if (prefs.newPosition === "after") return [
		...learn,
		...reviews,
		...news
	];
	const mixed = [];
	const a = [...learn, ...reviews];
	const b = [...news];
	while (a.length || b.length) {
		if (a.length) mixed.push(a.shift());
		if (b.length) mixed.push(b.shift());
	}
	return mixed;
}
function applyResultsToCards(cards, configs, deckConfigId, payload, now = Date.now()) {
	const config = configs[deckConfigId];
	const byId = new Map(cards.map((c) => [c.id, c]));
	const logs = [];
	for (const item of payload.items) {
		const card = byId.get(String(item.bankId));
		if (!card) continue;
		const rating = ratingFromResult(item);
		const scheduled = answerCard(card, rating, config, now);
		const stamped = stampCardFromItem(scheduled, item);
		const updated = {
			...scheduled,
			marked: stamped.marked,
			tags: stamped.tags
		};
		byId.set(card.id, updated);
		logs.push({
			id: uid$1(),
			cardId: card.id,
			deckId: card.deckId,
			rating,
			queue: card.queue,
			interval: updated.interval,
			ease: updated.ease,
			at: now
		});
	}
	return {
		cards: cards.map((c) => byId.get(c.id) ?? c),
		logs
	};
}
function bumpDaily(daily, deckId, newCount, reviewCount) {
	const cur = daily.byDeck[deckId] ?? {
		newStudied: 0,
		reviewsStudied: 0
	};
	return {
		...daily,
		byDeck: {
			...daily.byDeck,
			[deckId]: {
				newStudied: cur.newStudied + newCount,
				reviewsStudied: cur.reviewsStudied + reviewCount
			}
		}
	};
}
function shuffle(arr) {
	const copy = arr.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}
function forecast(cards, days, now = Date.now()) {
	const out = Array.from({ length: days }, () => 0);
	for (const c of cards) {
		if (c.queue !== "review" && c.queue !== "learn" && c.queue !== "relearn") continue;
		const diff = Math.floor((c.due - now) / DAY);
		if (diff >= 0 && diff < days) out[diff] += 1;
		if (diff < 0 && c.queue === "review") out[0] += 1;
	}
	return out;
}
var seed = seed_questions_default;
var SAMPLE_DECK_ID = "sample-rock-mechanics";
function newCard(deckId, q) {
	const now = Date.now();
	return {
		id: uid$1(),
		deckId,
		type: q.type || "mcq",
		rule: q.rule || "General",
		question: q.question,
		options: q.options,
		correct: q.correct,
		explanation: q.explanation || "",
		sourceSection: q.sourceSection?.trim() || void 0,
		tags: q.tags ?? [],
		queue: "new",
		due: 0,
		interval: 0,
		ease: 2500,
		reps: 0,
		lapses: 0,
		remainingSteps: 0,
		flag: 0,
		marked: false,
		createdAt: now,
		modifiedAt: now
	};
}
function sampleNotes() {
	const now = Date.now();
	return [{
		id: "sample-note",
		title: "How Notes work",
		body: "Write a note, or add photos, PDFs, HTML, audio, and video with +. Use the folder button to make folders and subfolders.\n\nNames and folders sync with your account. File contents stay on this device.",
		folderId: null,
		files: [],
		createdAt: now,
		modifiedAt: now
	}];
}
function descendantFolderIds(folders, rootId) {
	const ids = /* @__PURE__ */ new Set([rootId]);
	let added = true;
	while (added) {
		added = false;
		for (const f of folders) if (f.parentId && ids.has(f.parentId) && !ids.has(f.id)) {
			ids.add(f.id);
			added = true;
		}
	}
	return ids;
}
function folderDepth(folders, id) {
	let depth = 0;
	let cur = id;
	const seen = /* @__PURE__ */ new Set();
	while (cur) {
		if (seen.has(cur)) break;
		seen.add(cur);
		const folder = folders.find((f) => f.id === cur);
		if (!folder) break;
		depth += 1;
		cur = folder.parentId;
		if (depth > 24) break;
	}
	return depth;
}
function sampleState() {
	const now = Date.now();
	return {
		configs: { [DEFAULT_CONFIG_ID]: defaultConfig() },
		decks: [{
			id: SAMPLE_DECK_ID,
			name: seed.deckName,
			description: seed.description,
			configId: DEFAULT_CONFIG_ID,
			collapsed: false,
			createdAt: now
		}],
		cards: seed.questions.map((q) => newCard(SAMPLE_DECK_ID, q))
	};
}
var emptyDaily = () => ({
	day: dayKey(Date.now(), 4),
	byDeck: {}
});
var sampled = sampleState();
var legacyMigrateStarted = false;
async function migrateLegacyTemplate() {
	if (legacyMigrateStarted) return;
	legacyMigrateStarted = true;
	if (typeof indexedDB === "undefined") return;
	try {
		const { getHtmlFile, saveHtmlFile, IDB_TEMPLATE_SENTINEL, templateHtmlId } = await import("../_libs/_.mjs").then((n) => n.a);
		const s = useExamStore.getState();
		if ((s.templates ?? []).some((t) => t.kind === "uploaded")) return;
		let html = "";
		let fileName = "Uploaded template.html";
		let size = 0;
		let createdAt = Date.now();
		if (s.prefs.templateHtml === IDB_TEMPLATE_SENTINEL) {
			const old = await getHtmlFile("template");
			if (!old?.html?.includes("__EXAM_DATA__")) return;
			html = old.html;
			fileName = old.name;
			size = old.size;
			createdAt = old.createdAt;
		} else if (s.prefs.templateHtml.trim() && s.prefs.templateHtml.includes("__EXAM_DATA__")) {
			html = s.prefs.templateHtml;
			size = html.length;
		} else return;
		const id = uid$1();
		await saveHtmlFile({
			id: templateHtmlId(id),
			name: fileName,
			size,
			html,
			createdAt
		});
		useExamStore.getState().addTemplate({
			id,
			name: fileName.replace(/\.html?$/i, "") || "Uploaded template",
			kind: "uploaded",
			fileName,
			size,
			bookmark: true
		});
		useExamStore.getState().setPrefs({ templateHtml: "" });
	} catch {}
}
var useExamStore = create()(persist((set, get) => ({
	hydrated: false,
	decks: sampled.decks,
	cards: sampled.cards,
	configs: sampled.configs,
	prefs: defaultPrefs(),
	daily: emptyDaily(),
	revlog: [],
	papers: [],
	lastSession: null,
	sessions: [],
	notes: sampleNotes(),
	folders: [],
	links: [],
	templates: defaultTemplates(),
	coaching: defaultCoaching(),
	journey: defaultJourney(),
	path: defaultExamPath(),
	focus: mergeFocus(defaultFocus()),
	ludo: defaultLudo(),
	lastSyncedAt: null,
	undoStack: [],
	markHydrated: () => set({ hydrated: true }),
	seedSampleIfEmpty: () => {
		const patch = {};
		if (get().decks.length === 0) Object.assign(patch, sampleState());
		if (!get().notes?.length) patch.notes = sampleNotes();
		if (!Array.isArray(get().folders)) patch.folders = [];
		if (!Array.isArray(get().links)) patch.links = [];
		if (!Array.isArray(get().templates) || get().templates.length === 0) patch.templates = defaultTemplates(get().prefs);
		if (!get().coaching || !Array.isArray(get().coaching.classes)) patch.coaching = defaultCoaching();
		if (!get().journey || !Array.isArray(get().journey.nodes)) patch.journey = defaultJourney();
		patch.path = normalizeExamPath(get().path);
		patch.focus = mergeFocus(get().focus ?? defaultFocus());
		patch.ludo = normalizeLudo(get().ludo);
		if (!Array.isArray(get().sessions)) patch.sessions = [];
		const cards = get().cards;
		if (cards.some((c) => !c.sourceSection)) patch.cards = cards.map((c) => {
			if (c.sourceSection) return c;
			const match = seed.questions.find((q) => q.question === c.question);
			return match?.sourceSection ? {
				...c,
				sourceSection: match.sourceSection
			} : c;
		});
		if (!get().prefs.targetExamName) patch.prefs = {
			...get().prefs,
			...patch.prefs,
			targetExamName: "Target Exam"
		};
		if (Object.keys(patch).length) set(patch);
		migrateLegacyTemplate();
	},
	createDeck: (name, description = "") => {
		const id = uid$1();
		set((s) => ({ decks: [{
			id,
			name: name.trim() || "Default",
			description: description.trim(),
			configId: DEFAULT_CONFIG_ID,
			collapsed: false,
			createdAt: Date.now()
		}, ...s.decks] }));
		return id;
	},
	renameDeck: (id, name) => set((s) => ({ decks: s.decks.map((d) => d.id === id ? {
		...d,
		name
	} : d) })),
	setDescription: (id, description) => set((s) => ({ decks: s.decks.map((d) => d.id === id ? {
		...d,
		description
	} : d) })),
	deleteDeck: (id) => set((s) => ({
		decks: s.decks.filter((d) => d.id !== id && !d.name.startsWith(s.decks.find((x) => x.id === id)?.name + "::")),
		cards: s.cards.filter((c) => c.deckId !== id)
	})),
	toggleCollapsed: (id) => set((s) => ({ decks: s.decks.map((d) => d.id === id ? {
		...d,
		collapsed: !d.collapsed
	} : d) })),
	addCards: (deckId, incoming) => set((s) => ({ cards: [...s.cards, ...incoming.map((q) => newCard(deckId, {
		type: q.type,
		rule: q.rule,
		question: q.question,
		options: q.options,
		correct: q.correct,
		explanation: q.explanation,
		sourceSection: q.sourceSection
	}))] })),
	updateCard: (card) => set((s) => ({ cards: s.cards.map((c) => c.id === card.id ? {
		...card,
		modifiedAt: Date.now()
	} : c) })),
	deleteCards: (ids) => {
		const setIds = new Set(ids);
		set((s) => ({ cards: s.cards.filter((c) => !setIds.has(c.id)) }));
	},
	suspendCards: (ids, on = true) => {
		const setIds = new Set(ids);
		set((s) => ({ cards: s.cards.map((c) => setIds.has(c.id) ? {
			...c,
			queue: on ? "suspended" : c.reps ? "review" : "new"
		} : c) }));
	},
	buryCards: (ids) => {
		const setIds = new Set(ids);
		const until = Date.now() + 648e5;
		set((s) => ({ cards: s.cards.map((c) => setIds.has(c.id) ? {
			...c,
			queue: "buried",
			due: until
		} : c) }));
	},
	unburyDeck: (deckId) => set((s) => ({ cards: s.cards.map((c) => c.deckId === deckId && c.queue === "buried" ? {
		...c,
		queue: c.reps ? "review" : "new"
	} : c) })),
	flagCard: (id, flag) => set((s) => ({ cards: s.cards.map((c) => c.id === id ? {
		...c,
		flag
	} : c) })),
	markCard: (id, marked) => set((s) => ({ cards: s.cards.map((c) => c.id === id ? {
		...c,
		marked,
		tags: marked ? Array.from(/* @__PURE__ */ new Set([...c.tags, "marked"])) : c.tags.filter((t) => t !== "marked")
	} : c) })),
	setPrefs: (patch) => set((s) => ({ prefs: {
		...s.prefs,
		...patch
	} })),
	setConfig: (config) => set((s) => ({ configs: {
		...s.configs,
		[config.id]: config
	} })),
	bumpNewLimit: (deckId, extra) => set((s) => {
		const daily = ensureDaily(s.daily, s.prefs.dayStartHour);
		const cur = daily.byDeck[deckId] ?? {
			newStudied: 0,
			reviewsStudied: 0
		};
		return { daily: {
			...daily,
			byDeck: {
				...daily.byDeck,
				[deckId]: {
					...cur,
					newStudied: Math.max(0, cur.newStudied - extra)
				}
			}
		} };
	}),
	applyExamResults: (deckId, payload, opts) => {
		let summary = {
			id: uid$1(),
			deckId,
			at: Date.now(),
			total: payload.total,
			correct: payload.correct,
			wrong: payload.wrong,
			notAttempted: payload.notAttempted,
			marked: payload.marked,
			againIds: [],
			hardIds: [],
			goodIds: [],
			wrongIds: [],
			skippedIds: [],
			markedIds: [],
			correctIds: [],
			paperId: null,
			templateId: null
		};
		set((s) => {
			const deck = s.decks.find((d) => d.id === deckId);
			const configId = deck?.configId ?? "default";
			const snap = {
				cards: s.cards,
				daily: s.daily,
				revlog: s.revlog
			};
			const { cards, logs } = applyResultsToCards(s.cards, s.configs, configId, payload);
			const newCount = payload.items.filter((i) => {
				return s.cards.find((x) => x.id === String(i.bankId))?.queue === "new";
			}).length;
			const reviewCount = payload.items.length - newCount;
			const daily = bumpDaily(ensureDaily(s.daily, s.prefs.dayStartHour), deckId, newCount, reviewCount);
			const split = splitResultIds(payload);
			const buckets = rollingBucketsFromCards(cards, deckId);
			const parentId = opts?.parentSessionId;
			const parent = opts?.merge && parentId ? (s.sessions ?? []).find((row) => row.id === parentId) ?? (s.lastSession?.id === parentId ? s.lastSession : null) : opts?.merge ? (s.lastSession?.deckId === deckId ? s.lastSession : null) ?? (s.sessions ?? []).find((row) => row.deckId === deckId) ?? null : null;
			const papers = upsertBucketPapers(s.papers, deckId, buckets, parent?.id ?? summary.id);
			const wrongPaper = papers.find((p) => p.id === `bucket:${deckId}:wrong`) ?? papers.find((p) => p.deckId === deckId && p.kind === "wrong");
			const template = (s.templates ?? []).find((t) => t.bookmarked) ?? s.templates?.[0];
			summary = parent ? {
				...mergeSessionResults(parent, split, payload),
				paperId: wrongPaper?.id ?? parent.paperId,
				templateId: parent.templateId ?? template?.id ?? null
			} : {
				...summary,
				...split,
				paperId: wrongPaper?.id ?? papers.find((p) => p.deckId === deckId)?.id ?? null,
				templateId: template?.id ?? null
			};
			const saved = asTemplateResult(summary, deck?.name.split("::").pop() ?? deck?.name);
			const templates = (s.templates ?? []).map((t) => t.id === (summary.templateId ?? template?.id) ? {
				...t,
				lastResult: saved,
				results: [saved, ...(t.results ?? []).filter((r) => r.sessionId !== saved.sessionId)].slice(0, 40),
				modifiedAt: Date.now()
			} : t);
			const prior = s.sessions ?? [];
			const sessions = parent ? [summary, ...prior.filter((row) => row.id !== summary.id)].slice(0, 120) : [summary, ...prior.filter((row) => row.id !== summary.id)].slice(0, 120);
			return {
				cards,
				daily,
				papers,
				templates,
				lastSession: summary,
				sessions,
				revlog: [...logs, ...s.revlog].slice(0, 4e3),
				undoStack: [snap, ...s.undoStack].slice(0, 10)
			};
		});
		return summary;
	},
	deletePaper: (id) => set((s) => ({ papers: s.papers.filter((p) => p.id !== id) })),
	undo: () => set((s) => {
		const [snap, ...rest] = s.undoStack;
		if (!snap) return s;
		return {
			cards: snap.cards,
			daily: snap.daily,
			revlog: snap.revlog,
			undoStack: rest
		};
	}),
	resetCollection: () => {
		clearNoteFiles().catch(() => void 0);
		set({
			...sampleState(),
			notes: sampleNotes(),
			folders: [],
			links: [],
			templates: defaultTemplates(),
			coaching: defaultCoaching(),
			journey: defaultJourney(),
			path: defaultExamPath(),
			focus: mergeFocus(defaultFocus()),
			ludo: defaultLudo(),
			daily: emptyDaily(),
			revlog: [],
			papers: [],
			lastSession: null,
			sessions: [],
			undoStack: [],
			prefs: defaultPrefs()
		});
	},
	importPayload: (data) => set((s) => ({
		decks: data.decks ?? s.decks,
		cards: data.cards ?? s.cards,
		configs: data.configs ?? s.configs,
		prefs: {
			...s.prefs,
			...data.prefs ?? {}
		},
		notes: data.notes ?? s.notes,
		folders: data.folders ?? s.folders,
		links: data.links ?? s.links,
		templates: data.templates ?? s.templates,
		coaching: data.coaching ?? s.coaching,
		journey: data.journey ?? s.journey,
		path: data.path ? normalizeExamPath(data.path) : s.path,
		focus: data.focus ? mergeFocus(data.focus) : s.focus,
		ludo: data.ludo ?? s.ludo
	})),
	applyCloudPayload: (data) => set((s) => ({
		decks: data.decks,
		cards: data.cards,
		configs: data.configs,
		prefs: {
			...defaultPrefs(),
			...data.prefs
		},
		daily: data.daily,
		revlog: data.revlog,
		papers: data.papers,
		lastSession: normalizeSessionSummary(data.lastSession),
		sessions: normalizeSessions(Array.isArray(data.sessions) && data.sessions.length ? data.sessions : data.lastSession ? [data.lastSession] : []),
		notes: data.notes ?? [],
		folders: data.folders ?? [],
		links: data.links ?? [],
		templates: Array.isArray(data.templates) && data.templates.length ? normalizeTemplates(data.templates, data.prefs) : s.templates?.length ? s.templates : defaultTemplates(data.prefs),
		coaching: data.coaching ? normalizeCoaching(data.coaching) : s.coaching ?? defaultCoaching(),
		journey: data.journey ? normalizeJourney(data.journey) : s.journey ?? defaultJourney(),
		path: data.path ? normalizeExamPath(data.path) : s.path ?? defaultExamPath(),
		focus: data.focus ? mergeFocus(data.focus) : s.focus ?? mergeFocus(defaultFocus()),
		ludo: data.ludo ? normalizeLudo(data.ludo) : s.ludo ?? defaultLudo(),
		lastSyncedAt: Date.now(),
		undoStack: []
	})),
	addNote: (title = "", body = "", folderId = null, files = []) => {
		const id = uid$1();
		const now = Date.now();
		set((s) => ({ notes: [{
			id,
			title: title.trim() || (files[0]?.name ?? "Untitled"),
			body,
			folderId: folderId || null,
			files,
			createdAt: now,
			modifiedAt: now
		}, ...s.notes ?? []] }));
		return id;
	},
	updateNote: (id, patch) => set((s) => ({ notes: (s.notes ?? []).map((n) => n.id === id ? {
		...n,
		title: patch.title !== void 0 ? patch.title : n.title,
		body: patch.body !== void 0 ? patch.body : n.body,
		folderId: patch.folderId !== void 0 ? patch.folderId : n.folderId ?? null,
		files: patch.files !== void 0 ? patch.files : n.files ?? [],
		modifiedAt: Date.now()
	} : n) })),
	deleteNote: (id) => {
		const fileIds = (get().notes.find((n) => n.id === id)?.files ?? []).map((f) => f.id);
		if (fileIds.length) deleteNoteFiles(fileIds).catch(() => void 0);
		set((s) => ({ notes: (s.notes ?? []).filter((n) => n.id !== id) }));
	},
	createFolder: (name, parentId = null, source) => {
		const folders = get().folders ?? [];
		if (parentId && folderDepth(folders, parentId) >= 8) return "";
		const id = uid$1();
		set((s) => ({ folders: [{
			id,
			name: name.trim() || (parentId ? "Subfolder" : "Folder"),
			parentId: parentId || null,
			createdAt: Date.now(),
			source
		}, ...s.folders ?? []] }));
		return id;
	},
	renameFolder: (id, name) => set((s) => ({ folders: (s.folders ?? []).map((f) => f.id === id ? {
		...f,
		name: name.trim() || f.name
	} : f) })),
	deleteFolder: (id) => {
		const ids = descendantFolderIds(get().folders ?? [], id);
		const fileIds = (get().notes ?? []).filter((n) => n.folderId && ids.has(n.folderId)).flatMap((n) => (n.files ?? []).map((f) => f.id));
		if (fileIds.length) deleteNoteFiles(fileIds).catch(() => void 0);
		set((s) => ({
			folders: (s.folders ?? []).filter((f) => !ids.has(f.id)),
			notes: (s.notes ?? []).filter((n) => !(n.folderId && ids.has(n.folderId))),
			links: (s.links ?? []).filter((l) => !(l.folderId && ids.has(l.folderId)))
		}));
	},
	moveDeck: (id, parentId) => set((s) => {
		const deck = s.decks.find((d) => d.id === id);
		if (!deck) return s;
		const parent = parentId ? s.decks.find((d) => d.id === parentId) : null;
		if (parentId && !parent) return s;
		if (parent && (parent.id === id || parent.name === deck.name || parent.name.startsWith(`${deck.name}::`))) return s;
		const leaf = deck.name.split("::").pop() ?? deck.name;
		const newName = parent ? `${parent.name}::${leaf}` : leaf;
		if (newName === deck.name) return s;
		const oldPrefix = deck.name;
		return { decks: s.decks.map((d) => {
			if (d.id === id) return {
				...d,
				name: newName
			};
			if (d.name.startsWith(`${oldPrefix}::`)) return {
				...d,
				name: newName + d.name.slice(oldPrefix.length)
			};
			return d;
		}) };
	}),
	duplicateDeck: (id, parentId = null) => {
		const s = get();
		const root = s.decks.find((d) => d.id === id);
		if (!root) return "";
		const parent = parentId ? s.decks.find((d) => d.id === parentId) : null;
		if (parentId && !parent) return "";
		if (parent && (parent.id === id || parent.name === root.name || parent.name.startsWith(`${root.name}::`))) return "";
		const oldPrefix = root.name;
		const leaf = oldPrefix.split("::").pop() ?? oldPrefix;
		const newRootName = parent ? `${parent.name}::${leaf}` : `${leaf} copy`;
		const related = s.decks.filter((d) => d.id === id || d.name.startsWith(`${oldPrefix}::`));
		const idMap = /* @__PURE__ */ new Map();
		const now = Date.now();
		const newDecks = related.map((d) => {
			const nid = uid$1();
			idMap.set(d.id, nid);
			const suffix = d.name.slice(oldPrefix.length);
			return {
				...d,
				id: nid,
				name: newRootName + suffix,
				createdAt: now,
				collapsed: false
			};
		});
		const newCards = s.cards.filter((c) => idMap.has(c.deckId)).map((c) => ({
			...c,
			id: uid$1(),
			deckId: idMap.get(c.deckId),
			createdAt: now,
			modifiedAt: now
		}));
		set((cur) => ({
			decks: [...newDecks, ...cur.decks],
			cards: [...cur.cards, ...newCards]
		}));
		return idMap.get(id) ?? "";
	},
	moveNote: (id, folderId) => set((s) => ({ notes: (s.notes ?? []).map((n) => n.id === id ? {
		...n,
		folderId,
		modifiedAt: Date.now()
	} : n) })),
	moveFolder: (id, parentId) => set((s) => {
		const folders = s.folders ?? [];
		if (parentId) {
			if (parentId === id) return s;
			if (descendantFolderIds(folders, id).has(parentId)) return s;
			if (folderDepth(folders, parentId) >= 8) return s;
		}
		return { folders: folders.map((f) => f.id === id ? {
			...f,
			parentId: parentId || null
		} : f) };
	}),
	addLink: (input) => {
		const id = uid$1();
		set((s) => ({ links: [{
			id,
			kind: input.kind,
			name: input.name.trim() || input.kind,
			remoteId: input.remoteId,
			folderId: input.folderId,
			createdAt: Date.now()
		}, ...s.links ?? []] }));
		return id;
	},
	removeLink: (id) => set((s) => ({ links: (s.links ?? []).filter((l) => l.id !== id) })),
	addTemplate: (input) => {
		const id = input.id?.trim() || uid$1();
		const bookmark = input.bookmark !== false;
		const now = Date.now();
		const row = {
			id,
			name: input.name.trim() || (input.kind === "bundled" ? "TCS iON" : "Exam template"),
			kind: input.kind,
			fileName: input.fileName ?? "",
			size: Math.max(0, input.size ?? 0),
			bookmarked: bookmark,
			pattern: normalizePattern(input.pattern, get().prefs),
			createdAt: now,
			modifiedAt: now,
			lastResult: null,
			results: []
		};
		set((s) => ({ templates: [row, ...(s.templates ?? []).map((t) => bookmark ? {
			...t,
			bookmarked: false
		} : t)] }));
		return id;
	},
	updateTemplate: (id, patch) => set((s) => ({ templates: (s.templates ?? []).map((t) => t.id === id ? {
		...t,
		...patch,
		id: t.id,
		createdAt: t.createdAt,
		pattern: patch.pattern ? normalizePattern({
			...t.pattern,
			...patch.pattern
		}, s.prefs) : t.pattern,
		modifiedAt: Date.now()
	} : t) })),
	updateTemplatePattern: (id, patch) => set((s) => ({ templates: (s.templates ?? []).map((t) => t.id === id ? {
		...t,
		pattern: normalizePattern({
			...t.pattern,
			...patch
		}, s.prefs),
		modifiedAt: Date.now()
	} : t) })),
	bookmarkTemplate: (id) => set((s) => ({ templates: (s.templates ?? []).map((t) => ({
		...t,
		bookmarked: t.id === id
	})) })),
	deleteTemplate: (id) => {
		const current = get().templates ?? [];
		const target = current.find((t) => t.id === id);
		if (!target) return;
		let next = current.filter((t) => t.id !== id);
		if (next.length === 0) set({ templates: defaultTemplates(get().prefs) });
		else {
			if (target.bookmarked && !next.some((t) => t.bookmarked)) next = next.map((t, i) => i === 0 ? {
				...t,
				bookmarked: true
			} : t);
			set({ templates: next });
		}
		if (target.kind === "uploaded") deleteHtmlFile(templateHtmlId(id)).catch(() => void 0);
	},
	updateCoaching: (fn) => set((s) => ({ coaching: fn(s.coaching ?? defaultCoaching()) })),
	updateJourney: (fn) => set((s) => ({ journey: fn(s.journey ?? defaultJourney()) })),
	updatePath: (fn) => set((s) => ({ path: normalizeExamPath(fn(s.path ?? defaultExamPath())) })),
	updateFocus: (fn) => set((s) => ({ focus: mergeFocus(normalizeFocus(fn(s.focus ?? defaultFocus()))) })),
	updateLudo: (fn) => set((s) => ({ ludo: normalizeLudo(fn(s.ludo ?? defaultLudo())) }))
}), {
	name: "setpaper-anki-v3",
	partialize: (s) => ({
		decks: s.decks,
		cards: s.cards,
		configs: s.configs,
		prefs: s.prefs,
		daily: s.daily,
		revlog: s.revlog,
		papers: s.papers,
		lastSession: s.lastSession,
		sessions: s.sessions ?? [],
		notes: s.notes,
		folders: s.folders,
		links: s.links ?? [],
		templates: s.templates,
		coaching: s.coaching,
		journey: s.journey,
		path: s.path,
		focus: s.focus,
		ludo: s.ludo,
		lastSyncedAt: s.lastSyncedAt
	}),
	onRehydrateStorage: () => (state) => {
		state?.markHydrated();
		state?.seedSampleIfEmpty();
	}
}));
function collectionSnapshot() {
	const s = useExamStore.getState();
	return {
		decks: s.decks,
		cards: s.cards,
		configs: s.configs,
		prefs: s.prefs,
		daily: s.daily,
		revlog: s.revlog,
		papers: s.papers,
		lastSession: s.lastSession,
		sessions: s.sessions ?? [],
		notes: s.notes ?? [],
		folders: s.folders ?? [],
		links: s.links ?? [],
		templates: s.templates?.length ? s.templates : defaultTemplates(s.prefs),
		coaching: s.coaching ?? defaultCoaching(),
		journey: s.journey ?? defaultJourney(),
		path: s.path ?? defaultExamPath(),
		focus: s.focus ? mergeFocus(s.focus) : mergeFocus(defaultFocus()),
		ludo: s.ludo ?? defaultLudo()
	};
}
function studyCards(deckId) {
	const s = useExamStore.getState();
	const daily = ensureDaily(s.daily, s.prefs.dayStartHour);
	const config = s.configs[s.decks.find((d) => d.id === deckId)?.configId ?? "default"] ?? defaultConfig();
	return buildStudyQueue(s.cards, deckId, config, daily, s.prefs);
}
function activeExamTemplate() {
	const list = useExamStore.getState().templates ?? [];
	return list.find((t) => t.bookmarked) ?? list[0] ?? defaultTemplates()[0];
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-(--motion-fast) ease-(--ease-smooth-out) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-btn hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground shadow-raised hover:bg-secondary/80",
			outline: "border border-border bg-card text-foreground shadow-raised hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			destructive: "bg-destructive text-white hover:bg-destructive/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-6",
			icon: "h-11 w-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/input-Dwv9NclU.js
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-raised transition-[box-shadow,border-color] duration-(--motion-quick) ease-(--ease-smooth-out) placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/label-DjhITAWa.js
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-sm font-medium text-foreground leading-none", className),
	...props
}));
Label.displayName = "Label";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/sync-DHTjZmz3.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function asPayload(raw) {
	const data = typeof raw === "string" ? JSON.parse(raw) : raw;
	if (!data || typeof data !== "object") throw new Error("Invalid collection payload");
	const d = data;
	if (!Array.isArray(d.decks) || !Array.isArray(d.cards)) throw new Error("Invalid collection payload");
	return {
		decks: d.decks,
		cards: d.cards,
		configs: d.configs ?? {},
		prefs: d.prefs ?? defaultPrefs(),
		daily: d.daily ?? {
			day: "",
			byDeck: {}
		},
		revlog: Array.isArray(d.revlog) ? d.revlog : [],
		papers: Array.isArray(d.papers) ? d.papers : [],
		lastSession: normalizeSessionSummary(d.lastSession),
		sessions: normalizeSessions(Array.isArray(d.sessions) && d.sessions.length ? d.sessions : d.lastSession ? [d.lastSession] : []),
		notes: normalizeNotes(d.notes),
		folders: normalizeFolders(d.folders),
		links: normalizeLinks(d.links),
		templates: normalizeTemplates(d.templates, d.prefs),
		coaching: normalizeCoaching(d.coaching),
		journey: normalizeJourney(d.journey),
		path: normalizeExamPath(d.path),
		focus: mergeFocus(normalizeFocus(d.focus)),
		ludo: normalizeLudo(d.ludo)
	};
}
function validatePayload(data) {
	return asPayload(data);
}
var pullCollection = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ebbb2549730f02155ae741e61f373a70f222d72b6ae96dc6527acb25c0253352"));
var pushCollection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(validatePayload).handler(createSsrRpc("a2b8ed49f2e74639610e1037ef5a82fbb1c6909c817e4be8cc2ec29ef33d499d"));
var PHONE_DOMAIN = "phone.setpaper.app";
function formatMobile(digits) {
	if (digits.length !== 10) return digits;
	return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
function parseMobileDigits(raw) {
	let digits = raw.replace(/\D/g, "");
	if (digits.length >= 12 && digits.startsWith("91")) digits = digits.slice(-10);
	if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
	if (!/^[6-9]\d{9}$/.test(digits)) throw new Error("Enter a valid 10-digit mobile number");
	return digits;
}
function phoneEmail(digits) {
	return `${digits}@${PHONE_DOMAIN}`;
}
function digitsFromPhoneEmail(email) {
	const lower = email.trim().toLowerCase();
	const suffix = `@${PHONE_DOMAIN}`;
	if (!lower.endsWith(suffix)) return null;
	const digits = lower.slice(0, -suffix.length);
	return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
function formatAccountLabel(email) {
	if (!email) return "your account";
	const digits = digitsFromPhoneEmail(email);
	if (digits) return formatMobile(digits);
	return email;
}
function parseAccountId(raw, prefer) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error(prefer === "mobile" ? "Enter your mobile number" : "Enter your email ID");
	const looksEmail = trimmed.includes("@");
	if (prefer === "mobile" || !prefer && !looksEmail) try {
		const digits = parseMobileDigits(trimmed);
		return {
			kind: "mobile",
			email: phoneEmail(digits),
			label: formatMobile(digits),
			name: digits
		};
	} catch (err) {
		if (prefer === "mobile" || !looksEmail) throw err;
	}
	const email = trimmed.toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email ID");
	return {
		kind: "email",
		email,
		label: email,
		name: email.split("@")[0] || "Student"
	};
}
var EMAIL_KEY = "setpaper-sync-email";
var useSyncUi = create((set) => ({
	dialogOpen: false,
	syncing: false,
	lastError: null,
	lastSyncedAt: null,
	openDialog: () => set({
		dialogOpen: true,
		lastError: null
	}),
	closeDialog: () => set({ dialogOpen: false }),
	setSyncing: (syncing) => set({ syncing }),
	setResult: (lastError, at) => set((s) => ({
		lastError,
		syncing: false,
		lastSyncedAt: at === void 0 ? s.lastSyncedAt : at
	}))
}));
function rememberedEmail() {
	if (typeof window === "undefined") return "";
	try {
		return window.localStorage.getItem(EMAIL_KEY) ?? "";
	} catch {
		return "";
	}
}
function rememberEmail(email) {
	try {
		window.localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
	} catch {}
}
function errMessage(err, fallback) {
	if (err instanceof Error && err.message) return err.message;
	if (typeof err === "object" && err && "message" in err && typeof err.message === "string") return err.message;
	return fallback;
}
function isUnauthorized(err) {
	if (!err || typeof err !== "object") return false;
	const anyErr = err;
	return anyErr.status === 401 || anyErr.message === "Unauthorized";
}
var applyingRemote = false;
var lastPushedJson = "";
var restoreInFlight = null;
var pushInFlight = null;
var pushQueued = false;
function isApplyingRemote() {
	return applyingRemote;
}
var WATCH = [
	"decks",
	"cards",
	"configs",
	"prefs",
	"daily",
	"revlog",
	"papers",
	"lastSession",
	"sessions",
	"notes",
	"folders",
	"templates",
	"coaching",
	"journey",
	"ludo"
];
function didCollectionChange(state, prev) {
	return WATCH.some((key) => state[key] !== prev[key]);
}
async function restoreFromCloud() {
	if (restoreInFlight) return restoreInFlight;
	restoreInFlight = (async () => {
		useSyncUi.getState().setSyncing(true);
		try {
			const remote = await pullCollection();
			if (remote?.payload) {
				applyingRemote = true;
				lastPushedJson = JSON.stringify(remote.payload);
				useExamStore.getState().applyCloudPayload(remote.payload);
				applyingRemote = false;
				useSyncUi.getState().setResult(null, Date.now());
				return "restored";
			}
			await pushCurrentCollection();
			return "uploaded";
		} catch (err) {
			applyingRemote = false;
			if (isUnauthorized(err)) {
				useSyncUi.getState().setResult("Sign in to sync");
				throw err;
			}
			const message = errMessage(err, "Could not sync");
			useSyncUi.getState().setResult(message);
			throw err;
		} finally {
			useSyncUi.getState().setSyncing(false);
		}
	})().finally(() => {
		restoreInFlight = null;
	});
	return restoreInFlight;
}
async function pushCurrentCollection() {
	if (applyingRemote) return;
	if (pushInFlight) {
		pushQueued = true;
		return pushInFlight;
	}
	pushInFlight = (async () => {
		try {
			do {
				pushQueued = false;
				if (applyingRemote) return;
				const payload = collectionSnapshot();
				const json = JSON.stringify(payload);
				if (json === lastPushedJson) continue;
				useSyncUi.getState().setSyncing(true);
				try {
					await pushCollection({ data: payload });
					lastPushedJson = json;
					const at = Date.now();
					useExamStore.setState({ lastSyncedAt: at });
					useSyncUi.getState().setResult(null, at);
				} catch (err) {
					if (isUnauthorized(err)) {
						useSyncUi.getState().setResult(null);
						return;
					}
					useSyncUi.getState().setResult(errMessage(err, "Could not save to your account"));
					return;
				}
			} while (pushQueued);
		} finally {
			useSyncUi.getState().setSyncing(false);
		}
	})().finally(() => {
		pushInFlight = null;
	});
	await pushInFlight;
}
async function syncNow() {
	const outcome = await restoreFromCloud();
	if (outcome !== "restored") return outcome;
	await pushCurrentCollection();
	return "in-sync";
}
async function connectAccount(raw, password, mode = "auto", prefer) {
	const account = parseAccountId(raw, prefer);
	if (password.length < 8) throw new Error("Password must be at least 8 characters");
	if (mode === "signup") {
		const signUpRes = await authClient.signUp.email({
			email: account.email,
			password,
			name: account.name
		});
		if (signUpRes.error) {
			const msg = signUpRes.error.message ?? "";
			if (/already|exist|registered/i.test(msg)) throw new Error(account.kind === "mobile" ? "This mobile number already has an account. Sign in." : "This email ID already has an account. Sign in.");
			throw new Error(signUpRes.error.message ?? "Could not create this account");
		}
	} else if (mode === "signin") {
		if ((await authClient.signIn.email({
			email: account.email,
			password
		})).error) throw new Error(account.kind === "mobile" ? "Wrong password, or no account for this mobile number. Create a new account." : "Wrong password, or no account for this email ID. Create a new account.");
	} else if ((await authClient.signIn.email({
		email: account.email,
		password
	})).error) {
		const signUpRes = await authClient.signUp.email({
			email: account.email,
			password,
			name: account.name
		});
		if (signUpRes.error) {
			const msg = signUpRes.error.message ?? "";
			if (/already|exist|registered/i.test(msg)) throw new Error(account.kind === "mobile" ? "Wrong password for this mobile number. Try again." : "Wrong password for this email ID. Try again.");
			throw new Error(signUpRes.error.message ?? "Could not open this account");
		}
	}
	try {
		await authClient.getSession();
	} catch {}
	rememberEmail(account.kind === "mobile" ? account.name : account.email);
	return {
		outcome: await restoreFromCloud(),
		account
	};
}
function describeOutcome(outcome, email) {
	const label = formatAccountLabel(email);
	if (outcome === "restored") return `Restored collection from ${label}`;
	if (outcome === "uploaded") return `Saved collection to ${label}`;
	return `Synced with ${label}`;
}
function toastOutcome(outcome, email) {
	toast.success(describeOutcome(outcome, email));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/template-rk5YBqZ0.js
function uid() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
var OPTION_RE = /^\s*(?:[([]?)([A-Da-d1-4])[)\].,:\-]\s+(.*\S)\s*$/;
var QUESTION_RE = /^\s*(?:Q(?:uestion)?\s*)?(\d+)[).:\-]\s+(.*\S)\s*$/i;
var ANSWER_RE = /^\s*(?:Answer|Ans|Correct(?:\s*answer)?)\s*[:\-–]\s*(.+)\s*$/i;
var EXPLAIN_RE = /^\s*(?:Explanation|Explain|Exp|Solution)\s*[:\-–]\s*(.*)\s*$/i;
var TYPE_RE = /^\s*Type\s*[:\-]\s*(mcq|msq|numerical)\s*$/i;
var RULE_RE = /^\s*(?:Rule|Topic|Subject|Source)\s*[:\-]\s*(.+)\s*$/i;
var JSON_ASSIGN_NAMES = [
	"examData",
	"raw_questions_data",
	"questions_data",
	"questionsData",
	"quizData",
	"paperData",
	"testData",
	"mcqData",
	"questionBank",
	"QUESTION_BANK",
	"questions"
];
function letterToIndex(token) {
	const t = token.trim();
	if (/^[A-Da-d]$/.test(t)) return t.toUpperCase().charCodeAt(0) - 65;
	if (/^[1-4]$/.test(t)) return Number(t) - 1;
	return null;
}
function parseAnswerToken(raw, options, type) {
	const value = raw.trim().replace(/^\(|\)$/g, "");
	if (type === "numerical") return value;
	if (type === "msq") {
		const parts = value.split(/[,&+/]|and/i).map((p) => p.trim()).filter(Boolean);
		const idxs = [];
		for (const p of parts) {
			const i = letterToIndex(p);
			if (i === null) return null;
			idxs.push(i);
		}
		return idxs;
	}
	const direct = letterToIndex(value);
	if (direct !== null) return direct;
	const lower = value.toLowerCase();
	const byText = options.findIndex((o) => o.toLowerCase() === lower);
	if (byText >= 0) return byText;
	return null;
}
function flush(draft, out, warnings) {
	if (!draft) return;
	const q = draft.question.trim();
	if (!q) return;
	if (draft.type !== "numerical" && draft.options.length < 2) {
		warnings.push(`Skipped (need at least 2 options): “${q.slice(0, 60)}”`);
		return;
	}
	let correct = draft.correct ?? 0;
	if (draft.correct === null) {
		warnings.push(`No answer marked for “${q.slice(0, 48)}…” — defaulted to A`);
		correct = 0;
	}
	out.push({
		id: uid(),
		type: draft.type,
		rule: draft.rule || "General",
		question: q,
		options: draft.options,
		correct,
		explanation: draft.explanation.trim()
	});
}
function parseJsonBlob(raw) {
	try {
		return questionsFromUnknown(JSON.parse(raw));
	} catch {
		try {
			const loosened = raw.replace(/,\s*([}\]])/g, "$1");
			return questionsFromUnknown(JSON.parse(loosened));
		} catch {
			return null;
		}
	}
}
function asText(value) {
	if (value == null) return "";
	if (typeof value === "string") return stripMarkup(value);
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (typeof value === "object") {
		const o = value;
		return asText(o.text ?? o.label ?? o.option ?? o.value ?? o.en ?? o.question_en);
	}
	return "";
}
function stripMarkup(raw) {
	return raw.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/</gi, "<").replace(/>/gi, ">").replace(/"/gi, "\"").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
}
function optionList(value) {
	if (!Array.isArray(value)) return {
		options: [],
		correctFromFlags: null
	};
	const options = [];
	let correctFromFlags = null;
	value.forEach((item, idx) => {
		if (item && typeof item === "object") {
			const o = item;
			options.push(asText(o.text ?? o.label ?? o.option ?? o.value ?? o.en ?? item));
			if (o.isCorrect === true || o.correct === true || o.answer === true) correctFromFlags = idx;
		} else options.push(asText(item));
	});
	return {
		options: options.filter(Boolean),
		correctFromFlags
	};
}
function asCorrect(q, options) {
	const flagged = optionList(q.options ?? q.options_en ?? q.choices).correctFromFlags;
	if (flagged != null) return flagged;
	const candidates = [
		q.correct,
		q.answerIndex,
		q.answer_index,
		q.correctIndex,
		q.correct_index,
		q.answer,
		q.ans
	];
	for (const c of candidates) {
		if (typeof c === "number" && Number.isFinite(c)) return c;
		if (Array.isArray(c)) {
			const nums = c.map((n) => Number(n)).filter((n) => Number.isFinite(n));
			if (nums.length) return nums;
		}
		if (typeof c === "string" && c.trim()) {
			const token = parseAnswerToken(c, options, "mcq");
			if (token !== null) return token;
			return c.trim();
		}
	}
	return 0;
}
function questionTextOf(q) {
	return asText(q.question ?? q.q ?? q.question_en ?? q.questionText ?? q.question_text ?? q.stem ?? q.text ?? q.prompt ?? q.title);
}
function explanationOf(q) {
	return asText(q.explanation ?? q.solution ?? q.explain ?? q.reason ?? q.solution_en ?? q.answer_explain);
}
function questionsFromUnknown(data) {
	const collected = [];
	if (Array.isArray(data)) collected.push(...data);
	else if (data && typeof data === "object") {
		const obj = data;
		if (Array.isArray(obj.questions)) collected.push(...obj.questions);
		if (Array.isArray(obj.raw_questions_data)) collected.push(...obj.raw_questions_data);
		if (Array.isArray(obj.questions_data)) collected.push(...obj.questions_data);
		if (Array.isArray(obj.items)) collected.push(...obj.items);
		if (Array.isArray(obj.data)) collected.push(...obj.data);
		if (Array.isArray(obj.sections)) {
			for (const s of obj.sections) if (Array.isArray(s.questions)) for (const q of s.questions) if (q && typeof q === "object") collected.push({
				...q,
				rule: q.rule || s.name || s.title
			});
			else collected.push(q);
		}
	}
	if (collected.length === 0) return null;
	const questions = [];
	const warnings = [];
	for (const item of collected) {
		if (!item || typeof item !== "object") continue;
		const q = item;
		const text = questionTextOf(q);
		if (!text) continue;
		const { options } = optionList(q.options ?? q.options_en ?? q.choices ?? q.answers ?? q.optionsEn);
		const type = (q.type || "mcq").toLowerCase();
		const safeType = type === "msq" || type === "numerical" ? type : "mcq";
		questions.push({
			id: uid(),
			type: safeType,
			rule: asText(q.rule ?? q.topic ?? q.subject ?? q.source ?? q.section) || "General",
			question: text,
			options,
			correct: asCorrect(q, options),
			explanation: explanationOf(q)
		});
		if (safeType !== "numerical" && options.length < 2) warnings.push(`“${text.slice(0, 48)}” has fewer than 2 options`);
	}
	return {
		questions,
		warnings,
		errors: questions.length ? [] : ["JSON had no questions"]
	};
}
function parseQuestionText(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		questions: [],
		warnings: [],
		errors: ["Nothing to parse"]
	};
	const payloads = extractQuestionPayloads(trimmed);
	for (const embedded of payloads) {
		const json = parseJsonBlob(embedded);
		if (json && json.questions.length) return json;
	}
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
		const json = parseJsonBlob(trimmed);
		if (json) return json;
	}
	const questions = [];
	const warnings = [];
	const errors = [];
	const lines = trimmed.replace(/\r\n/g, "\n").split("\n");
	let draft = null;
	let explainContinue = false;
	const startDraft = (text) => ({
		question: text,
		options: [],
		correct: null,
		explanation: "",
		type: "mcq",
		rule: "General"
	});
	for (const line of lines) {
		if (!line.trim()) {
			explainContinue = false;
			continue;
		}
		const typeMatch = line.match(TYPE_RE);
		if (typeMatch && draft) {
			draft.type = typeMatch[1].toLowerCase();
			continue;
		}
		const ruleMatch = line.match(RULE_RE);
		if (ruleMatch && draft) {
			draft.rule = ruleMatch[1].trim();
			continue;
		}
		const ansMatch = line.match(ANSWER_RE);
		if (ansMatch && draft) {
			draft.correct = parseAnswerToken(ansMatch[1], draft.options, draft.type);
			if (draft.correct === null) warnings.push(`Could not read answer “${ansMatch[1].trim()}”`);
			explainContinue = false;
			continue;
		}
		const expMatch = line.match(EXPLAIN_RE);
		if (expMatch && draft) {
			draft.explanation = expMatch[1];
			explainContinue = true;
			continue;
		}
		const optMatch = line.match(OPTION_RE);
		if (optMatch && draft) {
			draft.options.push(optMatch[2].trim());
			explainContinue = false;
			continue;
		}
		const qMatch = line.match(QUESTION_RE);
		if (qMatch) {
			flush(draft, questions, warnings);
			draft = startDraft(qMatch[2]);
			explainContinue = false;
			continue;
		}
		if (draft && explainContinue) {
			draft.explanation += (draft.explanation ? " " : "") + line.trim();
			continue;
		}
		if (draft && draft.options.length === 0 && !OPTION_RE.test(line)) {
			draft.question += " " + line.trim();
			continue;
		}
		if (!draft) draft = startDraft(line.trim());
	}
	flush(draft, questions, warnings);
	if (questions.length === 0) errors.push("Could not detect questions. Use numbered items with A/B/C/D options.");
	return {
		questions,
		warnings,
		errors
	};
}
function htmlTitle(html) {
	const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
	if (!m) return "";
	return decodeHtmlEntities(m[1]).replace(/TCS\s*iON\s*\|\s*/i, "").replace(/\s+/g, " ").trim();
}
function examMinutesFromHtml(html) {
	const m = html.match(/id=["']setting-time["'][^>]*value=["'](\d+)/i) || html.match(/value=["'](\d+)["'][^>]*id=["']setting-time["']/i);
	if (!m) return void 0;
	const n = Number(m[1]);
	return Number.isFinite(n) && n > 0 ? n : void 0;
}
function decodeHtmlEntities(text) {
	return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_, ent) => {
		const lower = ent.toLowerCase();
		if (lower.startsWith("#x")) return String.fromCharCode(parseInt(lower.slice(2), 16));
		if (lower.startsWith("#")) return String.fromCharCode(Number(lower.slice(1)));
		if (lower === "amp") return String.fromCharCode(38);
		if (lower === "lt") return String.fromCharCode(60);
		if (lower === "gt") return String.fromCharCode(62);
		if (lower === "quot") return String.fromCharCode(34);
		if (lower === "apos" || lower === "nbsp") return lower === "nbsp" ? " " : "'";
		return `&${ent};`;
	});
}
/** Pull the examData object out of a full HTML paper, any size. */
function extractExamDataObject(html) {
	const span = findAssignedValue(html, ["examData"]);
	if (!span || span.placeholder) return null;
	if (span.value === "{}") return null;
	return span.value;
}
/** JSON blobs that may hold questions — examData, raw_questions_data, etc. */
function extractQuestionPayloads(html) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (value) => {
		if (!value || value === "{}" || value === "[]") return;
		if (seen.has(value)) return;
		seen.add(value);
		out.push(value);
	};
	push(extractExamDataObject(html));
	for (const name of JSON_ASSIGN_NAMES) {
		const span = findAssignedValue(html, [name]);
		if (span && !span.placeholder) push(span.value);
	}
	const any = findAnyJsonAssignment(html);
	if (any && !any.placeholder) push(any.value);
	return out;
}
/** Turn a filled HTML paper into a reusable template by dropping the questions. */
function toTemplateHtml(html) {
	if (html.includes("__EXAM_DATA__")) return html;
	const span = findAssignedValue(html, ["examData"]);
	if (span) return html.slice(0, span.start) + "__EXAM_DATA__" + html.slice(span.end);
	return null;
}
function findAssignedValue(html, names) {
	for (const name of names) {
		const markers = [new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`), new RegExp(`window\\.${name}\\s*=\\s*`)];
		for (const re of markers) {
			const m = html.match(re);
			if (!m || m.index === void 0) continue;
			let i = m.index + m[0].length;
			while (i < html.length && /\s/.test(html[i])) i++;
			if (html.startsWith("__EXAM_DATA__", i)) return {
				start: i,
				end: i + 13,
				value: "__EXAM_DATA__",
				placeholder: true,
				name
			};
			if (html[i] !== "{" && html[i] !== "[") continue;
			const value = sliceBalanced(html, i);
			if (!value) continue;
			return {
				start: i,
				end: i + value.length,
				value,
				placeholder: false,
				name
			};
		}
	}
	return null;
}
function findAnyJsonAssignment(html) {
	const re = /(?:(?:const|let|var)\s+|window\.)([A-Za-z_][\w]*)\s*=\s*/g;
	let m;
	while (m = re.exec(html)) {
		const name = m[1];
		let i = m.index + m[0].length;
		while (i < html.length && /\s/.test(html[i])) i++;
		if (html[i] !== "[" && html[i] !== "{") continue;
		const value = sliceBalanced(html, i);
		if (!value || value.length < 20) continue;
		if (value.startsWith("[") || /"question|"options|"question_en|"answerIndex/.test(value.slice(0, 400))) return {
			start: i,
			end: i + value.length,
			value,
			placeholder: false,
			name
		};
	}
	return null;
}
function sliceBalanced(source, start) {
	const open = source[start];
	const close = open === "[" ? "]" : open === "{" ? "}" : "";
	if (!close) return null;
	let depth = 0;
	let inStr = false;
	let quote = "";
	let esc = false;
	for (let i = start; i < source.length; i++) {
		const c = source[i];
		if (inStr) {
			if (esc) {
				esc = false;
				continue;
			}
			if (c === "\\") {
				esc = true;
				continue;
			}
			if (c === quote) inStr = false;
			continue;
		}
		if (c === "\"" || c === "'") {
			inStr = true;
			quote = c;
			continue;
		}
		if (c === open) depth += 1;
		else if (c === close) {
			depth -= 1;
			if (depth === 0) return source.slice(start, i + 1);
		} else if (open === "{" && c === "{") depth += 1;
	}
	return null;
}
var tcs_ion_template_default = "<!DOCTYPE html>\n<html lang=\"hi\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TCS iON | Rock Mechanics, Supports &amp; Subsidence Practice Test (Overman/Sirdar)</title>\n    <script src=\"https://cdn.tailwindcss.com\"><\/script>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css\">\n    <style>\n        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Roboto+Mono:wght@400;500&amp;display=swap');\n        \n        :root {\n            --tcs-blue: #003366;\n            --tcs-light-blue: #0055A4;\n        }\n        \n        body {\n            font-family: 'Inter', system_ui, sans-serif;\n        }\n        \n        .tcs-header {\n            background: linear-gradient(to right, #003366, #0055A4);\n        }\n        \n        .question-palette {\n            scrollbar-width: thin;\n            scrollbar-color: #cbd5e1 #f8fafc;\n        }\n        \n        .palette-btn {\n            width: 38px;\n            height: 38px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-weight: 600;\n            font-size: 13px;\n            transition: all 0.2s ease;\n            border: 2px solid #e2e8f0;\n        }\n        \n        .palette-btn.not-visited { background: #fff; color: #64748b; }\n        .palette-btn.answered { background: #22c55e; color: white; border-color: #16a34a; }\n        .palette-btn.not-answered { background: #f97316; color: white; border-color: #ea580c; }\n        .palette-btn.marked { background: #a855f7; color: white; border-color: #9333ea; }\n        .palette-btn.answered-marked { \n            background: #22c55e; \n            color: white; \n            border: 3px solid #a855f7; \n            box-shadow: 0 0 0 2px #fff;\n        }\n        \n        .question-container {\n            min-height: 420px;\n        }\n        \n        .option-label {\n            transition: all 0.2s ease;\n        }\n        \n        .option-label:hover {\n            background-color: #f8fafc;\n        }\n        \n        .option-label.selected {\n            background-color: #dbeafe;\n            border-color: #3b82f6;\n        }\n        \n        .section-tab {\n            transition: all 0.3s ease;\n        }\n        \n        .nav-btn {\n            transition: all 0.2s ease;\n        }\n        \n        .nav-btn:hover {\n            transform: translateY(-1px);\n        }\n        \n        .tcs-shadow {\n            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n        }\n        \n        .exam-timer {\n            font-family: 'Roboto Mono', monospace;\n            font-weight: 600;\n            letter-spacing: 1px;\n        }\n        \n        .rule-badge {\n            font-size: 10px;\n            padding: 1px 7px;\n            border-radius: 10px;\n        }\n    </style>\n</head>\n<body class=\"bg-slate-100\">\n    \n    <!-- ============================================ -->\n    <!-- CANDIDATE INFORMATION FORM (TCS iON Style) -->\n    <!-- ============================================ -->\n    <div id=\"candidate-info-screen\" class=\"min-h-screen flex items-center justify-center bg-slate-100 p-4\">\n        <div class=\"w-full max-w-lg\">\n            \n            <!-- TCS Header -->\n            <div class=\"flex justify-center mb-6\">\n                <div class=\"flex items-center gap-x-3\">\n                    <div class=\"w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center shadow-lg\">\n                        <span class=\"text-white font-black text-3xl tracking-tighter\">TCS</span>\n                    </div>\n                    <div>\n                        <div class=\"font-bold text-3xl text-[#003366] tracking-tight\">iON</div>\n                        <div class=\"text-[10px] text-slate-500 -mt-1 tracking-[3px]\">EXAM PLATFORM</div>\n                    </div>\n                </div>\n            </div>\n\n            <!-- Test Info Card -->\n            <div class=\"bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden\">\n                \n                <!-- Header -->\n                <div class=\"bg-gradient-to-r from-[#003366] to-[#0055A4] px-8 py-5 text-white\">\n                    <div class=\"text-center\">\n                        <div class=\"text-xs tracking-[2px] text-blue-200 mb-1\">PRACTICE TEST</div>\n                        <div class=\"font-bold text-2xl\" id=\"start-paper-title\">Practice Test</div>\n                    </div>\n                </div>\n\n                <div class=\"p-8\">\n                    \n                    <!-- Instructions -->\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs text-slate-600\">\n                        <div class=\"flex gap-2\">\n                            <i class=\"fa-solid fa-info-circle text-[#003366] mt-0.5\"></i>\n                            <div>\n                                This test follows exact <span class=\"font-semibold\">TCS iON</span> exam pattern.<br>\n                                <span id=\"start-counts\">Sections • Questions • Section-wise Timer</span><br>\n                                <span class=\"text-[#003366] font-medium\"><span id=\"start-subtitle\" class=\"text-[#003366] font-medium\">Generated from your question bank</span>\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Candidate details -->\n                    <div id=\"candidate-fields\" class=\"grid gap-3 mb-6\">\n                        <div>\n                            <label for=\"candidate-name-input\" class=\"text-xs text-slate-500 mb-1 block\">Candidate name</label>\n                            <input id=\"candidate-name-input\" type=\"text\" placeholder=\"Your name\"\n                                   class=\"w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]\">\n                        </div>\n                        <div>\n                            <label for=\"candidate-id-input\" class=\"text-xs text-slate-500 mb-1 block\">Roll / ID</label>\n                            <input id=\"candidate-id-input\" type=\"text\" placeholder=\"Optional\"\n                                   class=\"w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]\">\n                        </div>\n                    </div>\n\n                    <!-- Start Button -->\n                    <button onclick=\"startTest()\"\n                            class=\"w-full py-4 bg-[#003366] hover:bg-[#002244] active:bg-black transition-all text-white font-bold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-x-3\">\n                        <span>START TEST</span>\n                        <i class=\"fa-solid fa-arrow-right\"></i>\n                    </button>\n\n                    <div class=\"text-center mt-4\">\n                        <div class=\"text-[10px] text-slate-500\" id=\"start-duration\">Total Duration will appear here</div>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"text-center mt-6 text-xs text-slate-500\" id=\"start-footer\">\n                SetPaper · template-generated practice paper\n            </div>\n        </div>\n    </div>\n\n    <!-- ============================================ -->\n    <!-- MAIN EXAM INTERFACE (Hidden initially) -->\n    <!-- ============================================ -->\n    <div id=\"exam-interface\" style=\"display: none;\">\n        \n        <!-- Top Header -->\n        <div class=\"tcs-header text-white shadow-lg\">\n        <div class=\"max-w-screen-2xl mx-auto\">\n            <div class=\"px-6 py-3 flex items-center justify-between\">\n                <div class=\"flex items-center gap-x-4\">\n                    <!-- TCS Logo -->\n                    <div class=\"flex items-center gap-x-2\">\n                        <div class=\"w-10 h-10 bg-white rounded flex items-center justify-center\">\n                            <span class=\"text-[#003366] font-black text-2xl tracking-tighter\">TCS</span>\n                        </div>\n                        <div>\n                            <span class=\"font-bold text-xl tracking-tight\">iON</span>\n                            <span class=\"text-xs font-medium tracking-[2px] block -mt-1\">EXAM PLATFORM</span>\n                        </div>\n                    </div>\n                    \n                    <div class=\"h-6 w-px bg-white/30\"></div>\n                    \n                    <div id=\"candidate-header\" class=\"hidden text-left\">\n                        <div id=\"header-candidate-name\" class=\"text-sm font-semibold leading-tight\"></div>\n                        <div id=\"header-candidate-id\" class=\"text-[10px] tracking-wide text-blue-100\"></div>\n                    </div>\n                </div>\n                \n                <div class=\"flex items-center gap-x-6\">\n                    <!-- Timer -->\n                    <div id=\"timer-wrap\" class=\"bg-white/10 backdrop-blur px-4 py-1.5 rounded-xl flex items-center gap-x-2 border border-white/20\">\n                        <i class=\"fa-solid fa-clock text-lg\"></i>\n                        <div>\n                            <div class=\"text-[10px] text-blue-200 tracking-wider\">TIME LEFT</div>\n                            <div id=\"timer-display\" \n                                 class=\"exam-timer text-2xl font-bold tabular-nums\">75:00</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"max-w-screen-2xl mx-auto px-4 pt-4 pb-8\">\n        \n        <!-- Section Tabs -->\n        <div class=\"flex items-center justify-between mb-3 px-1\">\n            <div class=\"flex items-center gap-x-1\" id=\"section-tabs\">\n                <!-- Populated by JS -->\n            </div>\n            \n            <div class=\"flex items-center gap-x-2 text-sm\">\n                <div class=\"px-3 py-1 bg-white rounded-lg shadow-sm flex items-center gap-x-2 text-xs\">\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-green-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Answered</span>\n                    </div>\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-orange-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Not Answered</span>\n                    </div>\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-purple-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Marked</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n        <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-4\">\n            \n            <!-- Question Area -->\n            <div id=\"question-column\" class=\"lg:col-span-8 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 overflow-hidden\">\n                \n                <!-- Question Header -->\n                <div class=\"px-6 py-3.5 bg-slate-50 border-b flex items-center justify-between\">\n                    <div class=\"flex items-center gap-x-3\">\n                        <div id=\"question-number-badge\"\n                             class=\"px-4 py-1 bg-[#003366] text-white text-sm font-bold rounded-xl flex items-center gap-x-2\">\n                            <span id=\"current-q-no\">Q1</span>\n                            <span id=\"current-section-name\" class=\"text-blue-200 text-xs font-normal\">Section 1</span>\n                        </div>\n                        \n                        <div id=\"question-type-badge\"\n                             class=\"px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center\">\n                            <!-- JS populated -->\n                        </div>\n                    </div>\n                    \n                    <div class=\"flex items-center gap-x-2\">\n                        <button id=\"mark-review-btn\" onclick=\"markForReview()\"\n                                class=\"px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors\">\n                            <i class=\"fa-solid fa-flag\"></i>\n                            <span>Mark for Review</span>\n                        </button>\n                        \n                        <button id=\"clear-response-btn\" onclick=\"clearResponse()\"\n                                class=\"px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors\">\n                            <i class=\"fa-solid fa-eraser\"></i>\n                            <span>Clear</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Question Content -->\n                <div class=\"p-6 question-container\" id=\"question-area\">\n                    <!-- Dynamically loaded by JS -->\n                </div>\n                \n                <!-- Navigation Footer -->\n                <div class=\"px-6 py-4 bg-slate-50 border-t flex items-center justify-between\">\n                    <button onclick=\"prevQuestion()\"\n                            class=\"nav-btn px-6 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40\"\n                            id=\"prev-btn\">\n                        <i class=\"fa-solid fa-arrow-left\"></i>\n                        <span>Previous</span>\n                    </button>\n                    \n                    <div class=\"flex items-center gap-x-2 text-xs text-slate-500\">\n                        <span id=\"progress-text\">1 of 25</span>\n                    </div>\n                    \n                    <button onclick=\"nextQuestion()\"\n                            class=\"nav-btn px-7 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl bg-[#003366] text-white hover:bg-[#002244]\"\n                            id=\"next-btn\">\n                        <span>Next</span>\n                        <i class=\"fa-solid fa-arrow-right\"></i>\n                    </button>\n                </div>\n            </div>\n            \n            <!-- Question Palette -->\n            <div id=\"palette-column\" class=\"lg:col-span-4 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 flex flex-col\">\n                <div class=\"px-5 py-3.5 border-b flex items-center justify-between bg-slate-50 rounded-t-2xl\">\n                    <div>\n                        <span class=\"font-bold text-slate-700\">Question Palette</span>\n                    </div>\n                    <div class=\"text-xs px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded font-mono\" id=\"palette-progress\">\n                        0/115\n                    </div>\n                </div>\n                \n                <div class=\"p-4 flex-1 overflow-auto question-palette\" style=\"max-height: 460px;\">\n                    <div id=\"palette-grid\" class=\"grid grid-cols-5 gap-2.5\">\n                        <!-- Populated dynamically by JS -->\n                    </div>\n                </div>\n                \n                <div class=\"p-4 border-t bg-slate-50 rounded-b-2xl\">\n                    <button id=\"submit-section-btn\" onclick=\"submitCurrentSection()\"\n                            class=\"w-full py-3 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center gap-x-2 shadow-sm\">\n                        <i class=\"fa-solid fa-check-double\"></i>\n                        <span>SUBMIT SECTION</span>\n                    </button>\n                </div>\n            </div>\n            \n        </div>\n        \n        <!-- Instructions Bar -->\n        <div class=\"mt-4 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs flex items-center gap-x-4 text-slate-600\">\n            <div class=\"flex items-center gap-x-1.5\">\n                <i class=\"fa-solid fa-info-circle text-blue-500\"></i>\n                <span class=\"font-medium\">Instructions:</span>\n            </div>\n            <div class=\"flex-1 text-[11px]\">\n                • Use <strong>Mark for Review</strong> for questions you want to revisit later &nbsp;•&nbsp; \n                Timer is section-wise &nbsp;•&nbsp; \n                You can navigate freely between questions\n            </div>\n        </div>\n        \n    </div>\n    \n    <!-- Final Summary Modal -->\n    <div id=\"summary-modal\" class=\"hidden fixed inset-0 bg-black/60 flex items-center justify-center z-50\">\n        <div class=\"bg-white w-full max-w-2xl mx-4 rounded-3xl overflow-hidden shadow-2xl\">\n            <div class=\"px-8 py-6 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white\">\n                <div class=\"flex justify-between items-center\">\n                    <div>\n                        <h3 class=\"text-2xl font-bold\">Test Summary</h3>\n                    </div>\n                    <i onclick=\"closeSummary()\" class=\"fa-solid fa-times text-2xl cursor-pointer hover:text-blue-200\"></i>\n                </div>\n            </div>\n            \n            <div class=\"p-8\">\n                <div class=\"grid grid-cols-3 gap-4 mb-6\">\n                    <!-- Row 1 -->\n                    <div onclick=\"showCategoryReview('attempted')\" class=\"bg-green-50 border border-green-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-green-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-check-double text-xs\"></i> ATTEMPTED\n                        </div>\n                        <div id=\"summary-attempted\" class=\"text-4xl font-black text-green-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-green-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('correct')\" class=\"bg-emerald-50 border border-emerald-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-emerald-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-check text-xs\"></i> CORRECT\n                        </div>\n                        <div id=\"summary-correct\" class=\"text-4xl font-black text-emerald-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-emerald-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('wrong')\" class=\"bg-red-50 border border-red-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-red-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-times text-xs\"></i> WRONG\n                        </div>\n                        <div id=\"summary-wrong\" class=\"text-4xl font-black text-red-600 mt-1\">0</div>\n                        <div class=\"text-[10px] text-red-600 mt-0.5\">Click to review</div>\n                    </div>\n                    \n                    <!-- Row 2 -->\n                    <div onclick=\"showCategoryReview('not-attempted')\" class=\"bg-orange-50 border border-orange-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-orange-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-question text-xs\"></i> NOT ATTEMPTED\n                        </div>\n                        <div id=\"summary-not-attempted\" class=\"text-4xl font-black text-orange-600 mt-1\">0</div>\n                        <div class=\"text-[10px] text-orange-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('marked')\" class=\"bg-purple-50 border border-purple-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-purple-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-flag text-xs\"></i> MARKED FOR REVIEW\n                        </div>\n                        <div id=\"summary-marked\" class=\"text-4xl font-black text-purple-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-purple-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('all')\" class=\"bg-slate-50 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-slate-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-list text-xs\"></i> TOTAL QUESTIONS\n                        </div>\n                        <div id=\"summary-total-questions\" class=\"text-4xl font-black text-slate-700 mt-1\">115</div>\n                        <div class=\"text-[10px] text-slate-600 mt-0.5\">Click to review</div>\n                    </div>\n                </div>\n                \n                <div class=\"bg-[#003366] text-white rounded-2xl p-4 mb-6 text-center\">\n                    <div class=\"text-xs tracking-[1px] text-blue-200\">YOUR SCORE</div>\n                    <div class=\"flex items-baseline justify-center gap-x-2\">\n                        <span id=\"summary-score\" class=\"text-5xl font-black\">0</span>\n                        <span class=\"text-2xl text-blue-200\">/ <span id=\"summary-max-score\">115</span></span>\n                    </div>\n                    <div id=\"summary-percentage\" class=\"text-sm text-blue-200 mt-0.5\">0% Accuracy</div>\n                </div>\n                \n                <div class=\"text-center\">\n                    <button onclick=\"restartTest()\"\n                            class=\"px-8 py-3 text-sm font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl mr-3\">\n                        <i class=\"fa-solid fa-redo mr-2\"></i> RESTART TEST\n                    </button>\n                    <button onclick=\"finishAndShowAnswers()\"\n                            class=\"px-8 py-3 text-sm font-bold bg-[#003366] hover:bg-[#002244] text-white rounded-2xl\">\n                        VIEW DETAILED ANSWERS &amp; EXPLANATIONS\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <script>\n        // ==================== DATA: Questions (total auto-detected in summary) ====================\n                const examData = __EXAM_DATA__;\n        const examSettings = Object.assign({\n            timerMode: \"section\",\n            extraMinutes: 0,\n            optionOrder: \"as-written\",\n            allowSectionSwitch: true,\n            showMarkForReview: true,\n            showClear: true,\n            showPalette: true,\n            showSubmitSection: true,\n            showTimer: true\n        }, (examData && examData.settings) || {});\n        // ==================== STATE MANAGEMENT ====================\n        function notifyHost(type, payload) {\n            try {\n                if (window.parent && window.parent !== window) {\n                    window.parent.postMessage({ source: \"setpaper-exam\", type: type, payload: payload }, \"*\");\n                }\n            } catch (err) {}\n        }\n        let currentSection = 0;\n        let currentQuestion = 0;\n        let userAnswers = {}; // {sectionIndex: {qIndex: answer}}\n        let markedForReview = {}; // {sectionIndex: {qIndex: true}}\n        let visited = {}; // {sectionIndex: {qIndex: true}}\n        let sectionTimers = {};\n        let timerInterval = null;\n        let testSubmitted = false;\n        let overallSeconds = 0;\n        \n        // Initialize state\n        function initState() {\n            examData.sections.forEach((section, sIdx) => {\n                userAnswers[sIdx] = {};\n                markedForReview[sIdx] = {};\n                visited[sIdx] = {};\n                sectionTimers[sIdx] = section.timeMinutes * 60;\n            });\n            overallSeconds = examData.sections.reduce((n, s) => n + (s.timeMinutes || 0) * 60, 0);\n        }\n\n        function applyPaperChrome() {\n            const markBtn = document.getElementById(\"mark-review-btn\");\n            const clearBtn = document.getElementById(\"clear-response-btn\");\n            const palette = document.getElementById(\"palette-column\");\n            const questionCol = document.getElementById(\"question-column\");\n            const submitBtn = document.getElementById(\"submit-section-btn\");\n            const timerWrap = document.getElementById(\"timer-wrap\");\n            if (markBtn) markBtn.style.display = examSettings.showMarkForReview ? \"\" : \"none\";\n            if (clearBtn) clearBtn.style.display = examSettings.showClear ? \"\" : \"none\";\n            if (submitBtn) submitBtn.style.display = examSettings.showSubmitSection ? \"\" : \"none\";\n            if (palette) palette.style.display = examSettings.showPalette ? \"\" : \"none\";\n            if (questionCol) {\n                questionCol.classList.remove(\"lg:col-span-8\", \"lg:col-span-12\");\n                questionCol.classList.add(examSettings.showPalette ? \"lg:col-span-8\" : \"lg:col-span-12\");\n            }\n            if (timerWrap) timerWrap.style.display = examSettings.showTimer && examSettings.timerMode !== \"off\" ? \"\" : \"none\";\n        }\n        \n        // ==================== TIMER ====================\n        function startSectionTimer() {\n            clearInterval(timerInterval);\n            const timerWrap = document.getElementById(\"timer-wrap\");\n            if (!examSettings.showTimer || examSettings.timerMode === \"off\") {\n                if (timerWrap) timerWrap.style.display = \"none\";\n                return;\n            }\n            if (timerWrap) timerWrap.style.display = \"\";\n\n            if (examSettings.timerMode === \"overall\") {\n                updateTimerDisplay(overallSeconds);\n                timerInterval = setInterval(() => {\n                    overallSeconds--;\n                    updateTimerDisplay(overallSeconds);\n                    if (overallSeconds <= 0) {\n                        clearInterval(timerInterval);\n                        alert(\"Time is over. Submitting the paper.\");\n                        showFinalSummary();\n                    }\n                }, 1000);\n                return;\n            }\n            \n            const timeLeft = sectionTimers[currentSection];\n            updateTimerDisplay(timeLeft);\n            \n            timerInterval = setInterval(() => {\n                sectionTimers[currentSection]--;\n                updateTimerDisplay(sectionTimers[currentSection]);\n                \n                if (sectionTimers[currentSection] <= 0) {\n                    clearInterval(timerInterval);\n                    alert(\"Section time is over! Submitting current section automatically.\");\n                    submitCurrentSection(true);\n                }\n            }, 1000);\n        }\n        \n        function updateTimerDisplay(seconds) {\n            const min = Math.floor(seconds / 60);\n            const sec = seconds % 60;\n            const display = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;\n            document.getElementById('timer-display').innerHTML = display;\n            \n            // Warning color\n            const timerEl = document.getElementById('timer-display');\n            if (seconds < 120) {\n                timerEl.classList.add('text-red-400');\n            } else {\n                timerEl.classList.remove('text-red-400');\n            }\n        }\n        \n        // ==================== RENDER SECTION TABS ====================\n        function renderSectionTabs() {\n            const container = document.getElementById('section-tabs');\n            container.innerHTML = '';\n            \n            examData.sections.forEach((section, idx) => {\n                const btn = document.createElement('button');\n                btn.className = `section-tab px-5 py-2 text-sm font-semibold rounded-2xl flex items-center gap-x-2 transition-all ${idx === currentSection ? \n                    'bg-[#003366] text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`;\n                \n                btn.innerHTML = `\n                    <span>${section.name}</span>\n                    <span class=\"text-xs px-1.5 py-0.5 rounded ${idx === currentSection ? 'bg-white/20' : 'bg-slate-100'}\">${section.questions.length}Q</span>\n                `;\n                \n                btn.onclick = () => {\n                    if (!examSettings.allowSectionSwitch) return;\n                    if (idx !== currentSection) {\n                        // Auto save current\n                        saveCurrentAnswer();\n                        currentSection = idx;\n                        currentQuestion = 0;\n                        renderCurrentQuestion();\n                        renderPalette();\n                        renderSectionTabs();\n                        if (examSettings.timerMode === \"section\") startSectionTimer();\n                    }\n                };\n                \n                container.appendChild(btn);\n            });\n        }\n        \n        // ==================== RENDER QUESTION ====================\n        function renderCurrentQuestion() {\n            const section = examData.sections[currentSection];\n            const q = section.questions[currentQuestion];\n            const qArea = document.getElementById('question-area');\n            \n            // Mark as visited\n            if (!visited[currentSection]) visited[currentSection] = {};\n            visited[currentSection][currentQuestion] = true;\n            \n            let html = `\n                <div class=\"mb-2 flex items-center gap-x-2\">\n                    <span class=\"rule-badge bg-slate-100 text-slate-600 font-mono\">${q.rule}</span>\n                </div>\n                <div class=\"text-lg font-semibold text-slate-800 leading-snug mb-5\">${q.question}</div>\n            `;\n            \n            if (q.type === \"mcq\") {\n                html += `<div class=\"space-y-2.5\">`;\n                q.options.forEach((opt, idx) => {\n                    const isSelected = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] === idx;\n                    html += `\n                        <label onclick=\"selectMCQ(${idx})\" \n                               class=\"option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer ${isSelected ? 'selected border-blue-500' : 'border-slate-200'}\">\n                            <div class=\"mt-0.5\">\n                                <input type=\"radio\" name=\"q${q.id}\" ${isSelected ? 'checked' : ''} class=\"accent-[#003366]\">\n                            </div>\n                            <div class=\"flex-1 text-[15px] text-slate-700\">${opt}</div>\n                        </label>\n                    `;\n                });\n                html += `</div>`;\n            } \n            else if (q.type === \"msq\") {\n                html += `<div class=\"text-xs text-orange-600 mb-2 font-medium\">⚡ Multiple answers can be correct</div>`;\n                html += `<div class=\"space-y-2.5\">`;\n                q.options.forEach((opt, idx) => {\n                    const selectedAnswers = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : [];\n                    const isSelected = selectedAnswers.includes(idx);\n                    html += `\n                        <label onclick=\"toggleMSQ(${idx})\" \n                               class=\"option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer ${isSelected ? 'selected border-blue-500' : 'border-slate-200'}\">\n                            <div class=\"mt-0.5\">\n                                <input type=\"checkbox\" ${isSelected ? 'checked' : ''} class=\"accent-[#003366]\">\n                            </div>\n                            <div class=\"flex-1 text-[15px] text-slate-700\">${opt}</div>\n                        </label>\n                    `;\n                });\n                html += `</div>`;\n            } \n            else if (q.type === \"numerical\") {\n                const currentVal = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : '';\n                html += `\n                    <div class=\"mt-2\">\n                        <div class=\"text-xs text-slate-500 mb-1.5\">Enter the number:</div>\n                        <input type=\"text\" id=\"numerical-input\" value=\"${currentVal}\" \n                               oninput=\"saveNumericalAnswer()\"\n                               class=\"w-full px-5 py-4 text-xl font-semibold border-2 border-slate-300 focus:border-[#003366] rounded-2xl outline-none\">\n                    </div>\n                `;\n            }\n            \n            qArea.innerHTML = html;\n            \n            // Update badges\n            document.getElementById('current-q-no').innerText = `Q${q.id}`;\n            document.getElementById('current-section-name').innerText = section.name;\n            \n            const typeBadge = document.getElementById('question-type-badge');\n            if (q.type === \"mcq\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-check-circle mr-1\"></i> Single Correct`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center`;\n            } else if (q.type === \"msq\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-tasks mr-1\"></i> Multiple Select`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 flex items-center`;\n            } else if (q.type === \"numerical\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-calculator mr-1\"></i> Numerical`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center`;\n            }\n            \n            // Progress\n            document.getElementById('progress-text').innerText = `${currentQuestion + 1} of ${section.questions.length}`;\n            \n            // Enable/disable nav buttons\n            document.getElementById('prev-btn').disabled = currentQuestion === 0;\n            document.getElementById('next-btn').innerHTML = currentQuestion === section.questions.length - 1 ? \n                `Finish Section <i class=\"fa-solid fa-check ml-2\"></i>` : `Next <i class=\"fa-solid fa-arrow-right ml-2\"></i>`;\n            \n            updatePalette();\n        }\n        \n        // ==================== ANSWER HANDLING ====================\n        function selectMCQ(optionIndex) {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            userAnswers[currentSection][currentQuestion] = optionIndex;\n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function toggleMSQ(optionIndex) {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            if (!userAnswers[currentSection][currentQuestion]) userAnswers[currentSection][currentQuestion] = [];\n            \n            let answers = userAnswers[currentSection][currentQuestion];\n            const idx = answers.indexOf(optionIndex);\n            \n            if (idx > -1) {\n                answers.splice(idx, 1);\n            } else {\n                answers.push(optionIndex);\n            }\n            \n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function saveNumericalAnswer() {\n            const input = document.getElementById('numerical-input');\n            if (!input) return;\n            \n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            userAnswers[currentSection][currentQuestion] = input.value.trim();\n            updatePalette();\n        }\n        \n        function saveCurrentAnswer() {\n            // For numerical, already saved on input\n            // MCQ/MSQ already saved on click\n        }\n        \n        function clearResponse() {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            delete userAnswers[currentSection][currentQuestion];\n            \n            if (markedForReview[currentSection]) {\n                delete markedForReview[currentSection][currentQuestion];\n            }\n            \n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function markForReview() {\n            if (!markedForReview[currentSection]) markedForReview[currentSection] = {};\n            markedForReview[currentSection][currentQuestion] = true;\n            updatePalette();\n            \n            // Visual feedback\n            const btns = document.querySelectorAll('.option-label');\n            btns.forEach(b => b.style.transition = 'all 0.1s');\n        }\n        \n        // ==================== PALETTE ====================\n        function updatePalette() {\n            const container = document.getElementById('palette-grid');\n            container.innerHTML = '';\n            \n            const section = examData.sections[currentSection];\n            const totalQ = section.questions.length;\n            \n            let answeredCount = 0;\n            \n            for (let i = 0; i < totalQ; i++) {\n                const btn = document.createElement('button');\n                btn.className = `palette-btn rounded-xl text-sm font-bold`;\n                \n                let status = 'not-visited';\n                let label = i + 1;\n                \n                const isAnswered = userAnswers[currentSection] && userAnswers[currentSection][i] !== undefined && \n                                   (Array.isArray(userAnswers[currentSection][i]) ? userAnswers[currentSection][i].length > 0 : true);\n                \n                const isMarked = markedForReview[currentSection] && markedForReview[currentSection][i];\n                const isVisited = visited[currentSection] && visited[currentSection][i];\n                \n                if (isAnswered && isMarked) {\n                    status = 'answered-marked';\n                } else if (isAnswered) {\n                    status = 'answered';\n                    answeredCount++;\n                } else if (isMarked) {\n                    status = 'marked';\n                } else if (isVisited) {\n                    status = 'not-answered';\n                }\n                \n                btn.classList.add(status);\n                btn.innerText = label;\n                \n                if (i === currentQuestion) {\n                    btn.style.boxShadow = '0 0 0 3px #003366';\n                    btn.style.transform = 'scale(1.05)';\n                }\n                \n                btn.onclick = () => {\n                    saveCurrentAnswer();\n                    currentQuestion = i;\n                    renderCurrentQuestion();\n                    updatePalette();\n                };\n                \n                container.appendChild(btn);\n            }\n            \n            // Update progress text\n            document.getElementById('palette-progress').innerText = `${answeredCount}/${totalQ}`;\n        }\n        \n        function renderPalette() {\n            updatePalette();\n        }\n        \n        // ==================== NAVIGATION ====================\n        function nextQuestion() {\n            saveCurrentAnswer();\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            \n            const section = examData.sections[currentSection];\n            if (!section) {\n                showFinalSummary();\n                return;\n            }\n            \n            if (currentQuestion < section.questions.length - 1) {\n                currentQuestion++;\n                renderCurrentQuestion();\n                updatePalette();\n            } else {\n                submitCurrentSection(true);\n            }\n        }\n        \n        function prevQuestion() {\n            saveCurrentAnswer();\n            if (currentQuestion > 0) {\n                currentQuestion--;\n                renderCurrentQuestion();\n                updatePalette();\n            }\n        }\n        \n        // ==================== SUBMIT SECTION ====================\n        function answersMatch(q, userAns) {\n            if (!q || userAns === undefined || userAns === null || userAns === \"\") return false;\n            if (q.type === \"mcq\") return userAns === q.correct;\n            if (q.type === \"msq\") {\n                const a = (Array.isArray(userAns) ? userAns : []).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });\n                const b = (Array.isArray(q.correct) ? q.correct : [q.correct]).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });\n                return JSON.stringify(a) === JSON.stringify(b);\n            }\n            if (q.type === \"numerical\") return String(userAns).trim() === String(q.correct).trim();\n            return false;\n        }\n\n        function submitPaper() {\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            showFinalSummary();\n        }\n\n        function submitCurrentSection(auto = false) {\n            clearInterval(timerInterval);\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            \n            const section = examData.sections[currentSection];\n            if (!section) {\n                showFinalSummary();\n                return;\n            }\n            \n            if (currentSection >= examData.sections.length - 1) {\n                showFinalSummary();\n                return;\n            }\n            \n            currentSection++;\n            currentQuestion = 0;\n            renderSectionTabs();\n            renderCurrentQuestion();\n            renderPalette();\n            startSectionTimer();\n            const btn = document.getElementById(\"submit-section-btn\");\n            if (btn) {\n                const label = btn.querySelector(\"span\");\n                if (label) label.textContent = currentSection >= examData.sections.length - 1 ? \"SUBMIT PAPER\" : \"SUBMIT SECTION\";\n            }\n        }\n        \n        // ==================== FINAL SUMMARY ====================\n        function showFinalSummary() {\n            testSubmitted = true;\n            clearInterval(timerInterval);\n            \n            let totalAnswered = 0;\n            let totalMarked = 0;\n            let totalQuestions = 0;\n            let correctCount = 0;\n            let wrongCount = 0;\n            \n            examData.sections.forEach((section, sIdx) => {\n                totalQuestions += section.questions.length;\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    \n                    if (userAns !== undefined) {\n                        const ans = userAns;\n                        if (Array.isArray(ans) ? ans.length > 0 : true) {\n                            totalAnswered++;\n                            \n                            let isCorrect = answersMatch(q, userAns);\n                            if (isCorrect) {\n                                correctCount++;\n                            } else {\n                                wrongCount++;\n                            }\n                        }\n                    }\n                    \n                    if (markedForReview[sIdx] && markedForReview[sIdx][qIdx]) totalMarked++;\n                });\n            });\n            \n            const notAttempted = totalQuestions - totalAnswered;\n            const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;\n            \n            try {\n            document.getElementById('summary-attempted').innerText = totalAnswered;\n            document.getElementById('summary-not-attempted').innerText = notAttempted;\n            document.getElementById('summary-marked').innerText = totalMarked;\n            document.getElementById('summary-correct').innerText = correctCount;\n            document.getElementById('summary-wrong').innerText = wrongCount;\n            document.getElementById('summary-score').innerText = correctCount;\n            document.getElementById('summary-percentage').innerText = `${percentage}% Accuracy`;\n            document.getElementById('summary-total-questions').innerText = totalQuestions;\n            document.getElementById('summary-max-score').innerText = totalQuestions;\n            } catch (err) {}\n            \n            \n            const itemResults = [];\n            examData.sections.forEach((section, sIdx) => {\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    let isAttempted = false;\n                    let isCorrect = false;\n                    if (userAns !== undefined) {\n                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {\n                            isAttempted = userAns !== \"\";\n                            isCorrect = answersMatch(q, userAns);\n                        }\n                    }\n                    const isMarked = !!(markedForReview[sIdx] && markedForReview[sIdx][qIdx]);\n                    itemResults.push({\n                        bankId: q.bankId || q.id,\n                        id: q.id,\n                        type: q.type,\n                        userAns: userAns === undefined ? null : userAns,\n                        isAttempted: isAttempted,\n                        isCorrect: isCorrect,\n                        isMarked: isMarked,\n                        sectionIdx: sIdx,\n                        qIdx: qIdx\n                    });\n                });\n            });\n            notifyHost(\"exam-complete\", {\n                attempted: totalAnswered,\n                correct: correctCount,\n                wrong: wrongCount,\n                notAttempted: notAttempted,\n                marked: totalMarked,\n                score: correctCount,\n                total: totalQuestions,\n                items: itemResults\n            });\n\n            try {\n                document.getElementById('summary-modal').classList.remove('hidden');\n                document.getElementById('summary-modal').classList.add('flex');\n            } catch (err) {}\n        }\n        \n        function closeSummary() {\n            document.getElementById('summary-modal').classList.remove('flex');\n            document.getElementById('summary-modal').classList.add('hidden');\n        }\n        \n        function finishAndShowAnswers() {\n            closeSummary();\n            showDetailedAnswers();\n        }\n        \n        function showDetailedAnswers() {\n            const container = document.createElement('div');\n            container.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4`;\n            \n            let html = `\n                <div class=\"bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col\">\n                    <div class=\"px-8 py-5 bg-[#003366] text-white flex justify-between items-center\">\n                        <div>\n                            <span class=\"font-bold text-xl\">Detailed Answers &amp; Explanations</span>\n                            <span class=\"ml-3 text-xs bg-white/20 px-3 py-1 rounded\">For Self-Assessment</span>\n                        </div>\n                        <button onclick=\"this.closest('.fixed').remove()\" class=\"text-white text-2xl hover:text-red-300\">×</button>\n                    </div>\n                    \n                    <div class=\"overflow-auto p-6 flex-1 bg-slate-50\" style=\"max-height: calc(92vh - 140px)\">\n            `;\n            \n            let qNo = 1;\n            examData.sections.forEach((section, sIdx) => {\n                html += `<div class=\"mb-8\"><div class=\"font-bold text-lg mb-3 text-[#003366] sticky top-0 bg-slate-50 py-1\">${section.name} — ${section.title}</div>`;\n                \n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    let isCorrect = false;\n                    \n                    if (q.type === \"mcq\" && userAns !== undefined) {\n                        isCorrect = userAns === q.correct;\n                    } else if (q.type === \"msq\" && Array.isArray(userAns)) {\n                        isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());\n                    } else if (q.type === \"numerical\" && userAns !== undefined) {\n                        isCorrect = userAns.toString().trim() === q.correct.toString();\n                    }\n                    \n                    const statusColor = isCorrect ? 'green' : (userAns !== undefined ? 'red' : 'slate');\n                    \n                    html += `\n                        <div class=\"mb-5 bg-white border border-slate-200 rounded-2xl p-5\">\n                            <div class=\"flex gap-x-3\">\n                                <div class=\"font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500\">${q.rule}</div>\n                                <div class=\"flex-1\">\n                                    <div class=\"font-semibold text-slate-800\">${qNo}. ${q.question}</div>\n                                    \n                                    <div class=\"mt-3 text-sm\">\n                    `;\n                    \n                    if (q.type === \"mcq\") {\n                        q.options.forEach((opt, idx) => {\n                            let cls = '';\n                            if (idx === q.correct) cls = 'text-green-700 font-semibold';\n                            if (userAns === idx && idx !== q.correct) cls = 'text-red-600 line-through';\n                            \n                            html += `<div class=\"flex items-center gap-x-2 py-0.5 ${cls}\">\n                                <span class=\"font-mono text-xs w-5\">${String.fromCharCode(65+idx)}.</span> \n                                <span>${opt}</span>\n                                ${idx === q.correct ? '<i class=\"fa-solid fa-check text-green-500 ml-1\"></i>' : ''}\n                            </div>`;\n                        });\n                    } else if (q.type === \"msq\") {\n                        q.options.forEach((opt, idx) => {\n                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);\n                            const isCorrectOpt = q.correct.includes(idx);\n                            \n                            let cls = '';\n                            if (isCorrectOpt) cls = 'text-green-700 font-semibold';\n                            if (userSelected && !isCorrectOpt) cls = 'text-red-600 line-through';\n                            \n                            html += `<div class=\"flex items-center gap-x-2 py-0.5 ${cls}\">\n                                <span class=\"font-mono text-xs w-5\">${String.fromCharCode(65+idx)}.</span> \n                                <span>${opt}</span>\n                                ${isCorrectOpt ? '<i class=\"fa-solid fa-check text-green-500 ml-1\"></i>' : ''}\n                            </div>`;\n                        });\n                    } else if (q.type === \"numerical\") {\n                        html += `<div class=\"mt-1\">\n                            <span class=\"text-xs text-slate-500\">Your Answer:</span> \n                            <span class=\"font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}\">${userAns || 'Not Answered'}</span><br>\n                            <span class=\"text-xs text-slate-500\">Correct Answer:</span> \n                            <span class=\"font-semibold text-green-700\">${q.correct}</span>\n                        </div>`;\n                    }\n                    \n                    html += `</div>\n                            <div class=\"mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600\">${q.explanation}</div>\n                        </div></div></div>`;\n                    \n                    qNo++;\n                });\n                \n                html += `</div>`;\n            });\n            \n            html += `</div></div>`;\n            container.innerHTML = html;\n            document.body.appendChild(container);\n        }\n        \n        // ==================== CATEGORY REVIEW (Clickable Summary Cards) ====================\n        function showCategoryReview(category) {\n            closeSummary();\n            \n            let filteredQuestions = [];\n            let categoryTitle = '';\n            let categoryIcon = '';\n            let categoryColor = 'slate';\n            \n            examData.sections.forEach((section, sIdx) => {\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    const isMarked = markedForReview[sIdx] && markedForReview[sIdx][qIdx];\n                    \n                    let isCorrect = false;\n                    let isAttempted = false;\n                    \n                    if (userAns !== undefined) {\n                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {\n                            isAttempted = true;\n                            \n                            if (q.type === \"mcq\") {\n                                isCorrect = userAns === q.correct;\n                            } else if (q.type === \"msq\" && Array.isArray(userAns)) {\n                                isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());\n                            } else if (q.type === \"numerical\") {\n                                isCorrect = userAns.toString().trim() === q.correct.toString();\n                            }\n                        }\n                    }\n                    \n                    let include = false;\n                    \n                    if (category === 'all') include = true;\n                    else if (category === 'correct' && isAttempted && isCorrect) include = true;\n                    else if (category === 'wrong' && isAttempted && !isCorrect) include = true;\n                    else if (category === 'attempted' && isAttempted) include = true;\n                    else if (category === 'not-attempted' && !isAttempted) include = true;\n                    else if (category === 'marked' && isMarked) include = true;\n                    \n                    if (include) {\n                        filteredQuestions.push({\n                            sectionIdx: sIdx,\n                            qIdx: qIdx,\n                            sectionName: section.name,\n                            sectionTitle: section.title,\n                            question: q,\n                            userAns: userAns,\n                            isCorrect: isCorrect,\n                            isMarked: isMarked\n                        });\n                    }\n                });\n            });\n            \n            // Set title based on category\n            if (category === 'all') {\n                categoryTitle = `All Questions (${filteredQuestions.length})`;\n                categoryIcon = 'fa-list-ul';\n                categoryColor = 'slate';\n            } else if (category === 'correct') {\n                categoryTitle = `Correct Answers (${filteredQuestions.length})`;\n                categoryIcon = 'fa-check-circle';\n                categoryColor = 'emerald';\n            } else if (category === 'wrong') {\n                categoryTitle = `Wrong Answers (${filteredQuestions.length})`;\n                categoryIcon = 'fa-times-circle';\n                categoryColor = 'red';\n            } else if (category === 'attempted') {\n                categoryTitle = `Attempted Questions (${filteredQuestions.length})`;\n                categoryIcon = 'fa-check-double';\n                categoryColor = 'green';\n            } else if (category === 'not-attempted') {\n                categoryTitle = `Not Attempted (${filteredQuestions.length})`;\n                categoryIcon = 'fa-question-circle';\n                categoryColor = 'orange';\n            } else if (category === 'marked') {\n                categoryTitle = `Marked for Review (${filteredQuestions.length})`;\n                categoryIcon = 'fa-flag';\n                categoryColor = 'purple';\n            }\n            \n            const container = document.createElement('div');\n            container.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4`;\n            \n            let html = `\n                <div class=\"bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col\">\n                    <div class=\"px-8 py-5 bg-[#003366] text-white flex justify-between items-center\">\n                        <div class=\"flex items-center gap-x-3\">\n                            <i class=\"fa-solid ${categoryIcon} text-2xl text-${categoryColor}-400\"></i>\n                            <div>\n                                <span class=\"font-bold text-xl\">${categoryTitle}</span>\n                                <span class=\"ml-3 text-xs bg-white/20 px-3 py-1 rounded\">Review Mode</span>\n                            </div>\n                        </div>\n                        <div class=\"flex items-center gap-x-2\">\n                            <button onclick=\"this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');\" \n                                    class=\"px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-x-2\">\n                                <i class=\"fa-solid fa-arrow-left\"></i> \n                                <span>Back to Summary</span>\n                            </button>\n                            <button onclick=\"this.closest('.fixed').remove()\" class=\"text-white text-3xl leading-none hover:text-red-300 px-2\">×</button>\n                        </div>\n                    </div>\n                    \n                    <div class=\"overflow-auto p-6 flex-1 bg-slate-50\" style=\"max-height: calc(92vh - 140px)\">\n            `;\n            \n            if (filteredQuestions.length === 0) {\n                html += `\n                    <div class=\"flex flex-col items-center justify-center py-16 text-center\">\n                        <i class=\"fa-solid ${categoryIcon} text-6xl text-slate-300 mb-4\"></i>\n                        <div class=\"text-xl font-semibold text-slate-600\">No questions in this category</div>\n                        <div class=\"text-sm text-slate-500 mt-1\">Great job! Keep practicing.</div>\n                    </div>\n                `;\n            } else {\n                filteredQuestions.forEach((item, index) => {\n                    const q = item.question;\n                    const userAns = item.userAns;\n                    const isCorrect = item.isCorrect;\n                    const qNoGlobal = (item.sectionIdx * 10) + (item.qIdx + 1); // Approximate global number\n                    \n                    html += `\n                        <div class=\"mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm\">\n                            <div class=\"flex items-start gap-x-3\">\n                                <div class=\"font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0 mt-0.5\">${q.rule}</div>\n                                <div class=\"flex-1 min-w-0\">\n                                    <div class=\"flex items-center gap-x-2 mb-1\">\n                                        <span class=\"font-bold text-slate-700\">Q${qNoGlobal}</span>\n                                        <span class=\"text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600\">${item.sectionName}</span>\n                                        ${item.isMarked ? '<span class=\"text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700\"><i class=\"fa-solid fa-flag mr-1\"></i>Marked</span>' : ''}\n                                    </div>\n                                    \n                                    <div class=\"font-semibold text-slate-800 mb-3\">${q.question}</div>\n                    `;\n                    \n                    // Options rendering (same logic as detailed answers)\n                    if (q.type === \"mcq\") {\n                        html += `<div class=\"space-y-1 text-sm\">`;\n                        q.options.forEach((opt, idx) => {\n                            let cls = 'text-slate-700';\n                            let icon = '';\n                            \n                            if (idx === q.correct) {\n                                cls = 'text-green-700 font-semibold';\n                                icon = '<i class=\"fa-solid fa-check text-green-500 ml-1.5\"></i>';\n                            }\n                            if (userAns === idx && idx !== q.correct) {\n                                cls = 'text-red-600 line-through';\n                            }\n                            \n                            html += `\n                                <div class=\"flex items-center gap-x-2 py-1 px-2 rounded ${cls}\">\n                                    <span class=\"font-mono text-xs w-5 flex-shrink-0\">${String.fromCharCode(65+idx)}.</span> \n                                    <span class=\"flex-1\">${opt}</span>\n                                    ${icon}\n                                </div>\n                            `;\n                        });\n                        html += `</div>`;\n                    } else if (q.type === \"msq\") {\n                        html += `<div class=\"space-y-1 text-sm\">`;\n                        q.options.forEach((opt, idx) => {\n                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);\n                            const isCorrectOpt = q.correct.includes(idx);\n                            \n                            let cls = 'text-slate-700';\n                            let icon = '';\n                            \n                            if (isCorrectOpt) {\n                                cls = 'text-green-700 font-semibold';\n                                icon = '<i class=\"fa-solid fa-check text-green-500 ml-1.5\"></i>';\n                            }\n                            if (userSelected && !isCorrectOpt) {\n                                cls = 'text-red-600 line-through';\n                            }\n                            \n                            html += `\n                                <div class=\"flex items-center gap-x-2 py-1 px-2 rounded ${cls}\">\n                                    <span class=\"font-mono text-xs w-5 flex-shrink-0\">${String.fromCharCode(65+idx)}.</span> \n                                    <span class=\"flex-1\">${opt}</span>\n                                    ${icon}\n                                </div>\n                            `;\n                        });\n                        html += `</div>`;\n                    } else if (q.type === \"numerical\") {\n                        html += `\n                            <div class=\"mt-2 p-3 bg-slate-50 rounded-xl text-sm\">\n                                <div><span class=\"text-xs text-slate-500\">Your Answer:</span> <span class=\"font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}\">${userAns || 'Not Answered'}</span></div>\n                                <div class=\"mt-1\"><span class=\"text-xs text-slate-500\">Correct Answer:</span> <span class=\"font-semibold text-green-700\">${q.correct}</span></div>\n                            </div>\n                        `;\n                    }\n                    \n                    html += `\n                                    <div class=\"mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600\">\n                                        ${q.explanation}\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    `;\n                });\n            }\n            \n            html += `\n                    </div>\n                    \n                    <div class=\"px-8 py-4 border-t bg-white flex justify-between items-center\">\n                        <div class=\"text-xs text-slate-500\">\n                            Click on any card in Summary to filter questions\n                        </div>\n                        <button onclick=\"this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');\"\n                                class=\"px-5 py-2 text-sm font-semibold bg-[#003366] text-white rounded-2xl flex items-center gap-x-2 hover:bg-[#002244]\">\n                            <i class=\"fa-solid fa-arrow-left\"></i>\n                            <span>Back to Summary</span>\n                        </button>\n                    </div>\n                </div>\n            `;\n            \n            container.innerHTML = html;\n            document.body.appendChild(container);\n        }\n        \n        function restartTest() {\n            if (confirm(\"क्या आप पूरा टेस्ट restart करना चाहते हैं? सारी progress मिट जाएगी।\")) {\n                location.reload();\n            }\n        }\n\n        // ==================== CANDIDATE INFO HANDLER ====================\n        function startTest() {\n            const nameInput = (document.getElementById(\"candidate-name-input\") || {}).value || (examData.meta && examData.meta.candidateName) || \"\";\n            const idInput = (document.getElementById(\"candidate-id-input\") || {}).value || (examData.meta && examData.meta.candidateId) || \"\";\n            const selectedLang = \"Hinglish\";\n\n            window.candidateName = nameInput;\n            window.candidateId = idInput;\n            window.selectedLanguage = selectedLang;\n\n            const header = document.getElementById(\"candidate-header\");\n            const headerName = document.getElementById(\"header-candidate-name\");\n            const headerId = document.getElementById(\"header-candidate-id\");\n            if (headerName) headerName.textContent = nameInput || \"Candidate\";\n            if (headerId) headerId.textContent = idInput || \"\";\n            if (header) header.classList.toggle(\"hidden\", !nameInput && !idInput);\n\n            document.getElementById('candidate-info-screen').style.display = 'none';\n            document.getElementById('exam-interface').style.display = 'block';\n\n            initializeExam();\n            notifyHost('exam-started', { sections: examData.sections.length, questions: examData.sections.reduce((n,s)=>n+s.questions.length,0) });\n\n            // Show simple start toast (no language badge since removed)\n            setTimeout(() => {\n                const startToast = document.createElement('div');\n                startToast.className = `fixed bottom-5 left-5 bg-white shadow-xl border px-4 py-2.5 rounded-2xl text-sm flex items-center gap-x-2 z-50`;\n                startToast.innerHTML = `\n                    <div class=\"text-[#003366]\"><i class=\"fa-solid fa-play\"></i></div>\n                    <div class=\"text-xs\">Test started successfully. Good luck!</div>\n                `;\n                document.body.appendChild(startToast);\n                setTimeout(() => startToast.remove(), 2200);\n            }, 800);\n        }\n        \n        // ==================== INITIALIZE ====================\n        function initializeExam() {\n            initState();\n            applyPaperChrome();\n            renderSectionTabs();\n            renderCurrentQuestion();\n            renderPalette();\n            startSectionTimer();\n            \n            // Keyboard shortcuts\n            document.addEventListener('keydown', function(e) {\n                if (testSubmitted) return;\n                \n                if (e.key === \"ArrowRight\") {\n                    nextQuestion();\n                } else if (e.key === \"ArrowLeft\") {\n                    prevQuestion();\n                } else if (e.key.toLowerCase() === \"m\") {\n                    if (examSettings.showMarkForReview) markForReview();\n                } else if (e.key.toLowerCase() === \"c\") {\n                    if (examSettings.showClear) clearResponse();\n                }\n            });\n            \n            // Welcome toast\n            setTimeout(() => {\n                const toast = document.createElement('div');\n                toast.className = `fixed bottom-5 right-5 bg-white shadow-xl border px-5 py-3 rounded-2xl text-sm flex items-center gap-x-3 z-40`;\n                toast.innerHTML = `\n                    <div class=\"text-emerald-600\"><i class=\"fa-solid fa-info-circle\"></i></div>\n                    <div class=\"text-xs\">Tip: Press <span class=\"font-mono bg-slate-100 px-1.5 rounded\">M</span> to Mark for Review &nbsp;•&nbsp; <span class=\"font-mono bg-slate-100 px-1.5 rounded\">C</span> to Clear</div>\n                `;\n                document.body.appendChild(toast);\n                setTimeout(() => toast.remove(), 4200);\n            }, 6500);\n            \n            console.log(\"%c[SetPaper] Paper ready.\", \"color:#64748b\");\n        }\n\n        function fillStartScreen() {\n            const totalQ = examData.sections.reduce(function (n, s) { return n + s.questions.length; }, 0);\n            const secs = examData.sections.length;\n            const mins = examData.sections.reduce(function (n, s) { return n + (s.timeMinutes || s.questions.length); }, 0);\n            const meta = examData.meta || {};\n            const titleEl = document.getElementById(\"start-paper-title\");\n            const countsEl = document.getElementById(\"start-counts\");\n            const subEl = document.getElementById(\"start-subtitle\");\n            const durEl = document.getElementById(\"start-duration\");\n            const footEl = document.getElementById(\"start-footer\");\n            const nameEl = document.getElementById(\"candidate-name-input\");\n            const idEl = document.getElementById(\"candidate-id-input\");\n            if (titleEl) titleEl.textContent = meta.title || \"Practice Test\";\n            const timerLabel = examSettings.timerMode === \"off\"\n                ? \"No timer\"\n                : examSettings.timerMode === \"overall\"\n                    ? \"One paper timer\"\n                    : \"Section-wise timer\";\n            if (countsEl) countsEl.textContent = secs + \" Sections • \" + totalQ + \" Questions • \" + timerLabel;\n            if (subEl) subEl.textContent = meta.subtitle || \"Generated from your question bank\";\n            if (durEl) durEl.textContent = examSettings.timerMode === \"off\"\n                ? secs + \" Sections · untimed\"\n                : \"Total Duration: ~\" + mins + \" Minutes | \" + secs + \" Sections\";\n            if (footEl) footEl.textContent = meta.footer || \"SetPaper · template-generated practice paper\";\n            if (nameEl && meta.candidateName) nameEl.value = meta.candidateName;\n            if (idEl && meta.candidateId) idEl.value = meta.candidateId;\n            const sumTotal = document.getElementById(\"summary-total-questions\");\n            const sumMax = document.getElementById(\"summary-max-score\");\n            if (sumTotal) sumTotal.textContent = String(totalQ);\n            if (sumMax) sumMax.textContent = String(totalQ);\n        }\n        fillStartScreen();\n        \n        // Boot - We call initializeExam manually after candidate form\n        // window.onload = initializeExam;   // Disabled - now called from startTest()\n    <\/script>\n    \n    </div> <!-- End of #exam-interface -->\n</body>\n</html>";
/** Injected into every TCS-style paper so Submit works inside nested iframes. */
function wirePaperGlobals(html) {
	return html.replace(/\bconst\s+examData\s*=/, "var examData = window.examData =").replace(/\blet\s+userAnswers\s*=/, "var userAnswers = window.userAnswers =").replace(/\blet\s+markedForReview\s*=/, "var markedForReview = window.markedForReview =").replace(/\blet\s+visited\s*=/, "var visited = window.visited =").replace(/\blet\s+currentSection\s*=/, "var currentSection =").replace(/\blet\s+currentQuestion\s*=/, "var currentQuestion =");
}
var PAPER_HOST_SCRIPT = `<script>
(function () {
  if (window.__setpaperHost) return;
  window.__setpaperHost = true;

  function notifyHost(type, payload) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ source: "setpaper-exam", type: type, payload: payload }, "*");
      }
    } catch (err) {}
  }
  window.notifyHost = notifyHost;

  function asList(value) {
    if (Array.isArray(value)) return value.slice().map(Number).filter(function (n) { return Number.isFinite(n); }).sort(function (a, b) { return a - b; });
    if (typeof value === "number" && Number.isFinite(value)) return [value];
    return [];
  }

  function isCorrect(q, userAns) {
    if (!q || userAns === undefined || userAns === null || userAns === "") return false;
    if (q.type === "mcq") return userAns === q.correct;
    if (q.type === "msq") return JSON.stringify(asList(userAns)) === JSON.stringify(asList(q.correct));
    if (q.type === "numerical") return String(userAns).trim() === String(q.correct).trim();
    return false;
  }

  function collectFromEmt() {
    var qs = (window.questions_data && window.questions_data.length) ? window.questions_data : window.raw_questions_data;
    var ans = window.answers;
    if (!Array.isArray(qs) || !qs.length) return null;
    var data = window.examData;
    var bankByText = {};
    if (data && data.sections) {
      data.sections.forEach(function (section) {
        (section.questions || []).forEach(function (q) {
          var key = String(q.question || "").replace(/\\s+/g, " ").trim();
          if (key) bankByText[key] = q.bankId || q.id;
        });
      });
    }
    var items = [];
    var correct = 0, wrong = 0, attempted = 0, marked = 0, total = 0;
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i] || {};
      total += 1;
      var userAns = Array.isArray(ans) ? ans[i] : null;
      var isAttempted = userAns !== undefined && userAns !== null && userAns !== "";
      var ok = isAttempted && userAns === q.answerIndex;
      if (isAttempted) {
        attempted += 1;
        if (ok) correct += 1;
        else wrong += 1;
      }
      var isMarked = !!(window.marked && window.marked[i]);
      if (isMarked) marked += 1;
      var text = String(q.question_en || q.question || "").replace(/\\s+/g, " ").trim();
      items.push({
        bankId: q.bankId || bankByText[text] || q.id,
        id: q.id,
        type: "mcq",
        userAns: isAttempted ? userAns : null,
        isAttempted: isAttempted,
        isCorrect: !!ok,
        isMarked: isMarked,
        sectionIdx: 0,
        qIdx: i
      });
    }
    return {
      attempted: attempted,
      correct: correct,
      wrong: wrong,
      notAttempted: Math.max(0, total - attempted),
      marked: marked,
      score: correct,
      total: total,
      items: items
    };
  }

  function collectResults() {
    var emt = collectFromEmt();
    if (emt && emt.total) return emt;
    var data = window.examData || { sections: [] };
    var answers = window.userAnswers || {};
    var marks = window.markedForReview || {};
    var items = [];
    var correct = 0, wrong = 0, attempted = 0, marked = 0, total = 0;
    (data.sections || []).forEach(function (section, sIdx) {
      (section.questions || []).forEach(function (q, qIdx) {
        total += 1;
        var userAns = answers[sIdx] ? answers[sIdx][qIdx] : undefined;
        var isAttempted = false;
        var ok = false;
        if (userAns !== undefined && userAns !== null && !(Array.isArray(userAns) && userAns.length === 0) && userAns !== "") {
          isAttempted = true;
          attempted += 1;
          ok = isCorrect(q, userAns);
          if (ok) correct += 1;
          else wrong += 1;
        }
        var isMarked = !!(marks[sIdx] && marks[sIdx][qIdx]);
        if (isMarked) marked += 1;
        items.push({
          bankId: q.bankId || q.id,
          id: q.id,
          type: q.type,
          userAns: userAns === undefined ? null : userAns,
          isAttempted: isAttempted,
          isCorrect: ok,
          isMarked: isMarked,
          sectionIdx: sIdx,
          qIdx: qIdx
        });
      });
    });
    return {
      attempted: attempted,
      correct: correct,
      wrong: wrong,
      notAttempted: Math.max(0, total - attempted),
      marked: marked,
      score: correct,
      total: total,
      items: items
    };
  }
  window.collectExamResults = collectResults;

  function saveOpenAnswer() {
    try {
      if (typeof saveNumericalAnswer === "function") saveNumericalAnswer();
      if (typeof saveCurrentAnswer === "function") saveCurrentAnswer();
    } catch (err) {}
  }

  function submitPaper() {
    saveOpenAnswer();
    if (locked()) {
      showLockNote();
      return;
    }
    if (typeof showFinalSummary === "function") showFinalSummary();
    else notifyHost("exam-complete", collectResults());
  }
  window.submitPaper = submitPaper;

  window.confirm = function () { return true; };

  function locked() {
    var until = Number(window.__setpaperLockUntil || 0);
    return until > 0 && Date.now() < until;
  }

  function showLockNote() {
    var el = document.getElementById("setpaper-lock-note");
    if (!el) {
      el = document.createElement("div");
      el.id = "setpaper-lock-note";
      el.style.cssText = "position:sticky;top:0;z-index:50;margin:8px 0;padding:10px 12px;border-radius:12px;background:#003366;color:#fff;font:600 13px/1.4 Inter,system-ui,sans-serif;text-align:center;";
      var exam = document.getElementById("exam-interface") || document.body;
      exam.insertBefore(el, exam.firstChild);
    }
    var until = Number(window.__setpaperLockUntil || 0);
    var left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    var m = Math.floor(left / 60);
    var s = left % 60;
    el.textContent = "Time still running · " + m + ":" + (s < 10 ? "0" : "") + s + " — the paper submits when time ends.";
    el.style.display = locked() ? "block" : "none";
  }

  var origShow = window.showFinalSummary;
  window.showFinalSummary = function () {
    saveOpenAnswer();
    if (locked()) {
      showLockNote();
      return;
    }
    try {
      if (typeof origShow === "function") origShow.apply(this, arguments);
    } catch (err) {}
    notifyHost("exam-complete", collectResults());
  };

  var origSubmit = window.submitCurrentSection;
  window.submitCurrentSection = function (auto) {
    saveOpenAnswer();
    var data = window.examData || { sections: [] };
    var sections = data.sections || [];
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    if (!sections[idx] || idx >= sections.length - 1) {
      submitPaper();
      return;
    }
    try {
      if (typeof origSubmit === "function") origSubmit.call(this, auto === undefined ? true : auto);
    } catch (err) {
      submitPaper();
    }
  };

  var origNext = window.nextQuestion;
  window.nextQuestion = function () {
    saveOpenAnswer();
    var data = window.examData || { sections: [] };
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    var qIdx = typeof window.currentQuestion === "number" ? window.currentQuestion : 0;
    var section = (data.sections || [])[idx];
    if (section && qIdx >= (section.questions || []).length - 1) {
      window.submitCurrentSection(true);
      return;
    }
    if (typeof origNext === "function") origNext.apply(this, arguments);
  };

  function labelSubmit() {
    var data = window.examData || { sections: [] };
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    var last = idx >= (data.sections || []).length - 1;
    var btn = document.getElementById("submit-section-btn");
    if (btn) {
      var span = btn.querySelector("span");
      if (span) span.textContent = last ? "SUBMIT PAPER" : "SUBMIT SECTION";
      btn.setAttribute("onclick", last ? "submitPaper()" : "submitCurrentSection(true)");
    }
    var next = document.getElementById("next-btn");
    if (next && last) {
      var section = (data.sections || [])[idx];
      var qIdx = typeof window.currentQuestion === "number" ? window.currentQuestion : 0;
      if (section && qIdx >= (section.questions || []).length - 1) {
        next.innerHTML = 'Submit paper <i class="fa-solid fa-check ml-2"></i>';
      }
    }
  }

  function addSubmitBar() {
    if (document.getElementById("setpaper-submit-bar")) return;
    var exam = document.getElementById("exam-interface") || document.getElementById("test-ui");
    if (!exam) return;
    var bar = document.createElement("div");
    bar.id = "setpaper-submit-bar";
    bar.style.cssText = "position:sticky;bottom:0;z-index:40;margin-top:12px;padding:10px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;display:flex;gap:8px;";
    bar.innerHTML = '<button type="button" id="setpaper-submit-paper" style="flex:1;min-height:44px;border:0;border-radius:14px;background:#003366;color:#fff;font-weight:700;font-size:13px;">Submit paper</button><button type="button" id="setpaper-submit-section" style="flex:1;min-height:44px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;color:#003366;font-weight:700;font-size:13px;">Submit section</button>';
    exam.appendChild(bar);
    document.getElementById("setpaper-submit-paper").onclick = function () { submitPaper(); };
    document.getElementById("setpaper-submit-section").onclick = function () { window.submitCurrentSection(true); };
  }

  var autoSent = false;
  function tickLock() {
    var bar = document.getElementById("setpaper-submit-bar");
    if (locked()) {
      if (bar) bar.style.display = "none";
      showLockNote();
      return;
    }
    if (bar) bar.style.display = "flex";
    var note = document.getElementById("setpaper-lock-note");
    if (note) note.style.display = "none";
    if (Number(window.__setpaperLockUntil || 0) > 0 && !autoSent) {
      autoSent = true;
      window.__setpaperLockUntil = 0;
      submitPaper();
    }
  }

  function bootLayout() {
    var timeEl = document.getElementById("setting-time");
    if (timeEl && window.examData) {
      var mins = 0;
      (window.examData.sections || []).forEach(function (s) { mins += Number(s.timeMinutes) || 0; });
      if (mins > 0) timeEl.value = String(Math.max(1, Math.round(mins)));
    }
    if (!window.__setpaperBooted && typeof window.startExam === "function" && document.getElementById("landing-page")) {
      window.__setpaperBooted = true;
      try { window.startExam(); } catch (err) {}
    }
    if (!window.__setpaperEmtWrap && typeof window.forceSubmit === "function") {
      window.__setpaperEmtWrap = true;
      var origForce = window.forceSubmit;
      window.forceSubmit = function () {
        if (locked()) {
          showLockNote();
          return;
        }
        try { origForce.apply(this, arguments); } catch (err) {}
        notifyHost("exam-complete", collectResults());
      };
    }
  }

  function install() {
    bootLayout();
    addSubmitBar();
    labelSubmit();
    tickLock();
    var tabs = document.getElementById("section-tabs");
    if (tabs && !tabs.__setpaperLabeled) {
      tabs.__setpaperLabeled = true;
      tabs.addEventListener("click", function () { setTimeout(labelSubmit, 0); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 400);
  setInterval(tickLock, 400);
})();
<\/script>`;
function withPaperHost(html) {
	const wired = wirePaperGlobals(html);
	if (wired.includes("window.__setpaperHost")) return wired;
	if (/<\/body>/i.test(wired)) return wired.replace(/<\/body>/i, PAPER_HOST_SCRIPT + "\n</body>");
	return wired + PAPER_HOST_SCRIPT;
}
var BUNDLED_TEMPLATE = tcs_ion_template_default;
async function resolveTemplateHtml(template) {
	if (!template || template.kind === "bundled") return tcs_ion_template_default;
	if (typeof indexedDB === "undefined") return tcs_ion_template_default;
	try {
		const stored = await getHtmlFile(templateHtmlId(template.id));
		if (stored?.html) return stored.html;
		const legacy = await getHtmlFile("template");
		if (legacy?.html) return legacy.html;
	} catch {}
	return tcs_ion_template_default;
}
function applyOptionOrder(questions, order) {
	if (order === "as-written") return questions;
	return questions.map((q) => {
		if (!q.options.length) return q;
		const idxs = q.options.map((_, i) => i);
		if (order === "reverse") idxs.reverse();
		else for (let i = idxs.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[idxs[i], idxs[j]] = [idxs[j], idxs[i]];
		}
		const options = idxs.map((i) => q.options[i]);
		let correct = q.correct;
		if (typeof correct === "number") {
			const mapped = idxs.indexOf(correct);
			correct = mapped >= 0 ? mapped : correct;
		} else if (Array.isArray(correct)) correct = correct.map((c) => idxs.indexOf(c)).filter((i) => i >= 0);
		return {
			...q,
			options,
			correct
		};
	});
}
function withPatternSettings(data, pattern) {
	const sections = data.sections.map((section, idx) => {
		let timeMinutes = section.timeMinutes;
		if (pattern.timerMode !== "off" && pattern.extraMinutes > 0 && idx === 0) timeMinutes += pattern.extraMinutes;
		return {
			...section,
			timeMinutes: Math.max(1, timeMinutes)
		};
	});
	return {
		...data,
		meta: {
			...data.meta,
			title: pattern.examTitle.trim() || data.meta.title,
			candidateName: pattern.candidateName.trim() || void 0,
			candidateId: pattern.candidateId.trim() || void 0
		},
		sections,
		settings: pattern
	};
}
function flattenForRaw(data) {
	const rows = [];
	for (const section of data.sections) for (const q of section.questions) rows.push({
		id: Number(q.id) || rows.length + 1,
		bankId: q.bankId,
		question_en: q.question,
		options_en: q.options,
		answerIndex: typeof q.correct === "number" ? q.correct : 0,
		solution: q.explanation || ""
	});
	return rows;
}
function safeJson(value) {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
function injectExamData(templateHtml, data) {
	const examJson = safeJson(data);
	if (templateHtml.includes("__EXAM_DATA__")) return withPaperHost(templateHtml.replace("__EXAM_DATA__", examJson));
	const examSpan = findAssignedValue(templateHtml, ["examData"]);
	if (examSpan && !examSpan.placeholder) return withPaperHost(templateHtml.slice(0, examSpan.start) + examJson + templateHtml.slice(examSpan.end));
	const rawSpan = findAssignedValue(templateHtml, [
		"raw_questions_data",
		"questions_data",
		"questions"
	]);
	if (rawSpan) {
		const rawJson = safeJson(flattenForRaw(data));
		let html = templateHtml.slice(0, rawSpan.start) + rawJson + templateHtml.slice(rawSpan.end);
		if (!/examData\s*=/.test(html)) html = html.replace(/<head[^>]*>/i, (tag) => `${tag}<script>var examData = window.examData = ${examJson};<\/script>`);
		return withPaperHost(html);
	}
	return withPaperHost(tcs_ion_template_default.replace("__EXAM_DATA__", examJson));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/anki-shell-JMkeXnRq.js
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("z-50 min-w-48 rounded-md border border-border bg-card p-1 text-card-foreground shadow-md", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5 text-sm outline-none select-none hover:bg-muted focus:bg-muted", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("my-1 h-px bg-border", className),
		...props
	});
}
var Sheet = Dialog$1;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, { className: "fixed inset-0 z-50 bg-black/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
		className: cn("fixed top-0 z-50 flex h-dvh w-[86%] max-w-xs flex-col border-r border-border bg-card text-card-foreground shadow-dock", side === "left" ? "left-0" : "right-0", className),
		...props,
		children
	})] });
}
function sectionOf(pathname) {
	if (pathname.startsWith("/notes")) return "notes";
	if (pathname.startsWith("/focus")) return "focus";
	if (pathname.startsWith("/coaching") || pathname.startsWith("/discuss")) return "coaching";
	if (pathname.startsWith("/target")) return "target";
	if (pathname.startsWith("/connect") || pathname.startsWith("/friends") || pathname.startsWith("/quiz") || pathname.startsWith("/chat")) return "connect";
	if (pathname === "/" || pathname.startsWith("/overview") || pathname.startsWith("/add") || pathname.startsWith("/options") || pathname.startsWith("/custom-study") || pathname.startsWith("/session") || pathname.startsWith("/mail") || pathname.startsWith("/desk")) return "tests";
	return "none";
}
function FocusMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "9",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "4.2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 7.2v3.1M12 13.7v3.1M9.4 10.2h5.2M10.1 13.8h3.8",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round"
			})
		]
	});
}
function SectionNav() {
	const current = sectionOf(useRouterState({ select: (s) => s.location.pathname }));
	const targetName = useExamStore((s) => s.prefs.targetExamName?.trim() || "Target Exam");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-bar-foreground/10 bg-bar text-bar-foreground shadow-dock",
		"aria-label": "Sections",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid h-20 max-w-xl grid-cols-6",
			children: [
				{
					to: "/",
					label: "Tests",
					icon: ClipboardList,
					match: "tests",
					gold: false
				},
				{
					to: "/notes",
					label: "Notes",
					icon: StickyNote,
					match: "notes",
					gold: false
				},
				{
					to: "/focus",
					label: "Focus",
					icon: FocusMark,
					match: "focus",
					gold: true
				},
				{
					to: "/connect",
					label: "Connect",
					icon: Radio,
					match: "connect",
					gold: false
				},
				{
					to: "/coaching",
					label: "Coaching",
					icon: GraduationCap,
					match: "coaching",
					gold: false
				},
				{
					to: "/target",
					label: targetName,
					icon: Target,
					match: "target",
					gold: false
				}
			].map((tab) => {
				const active = current === tab.match;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: tab.to,
					search: tab.to === "/notes" ? {
						view: "list",
						folder: ""
					} : tab.to === "/coaching" ? { view: "hub" } : tab.to === "/target" ? { game: "home" } : tab.to === "/focus" ? {
						view: "apps",
						id: "",
						range: "30d"
					} : void 0,
					"aria-current": active ? "page" : void 0,
					className: cn("flex min-h-20 flex-col items-center justify-center gap-1 px-0.5 text-center text-xs leading-tight", active ? "font-medium text-bar-foreground" : "text-bar-foreground/60", tab.gold && "font-semibold text-focus"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid size-8 place-items-center rounded-full", tab.gold && "focus-dock-mark", tab.gold && active && "is-on"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "size-5 shrink-0" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "line-clamp-2 w-full",
						children: tab.label
					})]
				}, tab.to);
			})
		})
	});
}
var MUTE_KEY = "setpaper-focus-sfx";
var ctx = null;
var master = null;
var bus = null;
var muted = readMuted();
function readMuted() {
	try {
		return localStorage.getItem(MUTE_KEY) === "off";
	} catch {
		return false;
	}
}
function unlockFocusSfx() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		bus = ctx.createGain();
		bus.gain.value = .55;
		master.gain.value = muted ? 0 : .72;
		bus.connect(master);
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
}
function tone(freq, dur, type, gain, at, slide) {
	if (!ctx || !bus || muted) return;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, at);
	if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), at + dur);
	g.gain.setValueAtTime(1e-4, at);
	g.gain.exponentialRampToValueAtTime(Math.max(2e-4, gain), at + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, at + dur);
	o.connect(g);
	g.connect(bus);
	o.start(at);
	o.stop(at + dur + .03);
}
function playFocusSfx(kind) {
	unlockFocusSfx();
	if (!ctx || muted) return;
	const t = ctx.currentTime;
	switch (kind) {
		case "tap":
			tone(620, .06, "triangle", .14, t);
			return;
		case "warn":
			tone(520, .12, "sine", .16, t);
			tone(520, .12, "sine", .12, t + .16);
			return;
		case "close":
			tone(392, .14, "sine", .18, t, 220);
			tone(330, .18, "triangle", .14, t + .12, 180);
			return;
		case "deny":
			tone(180, .16, "square", .08, t);
			return;
		case "unlock":
			tone(440, .08, "sine", .12, t);
			tone(660, .1, "sine", .14, t + .08);
			return;
	}
}
function speakFocusClose(name, waitMin) {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(`${name} is paused. Come back after ${waitMin} minutes.`);
		u.rate = 1;
		u.pitch = 1;
		window.speechSynthesis.speak(u);
	} catch {}
}
function FocusGuard() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const raw = useExamStore((s) => s.focus);
	const updateFocus = useExamStore((s) => s.updateFocus);
	const focus = mergeFocus(normalizeFocus(raw ?? defaultFocus()));
	const lastEvent = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		const applyTick = () => {
			const current = useExamStore.getState().focus;
			const { state, event } = tickFocus(mergeFocus(current ?? defaultFocus()), Date.now());
			if (event !== "none" || state.session?.lastTick !== current?.session?.lastTick || state.lastDayKey !== current?.lastDayKey) updateFocus(() => state);
			if (event === "warn" && lastEvent.current !== `warn-${state.session?.appId}`) {
				lastEvent.current = `warn-${state.session?.appId}`;
				const title = `${state.apps.find((a) => a.id === state.session?.appId)?.name ?? "App"} closes in 5 minutes`;
				toast.message(title);
				playFocusSfx("warn");
				if (state.settings.notifyBeforeClose) showFocusNotice("Focus", title);
			}
			if (event === "close" && lastEvent.current !== `close-${state.session?.appId}-${state.session?.waitUntil}`) {
				lastEvent.current = `close-${state.session?.appId}-${state.session?.waitUntil}`;
				const app = state.apps.find((a) => a.id === state.session?.appId);
				const wait = app ? Math.max(1, app.limits.waitMin) : 10;
				const title = `${app?.name ?? "App"} is paused for ${formatDurationMin(wait)}`;
				toast.message(title);
				playFocusSfx("close");
				showFocusNotice("Focus", title);
				if (state.settings.audioMessage && app) speakFocusClose(app.name, wait);
			}
			return state;
		};
		const id = window.setInterval(() => {
			const state = applyTick();
			if (state.settings.shieldOn || state.session && !state.session.waiting) holdWakeLock();
		}, 1e3);
		const onVisibility = () => {
			const next = applyTick();
			if (document.visibilityState === "hidden") {
				if (next.settings.shieldOn) {
					const away = startAway(next, Date.now());
					if (away !== next) updateFocus(() => away);
				}
			} else {
				holdWakeLock();
				if (next.session?.appId === "sp-device" && !next.session.waiting) updateFocus((f) => ({
					...f,
					session: null
				}));
			}
		};
		document.addEventListener("visibilitychange", onVisibility);
		holdWakeLock();
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVisibility);
			releaseWakeLock();
		};
	}, [updateFocus]);
	const session = focus.session;
	const sessionApp = session ? focus.apps.find((a) => a.id === session.appId) : void 0;
	const left = remainingMs(session);
	const skip = pathname.startsWith("/focus") || pathname.startsWith("/login") || pathname.startsWith("/auth");
	const routed = skip ? void 0 : setpaperAppForPath(pathname, focus.apps);
	const routeReason = routed ? whyBlocked(routed, focus) : "ok";
	const waiting = Boolean(session?.waiting);
	const armed = focus.settings.modeOn;
	const globalLock = armed && !skip && focus.settings.shieldOn && focus.settings.blockAllOn;
	const showLock = armed && (waiting || globalLock || !skip && routed && routeReason !== "ok");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [armed && session && !session.waiting && focus.settings.displayRemaining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 bg-focus px-3 py-2 text-sm font-semibold text-focus-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: sessionApp?.name ?? "Session"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "tabular-nums",
			children: [formatDurationMin(Math.max(1, Math.ceil(left / 6e4))), " left"]
		})]
	}) : null, showLock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "focus-lock",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "focus-lock-card grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold tracking-tight",
					children: "Locked on this device"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: waiting ? `${sessionApp?.name ?? "This app"} hit its off timer. Wait ${formatDurationMin(Math.max(1, Math.ceil(((session?.waitUntil ?? 0) - Date.now()) / 6e4)))} before opening it again.` : globalLock ? "Focus shield is locking every listed app in real time. Disarm it from Device access." : routed ? blockLabel(routeReason, routed, focus) : "Focus limits are on."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-focus text-focus-foreground hover:bg-focus/90",
					onClick: () => void navigate({
						to: "/focus",
						search: {
							view: "apps",
							id: "",
							range: "30d"
						}
					}),
					children: "Turn Focus off"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => void navigate({
						to: "/focus",
						search: {
							view: "access",
							id: "",
							range: "30d"
						}
					}),
					children: "Open Device access"
				})
			]
		})
	}) : null] });
}
function inferPattern(html, questionCount = 0) {
	const raw = extractExamDataObject(html);
	const fromSetting = examMinutesFromHtml(html);
	if (raw) try {
		const data = JSON.parse(raw);
		const sections = Array.isArray(data.sections) ? data.sections : [];
		if (sections.length) {
			const first = sections[0];
			const qCount = Array.isArray(first.questions) ? first.questions.length : 0;
			const mins = Number(first.timeMinutes) || fromSetting || 0;
			return {
				sectionSize: qCount >= 15 ? 20 : 10,
				minutesPerQuestion: qCount > 0 && mins > 0 ? Math.max(.5, Math.round(mins / qCount * 2) / 2) : 1
			};
		}
	} catch {}
	if (fromSetting && questionCount > 0) {
		const minutesPerQuestion = Math.max(.5, Math.round(fromSetting / questionCount * 2) / 2);
		return {
			sectionSize: questionCount >= 15 ? 20 : 10,
			minutesPerQuestion,
			timerMode: "overall"
		};
	}
	if (fromSetting) return {
		timerMode: "overall",
		extraMinutes: 0
	};
}
async function persistTemplateHtml(input) {
	const id = uid$1();
	const size = input.html.length;
	await saveHtmlFile({
		id: templateHtmlId(id),
		name: input.fileName,
		size,
		html: input.html,
		createdAt: Date.now()
	});
	useExamStore.getState().addTemplate({
		id,
		name: input.name,
		kind: "uploaded",
		fileName: input.fileName,
		size,
		bookmark: input.bookmark,
		pattern: input.pattern
	});
	return id;
}
async function replaceTemplateHtml(templateId, file, onProgress) {
	const sizeLabel = formatBytes(file.size);
	onProgress?.(`Reading ${file.name} · ${sizeLabel}…`);
	const html = await readHtmlFile(file, (pct) => {
		onProgress?.(`Reading ${file.name} · ${pct}%`);
	});
	const stripped = toTemplateHtml(html) ?? html;
	onProgress?.("Saving paper layout…");
	await saveHtmlFile({
		id: templateHtmlId(templateId),
		name: file.name,
		size: stripped.length,
		html: stripped,
		createdAt: Date.now()
	});
	const title = htmlTitle(html) || file.name.replace(/\.html?$/i, "").replace(/[_-]+/g, " ").trim() || "Exam template";
	const pattern = inferPattern(html);
	useExamStore.getState().updateTemplate(templateId, {
		kind: "uploaded",
		fileName: file.name,
		size: stripped.length,
		name: title
	});
	if (pattern) useExamStore.getState().updateTemplatePattern(templateId, pattern);
	return {
		title,
		sizeLabel: formatBytes(stripped.length)
	};
}
async function importHtmlTest(file, onProgress) {
	const sizeLabel = formatBytes(file.size);
	onProgress?.(`Reading ${file.name} · ${sizeLabel}…`);
	const html = await readHtmlFile(file, (pct) => {
		onProgress?.(`Reading ${file.name} · ${pct}%`);
	});
	onProgress?.(`Parsing ${file.name}…`);
	const parsed = parseQuestionText(html);
	const title = htmlTitle(html) || file.name.replace(/\.html?$/i, "").replace(/[_-]+/g, " ").trim() || "HTML test";
	const pattern = inferPattern(html, parsed.questions.length);
	const warnings = [...parsed.warnings, ...parsed.errors.filter((e) => parsed.questions.length > 0)];
	onProgress?.("Saving original paper and TCS iON templates…");
	const originalTemplateId = await persistTemplateHtml({
		html,
		fileName: file.name,
		title,
		bookmark: false,
		name: title,
		pattern
	});
	const tcsHtml = toTemplateHtml(html) ?? "<!DOCTYPE html>\n<html lang=\"hi\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TCS iON | Rock Mechanics, Supports &amp; Subsidence Practice Test (Overman/Sirdar)</title>\n    <script src=\"https://cdn.tailwindcss.com\"><\/script>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css\">\n    <style>\n        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Roboto+Mono:wght@400;500&amp;display=swap');\n        \n        :root {\n            --tcs-blue: #003366;\n            --tcs-light-blue: #0055A4;\n        }\n        \n        body {\n            font-family: 'Inter', system_ui, sans-serif;\n        }\n        \n        .tcs-header {\n            background: linear-gradient(to right, #003366, #0055A4);\n        }\n        \n        .question-palette {\n            scrollbar-width: thin;\n            scrollbar-color: #cbd5e1 #f8fafc;\n        }\n        \n        .palette-btn {\n            width: 38px;\n            height: 38px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-weight: 600;\n            font-size: 13px;\n            transition: all 0.2s ease;\n            border: 2px solid #e2e8f0;\n        }\n        \n        .palette-btn.not-visited { background: #fff; color: #64748b; }\n        .palette-btn.answered { background: #22c55e; color: white; border-color: #16a34a; }\n        .palette-btn.not-answered { background: #f97316; color: white; border-color: #ea580c; }\n        .palette-btn.marked { background: #a855f7; color: white; border-color: #9333ea; }\n        .palette-btn.answered-marked { \n            background: #22c55e; \n            color: white; \n            border: 3px solid #a855f7; \n            box-shadow: 0 0 0 2px #fff;\n        }\n        \n        .question-container {\n            min-height: 420px;\n        }\n        \n        .option-label {\n            transition: all 0.2s ease;\n        }\n        \n        .option-label:hover {\n            background-color: #f8fafc;\n        }\n        \n        .option-label.selected {\n            background-color: #dbeafe;\n            border-color: #3b82f6;\n        }\n        \n        .section-tab {\n            transition: all 0.3s ease;\n        }\n        \n        .nav-btn {\n            transition: all 0.2s ease;\n        }\n        \n        .nav-btn:hover {\n            transform: translateY(-1px);\n        }\n        \n        .tcs-shadow {\n            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n        }\n        \n        .exam-timer {\n            font-family: 'Roboto Mono', monospace;\n            font-weight: 600;\n            letter-spacing: 1px;\n        }\n        \n        .rule-badge {\n            font-size: 10px;\n            padding: 1px 7px;\n            border-radius: 10px;\n        }\n    </style>\n</head>\n<body class=\"bg-slate-100\">\n    \n    <!-- ============================================ -->\n    <!-- CANDIDATE INFORMATION FORM (TCS iON Style) -->\n    <!-- ============================================ -->\n    <div id=\"candidate-info-screen\" class=\"min-h-screen flex items-center justify-center bg-slate-100 p-4\">\n        <div class=\"w-full max-w-lg\">\n            \n            <!-- TCS Header -->\n            <div class=\"flex justify-center mb-6\">\n                <div class=\"flex items-center gap-x-3\">\n                    <div class=\"w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center shadow-lg\">\n                        <span class=\"text-white font-black text-3xl tracking-tighter\">TCS</span>\n                    </div>\n                    <div>\n                        <div class=\"font-bold text-3xl text-[#003366] tracking-tight\">iON</div>\n                        <div class=\"text-[10px] text-slate-500 -mt-1 tracking-[3px]\">EXAM PLATFORM</div>\n                    </div>\n                </div>\n            </div>\n\n            <!-- Test Info Card -->\n            <div class=\"bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden\">\n                \n                <!-- Header -->\n                <div class=\"bg-gradient-to-r from-[#003366] to-[#0055A4] px-8 py-5 text-white\">\n                    <div class=\"text-center\">\n                        <div class=\"text-xs tracking-[2px] text-blue-200 mb-1\">PRACTICE TEST</div>\n                        <div class=\"font-bold text-2xl\" id=\"start-paper-title\">Practice Test</div>\n                    </div>\n                </div>\n\n                <div class=\"p-8\">\n                    \n                    <!-- Instructions -->\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs text-slate-600\">\n                        <div class=\"flex gap-2\">\n                            <i class=\"fa-solid fa-info-circle text-[#003366] mt-0.5\"></i>\n                            <div>\n                                This test follows exact <span class=\"font-semibold\">TCS iON</span> exam pattern.<br>\n                                <span id=\"start-counts\">Sections • Questions • Section-wise Timer</span><br>\n                                <span class=\"text-[#003366] font-medium\"><span id=\"start-subtitle\" class=\"text-[#003366] font-medium\">Generated from your question bank</span>\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Candidate details -->\n                    <div id=\"candidate-fields\" class=\"grid gap-3 mb-6\">\n                        <div>\n                            <label for=\"candidate-name-input\" class=\"text-xs text-slate-500 mb-1 block\">Candidate name</label>\n                            <input id=\"candidate-name-input\" type=\"text\" placeholder=\"Your name\"\n                                   class=\"w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]\">\n                        </div>\n                        <div>\n                            <label for=\"candidate-id-input\" class=\"text-xs text-slate-500 mb-1 block\">Roll / ID</label>\n                            <input id=\"candidate-id-input\" type=\"text\" placeholder=\"Optional\"\n                                   class=\"w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]\">\n                        </div>\n                    </div>\n\n                    <!-- Start Button -->\n                    <button onclick=\"startTest()\"\n                            class=\"w-full py-4 bg-[#003366] hover:bg-[#002244] active:bg-black transition-all text-white font-bold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-x-3\">\n                        <span>START TEST</span>\n                        <i class=\"fa-solid fa-arrow-right\"></i>\n                    </button>\n\n                    <div class=\"text-center mt-4\">\n                        <div class=\"text-[10px] text-slate-500\" id=\"start-duration\">Total Duration will appear here</div>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"text-center mt-6 text-xs text-slate-500\" id=\"start-footer\">\n                SetPaper · template-generated practice paper\n            </div>\n        </div>\n    </div>\n\n    <!-- ============================================ -->\n    <!-- MAIN EXAM INTERFACE (Hidden initially) -->\n    <!-- ============================================ -->\n    <div id=\"exam-interface\" style=\"display: none;\">\n        \n        <!-- Top Header -->\n        <div class=\"tcs-header text-white shadow-lg\">\n        <div class=\"max-w-screen-2xl mx-auto\">\n            <div class=\"px-6 py-3 flex items-center justify-between\">\n                <div class=\"flex items-center gap-x-4\">\n                    <!-- TCS Logo -->\n                    <div class=\"flex items-center gap-x-2\">\n                        <div class=\"w-10 h-10 bg-white rounded flex items-center justify-center\">\n                            <span class=\"text-[#003366] font-black text-2xl tracking-tighter\">TCS</span>\n                        </div>\n                        <div>\n                            <span class=\"font-bold text-xl tracking-tight\">iON</span>\n                            <span class=\"text-xs font-medium tracking-[2px] block -mt-1\">EXAM PLATFORM</span>\n                        </div>\n                    </div>\n                    \n                    <div class=\"h-6 w-px bg-white/30\"></div>\n                    \n                    <div id=\"candidate-header\" class=\"hidden text-left\">\n                        <div id=\"header-candidate-name\" class=\"text-sm font-semibold leading-tight\"></div>\n                        <div id=\"header-candidate-id\" class=\"text-[10px] tracking-wide text-blue-100\"></div>\n                    </div>\n                </div>\n                \n                <div class=\"flex items-center gap-x-6\">\n                    <!-- Timer -->\n                    <div id=\"timer-wrap\" class=\"bg-white/10 backdrop-blur px-4 py-1.5 rounded-xl flex items-center gap-x-2 border border-white/20\">\n                        <i class=\"fa-solid fa-clock text-lg\"></i>\n                        <div>\n                            <div class=\"text-[10px] text-blue-200 tracking-wider\">TIME LEFT</div>\n                            <div id=\"timer-display\" \n                                 class=\"exam-timer text-2xl font-bold tabular-nums\">75:00</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"max-w-screen-2xl mx-auto px-4 pt-4 pb-8\">\n        \n        <!-- Section Tabs -->\n        <div class=\"flex items-center justify-between mb-3 px-1\">\n            <div class=\"flex items-center gap-x-1\" id=\"section-tabs\">\n                <!-- Populated by JS -->\n            </div>\n            \n            <div class=\"flex items-center gap-x-2 text-sm\">\n                <div class=\"px-3 py-1 bg-white rounded-lg shadow-sm flex items-center gap-x-2 text-xs\">\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-green-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Answered</span>\n                    </div>\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-orange-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Not Answered</span>\n                    </div>\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-purple-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Marked</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n        <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-4\">\n            \n            <!-- Question Area -->\n            <div id=\"question-column\" class=\"lg:col-span-8 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 overflow-hidden\">\n                \n                <!-- Question Header -->\n                <div class=\"px-6 py-3.5 bg-slate-50 border-b flex items-center justify-between\">\n                    <div class=\"flex items-center gap-x-3\">\n                        <div id=\"question-number-badge\"\n                             class=\"px-4 py-1 bg-[#003366] text-white text-sm font-bold rounded-xl flex items-center gap-x-2\">\n                            <span id=\"current-q-no\">Q1</span>\n                            <span id=\"current-section-name\" class=\"text-blue-200 text-xs font-normal\">Section 1</span>\n                        </div>\n                        \n                        <div id=\"question-type-badge\"\n                             class=\"px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center\">\n                            <!-- JS populated -->\n                        </div>\n                    </div>\n                    \n                    <div class=\"flex items-center gap-x-2\">\n                        <button id=\"mark-review-btn\" onclick=\"markForReview()\"\n                                class=\"px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors\">\n                            <i class=\"fa-solid fa-flag\"></i>\n                            <span>Mark for Review</span>\n                        </button>\n                        \n                        <button id=\"clear-response-btn\" onclick=\"clearResponse()\"\n                                class=\"px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors\">\n                            <i class=\"fa-solid fa-eraser\"></i>\n                            <span>Clear</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Question Content -->\n                <div class=\"p-6 question-container\" id=\"question-area\">\n                    <!-- Dynamically loaded by JS -->\n                </div>\n                \n                <!-- Navigation Footer -->\n                <div class=\"px-6 py-4 bg-slate-50 border-t flex items-center justify-between\">\n                    <button onclick=\"prevQuestion()\"\n                            class=\"nav-btn px-6 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40\"\n                            id=\"prev-btn\">\n                        <i class=\"fa-solid fa-arrow-left\"></i>\n                        <span>Previous</span>\n                    </button>\n                    \n                    <div class=\"flex items-center gap-x-2 text-xs text-slate-500\">\n                        <span id=\"progress-text\">1 of 25</span>\n                    </div>\n                    \n                    <button onclick=\"nextQuestion()\"\n                            class=\"nav-btn px-7 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl bg-[#003366] text-white hover:bg-[#002244]\"\n                            id=\"next-btn\">\n                        <span>Next</span>\n                        <i class=\"fa-solid fa-arrow-right\"></i>\n                    </button>\n                </div>\n            </div>\n            \n            <!-- Question Palette -->\n            <div id=\"palette-column\" class=\"lg:col-span-4 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 flex flex-col\">\n                <div class=\"px-5 py-3.5 border-b flex items-center justify-between bg-slate-50 rounded-t-2xl\">\n                    <div>\n                        <span class=\"font-bold text-slate-700\">Question Palette</span>\n                    </div>\n                    <div class=\"text-xs px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded font-mono\" id=\"palette-progress\">\n                        0/115\n                    </div>\n                </div>\n                \n                <div class=\"p-4 flex-1 overflow-auto question-palette\" style=\"max-height: 460px;\">\n                    <div id=\"palette-grid\" class=\"grid grid-cols-5 gap-2.5\">\n                        <!-- Populated dynamically by JS -->\n                    </div>\n                </div>\n                \n                <div class=\"p-4 border-t bg-slate-50 rounded-b-2xl\">\n                    <button id=\"submit-section-btn\" onclick=\"submitCurrentSection()\"\n                            class=\"w-full py-3 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center gap-x-2 shadow-sm\">\n                        <i class=\"fa-solid fa-check-double\"></i>\n                        <span>SUBMIT SECTION</span>\n                    </button>\n                </div>\n            </div>\n            \n        </div>\n        \n        <!-- Instructions Bar -->\n        <div class=\"mt-4 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs flex items-center gap-x-4 text-slate-600\">\n            <div class=\"flex items-center gap-x-1.5\">\n                <i class=\"fa-solid fa-info-circle text-blue-500\"></i>\n                <span class=\"font-medium\">Instructions:</span>\n            </div>\n            <div class=\"flex-1 text-[11px]\">\n                • Use <strong>Mark for Review</strong> for questions you want to revisit later &nbsp;•&nbsp; \n                Timer is section-wise &nbsp;•&nbsp; \n                You can navigate freely between questions\n            </div>\n        </div>\n        \n    </div>\n    \n    <!-- Final Summary Modal -->\n    <div id=\"summary-modal\" class=\"hidden fixed inset-0 bg-black/60 flex items-center justify-center z-50\">\n        <div class=\"bg-white w-full max-w-2xl mx-4 rounded-3xl overflow-hidden shadow-2xl\">\n            <div class=\"px-8 py-6 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white\">\n                <div class=\"flex justify-between items-center\">\n                    <div>\n                        <h3 class=\"text-2xl font-bold\">Test Summary</h3>\n                    </div>\n                    <i onclick=\"closeSummary()\" class=\"fa-solid fa-times text-2xl cursor-pointer hover:text-blue-200\"></i>\n                </div>\n            </div>\n            \n            <div class=\"p-8\">\n                <div class=\"grid grid-cols-3 gap-4 mb-6\">\n                    <!-- Row 1 -->\n                    <div onclick=\"showCategoryReview('attempted')\" class=\"bg-green-50 border border-green-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-green-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-check-double text-xs\"></i> ATTEMPTED\n                        </div>\n                        <div id=\"summary-attempted\" class=\"text-4xl font-black text-green-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-green-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('correct')\" class=\"bg-emerald-50 border border-emerald-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-emerald-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-check text-xs\"></i> CORRECT\n                        </div>\n                        <div id=\"summary-correct\" class=\"text-4xl font-black text-emerald-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-emerald-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('wrong')\" class=\"bg-red-50 border border-red-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-red-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-times text-xs\"></i> WRONG\n                        </div>\n                        <div id=\"summary-wrong\" class=\"text-4xl font-black text-red-600 mt-1\">0</div>\n                        <div class=\"text-[10px] text-red-600 mt-0.5\">Click to review</div>\n                    </div>\n                    \n                    <!-- Row 2 -->\n                    <div onclick=\"showCategoryReview('not-attempted')\" class=\"bg-orange-50 border border-orange-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-orange-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-question text-xs\"></i> NOT ATTEMPTED\n                        </div>\n                        <div id=\"summary-not-attempted\" class=\"text-4xl font-black text-orange-600 mt-1\">0</div>\n                        <div class=\"text-[10px] text-orange-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('marked')\" class=\"bg-purple-50 border border-purple-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-purple-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-flag text-xs\"></i> MARKED FOR REVIEW\n                        </div>\n                        <div id=\"summary-marked\" class=\"text-4xl font-black text-purple-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-purple-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('all')\" class=\"bg-slate-50 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-slate-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-list text-xs\"></i> TOTAL QUESTIONS\n                        </div>\n                        <div id=\"summary-total-questions\" class=\"text-4xl font-black text-slate-700 mt-1\">115</div>\n                        <div class=\"text-[10px] text-slate-600 mt-0.5\">Click to review</div>\n                    </div>\n                </div>\n                \n                <div class=\"bg-[#003366] text-white rounded-2xl p-4 mb-6 text-center\">\n                    <div class=\"text-xs tracking-[1px] text-blue-200\">YOUR SCORE</div>\n                    <div class=\"flex items-baseline justify-center gap-x-2\">\n                        <span id=\"summary-score\" class=\"text-5xl font-black\">0</span>\n                        <span class=\"text-2xl text-blue-200\">/ <span id=\"summary-max-score\">115</span></span>\n                    </div>\n                    <div id=\"summary-percentage\" class=\"text-sm text-blue-200 mt-0.5\">0% Accuracy</div>\n                </div>\n                \n                <div class=\"text-center\">\n                    <button onclick=\"restartTest()\"\n                            class=\"px-8 py-3 text-sm font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl mr-3\">\n                        <i class=\"fa-solid fa-redo mr-2\"></i> RESTART TEST\n                    </button>\n                    <button onclick=\"finishAndShowAnswers()\"\n                            class=\"px-8 py-3 text-sm font-bold bg-[#003366] hover:bg-[#002244] text-white rounded-2xl\">\n                        VIEW DETAILED ANSWERS &amp; EXPLANATIONS\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <script>\n        // ==================== DATA: Questions (total auto-detected in summary) ====================\n                const examData = __EXAM_DATA__;\n        const examSettings = Object.assign({\n            timerMode: \"section\",\n            extraMinutes: 0,\n            optionOrder: \"as-written\",\n            allowSectionSwitch: true,\n            showMarkForReview: true,\n            showClear: true,\n            showPalette: true,\n            showSubmitSection: true,\n            showTimer: true\n        }, (examData && examData.settings) || {});\n        // ==================== STATE MANAGEMENT ====================\n        function notifyHost(type, payload) {\n            try {\n                if (window.parent && window.parent !== window) {\n                    window.parent.postMessage({ source: \"setpaper-exam\", type: type, payload: payload }, \"*\");\n                }\n            } catch (err) {}\n        }\n        let currentSection = 0;\n        let currentQuestion = 0;\n        let userAnswers = {}; // {sectionIndex: {qIndex: answer}}\n        let markedForReview = {}; // {sectionIndex: {qIndex: true}}\n        let visited = {}; // {sectionIndex: {qIndex: true}}\n        let sectionTimers = {};\n        let timerInterval = null;\n        let testSubmitted = false;\n        let overallSeconds = 0;\n        \n        // Initialize state\n        function initState() {\n            examData.sections.forEach((section, sIdx) => {\n                userAnswers[sIdx] = {};\n                markedForReview[sIdx] = {};\n                visited[sIdx] = {};\n                sectionTimers[sIdx] = section.timeMinutes * 60;\n            });\n            overallSeconds = examData.sections.reduce((n, s) => n + (s.timeMinutes || 0) * 60, 0);\n        }\n\n        function applyPaperChrome() {\n            const markBtn = document.getElementById(\"mark-review-btn\");\n            const clearBtn = document.getElementById(\"clear-response-btn\");\n            const palette = document.getElementById(\"palette-column\");\n            const questionCol = document.getElementById(\"question-column\");\n            const submitBtn = document.getElementById(\"submit-section-btn\");\n            const timerWrap = document.getElementById(\"timer-wrap\");\n            if (markBtn) markBtn.style.display = examSettings.showMarkForReview ? \"\" : \"none\";\n            if (clearBtn) clearBtn.style.display = examSettings.showClear ? \"\" : \"none\";\n            if (submitBtn) submitBtn.style.display = examSettings.showSubmitSection ? \"\" : \"none\";\n            if (palette) palette.style.display = examSettings.showPalette ? \"\" : \"none\";\n            if (questionCol) {\n                questionCol.classList.remove(\"lg:col-span-8\", \"lg:col-span-12\");\n                questionCol.classList.add(examSettings.showPalette ? \"lg:col-span-8\" : \"lg:col-span-12\");\n            }\n            if (timerWrap) timerWrap.style.display = examSettings.showTimer && examSettings.timerMode !== \"off\" ? \"\" : \"none\";\n        }\n        \n        // ==================== TIMER ====================\n        function startSectionTimer() {\n            clearInterval(timerInterval);\n            const timerWrap = document.getElementById(\"timer-wrap\");\n            if (!examSettings.showTimer || examSettings.timerMode === \"off\") {\n                if (timerWrap) timerWrap.style.display = \"none\";\n                return;\n            }\n            if (timerWrap) timerWrap.style.display = \"\";\n\n            if (examSettings.timerMode === \"overall\") {\n                updateTimerDisplay(overallSeconds);\n                timerInterval = setInterval(() => {\n                    overallSeconds--;\n                    updateTimerDisplay(overallSeconds);\n                    if (overallSeconds <= 0) {\n                        clearInterval(timerInterval);\n                        alert(\"Time is over. Submitting the paper.\");\n                        showFinalSummary();\n                    }\n                }, 1000);\n                return;\n            }\n            \n            const timeLeft = sectionTimers[currentSection];\n            updateTimerDisplay(timeLeft);\n            \n            timerInterval = setInterval(() => {\n                sectionTimers[currentSection]--;\n                updateTimerDisplay(sectionTimers[currentSection]);\n                \n                if (sectionTimers[currentSection] <= 0) {\n                    clearInterval(timerInterval);\n                    alert(\"Section time is over! Submitting current section automatically.\");\n                    submitCurrentSection(true);\n                }\n            }, 1000);\n        }\n        \n        function updateTimerDisplay(seconds) {\n            const min = Math.floor(seconds / 60);\n            const sec = seconds % 60;\n            const display = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;\n            document.getElementById('timer-display').innerHTML = display;\n            \n            // Warning color\n            const timerEl = document.getElementById('timer-display');\n            if (seconds < 120) {\n                timerEl.classList.add('text-red-400');\n            } else {\n                timerEl.classList.remove('text-red-400');\n            }\n        }\n        \n        // ==================== RENDER SECTION TABS ====================\n        function renderSectionTabs() {\n            const container = document.getElementById('section-tabs');\n            container.innerHTML = '';\n            \n            examData.sections.forEach((section, idx) => {\n                const btn = document.createElement('button');\n                btn.className = `section-tab px-5 py-2 text-sm font-semibold rounded-2xl flex items-center gap-x-2 transition-all ${idx === currentSection ? \n                    'bg-[#003366] text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`;\n                \n                btn.innerHTML = `\n                    <span>${section.name}</span>\n                    <span class=\"text-xs px-1.5 py-0.5 rounded ${idx === currentSection ? 'bg-white/20' : 'bg-slate-100'}\">${section.questions.length}Q</span>\n                `;\n                \n                btn.onclick = () => {\n                    if (!examSettings.allowSectionSwitch) return;\n                    if (idx !== currentSection) {\n                        // Auto save current\n                        saveCurrentAnswer();\n                        currentSection = idx;\n                        currentQuestion = 0;\n                        renderCurrentQuestion();\n                        renderPalette();\n                        renderSectionTabs();\n                        if (examSettings.timerMode === \"section\") startSectionTimer();\n                    }\n                };\n                \n                container.appendChild(btn);\n            });\n        }\n        \n        // ==================== RENDER QUESTION ====================\n        function renderCurrentQuestion() {\n            const section = examData.sections[currentSection];\n            const q = section.questions[currentQuestion];\n            const qArea = document.getElementById('question-area');\n            \n            // Mark as visited\n            if (!visited[currentSection]) visited[currentSection] = {};\n            visited[currentSection][currentQuestion] = true;\n            \n            let html = `\n                <div class=\"mb-2 flex items-center gap-x-2\">\n                    <span class=\"rule-badge bg-slate-100 text-slate-600 font-mono\">${q.rule}</span>\n                </div>\n                <div class=\"text-lg font-semibold text-slate-800 leading-snug mb-5\">${q.question}</div>\n            `;\n            \n            if (q.type === \"mcq\") {\n                html += `<div class=\"space-y-2.5\">`;\n                q.options.forEach((opt, idx) => {\n                    const isSelected = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] === idx;\n                    html += `\n                        <label onclick=\"selectMCQ(${idx})\" \n                               class=\"option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer ${isSelected ? 'selected border-blue-500' : 'border-slate-200'}\">\n                            <div class=\"mt-0.5\">\n                                <input type=\"radio\" name=\"q${q.id}\" ${isSelected ? 'checked' : ''} class=\"accent-[#003366]\">\n                            </div>\n                            <div class=\"flex-1 text-[15px] text-slate-700\">${opt}</div>\n                        </label>\n                    `;\n                });\n                html += `</div>`;\n            } \n            else if (q.type === \"msq\") {\n                html += `<div class=\"text-xs text-orange-600 mb-2 font-medium\">⚡ Multiple answers can be correct</div>`;\n                html += `<div class=\"space-y-2.5\">`;\n                q.options.forEach((opt, idx) => {\n                    const selectedAnswers = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : [];\n                    const isSelected = selectedAnswers.includes(idx);\n                    html += `\n                        <label onclick=\"toggleMSQ(${idx})\" \n                               class=\"option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer ${isSelected ? 'selected border-blue-500' : 'border-slate-200'}\">\n                            <div class=\"mt-0.5\">\n                                <input type=\"checkbox\" ${isSelected ? 'checked' : ''} class=\"accent-[#003366]\">\n                            </div>\n                            <div class=\"flex-1 text-[15px] text-slate-700\">${opt}</div>\n                        </label>\n                    `;\n                });\n                html += `</div>`;\n            } \n            else if (q.type === \"numerical\") {\n                const currentVal = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : '';\n                html += `\n                    <div class=\"mt-2\">\n                        <div class=\"text-xs text-slate-500 mb-1.5\">Enter the number:</div>\n                        <input type=\"text\" id=\"numerical-input\" value=\"${currentVal}\" \n                               oninput=\"saveNumericalAnswer()\"\n                               class=\"w-full px-5 py-4 text-xl font-semibold border-2 border-slate-300 focus:border-[#003366] rounded-2xl outline-none\">\n                    </div>\n                `;\n            }\n            \n            qArea.innerHTML = html;\n            \n            // Update badges\n            document.getElementById('current-q-no').innerText = `Q${q.id}`;\n            document.getElementById('current-section-name').innerText = section.name;\n            \n            const typeBadge = document.getElementById('question-type-badge');\n            if (q.type === \"mcq\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-check-circle mr-1\"></i> Single Correct`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center`;\n            } else if (q.type === \"msq\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-tasks mr-1\"></i> Multiple Select`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 flex items-center`;\n            } else if (q.type === \"numerical\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-calculator mr-1\"></i> Numerical`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center`;\n            }\n            \n            // Progress\n            document.getElementById('progress-text').innerText = `${currentQuestion + 1} of ${section.questions.length}`;\n            \n            // Enable/disable nav buttons\n            document.getElementById('prev-btn').disabled = currentQuestion === 0;\n            document.getElementById('next-btn').innerHTML = currentQuestion === section.questions.length - 1 ? \n                `Finish Section <i class=\"fa-solid fa-check ml-2\"></i>` : `Next <i class=\"fa-solid fa-arrow-right ml-2\"></i>`;\n            \n            updatePalette();\n        }\n        \n        // ==================== ANSWER HANDLING ====================\n        function selectMCQ(optionIndex) {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            userAnswers[currentSection][currentQuestion] = optionIndex;\n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function toggleMSQ(optionIndex) {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            if (!userAnswers[currentSection][currentQuestion]) userAnswers[currentSection][currentQuestion] = [];\n            \n            let answers = userAnswers[currentSection][currentQuestion];\n            const idx = answers.indexOf(optionIndex);\n            \n            if (idx > -1) {\n                answers.splice(idx, 1);\n            } else {\n                answers.push(optionIndex);\n            }\n            \n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function saveNumericalAnswer() {\n            const input = document.getElementById('numerical-input');\n            if (!input) return;\n            \n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            userAnswers[currentSection][currentQuestion] = input.value.trim();\n            updatePalette();\n        }\n        \n        function saveCurrentAnswer() {\n            // For numerical, already saved on input\n            // MCQ/MSQ already saved on click\n        }\n        \n        function clearResponse() {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            delete userAnswers[currentSection][currentQuestion];\n            \n            if (markedForReview[currentSection]) {\n                delete markedForReview[currentSection][currentQuestion];\n            }\n            \n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function markForReview() {\n            if (!markedForReview[currentSection]) markedForReview[currentSection] = {};\n            markedForReview[currentSection][currentQuestion] = true;\n            updatePalette();\n            \n            // Visual feedback\n            const btns = document.querySelectorAll('.option-label');\n            btns.forEach(b => b.style.transition = 'all 0.1s');\n        }\n        \n        // ==================== PALETTE ====================\n        function updatePalette() {\n            const container = document.getElementById('palette-grid');\n            container.innerHTML = '';\n            \n            const section = examData.sections[currentSection];\n            const totalQ = section.questions.length;\n            \n            let answeredCount = 0;\n            \n            for (let i = 0; i < totalQ; i++) {\n                const btn = document.createElement('button');\n                btn.className = `palette-btn rounded-xl text-sm font-bold`;\n                \n                let status = 'not-visited';\n                let label = i + 1;\n                \n                const isAnswered = userAnswers[currentSection] && userAnswers[currentSection][i] !== undefined && \n                                   (Array.isArray(userAnswers[currentSection][i]) ? userAnswers[currentSection][i].length > 0 : true);\n                \n                const isMarked = markedForReview[currentSection] && markedForReview[currentSection][i];\n                const isVisited = visited[currentSection] && visited[currentSection][i];\n                \n                if (isAnswered && isMarked) {\n                    status = 'answered-marked';\n                } else if (isAnswered) {\n                    status = 'answered';\n                    answeredCount++;\n                } else if (isMarked) {\n                    status = 'marked';\n                } else if (isVisited) {\n                    status = 'not-answered';\n                }\n                \n                btn.classList.add(status);\n                btn.innerText = label;\n                \n                if (i === currentQuestion) {\n                    btn.style.boxShadow = '0 0 0 3px #003366';\n                    btn.style.transform = 'scale(1.05)';\n                }\n                \n                btn.onclick = () => {\n                    saveCurrentAnswer();\n                    currentQuestion = i;\n                    renderCurrentQuestion();\n                    updatePalette();\n                };\n                \n                container.appendChild(btn);\n            }\n            \n            // Update progress text\n            document.getElementById('palette-progress').innerText = `${answeredCount}/${totalQ}`;\n        }\n        \n        function renderPalette() {\n            updatePalette();\n        }\n        \n        // ==================== NAVIGATION ====================\n        function nextQuestion() {\n            saveCurrentAnswer();\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            \n            const section = examData.sections[currentSection];\n            if (!section) {\n                showFinalSummary();\n                return;\n            }\n            \n            if (currentQuestion < section.questions.length - 1) {\n                currentQuestion++;\n                renderCurrentQuestion();\n                updatePalette();\n            } else {\n                submitCurrentSection(true);\n            }\n        }\n        \n        function prevQuestion() {\n            saveCurrentAnswer();\n            if (currentQuestion > 0) {\n                currentQuestion--;\n                renderCurrentQuestion();\n                updatePalette();\n            }\n        }\n        \n        // ==================== SUBMIT SECTION ====================\n        function answersMatch(q, userAns) {\n            if (!q || userAns === undefined || userAns === null || userAns === \"\") return false;\n            if (q.type === \"mcq\") return userAns === q.correct;\n            if (q.type === \"msq\") {\n                const a = (Array.isArray(userAns) ? userAns : []).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });\n                const b = (Array.isArray(q.correct) ? q.correct : [q.correct]).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });\n                return JSON.stringify(a) === JSON.stringify(b);\n            }\n            if (q.type === \"numerical\") return String(userAns).trim() === String(q.correct).trim();\n            return false;\n        }\n\n        function submitPaper() {\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            showFinalSummary();\n        }\n\n        function submitCurrentSection(auto = false) {\n            clearInterval(timerInterval);\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            \n            const section = examData.sections[currentSection];\n            if (!section) {\n                showFinalSummary();\n                return;\n            }\n            \n            if (currentSection >= examData.sections.length - 1) {\n                showFinalSummary();\n                return;\n            }\n            \n            currentSection++;\n            currentQuestion = 0;\n            renderSectionTabs();\n            renderCurrentQuestion();\n            renderPalette();\n            startSectionTimer();\n            const btn = document.getElementById(\"submit-section-btn\");\n            if (btn) {\n                const label = btn.querySelector(\"span\");\n                if (label) label.textContent = currentSection >= examData.sections.length - 1 ? \"SUBMIT PAPER\" : \"SUBMIT SECTION\";\n            }\n        }\n        \n        // ==================== FINAL SUMMARY ====================\n        function showFinalSummary() {\n            testSubmitted = true;\n            clearInterval(timerInterval);\n            \n            let totalAnswered = 0;\n            let totalMarked = 0;\n            let totalQuestions = 0;\n            let correctCount = 0;\n            let wrongCount = 0;\n            \n            examData.sections.forEach((section, sIdx) => {\n                totalQuestions += section.questions.length;\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    \n                    if (userAns !== undefined) {\n                        const ans = userAns;\n                        if (Array.isArray(ans) ? ans.length > 0 : true) {\n                            totalAnswered++;\n                            \n                            let isCorrect = answersMatch(q, userAns);\n                            if (isCorrect) {\n                                correctCount++;\n                            } else {\n                                wrongCount++;\n                            }\n                        }\n                    }\n                    \n                    if (markedForReview[sIdx] && markedForReview[sIdx][qIdx]) totalMarked++;\n                });\n            });\n            \n            const notAttempted = totalQuestions - totalAnswered;\n            const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;\n            \n            try {\n            document.getElementById('summary-attempted').innerText = totalAnswered;\n            document.getElementById('summary-not-attempted').innerText = notAttempted;\n            document.getElementById('summary-marked').innerText = totalMarked;\n            document.getElementById('summary-correct').innerText = correctCount;\n            document.getElementById('summary-wrong').innerText = wrongCount;\n            document.getElementById('summary-score').innerText = correctCount;\n            document.getElementById('summary-percentage').innerText = `${percentage}% Accuracy`;\n            document.getElementById('summary-total-questions').innerText = totalQuestions;\n            document.getElementById('summary-max-score').innerText = totalQuestions;\n            } catch (err) {}\n            \n            \n            const itemResults = [];\n            examData.sections.forEach((section, sIdx) => {\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    let isAttempted = false;\n                    let isCorrect = false;\n                    if (userAns !== undefined) {\n                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {\n                            isAttempted = userAns !== \"\";\n                            isCorrect = answersMatch(q, userAns);\n                        }\n                    }\n                    const isMarked = !!(markedForReview[sIdx] && markedForReview[sIdx][qIdx]);\n                    itemResults.push({\n                        bankId: q.bankId || q.id,\n                        id: q.id,\n                        type: q.type,\n                        userAns: userAns === undefined ? null : userAns,\n                        isAttempted: isAttempted,\n                        isCorrect: isCorrect,\n                        isMarked: isMarked,\n                        sectionIdx: sIdx,\n                        qIdx: qIdx\n                    });\n                });\n            });\n            notifyHost(\"exam-complete\", {\n                attempted: totalAnswered,\n                correct: correctCount,\n                wrong: wrongCount,\n                notAttempted: notAttempted,\n                marked: totalMarked,\n                score: correctCount,\n                total: totalQuestions,\n                items: itemResults\n            });\n\n            try {\n                document.getElementById('summary-modal').classList.remove('hidden');\n                document.getElementById('summary-modal').classList.add('flex');\n            } catch (err) {}\n        }\n        \n        function closeSummary() {\n            document.getElementById('summary-modal').classList.remove('flex');\n            document.getElementById('summary-modal').classList.add('hidden');\n        }\n        \n        function finishAndShowAnswers() {\n            closeSummary();\n            showDetailedAnswers();\n        }\n        \n        function showDetailedAnswers() {\n            const container = document.createElement('div');\n            container.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4`;\n            \n            let html = `\n                <div class=\"bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col\">\n                    <div class=\"px-8 py-5 bg-[#003366] text-white flex justify-between items-center\">\n                        <div>\n                            <span class=\"font-bold text-xl\">Detailed Answers &amp; Explanations</span>\n                            <span class=\"ml-3 text-xs bg-white/20 px-3 py-1 rounded\">For Self-Assessment</span>\n                        </div>\n                        <button onclick=\"this.closest('.fixed').remove()\" class=\"text-white text-2xl hover:text-red-300\">×</button>\n                    </div>\n                    \n                    <div class=\"overflow-auto p-6 flex-1 bg-slate-50\" style=\"max-height: calc(92vh - 140px)\">\n            `;\n            \n            let qNo = 1;\n            examData.sections.forEach((section, sIdx) => {\n                html += `<div class=\"mb-8\"><div class=\"font-bold text-lg mb-3 text-[#003366] sticky top-0 bg-slate-50 py-1\">${section.name} — ${section.title}</div>`;\n                \n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    let isCorrect = false;\n                    \n                    if (q.type === \"mcq\" && userAns !== undefined) {\n                        isCorrect = userAns === q.correct;\n                    } else if (q.type === \"msq\" && Array.isArray(userAns)) {\n                        isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());\n                    } else if (q.type === \"numerical\" && userAns !== undefined) {\n                        isCorrect = userAns.toString().trim() === q.correct.toString();\n                    }\n                    \n                    const statusColor = isCorrect ? 'green' : (userAns !== undefined ? 'red' : 'slate');\n                    \n                    html += `\n                        <div class=\"mb-5 bg-white border border-slate-200 rounded-2xl p-5\">\n                            <div class=\"flex gap-x-3\">\n                                <div class=\"font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500\">${q.rule}</div>\n                                <div class=\"flex-1\">\n                                    <div class=\"font-semibold text-slate-800\">${qNo}. ${q.question}</div>\n                                    \n                                    <div class=\"mt-3 text-sm\">\n                    `;\n                    \n                    if (q.type === \"mcq\") {\n                        q.options.forEach((opt, idx) => {\n                            let cls = '';\n                            if (idx === q.correct) cls = 'text-green-700 font-semibold';\n                            if (userAns === idx && idx !== q.correct) cls = 'text-red-600 line-through';\n                            \n                            html += `<div class=\"flex items-center gap-x-2 py-0.5 ${cls}\">\n                                <span class=\"font-mono text-xs w-5\">${String.fromCharCode(65+idx)}.</span> \n                                <span>${opt}</span>\n                                ${idx === q.correct ? '<i class=\"fa-solid fa-check text-green-500 ml-1\"></i>' : ''}\n                            </div>`;\n                        });\n                    } else if (q.type === \"msq\") {\n                        q.options.forEach((opt, idx) => {\n                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);\n                            const isCorrectOpt = q.correct.includes(idx);\n                            \n                            let cls = '';\n                            if (isCorrectOpt) cls = 'text-green-700 font-semibold';\n                            if (userSelected && !isCorrectOpt) cls = 'text-red-600 line-through';\n                            \n                            html += `<div class=\"flex items-center gap-x-2 py-0.5 ${cls}\">\n                                <span class=\"font-mono text-xs w-5\">${String.fromCharCode(65+idx)}.</span> \n                                <span>${opt}</span>\n                                ${isCorrectOpt ? '<i class=\"fa-solid fa-check text-green-500 ml-1\"></i>' : ''}\n                            </div>`;\n                        });\n                    } else if (q.type === \"numerical\") {\n                        html += `<div class=\"mt-1\">\n                            <span class=\"text-xs text-slate-500\">Your Answer:</span> \n                            <span class=\"font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}\">${userAns || 'Not Answered'}</span><br>\n                            <span class=\"text-xs text-slate-500\">Correct Answer:</span> \n                            <span class=\"font-semibold text-green-700\">${q.correct}</span>\n                        </div>`;\n                    }\n                    \n                    html += `</div>\n                            <div class=\"mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600\">${q.explanation}</div>\n                        </div></div></div>`;\n                    \n                    qNo++;\n                });\n                \n                html += `</div>`;\n            });\n            \n            html += `</div></div>`;\n            container.innerHTML = html;\n            document.body.appendChild(container);\n        }\n        \n        // ==================== CATEGORY REVIEW (Clickable Summary Cards) ====================\n        function showCategoryReview(category) {\n            closeSummary();\n            \n            let filteredQuestions = [];\n            let categoryTitle = '';\n            let categoryIcon = '';\n            let categoryColor = 'slate';\n            \n            examData.sections.forEach((section, sIdx) => {\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    const isMarked = markedForReview[sIdx] && markedForReview[sIdx][qIdx];\n                    \n                    let isCorrect = false;\n                    let isAttempted = false;\n                    \n                    if (userAns !== undefined) {\n                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {\n                            isAttempted = true;\n                            \n                            if (q.type === \"mcq\") {\n                                isCorrect = userAns === q.correct;\n                            } else if (q.type === \"msq\" && Array.isArray(userAns)) {\n                                isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());\n                            } else if (q.type === \"numerical\") {\n                                isCorrect = userAns.toString().trim() === q.correct.toString();\n                            }\n                        }\n                    }\n                    \n                    let include = false;\n                    \n                    if (category === 'all') include = true;\n                    else if (category === 'correct' && isAttempted && isCorrect) include = true;\n                    else if (category === 'wrong' && isAttempted && !isCorrect) include = true;\n                    else if (category === 'attempted' && isAttempted) include = true;\n                    else if (category === 'not-attempted' && !isAttempted) include = true;\n                    else if (category === 'marked' && isMarked) include = true;\n                    \n                    if (include) {\n                        filteredQuestions.push({\n                            sectionIdx: sIdx,\n                            qIdx: qIdx,\n                            sectionName: section.name,\n                            sectionTitle: section.title,\n                            question: q,\n                            userAns: userAns,\n                            isCorrect: isCorrect,\n                            isMarked: isMarked\n                        });\n                    }\n                });\n            });\n            \n            // Set title based on category\n            if (category === 'all') {\n                categoryTitle = `All Questions (${filteredQuestions.length})`;\n                categoryIcon = 'fa-list-ul';\n                categoryColor = 'slate';\n            } else if (category === 'correct') {\n                categoryTitle = `Correct Answers (${filteredQuestions.length})`;\n                categoryIcon = 'fa-check-circle';\n                categoryColor = 'emerald';\n            } else if (category === 'wrong') {\n                categoryTitle = `Wrong Answers (${filteredQuestions.length})`;\n                categoryIcon = 'fa-times-circle';\n                categoryColor = 'red';\n            } else if (category === 'attempted') {\n                categoryTitle = `Attempted Questions (${filteredQuestions.length})`;\n                categoryIcon = 'fa-check-double';\n                categoryColor = 'green';\n            } else if (category === 'not-attempted') {\n                categoryTitle = `Not Attempted (${filteredQuestions.length})`;\n                categoryIcon = 'fa-question-circle';\n                categoryColor = 'orange';\n            } else if (category === 'marked') {\n                categoryTitle = `Marked for Review (${filteredQuestions.length})`;\n                categoryIcon = 'fa-flag';\n                categoryColor = 'purple';\n            }\n            \n            const container = document.createElement('div');\n            container.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4`;\n            \n            let html = `\n                <div class=\"bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col\">\n                    <div class=\"px-8 py-5 bg-[#003366] text-white flex justify-between items-center\">\n                        <div class=\"flex items-center gap-x-3\">\n                            <i class=\"fa-solid ${categoryIcon} text-2xl text-${categoryColor}-400\"></i>\n                            <div>\n                                <span class=\"font-bold text-xl\">${categoryTitle}</span>\n                                <span class=\"ml-3 text-xs bg-white/20 px-3 py-1 rounded\">Review Mode</span>\n                            </div>\n                        </div>\n                        <div class=\"flex items-center gap-x-2\">\n                            <button onclick=\"this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');\" \n                                    class=\"px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-x-2\">\n                                <i class=\"fa-solid fa-arrow-left\"></i> \n                                <span>Back to Summary</span>\n                            </button>\n                            <button onclick=\"this.closest('.fixed').remove()\" class=\"text-white text-3xl leading-none hover:text-red-300 px-2\">×</button>\n                        </div>\n                    </div>\n                    \n                    <div class=\"overflow-auto p-6 flex-1 bg-slate-50\" style=\"max-height: calc(92vh - 140px)\">\n            `;\n            \n            if (filteredQuestions.length === 0) {\n                html += `\n                    <div class=\"flex flex-col items-center justify-center py-16 text-center\">\n                        <i class=\"fa-solid ${categoryIcon} text-6xl text-slate-300 mb-4\"></i>\n                        <div class=\"text-xl font-semibold text-slate-600\">No questions in this category</div>\n                        <div class=\"text-sm text-slate-500 mt-1\">Great job! Keep practicing.</div>\n                    </div>\n                `;\n            } else {\n                filteredQuestions.forEach((item, index) => {\n                    const q = item.question;\n                    const userAns = item.userAns;\n                    const isCorrect = item.isCorrect;\n                    const qNoGlobal = (item.sectionIdx * 10) + (item.qIdx + 1); // Approximate global number\n                    \n                    html += `\n                        <div class=\"mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm\">\n                            <div class=\"flex items-start gap-x-3\">\n                                <div class=\"font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0 mt-0.5\">${q.rule}</div>\n                                <div class=\"flex-1 min-w-0\">\n                                    <div class=\"flex items-center gap-x-2 mb-1\">\n                                        <span class=\"font-bold text-slate-700\">Q${qNoGlobal}</span>\n                                        <span class=\"text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600\">${item.sectionName}</span>\n                                        ${item.isMarked ? '<span class=\"text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700\"><i class=\"fa-solid fa-flag mr-1\"></i>Marked</span>' : ''}\n                                    </div>\n                                    \n                                    <div class=\"font-semibold text-slate-800 mb-3\">${q.question}</div>\n                    `;\n                    \n                    // Options rendering (same logic as detailed answers)\n                    if (q.type === \"mcq\") {\n                        html += `<div class=\"space-y-1 text-sm\">`;\n                        q.options.forEach((opt, idx) => {\n                            let cls = 'text-slate-700';\n                            let icon = '';\n                            \n                            if (idx === q.correct) {\n                                cls = 'text-green-700 font-semibold';\n                                icon = '<i class=\"fa-solid fa-check text-green-500 ml-1.5\"></i>';\n                            }\n                            if (userAns === idx && idx !== q.correct) {\n                                cls = 'text-red-600 line-through';\n                            }\n                            \n                            html += `\n                                <div class=\"flex items-center gap-x-2 py-1 px-2 rounded ${cls}\">\n                                    <span class=\"font-mono text-xs w-5 flex-shrink-0\">${String.fromCharCode(65+idx)}.</span> \n                                    <span class=\"flex-1\">${opt}</span>\n                                    ${icon}\n                                </div>\n                            `;\n                        });\n                        html += `</div>`;\n                    } else if (q.type === \"msq\") {\n                        html += `<div class=\"space-y-1 text-sm\">`;\n                        q.options.forEach((opt, idx) => {\n                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);\n                            const isCorrectOpt = q.correct.includes(idx);\n                            \n                            let cls = 'text-slate-700';\n                            let icon = '';\n                            \n                            if (isCorrectOpt) {\n                                cls = 'text-green-700 font-semibold';\n                                icon = '<i class=\"fa-solid fa-check text-green-500 ml-1.5\"></i>';\n                            }\n                            if (userSelected && !isCorrectOpt) {\n                                cls = 'text-red-600 line-through';\n                            }\n                            \n                            html += `\n                                <div class=\"flex items-center gap-x-2 py-1 px-2 rounded ${cls}\">\n                                    <span class=\"font-mono text-xs w-5 flex-shrink-0\">${String.fromCharCode(65+idx)}.</span> \n                                    <span class=\"flex-1\">${opt}</span>\n                                    ${icon}\n                                </div>\n                            `;\n                        });\n                        html += `</div>`;\n                    } else if (q.type === \"numerical\") {\n                        html += `\n                            <div class=\"mt-2 p-3 bg-slate-50 rounded-xl text-sm\">\n                                <div><span class=\"text-xs text-slate-500\">Your Answer:</span> <span class=\"font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}\">${userAns || 'Not Answered'}</span></div>\n                                <div class=\"mt-1\"><span class=\"text-xs text-slate-500\">Correct Answer:</span> <span class=\"font-semibold text-green-700\">${q.correct}</span></div>\n                            </div>\n                        `;\n                    }\n                    \n                    html += `\n                                    <div class=\"mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600\">\n                                        ${q.explanation}\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    `;\n                });\n            }\n            \n            html += `\n                    </div>\n                    \n                    <div class=\"px-8 py-4 border-t bg-white flex justify-between items-center\">\n                        <div class=\"text-xs text-slate-500\">\n                            Click on any card in Summary to filter questions\n                        </div>\n                        <button onclick=\"this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');\"\n                                class=\"px-5 py-2 text-sm font-semibold bg-[#003366] text-white rounded-2xl flex items-center gap-x-2 hover:bg-[#002244]\">\n                            <i class=\"fa-solid fa-arrow-left\"></i>\n                            <span>Back to Summary</span>\n                        </button>\n                    </div>\n                </div>\n            `;\n            \n            container.innerHTML = html;\n            document.body.appendChild(container);\n        }\n        \n        function restartTest() {\n            if (confirm(\"क्या आप पूरा टेस्ट restart करना चाहते हैं? सारी progress मिट जाएगी।\")) {\n                location.reload();\n            }\n        }\n\n        // ==================== CANDIDATE INFO HANDLER ====================\n        function startTest() {\n            const nameInput = (document.getElementById(\"candidate-name-input\") || {}).value || (examData.meta && examData.meta.candidateName) || \"\";\n            const idInput = (document.getElementById(\"candidate-id-input\") || {}).value || (examData.meta && examData.meta.candidateId) || \"\";\n            const selectedLang = \"Hinglish\";\n\n            window.candidateName = nameInput;\n            window.candidateId = idInput;\n            window.selectedLanguage = selectedLang;\n\n            const header = document.getElementById(\"candidate-header\");\n            const headerName = document.getElementById(\"header-candidate-name\");\n            const headerId = document.getElementById(\"header-candidate-id\");\n            if (headerName) headerName.textContent = nameInput || \"Candidate\";\n            if (headerId) headerId.textContent = idInput || \"\";\n            if (header) header.classList.toggle(\"hidden\", !nameInput && !idInput);\n\n            document.getElementById('candidate-info-screen').style.display = 'none';\n            document.getElementById('exam-interface').style.display = 'block';\n\n            initializeExam();\n            notifyHost('exam-started', { sections: examData.sections.length, questions: examData.sections.reduce((n,s)=>n+s.questions.length,0) });\n\n            // Show simple start toast (no language badge since removed)\n            setTimeout(() => {\n                const startToast = document.createElement('div');\n                startToast.className = `fixed bottom-5 left-5 bg-white shadow-xl border px-4 py-2.5 rounded-2xl text-sm flex items-center gap-x-2 z-50`;\n                startToast.innerHTML = `\n                    <div class=\"text-[#003366]\"><i class=\"fa-solid fa-play\"></i></div>\n                    <div class=\"text-xs\">Test started successfully. Good luck!</div>\n                `;\n                document.body.appendChild(startToast);\n                setTimeout(() => startToast.remove(), 2200);\n            }, 800);\n        }\n        \n        // ==================== INITIALIZE ====================\n        function initializeExam() {\n            initState();\n            applyPaperChrome();\n            renderSectionTabs();\n            renderCurrentQuestion();\n            renderPalette();\n            startSectionTimer();\n            \n            // Keyboard shortcuts\n            document.addEventListener('keydown', function(e) {\n                if (testSubmitted) return;\n                \n                if (e.key === \"ArrowRight\") {\n                    nextQuestion();\n                } else if (e.key === \"ArrowLeft\") {\n                    prevQuestion();\n                } else if (e.key.toLowerCase() === \"m\") {\n                    if (examSettings.showMarkForReview) markForReview();\n                } else if (e.key.toLowerCase() === \"c\") {\n                    if (examSettings.showClear) clearResponse();\n                }\n            });\n            \n            // Welcome toast\n            setTimeout(() => {\n                const toast = document.createElement('div');\n                toast.className = `fixed bottom-5 right-5 bg-white shadow-xl border px-5 py-3 rounded-2xl text-sm flex items-center gap-x-3 z-40`;\n                toast.innerHTML = `\n                    <div class=\"text-emerald-600\"><i class=\"fa-solid fa-info-circle\"></i></div>\n                    <div class=\"text-xs\">Tip: Press <span class=\"font-mono bg-slate-100 px-1.5 rounded\">M</span> to Mark for Review &nbsp;•&nbsp; <span class=\"font-mono bg-slate-100 px-1.5 rounded\">C</span> to Clear</div>\n                `;\n                document.body.appendChild(toast);\n                setTimeout(() => toast.remove(), 4200);\n            }, 6500);\n            \n            console.log(\"%c[SetPaper] Paper ready.\", \"color:#64748b\");\n        }\n\n        function fillStartScreen() {\n            const totalQ = examData.sections.reduce(function (n, s) { return n + s.questions.length; }, 0);\n            const secs = examData.sections.length;\n            const mins = examData.sections.reduce(function (n, s) { return n + (s.timeMinutes || s.questions.length); }, 0);\n            const meta = examData.meta || {};\n            const titleEl = document.getElementById(\"start-paper-title\");\n            const countsEl = document.getElementById(\"start-counts\");\n            const subEl = document.getElementById(\"start-subtitle\");\n            const durEl = document.getElementById(\"start-duration\");\n            const footEl = document.getElementById(\"start-footer\");\n            const nameEl = document.getElementById(\"candidate-name-input\");\n            const idEl = document.getElementById(\"candidate-id-input\");\n            if (titleEl) titleEl.textContent = meta.title || \"Practice Test\";\n            const timerLabel = examSettings.timerMode === \"off\"\n                ? \"No timer\"\n                : examSettings.timerMode === \"overall\"\n                    ? \"One paper timer\"\n                    : \"Section-wise timer\";\n            if (countsEl) countsEl.textContent = secs + \" Sections • \" + totalQ + \" Questions • \" + timerLabel;\n            if (subEl) subEl.textContent = meta.subtitle || \"Generated from your question bank\";\n            if (durEl) durEl.textContent = examSettings.timerMode === \"off\"\n                ? secs + \" Sections · untimed\"\n                : \"Total Duration: ~\" + mins + \" Minutes | \" + secs + \" Sections\";\n            if (footEl) footEl.textContent = meta.footer || \"SetPaper · template-generated practice paper\";\n            if (nameEl && meta.candidateName) nameEl.value = meta.candidateName;\n            if (idEl && meta.candidateId) idEl.value = meta.candidateId;\n            const sumTotal = document.getElementById(\"summary-total-questions\");\n            const sumMax = document.getElementById(\"summary-max-score\");\n            if (sumTotal) sumTotal.textContent = String(totalQ);\n            if (sumMax) sumMax.textContent = String(totalQ);\n        }\n        fillStartScreen();\n        \n        // Boot - We call initializeExam manually after candidate form\n        // window.onload = initializeExam;   // Disabled - now called from startTest()\n    <\/script>\n    \n    </div> <!-- End of #exam-interface -->\n</body>\n</html>";
	const templateId = await persistTemplateHtml({
		html: tcsHtml,
		fileName: tcsHtml === "<!DOCTYPE html>\n<html lang=\"hi\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TCS iON | Rock Mechanics, Supports &amp; Subsidence Practice Test (Overman/Sirdar)</title>\n    <script src=\"https://cdn.tailwindcss.com\"><\/script>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css\">\n    <style>\n        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Roboto+Mono:wght@400;500&amp;display=swap');\n        \n        :root {\n            --tcs-blue: #003366;\n            --tcs-light-blue: #0055A4;\n        }\n        \n        body {\n            font-family: 'Inter', system_ui, sans-serif;\n        }\n        \n        .tcs-header {\n            background: linear-gradient(to right, #003366, #0055A4);\n        }\n        \n        .question-palette {\n            scrollbar-width: thin;\n            scrollbar-color: #cbd5e1 #f8fafc;\n        }\n        \n        .palette-btn {\n            width: 38px;\n            height: 38px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-weight: 600;\n            font-size: 13px;\n            transition: all 0.2s ease;\n            border: 2px solid #e2e8f0;\n        }\n        \n        .palette-btn.not-visited { background: #fff; color: #64748b; }\n        .palette-btn.answered { background: #22c55e; color: white; border-color: #16a34a; }\n        .palette-btn.not-answered { background: #f97316; color: white; border-color: #ea580c; }\n        .palette-btn.marked { background: #a855f7; color: white; border-color: #9333ea; }\n        .palette-btn.answered-marked { \n            background: #22c55e; \n            color: white; \n            border: 3px solid #a855f7; \n            box-shadow: 0 0 0 2px #fff;\n        }\n        \n        .question-container {\n            min-height: 420px;\n        }\n        \n        .option-label {\n            transition: all 0.2s ease;\n        }\n        \n        .option-label:hover {\n            background-color: #f8fafc;\n        }\n        \n        .option-label.selected {\n            background-color: #dbeafe;\n            border-color: #3b82f6;\n        }\n        \n        .section-tab {\n            transition: all 0.3s ease;\n        }\n        \n        .nav-btn {\n            transition: all 0.2s ease;\n        }\n        \n        .nav-btn:hover {\n            transform: translateY(-1px);\n        }\n        \n        .tcs-shadow {\n            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n        }\n        \n        .exam-timer {\n            font-family: 'Roboto Mono', monospace;\n            font-weight: 600;\n            letter-spacing: 1px;\n        }\n        \n        .rule-badge {\n            font-size: 10px;\n            padding: 1px 7px;\n            border-radius: 10px;\n        }\n    </style>\n</head>\n<body class=\"bg-slate-100\">\n    \n    <!-- ============================================ -->\n    <!-- CANDIDATE INFORMATION FORM (TCS iON Style) -->\n    <!-- ============================================ -->\n    <div id=\"candidate-info-screen\" class=\"min-h-screen flex items-center justify-center bg-slate-100 p-4\">\n        <div class=\"w-full max-w-lg\">\n            \n            <!-- TCS Header -->\n            <div class=\"flex justify-center mb-6\">\n                <div class=\"flex items-center gap-x-3\">\n                    <div class=\"w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center shadow-lg\">\n                        <span class=\"text-white font-black text-3xl tracking-tighter\">TCS</span>\n                    </div>\n                    <div>\n                        <div class=\"font-bold text-3xl text-[#003366] tracking-tight\">iON</div>\n                        <div class=\"text-[10px] text-slate-500 -mt-1 tracking-[3px]\">EXAM PLATFORM</div>\n                    </div>\n                </div>\n            </div>\n\n            <!-- Test Info Card -->\n            <div class=\"bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden\">\n                \n                <!-- Header -->\n                <div class=\"bg-gradient-to-r from-[#003366] to-[#0055A4] px-8 py-5 text-white\">\n                    <div class=\"text-center\">\n                        <div class=\"text-xs tracking-[2px] text-blue-200 mb-1\">PRACTICE TEST</div>\n                        <div class=\"font-bold text-2xl\" id=\"start-paper-title\">Practice Test</div>\n                    </div>\n                </div>\n\n                <div class=\"p-8\">\n                    \n                    <!-- Instructions -->\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs text-slate-600\">\n                        <div class=\"flex gap-2\">\n                            <i class=\"fa-solid fa-info-circle text-[#003366] mt-0.5\"></i>\n                            <div>\n                                This test follows exact <span class=\"font-semibold\">TCS iON</span> exam pattern.<br>\n                                <span id=\"start-counts\">Sections • Questions • Section-wise Timer</span><br>\n                                <span class=\"text-[#003366] font-medium\"><span id=\"start-subtitle\" class=\"text-[#003366] font-medium\">Generated from your question bank</span>\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Candidate details -->\n                    <div id=\"candidate-fields\" class=\"grid gap-3 mb-6\">\n                        <div>\n                            <label for=\"candidate-name-input\" class=\"text-xs text-slate-500 mb-1 block\">Candidate name</label>\n                            <input id=\"candidate-name-input\" type=\"text\" placeholder=\"Your name\"\n                                   class=\"w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]\">\n                        </div>\n                        <div>\n                            <label for=\"candidate-id-input\" class=\"text-xs text-slate-500 mb-1 block\">Roll / ID</label>\n                            <input id=\"candidate-id-input\" type=\"text\" placeholder=\"Optional\"\n                                   class=\"w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]\">\n                        </div>\n                    </div>\n\n                    <!-- Start Button -->\n                    <button onclick=\"startTest()\"\n                            class=\"w-full py-4 bg-[#003366] hover:bg-[#002244] active:bg-black transition-all text-white font-bold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-x-3\">\n                        <span>START TEST</span>\n                        <i class=\"fa-solid fa-arrow-right\"></i>\n                    </button>\n\n                    <div class=\"text-center mt-4\">\n                        <div class=\"text-[10px] text-slate-500\" id=\"start-duration\">Total Duration will appear here</div>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"text-center mt-6 text-xs text-slate-500\" id=\"start-footer\">\n                SetPaper · template-generated practice paper\n            </div>\n        </div>\n    </div>\n\n    <!-- ============================================ -->\n    <!-- MAIN EXAM INTERFACE (Hidden initially) -->\n    <!-- ============================================ -->\n    <div id=\"exam-interface\" style=\"display: none;\">\n        \n        <!-- Top Header -->\n        <div class=\"tcs-header text-white shadow-lg\">\n        <div class=\"max-w-screen-2xl mx-auto\">\n            <div class=\"px-6 py-3 flex items-center justify-between\">\n                <div class=\"flex items-center gap-x-4\">\n                    <!-- TCS Logo -->\n                    <div class=\"flex items-center gap-x-2\">\n                        <div class=\"w-10 h-10 bg-white rounded flex items-center justify-center\">\n                            <span class=\"text-[#003366] font-black text-2xl tracking-tighter\">TCS</span>\n                        </div>\n                        <div>\n                            <span class=\"font-bold text-xl tracking-tight\">iON</span>\n                            <span class=\"text-xs font-medium tracking-[2px] block -mt-1\">EXAM PLATFORM</span>\n                        </div>\n                    </div>\n                    \n                    <div class=\"h-6 w-px bg-white/30\"></div>\n                    \n                    <div id=\"candidate-header\" class=\"hidden text-left\">\n                        <div id=\"header-candidate-name\" class=\"text-sm font-semibold leading-tight\"></div>\n                        <div id=\"header-candidate-id\" class=\"text-[10px] tracking-wide text-blue-100\"></div>\n                    </div>\n                </div>\n                \n                <div class=\"flex items-center gap-x-6\">\n                    <!-- Timer -->\n                    <div id=\"timer-wrap\" class=\"bg-white/10 backdrop-blur px-4 py-1.5 rounded-xl flex items-center gap-x-2 border border-white/20\">\n                        <i class=\"fa-solid fa-clock text-lg\"></i>\n                        <div>\n                            <div class=\"text-[10px] text-blue-200 tracking-wider\">TIME LEFT</div>\n                            <div id=\"timer-display\" \n                                 class=\"exam-timer text-2xl font-bold tabular-nums\">75:00</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"max-w-screen-2xl mx-auto px-4 pt-4 pb-8\">\n        \n        <!-- Section Tabs -->\n        <div class=\"flex items-center justify-between mb-3 px-1\">\n            <div class=\"flex items-center gap-x-1\" id=\"section-tabs\">\n                <!-- Populated by JS -->\n            </div>\n            \n            <div class=\"flex items-center gap-x-2 text-sm\">\n                <div class=\"px-3 py-1 bg-white rounded-lg shadow-sm flex items-center gap-x-2 text-xs\">\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-green-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Answered</span>\n                    </div>\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-orange-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Not Answered</span>\n                    </div>\n                    <div class=\"flex items-center gap-x-1.5\">\n                        <div class=\"w-3 h-3 rounded-full bg-purple-500\"></div>\n                        <span class=\"font-medium text-slate-600\">Marked</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n        <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-4\">\n            \n            <!-- Question Area -->\n            <div id=\"question-column\" class=\"lg:col-span-8 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 overflow-hidden\">\n                \n                <!-- Question Header -->\n                <div class=\"px-6 py-3.5 bg-slate-50 border-b flex items-center justify-between\">\n                    <div class=\"flex items-center gap-x-3\">\n                        <div id=\"question-number-badge\"\n                             class=\"px-4 py-1 bg-[#003366] text-white text-sm font-bold rounded-xl flex items-center gap-x-2\">\n                            <span id=\"current-q-no\">Q1</span>\n                            <span id=\"current-section-name\" class=\"text-blue-200 text-xs font-normal\">Section 1</span>\n                        </div>\n                        \n                        <div id=\"question-type-badge\"\n                             class=\"px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center\">\n                            <!-- JS populated -->\n                        </div>\n                    </div>\n                    \n                    <div class=\"flex items-center gap-x-2\">\n                        <button id=\"mark-review-btn\" onclick=\"markForReview()\"\n                                class=\"px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors\">\n                            <i class=\"fa-solid fa-flag\"></i>\n                            <span>Mark for Review</span>\n                        </button>\n                        \n                        <button id=\"clear-response-btn\" onclick=\"clearResponse()\"\n                                class=\"px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors\">\n                            <i class=\"fa-solid fa-eraser\"></i>\n                            <span>Clear</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Question Content -->\n                <div class=\"p-6 question-container\" id=\"question-area\">\n                    <!-- Dynamically loaded by JS -->\n                </div>\n                \n                <!-- Navigation Footer -->\n                <div class=\"px-6 py-4 bg-slate-50 border-t flex items-center justify-between\">\n                    <button onclick=\"prevQuestion()\"\n                            class=\"nav-btn px-6 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40\"\n                            id=\"prev-btn\">\n                        <i class=\"fa-solid fa-arrow-left\"></i>\n                        <span>Previous</span>\n                    </button>\n                    \n                    <div class=\"flex items-center gap-x-2 text-xs text-slate-500\">\n                        <span id=\"progress-text\">1 of 25</span>\n                    </div>\n                    \n                    <button onclick=\"nextQuestion()\"\n                            class=\"nav-btn px-7 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl bg-[#003366] text-white hover:bg-[#002244]\"\n                            id=\"next-btn\">\n                        <span>Next</span>\n                        <i class=\"fa-solid fa-arrow-right\"></i>\n                    </button>\n                </div>\n            </div>\n            \n            <!-- Question Palette -->\n            <div id=\"palette-column\" class=\"lg:col-span-4 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 flex flex-col\">\n                <div class=\"px-5 py-3.5 border-b flex items-center justify-between bg-slate-50 rounded-t-2xl\">\n                    <div>\n                        <span class=\"font-bold text-slate-700\">Question Palette</span>\n                    </div>\n                    <div class=\"text-xs px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded font-mono\" id=\"palette-progress\">\n                        0/115\n                    </div>\n                </div>\n                \n                <div class=\"p-4 flex-1 overflow-auto question-palette\" style=\"max-height: 460px;\">\n                    <div id=\"palette-grid\" class=\"grid grid-cols-5 gap-2.5\">\n                        <!-- Populated dynamically by JS -->\n                    </div>\n                </div>\n                \n                <div class=\"p-4 border-t bg-slate-50 rounded-b-2xl\">\n                    <button id=\"submit-section-btn\" onclick=\"submitCurrentSection()\"\n                            class=\"w-full py-3 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center gap-x-2 shadow-sm\">\n                        <i class=\"fa-solid fa-check-double\"></i>\n                        <span>SUBMIT SECTION</span>\n                    </button>\n                </div>\n            </div>\n            \n        </div>\n        \n        <!-- Instructions Bar -->\n        <div class=\"mt-4 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs flex items-center gap-x-4 text-slate-600\">\n            <div class=\"flex items-center gap-x-1.5\">\n                <i class=\"fa-solid fa-info-circle text-blue-500\"></i>\n                <span class=\"font-medium\">Instructions:</span>\n            </div>\n            <div class=\"flex-1 text-[11px]\">\n                • Use <strong>Mark for Review</strong> for questions you want to revisit later &nbsp;•&nbsp; \n                Timer is section-wise &nbsp;•&nbsp; \n                You can navigate freely between questions\n            </div>\n        </div>\n        \n    </div>\n    \n    <!-- Final Summary Modal -->\n    <div id=\"summary-modal\" class=\"hidden fixed inset-0 bg-black/60 flex items-center justify-center z-50\">\n        <div class=\"bg-white w-full max-w-2xl mx-4 rounded-3xl overflow-hidden shadow-2xl\">\n            <div class=\"px-8 py-6 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white\">\n                <div class=\"flex justify-between items-center\">\n                    <div>\n                        <h3 class=\"text-2xl font-bold\">Test Summary</h3>\n                    </div>\n                    <i onclick=\"closeSummary()\" class=\"fa-solid fa-times text-2xl cursor-pointer hover:text-blue-200\"></i>\n                </div>\n            </div>\n            \n            <div class=\"p-8\">\n                <div class=\"grid grid-cols-3 gap-4 mb-6\">\n                    <!-- Row 1 -->\n                    <div onclick=\"showCategoryReview('attempted')\" class=\"bg-green-50 border border-green-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-green-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-check-double text-xs\"></i> ATTEMPTED\n                        </div>\n                        <div id=\"summary-attempted\" class=\"text-4xl font-black text-green-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-green-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('correct')\" class=\"bg-emerald-50 border border-emerald-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-emerald-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-check text-xs\"></i> CORRECT\n                        </div>\n                        <div id=\"summary-correct\" class=\"text-4xl font-black text-emerald-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-emerald-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('wrong')\" class=\"bg-red-50 border border-red-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-red-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-times text-xs\"></i> WRONG\n                        </div>\n                        <div id=\"summary-wrong\" class=\"text-4xl font-black text-red-600 mt-1\">0</div>\n                        <div class=\"text-[10px] text-red-600 mt-0.5\">Click to review</div>\n                    </div>\n                    \n                    <!-- Row 2 -->\n                    <div onclick=\"showCategoryReview('not-attempted')\" class=\"bg-orange-50 border border-orange-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-orange-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-question text-xs\"></i> NOT ATTEMPTED\n                        </div>\n                        <div id=\"summary-not-attempted\" class=\"text-4xl font-black text-orange-600 mt-1\">0</div>\n                        <div class=\"text-[10px] text-orange-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('marked')\" class=\"bg-purple-50 border border-purple-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-purple-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-flag text-xs\"></i> MARKED FOR REVIEW\n                        </div>\n                        <div id=\"summary-marked\" class=\"text-4xl font-black text-purple-700 mt-1\">0</div>\n                        <div class=\"text-[10px] text-purple-600 mt-0.5\">Click to review</div>\n                    </div>\n                    <div onclick=\"showCategoryReview('all')\" class=\"bg-slate-50 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all\">\n                        <div class=\"text-slate-600 text-xs font-semibold tracking-wider flex items-center gap-x-1\">\n                            <i class=\"fa-solid fa-list text-xs\"></i> TOTAL QUESTIONS\n                        </div>\n                        <div id=\"summary-total-questions\" class=\"text-4xl font-black text-slate-700 mt-1\">115</div>\n                        <div class=\"text-[10px] text-slate-600 mt-0.5\">Click to review</div>\n                    </div>\n                </div>\n                \n                <div class=\"bg-[#003366] text-white rounded-2xl p-4 mb-6 text-center\">\n                    <div class=\"text-xs tracking-[1px] text-blue-200\">YOUR SCORE</div>\n                    <div class=\"flex items-baseline justify-center gap-x-2\">\n                        <span id=\"summary-score\" class=\"text-5xl font-black\">0</span>\n                        <span class=\"text-2xl text-blue-200\">/ <span id=\"summary-max-score\">115</span></span>\n                    </div>\n                    <div id=\"summary-percentage\" class=\"text-sm text-blue-200 mt-0.5\">0% Accuracy</div>\n                </div>\n                \n                <div class=\"text-center\">\n                    <button onclick=\"restartTest()\"\n                            class=\"px-8 py-3 text-sm font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl mr-3\">\n                        <i class=\"fa-solid fa-redo mr-2\"></i> RESTART TEST\n                    </button>\n                    <button onclick=\"finishAndShowAnswers()\"\n                            class=\"px-8 py-3 text-sm font-bold bg-[#003366] hover:bg-[#002244] text-white rounded-2xl\">\n                        VIEW DETAILED ANSWERS &amp; EXPLANATIONS\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <script>\n        // ==================== DATA: Questions (total auto-detected in summary) ====================\n                const examData = __EXAM_DATA__;\n        const examSettings = Object.assign({\n            timerMode: \"section\",\n            extraMinutes: 0,\n            optionOrder: \"as-written\",\n            allowSectionSwitch: true,\n            showMarkForReview: true,\n            showClear: true,\n            showPalette: true,\n            showSubmitSection: true,\n            showTimer: true\n        }, (examData && examData.settings) || {});\n        // ==================== STATE MANAGEMENT ====================\n        function notifyHost(type, payload) {\n            try {\n                if (window.parent && window.parent !== window) {\n                    window.parent.postMessage({ source: \"setpaper-exam\", type: type, payload: payload }, \"*\");\n                }\n            } catch (err) {}\n        }\n        let currentSection = 0;\n        let currentQuestion = 0;\n        let userAnswers = {}; // {sectionIndex: {qIndex: answer}}\n        let markedForReview = {}; // {sectionIndex: {qIndex: true}}\n        let visited = {}; // {sectionIndex: {qIndex: true}}\n        let sectionTimers = {};\n        let timerInterval = null;\n        let testSubmitted = false;\n        let overallSeconds = 0;\n        \n        // Initialize state\n        function initState() {\n            examData.sections.forEach((section, sIdx) => {\n                userAnswers[sIdx] = {};\n                markedForReview[sIdx] = {};\n                visited[sIdx] = {};\n                sectionTimers[sIdx] = section.timeMinutes * 60;\n            });\n            overallSeconds = examData.sections.reduce((n, s) => n + (s.timeMinutes || 0) * 60, 0);\n        }\n\n        function applyPaperChrome() {\n            const markBtn = document.getElementById(\"mark-review-btn\");\n            const clearBtn = document.getElementById(\"clear-response-btn\");\n            const palette = document.getElementById(\"palette-column\");\n            const questionCol = document.getElementById(\"question-column\");\n            const submitBtn = document.getElementById(\"submit-section-btn\");\n            const timerWrap = document.getElementById(\"timer-wrap\");\n            if (markBtn) markBtn.style.display = examSettings.showMarkForReview ? \"\" : \"none\";\n            if (clearBtn) clearBtn.style.display = examSettings.showClear ? \"\" : \"none\";\n            if (submitBtn) submitBtn.style.display = examSettings.showSubmitSection ? \"\" : \"none\";\n            if (palette) palette.style.display = examSettings.showPalette ? \"\" : \"none\";\n            if (questionCol) {\n                questionCol.classList.remove(\"lg:col-span-8\", \"lg:col-span-12\");\n                questionCol.classList.add(examSettings.showPalette ? \"lg:col-span-8\" : \"lg:col-span-12\");\n            }\n            if (timerWrap) timerWrap.style.display = examSettings.showTimer && examSettings.timerMode !== \"off\" ? \"\" : \"none\";\n        }\n        \n        // ==================== TIMER ====================\n        function startSectionTimer() {\n            clearInterval(timerInterval);\n            const timerWrap = document.getElementById(\"timer-wrap\");\n            if (!examSettings.showTimer || examSettings.timerMode === \"off\") {\n                if (timerWrap) timerWrap.style.display = \"none\";\n                return;\n            }\n            if (timerWrap) timerWrap.style.display = \"\";\n\n            if (examSettings.timerMode === \"overall\") {\n                updateTimerDisplay(overallSeconds);\n                timerInterval = setInterval(() => {\n                    overallSeconds--;\n                    updateTimerDisplay(overallSeconds);\n                    if (overallSeconds <= 0) {\n                        clearInterval(timerInterval);\n                        alert(\"Time is over. Submitting the paper.\");\n                        showFinalSummary();\n                    }\n                }, 1000);\n                return;\n            }\n            \n            const timeLeft = sectionTimers[currentSection];\n            updateTimerDisplay(timeLeft);\n            \n            timerInterval = setInterval(() => {\n                sectionTimers[currentSection]--;\n                updateTimerDisplay(sectionTimers[currentSection]);\n                \n                if (sectionTimers[currentSection] <= 0) {\n                    clearInterval(timerInterval);\n                    alert(\"Section time is over! Submitting current section automatically.\");\n                    submitCurrentSection(true);\n                }\n            }, 1000);\n        }\n        \n        function updateTimerDisplay(seconds) {\n            const min = Math.floor(seconds / 60);\n            const sec = seconds % 60;\n            const display = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;\n            document.getElementById('timer-display').innerHTML = display;\n            \n            // Warning color\n            const timerEl = document.getElementById('timer-display');\n            if (seconds < 120) {\n                timerEl.classList.add('text-red-400');\n            } else {\n                timerEl.classList.remove('text-red-400');\n            }\n        }\n        \n        // ==================== RENDER SECTION TABS ====================\n        function renderSectionTabs() {\n            const container = document.getElementById('section-tabs');\n            container.innerHTML = '';\n            \n            examData.sections.forEach((section, idx) => {\n                const btn = document.createElement('button');\n                btn.className = `section-tab px-5 py-2 text-sm font-semibold rounded-2xl flex items-center gap-x-2 transition-all ${idx === currentSection ? \n                    'bg-[#003366] text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`;\n                \n                btn.innerHTML = `\n                    <span>${section.name}</span>\n                    <span class=\"text-xs px-1.5 py-0.5 rounded ${idx === currentSection ? 'bg-white/20' : 'bg-slate-100'}\">${section.questions.length}Q</span>\n                `;\n                \n                btn.onclick = () => {\n                    if (!examSettings.allowSectionSwitch) return;\n                    if (idx !== currentSection) {\n                        // Auto save current\n                        saveCurrentAnswer();\n                        currentSection = idx;\n                        currentQuestion = 0;\n                        renderCurrentQuestion();\n                        renderPalette();\n                        renderSectionTabs();\n                        if (examSettings.timerMode === \"section\") startSectionTimer();\n                    }\n                };\n                \n                container.appendChild(btn);\n            });\n        }\n        \n        // ==================== RENDER QUESTION ====================\n        function renderCurrentQuestion() {\n            const section = examData.sections[currentSection];\n            const q = section.questions[currentQuestion];\n            const qArea = document.getElementById('question-area');\n            \n            // Mark as visited\n            if (!visited[currentSection]) visited[currentSection] = {};\n            visited[currentSection][currentQuestion] = true;\n            \n            let html = `\n                <div class=\"mb-2 flex items-center gap-x-2\">\n                    <span class=\"rule-badge bg-slate-100 text-slate-600 font-mono\">${q.rule}</span>\n                </div>\n                <div class=\"text-lg font-semibold text-slate-800 leading-snug mb-5\">${q.question}</div>\n            `;\n            \n            if (q.type === \"mcq\") {\n                html += `<div class=\"space-y-2.5\">`;\n                q.options.forEach((opt, idx) => {\n                    const isSelected = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] === idx;\n                    html += `\n                        <label onclick=\"selectMCQ(${idx})\" \n                               class=\"option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer ${isSelected ? 'selected border-blue-500' : 'border-slate-200'}\">\n                            <div class=\"mt-0.5\">\n                                <input type=\"radio\" name=\"q${q.id}\" ${isSelected ? 'checked' : ''} class=\"accent-[#003366]\">\n                            </div>\n                            <div class=\"flex-1 text-[15px] text-slate-700\">${opt}</div>\n                        </label>\n                    `;\n                });\n                html += `</div>`;\n            } \n            else if (q.type === \"msq\") {\n                html += `<div class=\"text-xs text-orange-600 mb-2 font-medium\">⚡ Multiple answers can be correct</div>`;\n                html += `<div class=\"space-y-2.5\">`;\n                q.options.forEach((opt, idx) => {\n                    const selectedAnswers = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : [];\n                    const isSelected = selectedAnswers.includes(idx);\n                    html += `\n                        <label onclick=\"toggleMSQ(${idx})\" \n                               class=\"option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer ${isSelected ? 'selected border-blue-500' : 'border-slate-200'}\">\n                            <div class=\"mt-0.5\">\n                                <input type=\"checkbox\" ${isSelected ? 'checked' : ''} class=\"accent-[#003366]\">\n                            </div>\n                            <div class=\"flex-1 text-[15px] text-slate-700\">${opt}</div>\n                        </label>\n                    `;\n                });\n                html += `</div>`;\n            } \n            else if (q.type === \"numerical\") {\n                const currentVal = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : '';\n                html += `\n                    <div class=\"mt-2\">\n                        <div class=\"text-xs text-slate-500 mb-1.5\">Enter the number:</div>\n                        <input type=\"text\" id=\"numerical-input\" value=\"${currentVal}\" \n                               oninput=\"saveNumericalAnswer()\"\n                               class=\"w-full px-5 py-4 text-xl font-semibold border-2 border-slate-300 focus:border-[#003366] rounded-2xl outline-none\">\n                    </div>\n                `;\n            }\n            \n            qArea.innerHTML = html;\n            \n            // Update badges\n            document.getElementById('current-q-no').innerText = `Q${q.id}`;\n            document.getElementById('current-section-name').innerText = section.name;\n            \n            const typeBadge = document.getElementById('question-type-badge');\n            if (q.type === \"mcq\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-check-circle mr-1\"></i> Single Correct`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center`;\n            } else if (q.type === \"msq\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-tasks mr-1\"></i> Multiple Select`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 flex items-center`;\n            } else if (q.type === \"numerical\") {\n                typeBadge.innerHTML = `<i class=\"fa-solid fa-calculator mr-1\"></i> Numerical`;\n                typeBadge.className = `px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center`;\n            }\n            \n            // Progress\n            document.getElementById('progress-text').innerText = `${currentQuestion + 1} of ${section.questions.length}`;\n            \n            // Enable/disable nav buttons\n            document.getElementById('prev-btn').disabled = currentQuestion === 0;\n            document.getElementById('next-btn').innerHTML = currentQuestion === section.questions.length - 1 ? \n                `Finish Section <i class=\"fa-solid fa-check ml-2\"></i>` : `Next <i class=\"fa-solid fa-arrow-right ml-2\"></i>`;\n            \n            updatePalette();\n        }\n        \n        // ==================== ANSWER HANDLING ====================\n        function selectMCQ(optionIndex) {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            userAnswers[currentSection][currentQuestion] = optionIndex;\n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function toggleMSQ(optionIndex) {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            if (!userAnswers[currentSection][currentQuestion]) userAnswers[currentSection][currentQuestion] = [];\n            \n            let answers = userAnswers[currentSection][currentQuestion];\n            const idx = answers.indexOf(optionIndex);\n            \n            if (idx > -1) {\n                answers.splice(idx, 1);\n            } else {\n                answers.push(optionIndex);\n            }\n            \n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function saveNumericalAnswer() {\n            const input = document.getElementById('numerical-input');\n            if (!input) return;\n            \n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            userAnswers[currentSection][currentQuestion] = input.value.trim();\n            updatePalette();\n        }\n        \n        function saveCurrentAnswer() {\n            // For numerical, already saved on input\n            // MCQ/MSQ already saved on click\n        }\n        \n        function clearResponse() {\n            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};\n            delete userAnswers[currentSection][currentQuestion];\n            \n            if (markedForReview[currentSection]) {\n                delete markedForReview[currentSection][currentQuestion];\n            }\n            \n            renderCurrentQuestion();\n            updatePalette();\n        }\n        \n        function markForReview() {\n            if (!markedForReview[currentSection]) markedForReview[currentSection] = {};\n            markedForReview[currentSection][currentQuestion] = true;\n            updatePalette();\n            \n            // Visual feedback\n            const btns = document.querySelectorAll('.option-label');\n            btns.forEach(b => b.style.transition = 'all 0.1s');\n        }\n        \n        // ==================== PALETTE ====================\n        function updatePalette() {\n            const container = document.getElementById('palette-grid');\n            container.innerHTML = '';\n            \n            const section = examData.sections[currentSection];\n            const totalQ = section.questions.length;\n            \n            let answeredCount = 0;\n            \n            for (let i = 0; i < totalQ; i++) {\n                const btn = document.createElement('button');\n                btn.className = `palette-btn rounded-xl text-sm font-bold`;\n                \n                let status = 'not-visited';\n                let label = i + 1;\n                \n                const isAnswered = userAnswers[currentSection] && userAnswers[currentSection][i] !== undefined && \n                                   (Array.isArray(userAnswers[currentSection][i]) ? userAnswers[currentSection][i].length > 0 : true);\n                \n                const isMarked = markedForReview[currentSection] && markedForReview[currentSection][i];\n                const isVisited = visited[currentSection] && visited[currentSection][i];\n                \n                if (isAnswered && isMarked) {\n                    status = 'answered-marked';\n                } else if (isAnswered) {\n                    status = 'answered';\n                    answeredCount++;\n                } else if (isMarked) {\n                    status = 'marked';\n                } else if (isVisited) {\n                    status = 'not-answered';\n                }\n                \n                btn.classList.add(status);\n                btn.innerText = label;\n                \n                if (i === currentQuestion) {\n                    btn.style.boxShadow = '0 0 0 3px #003366';\n                    btn.style.transform = 'scale(1.05)';\n                }\n                \n                btn.onclick = () => {\n                    saveCurrentAnswer();\n                    currentQuestion = i;\n                    renderCurrentQuestion();\n                    updatePalette();\n                };\n                \n                container.appendChild(btn);\n            }\n            \n            // Update progress text\n            document.getElementById('palette-progress').innerText = `${answeredCount}/${totalQ}`;\n        }\n        \n        function renderPalette() {\n            updatePalette();\n        }\n        \n        // ==================== NAVIGATION ====================\n        function nextQuestion() {\n            saveCurrentAnswer();\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            \n            const section = examData.sections[currentSection];\n            if (!section) {\n                showFinalSummary();\n                return;\n            }\n            \n            if (currentQuestion < section.questions.length - 1) {\n                currentQuestion++;\n                renderCurrentQuestion();\n                updatePalette();\n            } else {\n                submitCurrentSection(true);\n            }\n        }\n        \n        function prevQuestion() {\n            saveCurrentAnswer();\n            if (currentQuestion > 0) {\n                currentQuestion--;\n                renderCurrentQuestion();\n                updatePalette();\n            }\n        }\n        \n        // ==================== SUBMIT SECTION ====================\n        function answersMatch(q, userAns) {\n            if (!q || userAns === undefined || userAns === null || userAns === \"\") return false;\n            if (q.type === \"mcq\") return userAns === q.correct;\n            if (q.type === \"msq\") {\n                const a = (Array.isArray(userAns) ? userAns : []).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });\n                const b = (Array.isArray(q.correct) ? q.correct : [q.correct]).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });\n                return JSON.stringify(a) === JSON.stringify(b);\n            }\n            if (q.type === \"numerical\") return String(userAns).trim() === String(q.correct).trim();\n            return false;\n        }\n\n        function submitPaper() {\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            showFinalSummary();\n        }\n\n        function submitCurrentSection(auto = false) {\n            clearInterval(timerInterval);\n            if (typeof saveNumericalAnswer === \"function\") saveNumericalAnswer();\n            \n            const section = examData.sections[currentSection];\n            if (!section) {\n                showFinalSummary();\n                return;\n            }\n            \n            if (currentSection >= examData.sections.length - 1) {\n                showFinalSummary();\n                return;\n            }\n            \n            currentSection++;\n            currentQuestion = 0;\n            renderSectionTabs();\n            renderCurrentQuestion();\n            renderPalette();\n            startSectionTimer();\n            const btn = document.getElementById(\"submit-section-btn\");\n            if (btn) {\n                const label = btn.querySelector(\"span\");\n                if (label) label.textContent = currentSection >= examData.sections.length - 1 ? \"SUBMIT PAPER\" : \"SUBMIT SECTION\";\n            }\n        }\n        \n        // ==================== FINAL SUMMARY ====================\n        function showFinalSummary() {\n            testSubmitted = true;\n            clearInterval(timerInterval);\n            \n            let totalAnswered = 0;\n            let totalMarked = 0;\n            let totalQuestions = 0;\n            let correctCount = 0;\n            let wrongCount = 0;\n            \n            examData.sections.forEach((section, sIdx) => {\n                totalQuestions += section.questions.length;\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    \n                    if (userAns !== undefined) {\n                        const ans = userAns;\n                        if (Array.isArray(ans) ? ans.length > 0 : true) {\n                            totalAnswered++;\n                            \n                            let isCorrect = answersMatch(q, userAns);\n                            if (isCorrect) {\n                                correctCount++;\n                            } else {\n                                wrongCount++;\n                            }\n                        }\n                    }\n                    \n                    if (markedForReview[sIdx] && markedForReview[sIdx][qIdx]) totalMarked++;\n                });\n            });\n            \n            const notAttempted = totalQuestions - totalAnswered;\n            const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;\n            \n            try {\n            document.getElementById('summary-attempted').innerText = totalAnswered;\n            document.getElementById('summary-not-attempted').innerText = notAttempted;\n            document.getElementById('summary-marked').innerText = totalMarked;\n            document.getElementById('summary-correct').innerText = correctCount;\n            document.getElementById('summary-wrong').innerText = wrongCount;\n            document.getElementById('summary-score').innerText = correctCount;\n            document.getElementById('summary-percentage').innerText = `${percentage}% Accuracy`;\n            document.getElementById('summary-total-questions').innerText = totalQuestions;\n            document.getElementById('summary-max-score').innerText = totalQuestions;\n            } catch (err) {}\n            \n            \n            const itemResults = [];\n            examData.sections.forEach((section, sIdx) => {\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    let isAttempted = false;\n                    let isCorrect = false;\n                    if (userAns !== undefined) {\n                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {\n                            isAttempted = userAns !== \"\";\n                            isCorrect = answersMatch(q, userAns);\n                        }\n                    }\n                    const isMarked = !!(markedForReview[sIdx] && markedForReview[sIdx][qIdx]);\n                    itemResults.push({\n                        bankId: q.bankId || q.id,\n                        id: q.id,\n                        type: q.type,\n                        userAns: userAns === undefined ? null : userAns,\n                        isAttempted: isAttempted,\n                        isCorrect: isCorrect,\n                        isMarked: isMarked,\n                        sectionIdx: sIdx,\n                        qIdx: qIdx\n                    });\n                });\n            });\n            notifyHost(\"exam-complete\", {\n                attempted: totalAnswered,\n                correct: correctCount,\n                wrong: wrongCount,\n                notAttempted: notAttempted,\n                marked: totalMarked,\n                score: correctCount,\n                total: totalQuestions,\n                items: itemResults\n            });\n\n            try {\n                document.getElementById('summary-modal').classList.remove('hidden');\n                document.getElementById('summary-modal').classList.add('flex');\n            } catch (err) {}\n        }\n        \n        function closeSummary() {\n            document.getElementById('summary-modal').classList.remove('flex');\n            document.getElementById('summary-modal').classList.add('hidden');\n        }\n        \n        function finishAndShowAnswers() {\n            closeSummary();\n            showDetailedAnswers();\n        }\n        \n        function showDetailedAnswers() {\n            const container = document.createElement('div');\n            container.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4`;\n            \n            let html = `\n                <div class=\"bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col\">\n                    <div class=\"px-8 py-5 bg-[#003366] text-white flex justify-between items-center\">\n                        <div>\n                            <span class=\"font-bold text-xl\">Detailed Answers &amp; Explanations</span>\n                            <span class=\"ml-3 text-xs bg-white/20 px-3 py-1 rounded\">For Self-Assessment</span>\n                        </div>\n                        <button onclick=\"this.closest('.fixed').remove()\" class=\"text-white text-2xl hover:text-red-300\">×</button>\n                    </div>\n                    \n                    <div class=\"overflow-auto p-6 flex-1 bg-slate-50\" style=\"max-height: calc(92vh - 140px)\">\n            `;\n            \n            let qNo = 1;\n            examData.sections.forEach((section, sIdx) => {\n                html += `<div class=\"mb-8\"><div class=\"font-bold text-lg mb-3 text-[#003366] sticky top-0 bg-slate-50 py-1\">${section.name} — ${section.title}</div>`;\n                \n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    let isCorrect = false;\n                    \n                    if (q.type === \"mcq\" && userAns !== undefined) {\n                        isCorrect = userAns === q.correct;\n                    } else if (q.type === \"msq\" && Array.isArray(userAns)) {\n                        isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());\n                    } else if (q.type === \"numerical\" && userAns !== undefined) {\n                        isCorrect = userAns.toString().trim() === q.correct.toString();\n                    }\n                    \n                    const statusColor = isCorrect ? 'green' : (userAns !== undefined ? 'red' : 'slate');\n                    \n                    html += `\n                        <div class=\"mb-5 bg-white border border-slate-200 rounded-2xl p-5\">\n                            <div class=\"flex gap-x-3\">\n                                <div class=\"font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500\">${q.rule}</div>\n                                <div class=\"flex-1\">\n                                    <div class=\"font-semibold text-slate-800\">${qNo}. ${q.question}</div>\n                                    \n                                    <div class=\"mt-3 text-sm\">\n                    `;\n                    \n                    if (q.type === \"mcq\") {\n                        q.options.forEach((opt, idx) => {\n                            let cls = '';\n                            if (idx === q.correct) cls = 'text-green-700 font-semibold';\n                            if (userAns === idx && idx !== q.correct) cls = 'text-red-600 line-through';\n                            \n                            html += `<div class=\"flex items-center gap-x-2 py-0.5 ${cls}\">\n                                <span class=\"font-mono text-xs w-5\">${String.fromCharCode(65+idx)}.</span> \n                                <span>${opt}</span>\n                                ${idx === q.correct ? '<i class=\"fa-solid fa-check text-green-500 ml-1\"></i>' : ''}\n                            </div>`;\n                        });\n                    } else if (q.type === \"msq\") {\n                        q.options.forEach((opt, idx) => {\n                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);\n                            const isCorrectOpt = q.correct.includes(idx);\n                            \n                            let cls = '';\n                            if (isCorrectOpt) cls = 'text-green-700 font-semibold';\n                            if (userSelected && !isCorrectOpt) cls = 'text-red-600 line-through';\n                            \n                            html += `<div class=\"flex items-center gap-x-2 py-0.5 ${cls}\">\n                                <span class=\"font-mono text-xs w-5\">${String.fromCharCode(65+idx)}.</span> \n                                <span>${opt}</span>\n                                ${isCorrectOpt ? '<i class=\"fa-solid fa-check text-green-500 ml-1\"></i>' : ''}\n                            </div>`;\n                        });\n                    } else if (q.type === \"numerical\") {\n                        html += `<div class=\"mt-1\">\n                            <span class=\"text-xs text-slate-500\">Your Answer:</span> \n                            <span class=\"font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}\">${userAns || 'Not Answered'}</span><br>\n                            <span class=\"text-xs text-slate-500\">Correct Answer:</span> \n                            <span class=\"font-semibold text-green-700\">${q.correct}</span>\n                        </div>`;\n                    }\n                    \n                    html += `</div>\n                            <div class=\"mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600\">${q.explanation}</div>\n                        </div></div></div>`;\n                    \n                    qNo++;\n                });\n                \n                html += `</div>`;\n            });\n            \n            html += `</div></div>`;\n            container.innerHTML = html;\n            document.body.appendChild(container);\n        }\n        \n        // ==================== CATEGORY REVIEW (Clickable Summary Cards) ====================\n        function showCategoryReview(category) {\n            closeSummary();\n            \n            let filteredQuestions = [];\n            let categoryTitle = '';\n            let categoryIcon = '';\n            let categoryColor = 'slate';\n            \n            examData.sections.forEach((section, sIdx) => {\n                section.questions.forEach((q, qIdx) => {\n                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;\n                    const isMarked = markedForReview[sIdx] && markedForReview[sIdx][qIdx];\n                    \n                    let isCorrect = false;\n                    let isAttempted = false;\n                    \n                    if (userAns !== undefined) {\n                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {\n                            isAttempted = true;\n                            \n                            if (q.type === \"mcq\") {\n                                isCorrect = userAns === q.correct;\n                            } else if (q.type === \"msq\" && Array.isArray(userAns)) {\n                                isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());\n                            } else if (q.type === \"numerical\") {\n                                isCorrect = userAns.toString().trim() === q.correct.toString();\n                            }\n                        }\n                    }\n                    \n                    let include = false;\n                    \n                    if (category === 'all') include = true;\n                    else if (category === 'correct' && isAttempted && isCorrect) include = true;\n                    else if (category === 'wrong' && isAttempted && !isCorrect) include = true;\n                    else if (category === 'attempted' && isAttempted) include = true;\n                    else if (category === 'not-attempted' && !isAttempted) include = true;\n                    else if (category === 'marked' && isMarked) include = true;\n                    \n                    if (include) {\n                        filteredQuestions.push({\n                            sectionIdx: sIdx,\n                            qIdx: qIdx,\n                            sectionName: section.name,\n                            sectionTitle: section.title,\n                            question: q,\n                            userAns: userAns,\n                            isCorrect: isCorrect,\n                            isMarked: isMarked\n                        });\n                    }\n                });\n            });\n            \n            // Set title based on category\n            if (category === 'all') {\n                categoryTitle = `All Questions (${filteredQuestions.length})`;\n                categoryIcon = 'fa-list-ul';\n                categoryColor = 'slate';\n            } else if (category === 'correct') {\n                categoryTitle = `Correct Answers (${filteredQuestions.length})`;\n                categoryIcon = 'fa-check-circle';\n                categoryColor = 'emerald';\n            } else if (category === 'wrong') {\n                categoryTitle = `Wrong Answers (${filteredQuestions.length})`;\n                categoryIcon = 'fa-times-circle';\n                categoryColor = 'red';\n            } else if (category === 'attempted') {\n                categoryTitle = `Attempted Questions (${filteredQuestions.length})`;\n                categoryIcon = 'fa-check-double';\n                categoryColor = 'green';\n            } else if (category === 'not-attempted') {\n                categoryTitle = `Not Attempted (${filteredQuestions.length})`;\n                categoryIcon = 'fa-question-circle';\n                categoryColor = 'orange';\n            } else if (category === 'marked') {\n                categoryTitle = `Marked for Review (${filteredQuestions.length})`;\n                categoryIcon = 'fa-flag';\n                categoryColor = 'purple';\n            }\n            \n            const container = document.createElement('div');\n            container.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4`;\n            \n            let html = `\n                <div class=\"bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col\">\n                    <div class=\"px-8 py-5 bg-[#003366] text-white flex justify-between items-center\">\n                        <div class=\"flex items-center gap-x-3\">\n                            <i class=\"fa-solid ${categoryIcon} text-2xl text-${categoryColor}-400\"></i>\n                            <div>\n                                <span class=\"font-bold text-xl\">${categoryTitle}</span>\n                                <span class=\"ml-3 text-xs bg-white/20 px-3 py-1 rounded\">Review Mode</span>\n                            </div>\n                        </div>\n                        <div class=\"flex items-center gap-x-2\">\n                            <button onclick=\"this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');\" \n                                    class=\"px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-x-2\">\n                                <i class=\"fa-solid fa-arrow-left\"></i> \n                                <span>Back to Summary</span>\n                            </button>\n                            <button onclick=\"this.closest('.fixed').remove()\" class=\"text-white text-3xl leading-none hover:text-red-300 px-2\">×</button>\n                        </div>\n                    </div>\n                    \n                    <div class=\"overflow-auto p-6 flex-1 bg-slate-50\" style=\"max-height: calc(92vh - 140px)\">\n            `;\n            \n            if (filteredQuestions.length === 0) {\n                html += `\n                    <div class=\"flex flex-col items-center justify-center py-16 text-center\">\n                        <i class=\"fa-solid ${categoryIcon} text-6xl text-slate-300 mb-4\"></i>\n                        <div class=\"text-xl font-semibold text-slate-600\">No questions in this category</div>\n                        <div class=\"text-sm text-slate-500 mt-1\">Great job! Keep practicing.</div>\n                    </div>\n                `;\n            } else {\n                filteredQuestions.forEach((item, index) => {\n                    const q = item.question;\n                    const userAns = item.userAns;\n                    const isCorrect = item.isCorrect;\n                    const qNoGlobal = (item.sectionIdx * 10) + (item.qIdx + 1); // Approximate global number\n                    \n                    html += `\n                        <div class=\"mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm\">\n                            <div class=\"flex items-start gap-x-3\">\n                                <div class=\"font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0 mt-0.5\">${q.rule}</div>\n                                <div class=\"flex-1 min-w-0\">\n                                    <div class=\"flex items-center gap-x-2 mb-1\">\n                                        <span class=\"font-bold text-slate-700\">Q${qNoGlobal}</span>\n                                        <span class=\"text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600\">${item.sectionName}</span>\n                                        ${item.isMarked ? '<span class=\"text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700\"><i class=\"fa-solid fa-flag mr-1\"></i>Marked</span>' : ''}\n                                    </div>\n                                    \n                                    <div class=\"font-semibold text-slate-800 mb-3\">${q.question}</div>\n                    `;\n                    \n                    // Options rendering (same logic as detailed answers)\n                    if (q.type === \"mcq\") {\n                        html += `<div class=\"space-y-1 text-sm\">`;\n                        q.options.forEach((opt, idx) => {\n                            let cls = 'text-slate-700';\n                            let icon = '';\n                            \n                            if (idx === q.correct) {\n                                cls = 'text-green-700 font-semibold';\n                                icon = '<i class=\"fa-solid fa-check text-green-500 ml-1.5\"></i>';\n                            }\n                            if (userAns === idx && idx !== q.correct) {\n                                cls = 'text-red-600 line-through';\n                            }\n                            \n                            html += `\n                                <div class=\"flex items-center gap-x-2 py-1 px-2 rounded ${cls}\">\n                                    <span class=\"font-mono text-xs w-5 flex-shrink-0\">${String.fromCharCode(65+idx)}.</span> \n                                    <span class=\"flex-1\">${opt}</span>\n                                    ${icon}\n                                </div>\n                            `;\n                        });\n                        html += `</div>`;\n                    } else if (q.type === \"msq\") {\n                        html += `<div class=\"space-y-1 text-sm\">`;\n                        q.options.forEach((opt, idx) => {\n                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);\n                            const isCorrectOpt = q.correct.includes(idx);\n                            \n                            let cls = 'text-slate-700';\n                            let icon = '';\n                            \n                            if (isCorrectOpt) {\n                                cls = 'text-green-700 font-semibold';\n                                icon = '<i class=\"fa-solid fa-check text-green-500 ml-1.5\"></i>';\n                            }\n                            if (userSelected && !isCorrectOpt) {\n                                cls = 'text-red-600 line-through';\n                            }\n                            \n                            html += `\n                                <div class=\"flex items-center gap-x-2 py-1 px-2 rounded ${cls}\">\n                                    <span class=\"font-mono text-xs w-5 flex-shrink-0\">${String.fromCharCode(65+idx)}.</span> \n                                    <span class=\"flex-1\">${opt}</span>\n                                    ${icon}\n                                </div>\n                            `;\n                        });\n                        html += `</div>`;\n                    } else if (q.type === \"numerical\") {\n                        html += `\n                            <div class=\"mt-2 p-3 bg-slate-50 rounded-xl text-sm\">\n                                <div><span class=\"text-xs text-slate-500\">Your Answer:</span> <span class=\"font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}\">${userAns || 'Not Answered'}</span></div>\n                                <div class=\"mt-1\"><span class=\"text-xs text-slate-500\">Correct Answer:</span> <span class=\"font-semibold text-green-700\">${q.correct}</span></div>\n                            </div>\n                        `;\n                    }\n                    \n                    html += `\n                                    <div class=\"mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600\">\n                                        ${q.explanation}\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    `;\n                });\n            }\n            \n            html += `\n                    </div>\n                    \n                    <div class=\"px-8 py-4 border-t bg-white flex justify-between items-center\">\n                        <div class=\"text-xs text-slate-500\">\n                            Click on any card in Summary to filter questions\n                        </div>\n                        <button onclick=\"this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');\"\n                                class=\"px-5 py-2 text-sm font-semibold bg-[#003366] text-white rounded-2xl flex items-center gap-x-2 hover:bg-[#002244]\">\n                            <i class=\"fa-solid fa-arrow-left\"></i>\n                            <span>Back to Summary</span>\n                        </button>\n                    </div>\n                </div>\n            `;\n            \n            container.innerHTML = html;\n            document.body.appendChild(container);\n        }\n        \n        function restartTest() {\n            if (confirm(\"क्या आप पूरा टेस्ट restart करना चाहते हैं? सारी progress मिट जाएगी।\")) {\n                location.reload();\n            }\n        }\n\n        // ==================== CANDIDATE INFO HANDLER ====================\n        function startTest() {\n            const nameInput = (document.getElementById(\"candidate-name-input\") || {}).value || (examData.meta && examData.meta.candidateName) || \"\";\n            const idInput = (document.getElementById(\"candidate-id-input\") || {}).value || (examData.meta && examData.meta.candidateId) || \"\";\n            const selectedLang = \"Hinglish\";\n\n            window.candidateName = nameInput;\n            window.candidateId = idInput;\n            window.selectedLanguage = selectedLang;\n\n            const header = document.getElementById(\"candidate-header\");\n            const headerName = document.getElementById(\"header-candidate-name\");\n            const headerId = document.getElementById(\"header-candidate-id\");\n            if (headerName) headerName.textContent = nameInput || \"Candidate\";\n            if (headerId) headerId.textContent = idInput || \"\";\n            if (header) header.classList.toggle(\"hidden\", !nameInput && !idInput);\n\n            document.getElementById('candidate-info-screen').style.display = 'none';\n            document.getElementById('exam-interface').style.display = 'block';\n\n            initializeExam();\n            notifyHost('exam-started', { sections: examData.sections.length, questions: examData.sections.reduce((n,s)=>n+s.questions.length,0) });\n\n            // Show simple start toast (no language badge since removed)\n            setTimeout(() => {\n                const startToast = document.createElement('div');\n                startToast.className = `fixed bottom-5 left-5 bg-white shadow-xl border px-4 py-2.5 rounded-2xl text-sm flex items-center gap-x-2 z-50`;\n                startToast.innerHTML = `\n                    <div class=\"text-[#003366]\"><i class=\"fa-solid fa-play\"></i></div>\n                    <div class=\"text-xs\">Test started successfully. Good luck!</div>\n                `;\n                document.body.appendChild(startToast);\n                setTimeout(() => startToast.remove(), 2200);\n            }, 800);\n        }\n        \n        // ==================== INITIALIZE ====================\n        function initializeExam() {\n            initState();\n            applyPaperChrome();\n            renderSectionTabs();\n            renderCurrentQuestion();\n            renderPalette();\n            startSectionTimer();\n            \n            // Keyboard shortcuts\n            document.addEventListener('keydown', function(e) {\n                if (testSubmitted) return;\n                \n                if (e.key === \"ArrowRight\") {\n                    nextQuestion();\n                } else if (e.key === \"ArrowLeft\") {\n                    prevQuestion();\n                } else if (e.key.toLowerCase() === \"m\") {\n                    if (examSettings.showMarkForReview) markForReview();\n                } else if (e.key.toLowerCase() === \"c\") {\n                    if (examSettings.showClear) clearResponse();\n                }\n            });\n            \n            // Welcome toast\n            setTimeout(() => {\n                const toast = document.createElement('div');\n                toast.className = `fixed bottom-5 right-5 bg-white shadow-xl border px-5 py-3 rounded-2xl text-sm flex items-center gap-x-3 z-40`;\n                toast.innerHTML = `\n                    <div class=\"text-emerald-600\"><i class=\"fa-solid fa-info-circle\"></i></div>\n                    <div class=\"text-xs\">Tip: Press <span class=\"font-mono bg-slate-100 px-1.5 rounded\">M</span> to Mark for Review &nbsp;•&nbsp; <span class=\"font-mono bg-slate-100 px-1.5 rounded\">C</span> to Clear</div>\n                `;\n                document.body.appendChild(toast);\n                setTimeout(() => toast.remove(), 4200);\n            }, 6500);\n            \n            console.log(\"%c[SetPaper] Paper ready.\", \"color:#64748b\");\n        }\n\n        function fillStartScreen() {\n            const totalQ = examData.sections.reduce(function (n, s) { return n + s.questions.length; }, 0);\n            const secs = examData.sections.length;\n            const mins = examData.sections.reduce(function (n, s) { return n + (s.timeMinutes || s.questions.length); }, 0);\n            const meta = examData.meta || {};\n            const titleEl = document.getElementById(\"start-paper-title\");\n            const countsEl = document.getElementById(\"start-counts\");\n            const subEl = document.getElementById(\"start-subtitle\");\n            const durEl = document.getElementById(\"start-duration\");\n            const footEl = document.getElementById(\"start-footer\");\n            const nameEl = document.getElementById(\"candidate-name-input\");\n            const idEl = document.getElementById(\"candidate-id-input\");\n            if (titleEl) titleEl.textContent = meta.title || \"Practice Test\";\n            const timerLabel = examSettings.timerMode === \"off\"\n                ? \"No timer\"\n                : examSettings.timerMode === \"overall\"\n                    ? \"One paper timer\"\n                    : \"Section-wise timer\";\n            if (countsEl) countsEl.textContent = secs + \" Sections • \" + totalQ + \" Questions • \" + timerLabel;\n            if (subEl) subEl.textContent = meta.subtitle || \"Generated from your question bank\";\n            if (durEl) durEl.textContent = examSettings.timerMode === \"off\"\n                ? secs + \" Sections · untimed\"\n                : \"Total Duration: ~\" + mins + \" Minutes | \" + secs + \" Sections\";\n            if (footEl) footEl.textContent = meta.footer || \"SetPaper · template-generated practice paper\";\n            if (nameEl && meta.candidateName) nameEl.value = meta.candidateName;\n            if (idEl && meta.candidateId) idEl.value = meta.candidateId;\n            const sumTotal = document.getElementById(\"summary-total-questions\");\n            const sumMax = document.getElementById(\"summary-max-score\");\n            if (sumTotal) sumTotal.textContent = String(totalQ);\n            if (sumMax) sumMax.textContent = String(totalQ);\n        }\n        fillStartScreen();\n        \n        // Boot - We call initializeExam manually after candidate form\n        // window.onload = initializeExam;   // Disabled - now called from startTest()\n    <\/script>\n    \n    </div> <!-- End of #exam-interface -->\n</body>\n</html>" ? "tcs-ion-template.html" : file.name,
		title,
		bookmark: true,
		name: `${title} · TCS iON`,
		pattern
	});
	if (parsed.questions.length === 0) return {
		deckId: null,
		title,
		questions: 0,
		template: true,
		templateId,
		originalTemplateId,
		sizeLabel,
		warnings: parsed.errors
	};
	const deckId = useExamStore.getState().createDeck(title, `Uploaded ${file.name} · ${sizeLabel}`);
	useExamStore.getState().addCards(deckId, parsed.questions);
	return {
		deckId,
		title,
		questions: parsed.questions.length,
		template: true,
		templateId,
		originalTemplateId,
		sizeLabel,
		warnings
	};
}
function AnkiShell({ title = "SetPaper", children, onUndo, immersive = false, hideHeader = false }) {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const prefs = useExamStore((s) => s.prefs);
	useExamStore((s) => s.hydrated);
	const markHydrated = useExamStore((s) => s.markHydrated);
	const seedSampleIfEmpty = useExamStore((s) => s.seedSampleIfEmpty);
	const undo = useExamStore((s) => s.undo);
	const resetCollection = useExamStore((s) => s.resetCollection);
	const cards = useExamStore((s) => s.cards);
	const decks = useExamStore((s) => s.decks);
	const configs = useExamStore((s) => s.configs);
	const prefsAll = useExamStore((s) => s.prefs);
	const notes = useExamStore((s) => s.notes);
	const folders = useExamStore((s) => s.folders);
	const links = useExamStore((s) => s.links);
	const templates = useExamStore((s) => s.templates);
	const coaching = useExamStore((s) => s.coaching);
	const journey = useExamStore((s) => s.journey);
	const path = useExamStore((s) => s.path);
	const focus = useExamStore((s) => s.focus);
	const ludo = useExamStore((s) => s.ludo);
	const { user, isPending } = useCurrentUserState();
	const syncing = useSyncUi((s) => s.syncing);
	(0, import_react.useEffect)(() => {
		const unsub = useExamStore.persist.onFinishHydration(() => {
			markHydrated();
			seedSampleIfEmpty();
		});
		if (useExamStore.persist.hasHydrated()) {
			markHydrated();
			seedSampleIfEmpty();
		}
		return unsub;
	}, [markHydrated, seedSampleIfEmpty]);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", prefs.theme === "dark");
	}, [prefs.theme]);
	function exportCollection() {
		const blob = new Blob([JSON.stringify({
			decks,
			cards,
			configs,
			prefs: prefsAll,
			notes,
			folders,
			links,
			templates,
			coaching,
			journey,
			path,
			focus,
			ludo
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "setpaper-collection.json";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Collection exported");
	}
	async function onSyncClick() {
		if (syncing || isPending) return;
		if (!user) {
			navigate({
				to: "/login",
				search: {
					mode: "signup",
					via: "email"
				}
			});
			return;
		}
		try {
			toastOutcome(await syncNow(), user.primaryEmail ?? "your account");
		} catch {
			toast.error("Could not sync. Try again.");
		}
	}
	const nav = [
		{
			to: "/",
			label: "Tests",
			icon: ClipboardList
		},
		{
			to: "/notes",
			label: "Notes",
			icon: StickyNote
		},
		{
			to: "/focus",
			label: "Focus",
			icon: FocusMark
		},
		{
			to: "/connect",
			label: "Connect",
			icon: Radio
		},
		{
			to: "/coaching",
			label: "Coaching",
			icon: GraduationCap
		},
		{
			to: "/target",
			label: prefs.targetExamName?.trim() || "Target Exam",
			icon: Target
		},
		{
			to: "/browser",
			label: "Card browser",
			icon: Search
		},
		{
			to: "/stats",
			label: "Statistics",
			icon: ChartColumn
		},
		{
			to: "/settings",
			label: "Settings",
			icon: Settings
		},
		{
			to: "/templates",
			label: "Exam templates",
			icon: BookMarked
		},
		{
			to: "/mail",
			label: "Mail",
			icon: Inbox
		},
		{
			to: "/desk",
			label: "Desk",
			icon: Monitor
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-canvas relative min-h-dvh text-foreground",
		children: [
			hideHeader ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("z-30 flex h-14 items-center gap-1 border-b border-bar-foreground/10 px-1 text-bar-foreground shadow-dock", immersive ? "absolute inset-x-0 top-0 bg-bar/80 backdrop-blur-md" : "sticky top-0 bg-bar"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "text-bar-foreground hover:bg-bar-foreground/10",
						onClick: () => setOpen(true),
						"aria-label": "Menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "min-w-0 flex-1 truncate px-1 text-xl font-semibold tracking-tight",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "icon",
						className: "relative text-bar-foreground hover:bg-bar-foreground/10",
						"aria-label": "Account",
						disabled: syncing,
						onClick: () => void onSyncClick(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn(syncing && "animate-spin") }), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2 right-2 size-1.5 rounded-full bg-review" }) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "text-bar-foreground hover:bg-bar-foreground/10",
							"aria-label": "More",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, {})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => {
									(onUndo ?? undo)();
									toast.success("Undo");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" }), " Undo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => {
									if (user) onSyncClick();
									else navigate({
										to: "/login",
										search: {
											mode: "signup",
											via: "email"
										}
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }),
									" ",
									user ? "Sync account" : "Create account / sign in"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => {
									const empty = cards.filter((c) => !c.question.trim()).length;
									const short = cards.filter((c) => c.type !== "numerical" && c.options.length < 2).length;
									toast.success(`Check database: ${cards.length} questions, ${empty} empty, ${short} missing options`);
								},
								children: "Check database"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => toast.message("Media check skipped — questions are text-only"),
								children: "Check media"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => {
									const input = document.createElement("input");
									input.type = "file";
									input.accept = ".html,.htm,text/html";
									input.onchange = () => {
										const file = input.files?.[0];
										if (!file) return;
										const toastId = toast.loading(`Reading ${file.name}…`);
										importHtmlTest(file, (hint) => toast.loading(hint, { id: toastId })).then((result) => {
											toast.dismiss(toastId);
											if (result.template && result.questions) toast.success(`${result.questions} questions from ${result.title}. Saved two templates: original paper and TCS iON.`);
											else if (result.questions) toast.success(`${result.questions} questions from ${result.title} (${result.sizeLabel})`);
											else if (result.template) toast.success(`Saved two templates (${result.sizeLabel}): original paper and TCS iON.`);
											if (result.deckId) navigate({
												to: "/overview/$deckId",
												params: { deckId: result.deckId }
											});
										}).catch((err) => {
											toast.dismiss(toastId);
											toast.error(err instanceof Error ? err.message : "Could not read this HTML file");
										});
									};
									input.click();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), " Import HTML test"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => {
									const input = document.createElement("input");
									input.type = "file";
									input.accept = "application/json";
									input.onchange = () => {
										const file = input.files?.[0];
										if (!file) return;
										file.text().then((t) => {
											try {
												useExamStore.getState().importPayload(JSON.parse(t));
												toast.success("Imported");
											} catch {
												toast.error("Invalid collection file");
											}
										});
									};
									input.click();
								},
								children: "Import collection"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: exportCollection,
								children: "Export collection"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => {
									resetCollection();
									toast.success("Restored sample collection");
								},
								children: "Restore from backup"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => void navigate({ to: "/settings" }),
								children: "Settings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => toast.message("Help: Tests for papers, Notes to study, Focus for timers, Connect for live tests, Coaching for classes, Target Exam for the daily path."),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" }), " Help"]
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bar px-5 py-8 text-bar-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: "SetPaper"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-bar-foreground/70",
						children: "Tests · Notes · Focus · Connect · Coaching · Target"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "py-2",
					children: nav.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							search: item.to === "/notes" ? {
								view: "list",
								folder: ""
							} : item.to === "/browser" ? { deck: "" } : item.to === "/coaching" ? { view: "hub" } : item.to === "/target" ? { game: "home" } : item.to === "/focus" ? {
								view: "apps",
								id: "",
								range: "30d"
							} : item.to === "/mail" ? {
								from: "tests",
								label: "",
								message: "",
								connector: "Gmail"
							} : item.to === "/desk" ? {
								folder: "",
								from: "tests"
							} : void 0,
							onClick: () => setOpen(false),
							className: cn("flex h-12 items-center gap-4 px-5 text-sm", active ? "bg-primary/10 font-medium text-primary" : "text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
						}, item.to);
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: cn("relative z-10", immersive ? "" : "pb-32"),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusGuard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionNav, {})
		]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-1QDP4b_8.js
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out", className),
		...props
	});
}
function DialogContent({ className, children, showClose = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-raised", className),
		...props,
		children: [children, showClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		}) : null]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/switch-cong2Sib.js
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border-2 border-transparent bg-muted data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 rounded-full bg-card shadow-xs transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" })
	});
}
//#endregion
export { persistBrowserFile as $, formatAccountLabel as A, Label as B, injectExamData as C, connectAccount as D, withPatternSettings as E, syncNow as F, createSsrRpc as G, Button as H, toastOutcome as I, descendantFolderIds as J, deckCounts as K, useCurrentUser as L, pushCurrentCollection as M, rememberedEmail as N, didCollectionChange as O, restoreFromCloud as P, getNoteFile as Q, useCurrentUserState as R, applyOptionOrder as S, resolveTemplateHtml as T, activeExamTemplate as U, Input as V, cn as W, folderDepth as X, ensureDaily as Y, forecast as Z, importHtmlTest as _, DialogDescription as a, formatBytes as at, unlockFocusSfx as b, AnkiShell as c, readHtmlFile as ct, DropdownMenuItem as d, studyCards as et, DropdownMenuSeparator as f, SheetContent as g, Sheet as h, DialogContent as i, deleteHtmlFile as it, isApplyingRemote as j, digitsFromPhoneEmail as k, DropdownMenu as l, saveHtmlFile as lt, FocusMark as m, Switch as n, useExamStore as nt, DialogHeader as o, getHtmlFile as ot, DropdownMenuTrigger as p, deleteNoteFile as q, Dialog as r, copyHtmlFile as rt, DialogTitle as s, html_store_exports as st, router_exports as t, uid$1 as tt, DropdownMenuContent as u, templateHtmlId as ut, playFocusSfx as v, parseQuestionText as w, BUNDLED_TEMPLATE as x, replaceTemplateHtml as y, useSyncUi as z };
