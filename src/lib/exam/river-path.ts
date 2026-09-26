/** Shared geometry for the Target Exam river. SVG space 360×940 maps to a 3D XZ valley. */
export const RIVER_VB = { w: 360, h: 940 };
export const WORLD_SCALE = 0.12;

export const RIVER_PATH =
  "M 180 48 C 62 96, 44 156, 86 208 S 318 268, 286 332 S 48 404, 82 468 S 322 538, 278 604 S 50 678, 96 742 S 210 804, 180 848";

export const ROCKS: Array<{ cx: number; cy: number; rx: number; ry: number; rotate: number }> = [
  { cx: 262, cy: 168, rx: 28, ry: 18, rotate: -18 },
  { cx: 78, cy: 292, rx: 26, ry: 16, rotate: 22 },
  { cx: 274, cy: 422, rx: 30, ry: 18, rotate: -12 },
  { cx: 72, cy: 552, rx: 24, ry: 16, rotate: 16 },
  { cx: 268, cy: 678, rx: 28, ry: 17, rotate: -20 },
];

export type PathPoint = { x: number; y: number; tx: number; ty: number; nx: number; ny: number };
export type WorldPoint = { x: number; y: number; z: number; yaw: number; nx: number; nz: number };

export type RiverWorldHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  fit: () => void;
  focusT: (t: number) => void;
};

let measurer: SVGPathElement | null = null;

function pathEl(): SVGPathElement | null {
  if (typeof document === "undefined") return null;
  if (!measurer) {
    measurer = document.createElementNS("http://www.w3.org/2000/svg", "path");
    measurer.setAttribute("d", RIVER_PATH);
  }
  return measurer;
}

export function pointOnPath(path: SVGPathElement, t: number): PathPoint {
  const len = path.getTotalLength();
  const clamped = Math.min(1, Math.max(0, t));
  const at = clamped * len;
  const p = path.getPointAtLength(at);
  const p2 = path.getPointAtLength(Math.min(len, at + 2));
  const dx = p2.x - p.x;
  const dy = p2.y - p.y;
  const mag = Math.hypot(dx, dy) || 1;
  return { x: p.x, y: p.y, tx: dx / mag, ty: dy / mag, nx: -dy / mag, ny: dx / mag };
}

export function pointAlongRiver(t: number): PathPoint {
  const path = pathEl();
  if (!path) {
    const y = 48 + Math.min(1, Math.max(0, t)) * 800;
    return { x: 180, y, tx: 0, ty: 1, nx: -1, ny: 0 };
  }
  return pointOnPath(path, t);
}

export function svgToWorld(x: number, y: number): { x: number; z: number } {
  return { x: (x - 180) * WORLD_SCALE, z: (y - 40) * WORLD_SCALE };
}

export function worldAlongRiver(t: number): WorldPoint {
  const p = pointAlongRiver(t);
  const w = svgToWorld(p.x, p.y);
  return {
    x: w.x,
    y: 0.1,
    z: w.z,
    yaw: Math.atan2(p.tx, p.ty),
    nx: p.nx,
    nz: p.ny,
  };
}

export function sampleRiver(count = 96): WorldPoint[] {
  const n = Math.max(2, count);
  const out: WorldPoint[] = [];
  for (let i = 0; i < n; i++) out.push(worldAlongRiver(i / (n - 1)));
  return out;
}
