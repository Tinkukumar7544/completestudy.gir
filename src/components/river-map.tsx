import { useEffect, useId, useMemo, useState } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RIVER_PATH, RIVER_VB, ROCKS, pointAlongRiver } from "@/lib/exam/river-path";
import type { RiverNode } from "@/lib/exam/types";

export type RiverAvatar = {
  id: string;
  name: string;
  progress: number;
  self?: boolean;
  hue?: number;
};

function logoFor(kind: RiverNode["kind"]) {
  if (kind === "bridge") return "/river/bridge.png";
  if (kind === "flood") return "/river/flood.png";
  return "/river/subject.png";
}

export function RiverMap({
  nodes,
  avatars,
  selectedId,
  onSelectNode,
}: {
  nodes: RiverNode[];
  avatars: RiverAvatar[];
  selectedId?: string | null;
  onSelectNode?: (id: string) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const seaReached = avatars.some((a) => a.self && a.progress >= 0.999);

  useEffect(() => {
    setReady(true);
  }, []);

  const placed = useMemo(() => {
    if (!ready) return [];
    return nodes.map((node) => ({ node, at: pointAlongRiver(node.t) }));
  }, [nodes, ready]);

  const boats = useMemo(() => {
    if (!ready) return [];
    return avatars.map((a, i) => {
      const t = 0.06 + Math.min(1, Math.max(0, a.progress)) * 0.86;
      return { ...a, at: pointAlongRiver(t), slot: i };
    });
  }, [avatars, ready]);

  return (
    <div className="river-stage">
      <svg
        viewBox={`0 0 ${RIVER_VB.w} ${RIVER_VB.h}`}
        preserveAspectRatio="xMidYMin meet"
        className="absolute inset-0 size-full"
        role="img"
        aria-label="River to the sea"
      >
        <g transform={`translate(180 0) scale(${zoom}) translate(-180 0)`}>
          <defs>
            <pattern id={`${uid}-grass`} patternUnits="userSpaceOnUse" width="160" height="160">
              <image href="/river/grass.jpg" width="160" height="160" />
            </pattern>
            <pattern id={`${uid}-water`} patternUnits="userSpaceOnUse" width="80" height="80">
              <image href="/river/water.jpg" width="80" height="80" />
            </pattern>
            <pattern id={`${uid}-sand`} patternUnits="userSpaceOnUse" width="90" height="90">
              <image href="/river/sand.jpg" width="90" height="90" />
            </pattern>
            <pattern id={`${uid}-rock`} patternUnits="userSpaceOnUse" width="70" height="70">
              <image href="/river/rock.jpg" width="70" height="70" />
            </pattern>
            <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-river)" />
              <stop offset="100%" stopColor="var(--color-sea)" />
            </linearGradient>
          </defs>
          <rect width={RIVER_VB.w} height={RIVER_VB.h} fill={`url(#${uid}-grass)`} />
          <ellipse cx="180" cy="900" rx="150" ry="70" fill={`url(#${uid}-sea)`} />
          <path
            d={RIVER_PATH}
            fill="none"
            stroke={`url(#${uid}-sand)`}
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={RIVER_PATH}
            className="river-flow"
            fill="none"
            stroke={`url(#${uid}-water)`}
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {ROCKS.map((r, i) => (
            <ellipse
              key={i}
              cx={r.cx}
              cy={r.cy}
              rx={r.rx}
              ry={r.ry}
              transform={`rotate(${r.rotate} ${r.cx} ${r.cy})`}
              fill={`url(#${uid}-rock)`}
            />
          ))}
          <image href="/river/source.png" x="156" y="20" width="48" height="48" />
          <text x="180" y="82" textAnchor="middle" fill="var(--color-foreground)" fontSize="12" fontWeight="600">
            Source
          </text>
          <image href="/river/sea.png" x="150" y="868" width="60" height="60" />
          <text x="180" y="860" textAnchor="middle" fill="var(--color-primary-foreground)" fontSize="12" fontWeight="600">
            Sea
          </text>
          {placed.map(({ node, at }) => {
            const selected = node.id === selectedId;
            const size = selected ? 40 : 32;
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => onSelectNode?.(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectNode?.(node.id);
                  }
                }}
              >
                <image href={logoFor(node.kind)} x={at.x - size / 2} y={at.y - size / 2} width={size} height={size} />
                {node.done ? <circle cx={at.x + 12} cy={at.y - 12} r="5" fill="var(--color-review)" /> : null}
                <text
                  x={at.x}
                  y={at.y - size / 2 - 6}
                  textAnchor="middle"
                  fill="var(--color-foreground)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {node.title.length > 18 ? `${node.title.slice(0, 16)}…` : node.title}
                </text>
              </g>
            );
          })}
          {boats.map((a) => (
            <g key={a.id} className="river-bob">
              <image
                href="/river/kayak.png"
                x={a.at.x - 14 + a.slot * 10}
                y={a.at.y - 14}
                width="28"
                height="28"
              />
              <text
                x={a.at.x + a.slot * 10}
                y={a.at.y - 18}
                textAnchor="middle"
                fill="var(--color-foreground)"
                fontSize="10"
                fontWeight="600"
              >
                {a.self ? "You" : a.name}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-xl bg-card/90 p-1 shadow-raised">
        <Button type="button" size="icon" variant="ghost" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2.2, z + 0.25))}>
          <Plus className="size-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.8, z - 0.25))}>
          <Minus className="size-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" aria-label="Fit river" onClick={() => setZoom(1)}>
          <Maximize2 className="size-4" />
        </Button>
      </div>
      {seaReached ? (
        <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground shadow-raised">
          You reached the sea
        </p>
      ) : null}
    </div>
  );
}
