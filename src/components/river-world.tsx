import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, Sky, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ROCKS, sampleRiver, svgToWorld, worldAlongRiver, type RiverWorldHandle, type WorldPoint } from "@/lib/exam/river-path";
import type { RiverNode } from "@/lib/exam/types";

type RiverAvatar = {
  id: string;
  name: string;
  progress: number;
  self?: boolean;
  hue?: number;
};

export type { RiverWorldHandle };

const START = new THREE.Vector3(14, 32, -8);
const LOOK = new THREE.Vector3(0, 0.3, 46);
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function hash(n: number, salt: number) {
  const x = Math.sin(n * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function riverDist(x: number, z: number, path: WorldPoint[], step = 2) {
  let d = 80;
  for (let k = 0; k < path.length; k += step) {
    const p = path[k]!;
    d = Math.min(d, Math.hypot(x - p.x, z - p.z));
  }
  return d;
}

function vestColor(hue?: number, self?: boolean) {
  if (self) return "#2b6fe8";
  const h = ((hue ?? 198) % 360 + 360) % 360;
  return `hsl(${h}, 58%, 40%)`;
}

function ribbonGeometry(points: WorldPoint[], width: number, y: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    const prev = points[Math.max(0, i - 1)]!;
    const next = points[Math.min(points.length - 1, i + 1)]!;
    const tx = next.x - prev.x;
    const tz = next.z - prev.z;
    const mag = Math.hypot(tx, tz) || 1;
    const nx = -tz / mag;
    const nz = tx / mag;
    const flare = i > points.length * 0.84 ? 1 + (i / points.length - 0.84) * 12 : 1;
    const w = width * flare;
    positions.push(p.x + nx * w, y, p.z + nz * w, p.x - nx * w, y, p.z - nz * w);
    const v = i * 0.18;
    uvs.push(0, v, 1, v);
    if (i > 0) {
      const a = (i - 1) * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function useAlbedo(url: string, repeatX = 1, repeatY = 1) {
  const tex = useTexture(url);
  const t = useMemo(() => {
    const clone = tex.clone();
    clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
    clone.colorSpace = THREE.SRGBColorSpace;
    clone.anisotropy = 8;
    clone.repeat.set(repeatX, repeatY);
    clone.needsUpdate = true;
    return clone;
  }, [tex, repeatX, repeatY]);
  useEffect(() => () => t.dispose(), [t]);
  return t;
}

function Terrain({ path }: { path: WorldPoint[] }) {
  const grass = useAlbedo("/river/grass.jpg", 22, 32);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(92, 148, 96, 150);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position!;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const d = riverDist(x, z, path, 2);
      const hills =
        Math.sin(x * 0.07) * Math.cos(z * 0.045) * 2.35 +
        Math.sin(x * 0.21 + z * 0.13) * 0.72 +
        Math.sin(x * 0.48 + z * 0.31) * 0.22;
      const valley = smoothstep(6.8, 1.3, d);
      const sea = smoothstep(86, 118, z);
      const y = hills * (1 - valley) * (1 - sea) - 0.58 * valley - 0.72 * sea;
      pos.setY(i, y);
      const sand = valley;
      const rock = clamp((1 - valley) * smoothstep(0.6, 2.4, Math.abs(hills)), 0, 1);
      colors[i * 3] = 0.62 + sand * 0.22 + rock * 0.08;
      colors[i * 3 + 1] = 0.7 - sand * 0.18 - rock * 0.16;
      colors[i * 3 + 2] = 0.42 + sand * 0.04 - rock * 0.08;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [path]);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial map={grass} vertexColors roughness={0.94} metalness={0.02} />
    </mesh>
  );
}

function Water({ path }: { path: WorldPoint[] }) {
  const water = useAlbedo("/river/water.jpg", 1.4, 6);
  const sand = useAlbedo("/river/sand.jpg", 5, 20);
  const riverGeo = useMemo(() => ribbonGeometry(path, 2.15, 0.04), [path]);
  const bankGeo = useMemo(() => ribbonGeometry(path, 3.45, -0.08), [path]);
  const foamGeo = useMemo(() => ribbonGeometry(path, 2.32, 0.055), [path]);
  const time = useRef({ value: 0 });
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    time.current.value += d;
    water.offset.x += d * 0.018;
    water.offset.y += d * 0.032;
  });
  const mouth = path[path.length - 1]!;
  return (
    <group>
      <mesh geometry={bankGeo} receiveShadow>
        <meshStandardMaterial map={sand} roughness={0.9} />
      </mesh>
      <mesh geometry={riverGeo}>
        <meshPhysicalMaterial
          map={water}
          color="#0e4f70"
          roughness={0.08}
          metalness={0.12}
          transparent
          opacity={0.94}
          envMapIntensity={0.8}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = time.current;
            shader.vertexShader = shader.vertexShader
              .replace("#include <common>", "#include <common>\nuniform float uTime;")
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
                 transformed.y += sin(transformed.x * 1.15 + uTime * 1.55) * 0.045
                   + cos(transformed.z * 0.82 + uTime * 1.25) * 0.032;`,
              );
          }}
        />
      </mesh>
      <mesh geometry={foamGeo}>
        <meshStandardMaterial color="#d7eef8" transparent opacity={0.22} roughness={1} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mouth.x, -0.22, mouth.z + 10]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshPhysicalMaterial
          map={water}
          color="#14587a"
          roughness={0.07}
          metalness={0.1}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = time.current;
            shader.vertexShader = shader.vertexShader
              .replace("#include <common>", "#include <common>\nuniform float uTime;")
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
                 transformed.z += sin(position.x * 0.35 + uTime * 1.1) * 0.08;`,
              );
          }}
        />
      </mesh>
    </group>
  );
}

function Mountains() {
  const cliff = useAlbedo("/river/cliff.jpg", 2, 2);
  const peaks = [
    { p: [-34, 7.5, 16] as const, s: [16, 16, 13] as const, r: 0.4 },
    { p: [36, 8.2, 22] as const, s: [17, 18, 14] as const, r: -0.7 },
    { p: [-30, 9, 62] as const, s: [18, 20, 15] as const, r: 1.1 },
    { p: [32, 8.4, 74] as const, s: [16, 17, 14] as const, r: 0.2 },
    { p: [-24, 7, 112] as const, s: [20, 14, 16] as const, r: -0.5 },
    { p: [26, 6.6, 116] as const, s: [18, 13, 15] as const, r: 0.9 },
    { p: [2, 6.2, -14] as const, s: [22, 13, 16] as const, r: 0.15 },
    { p: [-38, 9.5, 40] as const, s: [14, 19, 12] as const, r: 1.6 },
  ];
  return (
    <group>
      {peaks.map((m, i) => (
        <mesh key={i} position={m.p as unknown as [number, number, number]} rotation={[0.08, m.r, 0.04]} scale={m.s as unknown as [number, number, number]} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial map={cliff} roughness={0.88} metalness={0.06} />
        </mesh>
      ))}
    </group>
  );
}

function Rocks() {
  const cliff = useAlbedo("/river/cliff.jpg", 1.6, 1.6);
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    let n = 0;
    ROCKS.forEach((r, i) => {
      const w = svgToWorld(r.cx, r.cy);
      _dummy.position.set(w.x, 0.42, w.z);
      _dummy.rotation.set(0.18, (r.rotate * Math.PI) / 180, 0.08);
      _dummy.scale.set(r.rx * 0.05, 0.85 + hash(i, 8) * 0.4, r.ry * 0.055);
      _dummy.updateMatrix();
      mesh.current!.setMatrixAt(n++, _dummy.matrix);
    });
    for (let i = 0; i < 28; i++) {
      const x = (hash(i, 21) - 0.5) * 70;
      const z = 6 + hash(i, 22) * 112;
      _dummy.position.set(x, 0.28 + hash(i, 23) * 0.4, z);
      _dummy.rotation.set(hash(i, 24), hash(i, 25) * 6, hash(i, 26) * 0.4);
      const s = 0.35 + hash(i, 27) * 1.1;
      _dummy.scale.set(s, s * (0.5 + hash(i, 28) * 0.7), s);
      _dummy.updateMatrix();
      mesh.current!.setMatrixAt(n++, _dummy.matrix);
    }
    mesh.current.count = n;
    mesh.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 40]} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial map={cliff} roughness={0.8} metalness={0.08} />
    </instancedMesh>
  );
}

function Forest({ path }: { path: WorldPoint[] }) {
  const bark = useAlbedo("/river/bark.jpg", 1, 2);
  const foliage = useAlbedo("/river/foliage.jpg", 1, 1);
  const trunk = useRef<THREE.InstancedMesh>(null);
  const canopy = useRef<THREE.InstancedMesh>(null);
  const bush = useRef<THREE.InstancedMesh>(null);
  const reed = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    let tn = 0;
    let cn = 0;
    for (let i = 0; i < 140 && tn < 80; i++) {
      const x = (hash(i, 1) - 0.5) * 68;
      const z = 3 + hash(i, 2) * 112;
      const d = riverDist(x, z, path, 3);
      if (d < 3.5 || d > 30) continue;
      const s = 1.05 + hash(i, 3) * 0.85;
      _dummy.position.set(x, 0.85 * s, z);
      _dummy.scale.set(s, s * 1.55, s);
      _dummy.rotation.set(0, hash(i, 4) * 6, 0);
      _dummy.updateMatrix();
      trunk.current?.setMatrixAt(tn, _dummy.matrix);
      const blobs = 4;
      for (let b = 0; b < blobs; b++) {
        const ox = (hash(i, 10 + b) - 0.5) * 1.35 * s;
        const oz = (hash(i, 20 + b) - 0.5) * 1.35 * s;
        const oy = 1.7 * s + hash(i, 30 + b) * 0.85 * s;
        const cs = (1.05 + hash(i, 40 + b) * 0.5) * s;
        _dummy.position.set(x + ox, oy, z + oz);
        _dummy.scale.set(cs, cs * 0.85, cs);
        _dummy.rotation.set(hash(i, 50 + b), hash(i, 60 + b) * 6, hash(i, 70 + b) * 0.4);
        _dummy.updateMatrix();
        canopy.current?.setMatrixAt(cn, _dummy.matrix);
        _color.setHSL(0.28 + hash(i, 80 + b) * 0.06, 0.42, 0.34 + hash(i, 90 + b) * 0.1);
        canopy.current?.setColorAt(cn, _color);
        cn += 1;
      }
      tn += 1;
    }
    if (trunk.current) {
      trunk.current.count = tn;
      trunk.current.instanceMatrix.needsUpdate = true;
    }
    if (canopy.current) {
      canopy.current.count = cn;
      canopy.current.instanceMatrix.needsUpdate = true;
      if (canopy.current.instanceColor) canopy.current.instanceColor.needsUpdate = true;
    }

    let bn = 0;
    for (let i = 0; i < 70 && bn < 56; i++) {
      const x = (hash(i, 101) - 0.5) * 62;
      const z = 4 + hash(i, 102) * 110;
      const d = riverDist(x, z, path, 3);
      if (d < 3.2 || d > 14) continue;
      const s = 0.45 + hash(i, 103) * 0.5;
      _dummy.position.set(x, 0.35 * s, z);
      _dummy.scale.set(s, s * 0.7, s);
      _dummy.rotation.set(0, hash(i, 104) * 6, 0);
      _dummy.updateMatrix();
      bush.current?.setMatrixAt(bn, _dummy.matrix);
      bn += 1;
    }
    if (bush.current) {
      bush.current.count = bn;
      bush.current.instanceMatrix.needsUpdate = true;
    }

    let rn = 0;
    for (let i = 0; i < path.length && rn < 120; i += 2) {
      const p = path[i]!;
      const side = i % 4 === 0 ? 1 : -1;
      const spread = 2.15 + hash(i, 5) * 0.7;
      _dummy.position.set(p.x + p.nx * spread * side, 0.38, p.z + p.nz * spread * side);
      _dummy.rotation.set(0.08 * side, hash(i, 6) * 6, 0.1 * side);
      const s = 0.7 + hash(i, 7) * 0.6;
      _dummy.scale.set(0.35 * s, s, 0.35 * s);
      _dummy.updateMatrix();
      reed.current?.setMatrixAt(rn, _dummy.matrix);
      rn += 1;
    }
    if (reed.current) {
      reed.current.count = rn;
      reed.current.instanceMatrix.needsUpdate = true;
    }
  }, [path]);

  return (
    <group>
      <instancedMesh ref={trunk} args={[undefined, undefined, 80]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.1, 7]} />
        <meshStandardMaterial map={bark} roughness={0.92} />
      </instancedMesh>
      <instancedMesh ref={canopy} args={[undefined, undefined, 320]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial map={foliage} roughness={0.84} />
      </instancedMesh>
      <instancedMesh ref={bush} args={[undefined, undefined, 56]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial map={foliage} roughness={0.9} color="#5a7348" />
      </instancedMesh>
      <instancedMesh ref={reed} args={[undefined, undefined, 120]}>
        <cylinderGeometry args={[0.03, 0.05, 0.9, 5]} />
        <meshStandardMaterial color="#4f6a38" roughness={0.86} />
      </instancedMesh>
    </group>
  );
}

function LogoPlaque({ url, scale = 1 }: { url: string; scale?: number }) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh scale={[scale, scale, 1]} castShadow>
      <planeGeometry args={[1.05, 1.05]} />
      <meshStandardMaterial map={tex} transparent alphaTest={0.12} roughness={0.38} metalness={0.18} side={THREE.DoubleSide} />
    </mesh>
  );
}

function StoneBridge({ yaw }: { yaw: number }) {
  const cliff = useAlbedo("/river/cliff.jpg", 1.4, 1.4);
  return (
    <group rotation={[0, yaw + Math.PI / 2, 0]}>
      <mesh position={[-1.75, 0.58, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.16, 1.2]} />
        <meshStandardMaterial map={cliff} roughness={0.84} />
      </mesh>
      <mesh position={[1.75, 0.58, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.16, 1.2]} />
        <meshStandardMaterial map={cliff} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.22, 0.2, 8, 18, Math.PI]} />
        <meshStandardMaterial map={cliff} roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <boxGeometry args={[4.4, 0.18, 1.22]} />
        <meshStandardMaterial map={cliff} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.46, 0.52]} castShadow>
        <boxGeometry args={[4.4, 0.32, 0.12]} />
        <meshStandardMaterial map={cliff} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.46, -0.52]} castShadow>
        <boxGeometry args={[4.4, 0.32, 0.12]} />
        <meshStandardMaterial map={cliff} roughness={0.8} />
      </mesh>
    </group>
  );
}

function BookStack() {
  return (
    <group scale={0.82}>
      <mesh position={[0, 0.16, 0]} rotation={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.72, 0.14, 0.5]} />
        <meshStandardMaterial color="#6b2d2d" roughness={0.62} />
      </mesh>
      <mesh position={[0.02, 0.3, 0]} rotation={[0, -0.18, 0]} castShadow>
        <boxGeometry args={[0.7, 0.12, 0.48]} />
        <meshStandardMaterial color="#2c4a6e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.46, 0]} rotation={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.74, 0.16, 0.52]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.42} metalness={0.14} />
      </mesh>
    </group>
  );
}

function FloodSurge() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    const k = 1 + Math.sin(t * 1.7) * 0.1;
    ref.current.scale.set(k, 1, k);
    ref.current.position.y = Math.sin(t * 2.05) * 0.07;
  });
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
        <torusGeometry args={[0.62, 0.11, 8, 28]} />
        <meshPhysicalMaterial color="#3a8ec0" transparent opacity={0.5} roughness={0.08} metalness={0.12} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
        <torusGeometry args={[1.02, 0.1, 8, 28]} />
        <meshPhysicalMaterial color="#7ec4e4" transparent opacity={0.32} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 1.35, 8]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.86} />
      </mesh>
    </group>
  );
}

function Pedestal() {
  const cliff = useAlbedo("/river/cliff.jpg", 1, 1);
  return (
    <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.42, 0.55, 0.44, 10]} />
      <meshStandardMaterial map={cliff} roughness={0.78} />
    </mesh>
  );
}

function Encounters({
  nodes,
  selectedId,
  onSelectNode,
}: {
  nodes: RiverNode[];
  selectedId?: string | null;
  onSelectNode?: (id: string) => void;
}) {
  return (
    <group>
      {nodes.map((node) => {
        const at = worldAlongRiver(node.t);
        const selected = node.id === selectedId;
        const logo = node.kind === "bridge" ? "/river/bridge.png" : node.kind === "flood" ? "/river/flood.png" : "/river/subject.png";
        const side = node.kind === "bridge" ? 0 : 1.7;
        const lx = at.nx * side;
        const lz = at.nz * side;
        return (
          <group
            key={node.id}
            position={[at.x, 0, at.z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode?.(node.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onSelectNode?.(node.id);
            }}
          >
            {node.kind === "bridge" ? <StoneBridge yaw={at.yaw} /> : null}
            <group position={[lx, 0, lz]}>
              <Pedestal />
              {node.kind === "subject" ? <BookStack /> : null}
              {node.kind === "flood" ? <FloodSurge /> : null}
              <group position={[0, node.kind === "bridge" ? 2.15 : node.kind === "flood" ? 1.7 : 1.55, 0]} rotation={[0, at.yaw, 0]}>
                <LogoPlaque url={logo} scale={selected ? 0.95 : 0.78} />
              </group>
              {node.done ? (
                <mesh position={[0.55, 0.7, 0.2]}>
                  <sphereGeometry args={[0.12, 12, 12]} />
                  <meshStandardMaterial color="#2f9d5c" emissive="#2f9d5c" emissiveIntensity={0.45} />
                </mesh>
              ) : null}
              <Html position={[0, node.kind === "bridge" ? 2.9 : 2.4, 0]} center distanceFactor={22} occlude={false}>
                <button
                  type="button"
                  className="whitespace-nowrap rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-raised"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode?.(node.id);
                  }}
                >
                  {node.title.length > 20 ? `${node.title.slice(0, 18)}…` : node.title}
                </button>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}

function KayakMesh({ hue, self }: { hue?: number; self?: boolean }) {
  const accent = vestColor(hue, self);
  const paddle = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (paddle.current) paddle.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.4) * 0.45;
  });
  return (
    <group scale={0.48}>
      <mesh scale={[0.34, 0.13, 0.98]} castShadow>
        <sphereGeometry args={[1, 18, 12]} />
        <meshStandardMaterial color="#1a2834" roughness={0.28} metalness={0.22} />
      </mesh>
      <mesh position={[0, 0.07, 0.02]} scale={[0.2, 0.05, 0.62]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={accent} roughness={0.42} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.26, 0.04]} castShadow>
        <capsuleGeometry args={[0.075, 0.14, 4, 8]} />
        <meshStandardMaterial color={accent} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.42, 0.04]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#e2c2a0" roughness={0.52} />
      </mesh>
      <group ref={paddle} position={[0, 0.3, 0.04]} rotation={[0.12, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 1.12, 6]} />
          <meshStandardMaterial color="#3d2a1c" roughness={0.8} />
        </mesh>
        <mesh position={[0.54, 0, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.08]} />
          <meshStandardMaterial color="#c4b08a" roughness={0.5} />
        </mesh>
        <mesh position={[-0.54, 0, 0]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.08]} />
          <meshStandardMaterial color="#c4b08a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function Avatars({ avatars }: { avatars: RiverAvatar[] }) {
  const displayed = useRef(new Map<string, number>());
  const groups = useRef(new Map<string, THREE.Group>());
  const list = useRef(avatars);
  list.current = avatars;
  const bob = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    bob.current += dt;
    const selfIndex = Math.max(0, list.current.findIndex((a) => a.self));
    list.current.forEach((a, i) => {
      const cur = displayed.current.get(a.id) ?? a.progress;
      const next = cur + (a.progress - cur) * Math.min(1, dt * 3.6);
      displayed.current.set(a.id, next);
      const g = groups.current.get(a.id);
      if (!g) return;
      const t = 0.08 + clamp(next, 0, 1) * 0.84;
      const at = worldAlongRiver(t);
      const slot = i - selfIndex;
      g.position.set(at.x + at.nx * slot * 0.7, 0.16 + Math.sin(bob.current * 2.1 + i) * 0.05, at.z + at.nz * slot * 0.7);
      g.rotation.y = at.yaw;
    });
  });

  return (
    <group>
      {avatars.map((a) => (
        <group
          key={a.id}
          ref={(el) => {
            if (el) groups.current.set(a.id, el);
            else groups.current.delete(a.id);
          }}
        >
          <KayakMesh hue={a.hue} self={a.self} />
          <Html position={[0, 0.58, 0]} center occlude={false} distanceFactor={18}>
            <p className="whitespace-nowrap rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium text-foreground shadow-raised">
              {a.self ? "You" : a.name}
            </p>
          </Html>
        </group>
      ))}
    </group>
  );
}

function Lighthouse({ at }: { at: WorldPoint }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (light.current) light.current.intensity = 1.6 + Math.sin(state.clock.elapsedTime * 2.8) * 0.7;
  });
  return (
    <group position={[at.x + 7.2, 0, at.z + 9.4]}>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.25, 0.4, 10]} />
        <meshStandardMaterial color="#8a8174" roughness={0.86} />
      </mesh>
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.56, 4.1, 12]} />
        <meshStandardMaterial color="#efe8dc" roughness={0.72} />
      </mesh>
      <mesh position={[0, 4.28, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.38, 12]} />
        <meshStandardMaterial color="#8b2c2c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 4.72, 0]} castShadow>
        <coneGeometry args={[0.6, 0.82, 10]} />
        <meshStandardMaterial color="#2a3038" roughness={0.5} />
      </mesh>
      <pointLight ref={light} position={[0, 4.35, 0]} color="#ffd9a0" distance={22} />
    </group>
  );
}

function Landmarks() {
  const source = worldAlongRiver(0);
  const sea = worldAlongRiver(1);
  const cliff = useAlbedo("/river/cliff.jpg", 1, 1);
  return (
    <group>
      <mesh position={[source.x, 0.55, source.z]} castShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial map={cliff} roughness={0.82} />
      </mesh>
      <mesh position={[source.x, 0.12, source.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 24]} />
        <meshPhysicalMaterial color="#3a86c8" roughness={0.12} metalness={0.08} transparent opacity={0.85} />
      </mesh>
      <group position={[source.x, 1.55, source.z]} rotation={[0, 0.4, 0]}>
        <LogoPlaque url="/river/source.png" scale={0.78} />
      </group>
      <Html position={[source.x, 2.35, source.z]} center occlude={false} distanceFactor={16}>
        <p className="rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-raised">Source</p>
      </Html>
      <Lighthouse at={sea} />
      <group position={[sea.x, 1.9, sea.z + 6.5]} rotation={[0, -0.5, 0]}>
        <LogoPlaque url="/river/sea.png" scale={1.1} />
      </group>
      <Html position={[sea.x, 2.85, sea.z + 6.5]} center occlude={false} distanceFactor={18}>
        <p className="rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-raised">Sea</p>
      </Html>
    </group>
  );
}

function Rig({ api }: { api: MutableRefObject<RiverWorldHandle | null> }) {
  const { camera } = useThree();
  const controls = useRef<any>(null);

  useLayoutEffect(() => {
    camera.position.copy(START);
    camera.lookAt(LOOK);
  }, [camera]);

  useImperativeHandle(api, () => ({
    zoomIn: () => {
      camera.position.lerp(controls.current?.target ?? LOOK, 0.22);
      controls.current?.update?.();
    },
    zoomOut: () => {
      const target = (controls.current?.target as THREE.Vector3) ?? LOOK;
      const dir = camera.position.clone().sub(target);
      camera.position.add(dir.multiplyScalar(0.28));
      controls.current?.update?.();
    },
    fit: () => {
      camera.position.copy(START);
      if (controls.current) {
        controls.current.target.copy(LOOK);
        controls.current.update();
      }
    },
    focusT: (t: number) => {
      const at = worldAlongRiver(t);
      const target = new THREE.Vector3(at.x, 0.55, at.z);
      if (controls.current) {
        controls.current.target.copy(target);
        camera.position.set(at.x + 6.5, 8.5, at.z + 8);
        controls.current.update();
      }
    },
  }));

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={9}
      maxDistance={110}
      maxPolarAngle={Math.PI * 0.48}
      minPolarAngle={0.18}
      target={LOOK.toArray() as [number, number, number]}
    />
  );
}

function Scene({
  nodes,
  avatars,
  selectedId,
  onSelectNode,
  api,
}: {
  nodes: RiverNode[];
  avatars: RiverAvatar[];
  selectedId?: string | null;
  onSelectNode?: (id: string) => void;
  api: MutableRefObject<RiverWorldHandle | null>;
}) {
  const path = useMemo(() => sampleRiver(112), []);
  return (
    <>
      <color attach="background" args={["#87a8bc"]} />
      <fog attach="fog" args={["#93adc0", 48, 135]} />
      <hemisphereLight args={["#d7e4f2", "#3d4a32", 0.62]} />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[28, 38, 18]}
        intensity={1.85}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={2}
        shadow-camera-far={150}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={80}
        shadow-camera-bottom={-28}
      />
      <Sky sunPosition={[42, 18, 16]} turbidity={4.5} rayleigh={1.05} mieCoefficient={0.004} />
      <Terrain path={path} />
      <Water path={path} />
      <Mountains />
      <Rocks />
      <Forest path={path} />
      <Landmarks />
      <Encounters nodes={nodes} selectedId={selectedId} onSelectNode={onSelectNode} />
      <Avatars avatars={avatars} />
      <ContactShadows position={[0, -0.04, 48]} opacity={0.28} scale={96} blur={2.6} far={10} />
      <Rig api={api} />
    </>
  );
}

const RiverWorld = forwardRef<
  RiverWorldHandle,
  {
    nodes: RiverNode[];
    avatars: RiverAvatar[];
    selectedId?: string | null;
    onSelectNode?: (id: string) => void;
  }
>(function RiverWorld({ nodes, avatars, selectedId, onSelectNode }, ref) {
  const api = useRef<RiverWorldHandle | null>(null);
  useImperativeHandle(ref, () => ({
    zoomIn: () => api.current?.zoomIn(),
    zoomOut: () => api.current?.zoomOut(),
    fit: () => api.current?.fit(),
    focusT: (t: number) => api.current?.focusT(t),
  }));

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: START.toArray() as [number, number, number], fov: 48, near: 0.1, far: 260 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
      className="h-full w-full touch-none"
      onPointerMissed={() => onSelectNode?.("")}
    >
      <Scene nodes={nodes} avatars={avatars} selectedId={selectedId} onSelectNode={onSelectNode} api={api} />
    </Canvas>
  );
});

export default RiverWorld;
