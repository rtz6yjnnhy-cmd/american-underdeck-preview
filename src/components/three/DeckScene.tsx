"use client";

// Conceptual, procedural model of an elevated deck receiving an under deck
// drainage + ceiling system. Not to scale and not an engineering drawing.
// Units are roughly feet. x = across the deck, y = up, z = from house (−) to beam (+).

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const C = {
  abyss: "#0b1e33",
  cedar: "#9a5b32",
  cedarLight: "#b07a52",
  board: "#a9774f",
  wall: "#4b525a",
  ground: "#14263a",
  aluminum: "#e9ebe8", // White 30°
  signal: "#0a9be0",
  slab: "#8f8c86",
  warm: "#ffd9a8",
};

const W = 12; // deck width (x)
const D = 8; // deck depth (z)
const DECK_TOP = 8.5;
const JOIST_H = 0.8;
const JOIST_BOTTOM = DECK_TOP - 0.1 - JOIST_H; // 7.6
const JOISTS = Array.from({ length: 10 }, (_, i) => -W / 2 + (i * W) / 9);
const BAYS = JOISTS.slice(0, -1).map((x, i) => (x + JOISTS[i + 1]) / 2);
const BAY_W = W / 9;
const TROUGH_Y_BACK = JOIST_BOTTOM - 0.08;
const TROUGH_Y_FRONT = JOIST_BOTTOM - 0.38;
const GUTTER_Y = TROUGH_Y_FRONT - 0.25;
const GUTTER_Z = D / 2 + 0.3;
const SPOUT_X = W / 2 - 0.15;
const CEILING_Y = TROUGH_Y_FRONT - 0.42;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (s: number, a: number, b: number) => {
  const t = clamp01((s - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Camera choreography: one resting view per step, reached at the middle of
// that step's scroll range and held for half of it.
const KEYS: { pos: [number, number, number]; target: [number, number, number] }[] = [
  { pos: [15, 15, 19], target: [0, 5.8, 0] },
  { pos: [9, 14.5, 10], target: [0, 8.2, 0.5] },
  { pos: [6, 2.4, 13], target: [0, 7.1, 0] },
  { pos: [14, 3.5, 12], target: [3, 6, 3] },
  { pos: [-8, 4.2, 17], target: [0, 4.6, -0.5] },
];

function CameraRig({ progress, narrow }: { progress: MotionValue<number>; narrow: boolean }) {
  const { camera } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const tgt = useMemo(() => new THREE.Vector3(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const look = useRef(new THREE.Vector3(...KEYS[0].target));

  useFrame((_, dt) => {
    const u = Math.min(KEYS.length - 1.0001, Math.max(0, clamp01(progress.get()) * 5 - 0.5));
    const i = Math.floor(u);
    const t = clamp01((u - i - 0.25) / 0.5);
    const k = t * t * (3 - 2 * t);
    pos.copy(a.set(...KEYS[i].pos)).lerp(b.set(...KEYS[i + 1].pos), k);
    tgt.copy(a.set(...KEYS[i].target)).lerp(b.set(...KEYS[i + 1].target), k);
    if (narrow) pos.multiplyScalar(1.32).setY(pos.y / 1.32 + 0.4);
    // Critically damped follow keeps scroll jitter out of the camera.
    const f = 1 - Math.exp(-dt * 6);
    camera.position.lerp(pos, f);
    look.current.lerp(tgt, f);
    camera.lookAt(look.current);
  });
  return null;
}

function useCeilingTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = C.aluminum;
    g.fillRect(0, 0, 64, 512);
    // Panel grooves.
    for (let y = 0; y < 512; y += 32) {
      g.fillStyle = "rgba(20,30,40,0.18)";
      g.fillRect(0, y, 64, 2);
      g.fillStyle = "rgba(255,255,255,0.6)";
      g.fillRect(0, y + 2, 64, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Structure({ progress, shadows }: { progress: MotionValue<number>; shadows: boolean }) {
  const boards = useRef<THREE.InstancedMesh>(null);
  const boardMat = useRef<THREE.MeshStandardMaterial>(null);
  const flashing = useRef<THREE.Group>(null);
  const troughs = useRef<THREE.Group>(null);
  const gutter = useRef<THREE.Group>(null);
  const ceiling = useRef<THREE.Mesh>(null);
  const ceilingMat = useRef<THREE.MeshStandardMaterial>(null);
  const slab = useRef<THREE.Mesh>(null);
  const lamps = useRef<THREE.Group>(null);

  const warmLight = useRef<THREE.PointLight>(null);
  const windowMat = useRef<THREE.MeshStandardMaterial>(null);
  const ceilingTex = useCeilingTexture();
  // Shared materials so every lamp / flashing strip animates together.
  const lampMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff6e8",
        emissive: C.warm,
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const flashMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C.signal,
        emissive: C.signal,
        emissiveIntensity: 0.2,
        metalness: 0.4,
        roughness: 0.35,
        transparent: true,
      }),
    [],
  );

  const boardCount = 16;
  useEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < boardCount; i++) {
      const z = -D / 2 + 0.25 + i * (D / boardCount);
      m.makeTranslation(0, DECK_TOP - 0.05, z);
      boards.current?.setMatrixAt(i, m);
    }
    if (boards.current) boards.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    const s = clamp01(progress.get()) * 5;
    const xray = ramp(s, 0.6, 1.1) * (1 - ramp(s, 1.8, 2.3));
    if (boardMat.current) {
      boardMat.current.opacity = 1 - 0.85 * xray;
      boardMat.current.depthWrite = xray < 0.5;
    }
    const flash = ramp(s, 0.8, 1.3);
    if (flashing.current) flashing.current.visible = flash > 0.01;
    flashMat.opacity = flash;
    flashMat.emissiveIntensity = 0.6 * xray + 0.15;

    troughs.current?.children.forEach((child, i) => {
      const r = ramp(s, 1.85 + i * 0.04, 2.45 + i * 0.04);
      child.visible = r > 0.01;
      child.position.y = -1.6 * (1 - r);
      child.scale.setScalar(0.001 + r * 0.999);
    });

    const g = ramp(s, 2.5, 3.0);
    if (gutter.current) {
      gutter.current.visible = g > 0.01;
      gutter.current.position.y = -0.8 * (1 - g);
    }

    const ceil = ramp(s, 3.75, 4.3);
    if (ceiling.current) {
      ceiling.current.visible = ceil > 0.01;
      ceiling.current.position.y = CEILING_Y - 1.2 * (1 - ceil);
    }
    if (ceilingMat.current) ceilingMat.current.opacity = ceil;
    if (lamps.current) lamps.current.visible = ceil > 0.95;

    const sl = ramp(s, 3.9, 4.4);
    if (slab.current) {
      slab.current.visible = sl > 0.01;
      slab.current.scale.set(sl, 1, sl);
    }

    const lit = ramp(s, 4.25, 4.7);
    lampMat.emissiveIntensity = lit * 3;
    if (warmLight.current) warmLight.current.intensity = lit * 60;
    if (windowMat.current) windowMat.current.emissiveIntensity = 0.15 + lit * 1.2;
  });

  const lampSpots = useMemo(() => {
    const out: [number, number][] = [];
    for (const x of [-3.6, 0, 3.6]) for (const z of [-1.8, 1.8]) out.push([x, z]);
    return out;
  }, []);

  const troughSlope = Math.atan2(TROUGH_Y_BACK - TROUGH_Y_FRONT, D);

  return (
    <group>
      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow={shadows}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
      <gridHelper args={[40, 40, "#2a4a6a", "#1c3550"]} position={[0, 0.01, 0]} />

      {/* House wall with a door and a window */}
      <group position={[0, 0, -D / 2 - 0.35]}>
        <mesh position={[0, 7, 0]} receiveShadow={shadows}>
          <boxGeometry args={[18, 14, 0.4]} />
          <meshStandardMaterial color={C.wall} roughness={0.9} />
        </mesh>
        <mesh position={[-2.2, 3.4, 0.21]}>
          <planeGeometry args={[2.6, 4.2]} />
          <meshStandardMaterial
            ref={windowMat}
            color="#1b2733"
            emissive={C.warm}
            emissiveIntensity={0.15}
          />
        </mesh>
        <mesh position={[2.6, 3.0, 0.21]}>
          <planeGeometry args={[1.6, 3.6]} />
          <meshStandardMaterial color="#23303c" />
        </mesh>
      </group>

      {/* Posts */}
      {[-W / 2 + 0.2, 0, W / 2 - 0.2].map((x) => (
        <mesh key={x} position={[x, (JOIST_BOTTOM - 0.9) / 2, D / 2]} castShadow={shadows}>
          <boxGeometry args={[0.45, JOIST_BOTTOM - 0.9, 0.45]} />
          <meshStandardMaterial color={C.cedar} roughness={0.75} />
        </mesh>
      ))}

      {/* Beam (posts carry it, joists rest on it) */}
      <mesh position={[0, JOIST_BOTTOM - 0.45, D / 2]} castShadow={shadows}>
        <boxGeometry args={[W + 0.6, 0.9, 0.42]} />
        <meshStandardMaterial color={C.cedar} roughness={0.75} />
      </mesh>

      {/* Ledger on the house */}
      <mesh position={[0, JOIST_BOTTOM + JOIST_H / 2, -D / 2 - 0.08]}>
        <boxGeometry args={[W + 0.4, JOIST_H, 0.16]} />
        <meshStandardMaterial color={C.cedarLight} roughness={0.8} />
      </mesh>

      {/* Joists */}
      {JOISTS.map((x) => (
        <mesh key={x} position={[x, JOIST_BOTTOM + JOIST_H / 2, 0]} castShadow={shadows}>
          <boxGeometry args={[0.14, JOIST_H, D + 0.2]} />
          <meshStandardMaterial color={C.cedarLight} roughness={0.8} />
        </mesh>
      ))}

      {/* Flashing over the joists — revealed when the boards go transparent */}
      <group ref={flashing} visible={false}>
        {JOISTS.map((x) => (
          <mesh key={x} position={[x, JOIST_BOTTOM + JOIST_H + 0.012, 0]} material={flashMat}>
            <boxGeometry args={[0.3, 0.024, D + 0.2]} />
          </mesh>
        ))}
      </group>

      {/* Deck boards */}
      <instancedMesh ref={boards} args={[undefined, undefined, boardCount]} castShadow={shadows}>
        <boxGeometry args={[W + 0.6, 0.1, D / boardCount - 0.06]} />
        <meshStandardMaterial ref={boardMat} color={C.board} roughness={0.7} transparent />
      </instancedMesh>

      {/* Drainage troughs, one per joist bay, sloping toward the beam */}
      <group ref={troughs}>
        {BAYS.map((x) => (
          <group key={x} visible={false}>
            <group
              position={[x, (TROUGH_Y_BACK + TROUGH_Y_FRONT) / 2, 0]}
              rotation-x={-troughSlope}
            >
              <mesh receiveShadow={shadows}>
                <boxGeometry args={[BAY_W - 0.06, 0.03, D]} />
                <meshStandardMaterial color={C.aluminum} metalness={0.35} roughness={0.4} />
              </mesh>
              {[-1, 1].map((side) => (
                <mesh key={side} position={[side * (BAY_W / 2 - 0.05), 0.12, 0]}>
                  <boxGeometry args={[0.03, 0.24, D]} />
                  <meshStandardMaterial color={C.aluminum} metalness={0.35} roughness={0.4} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>

      {/* Gutter along the beam + downspout */}
      <group ref={gutter} visible={false}>
        <mesh position={[0, GUTTER_Y, GUTTER_Z]}>
          <boxGeometry args={[W + 0.6, 0.38, 0.42]} />
          <meshStandardMaterial color={C.aluminum} metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[SPOUT_X, GUTTER_Y / 2, GUTTER_Z + 0.32]}>
          <boxGeometry args={[0.28, GUTTER_Y, 0.22]} />
          <meshStandardMaterial color={C.aluminum} metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[SPOUT_X, 0.14, GUTTER_Z + 0.75]}>
          <boxGeometry args={[0.28, 0.2, 0.9]} />
          <meshStandardMaterial color={C.aluminum} metalness={0.4} roughness={0.35} />
        </mesh>
      </group>

      {/* Finished ceiling */}
      <mesh ref={ceiling} position={[0, CEILING_Y, 0]} rotation-x={Math.PI / 2} visible={false}>
        <planeGeometry args={[W + 0.2, D + 0.2]} />
        <meshStandardMaterial
          ref={ceilingMat}
          map={ceilingTex}
          color="#ffffff"
          roughness={0.55}
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Recessed lights */}
      <group ref={lamps} visible={false}>
      {lampSpots.map(([x, z]) => (
        <mesh
          key={`${x}${z}`}
          position={[x, CEILING_Y - 0.02, z]}
          rotation-x={Math.PI / 2}
          material={lampMat}
        >
          <circleGeometry args={[0.16, 24]} />
        </mesh>
      ))}
      </group>
      <pointLight ref={warmLight} position={[0, CEILING_Y - 0.6, 0]} color={C.warm} intensity={0} distance={18} decay={1.6} />

      {/* Patio slab */}
      <mesh ref={slab} position={[0, 0.06, 0]} receiveShadow={shadows} visible={false}>
        <boxGeometry args={[W + 1, 0.12, D + 0.6]} />
        <meshStandardMaterial color={C.slab} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Water({
  progress,
  rainCount,
  flowCount,
  animate,
}: {
  progress: MotionValue<number>;
  rainCount: number;
  flowCount: number;
  animate: boolean;
}) {
  const rain = useRef<THREE.InstancedMesh>(null);
  const flow = useRef<THREE.InstancedMesh>(null);
  const flowMat = useRef<THREE.MeshStandardMaterial>(null);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const one = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const zero = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const drops = useMemo(
    () =>
      Array.from({ length: rainCount }, () => ({
        x: (Math.random() - 0.5) * (W - 0.4),
        z: (Math.random() - 0.5) * (D - 0.4),
        y: Math.random() * 14,
        speed: 9 + Math.random() * 4,
      })),
    [rainCount],
  );
  const flows = useMemo(
    () =>
      Array.from({ length: flowCount }, (_, i) => ({
        bay: BAYS[i % BAYS.length],
        t: Math.random(),
        speed: 0.08 + Math.random() * 0.05,
      })),
    [flowCount],
  );

  useFrame((_, rawDt) => {
    const dt = animate ? Math.min(rawDt, 0.05) : 0;
    const s = clamp01(progress.get()) * 5;
    const caught = ramp(s, 2.2, 2.6) > 0.5;
    const flowOn = ramp(s, 2.85, 3.35);

    if (rain.current) {
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y -= d.speed * dt;
        const floor = caught && d.y < DECK_TOP ? TROUGH_Y_BACK : 0;
        if (d.y < floor) d.y = 14 + Math.random() * 2;
        // Hide the segment between deck surface and trough once caught.
        const hidden = caught && d.y < DECK_TOP - 0.05 && d.y > floor;
        m.compose(v.set(d.x, d.y, d.z), q, hidden ? zero : one);
        rain.current.setMatrixAt(i, m);
      }
      rain.current.instanceMatrix.needsUpdate = true;
    }

    if (flow.current) {
      for (let i = 0; i < flows.length; i++) {
        const f = flows[i];
        f.t = (f.t + f.speed * dt) % 1;
        // Path: along the trough (0–0.55), along the gutter (0.55–0.8), down the spout (0.8–1).
        let x = f.bay,
          y = 0,
          z = 0;
        if (f.t < 0.55) {
          const k = f.t / 0.55;
          z = -D / 2 + 0.2 + k * (D - 0.2);
          y = THREE.MathUtils.lerp(TROUGH_Y_BACK, TROUGH_Y_FRONT, k) + 0.06;
        } else if (f.t < 0.8) {
          const k = (f.t - 0.55) / 0.25;
          x = THREE.MathUtils.lerp(f.bay, SPOUT_X, k);
          y = GUTTER_Y + 0.1;
          z = GUTTER_Z;
        } else {
          const k = (f.t - 0.8) / 0.2;
          x = SPOUT_X;
          y = THREE.MathUtils.lerp(GUTTER_Y, 0.3, k);
          z = GUTTER_Z + 0.32;
        }
        m.compose(v.set(x, y, z), q, flowOn > 0.01 ? one : zero);
        flow.current.setMatrixAt(i, m);
      }
      flow.current.instanceMatrix.needsUpdate = true;
    }
    if (flowMat.current) flowMat.current.opacity = flowOn;
  });

  return (
    <>
      <instancedMesh ref={rain} args={[undefined, undefined, rainCount]} frustumCulled={false}>
        <boxGeometry args={[0.025, 0.32, 0.025]} />
        <meshBasicMaterial color="#9fd8f5" transparent opacity={0.55} />
      </instancedMesh>
      <instancedMesh ref={flow} args={[undefined, undefined, flowCount]} frustumCulled={false}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial
          ref={flowMat}
          color={C.signal}
          emissive={C.signal}
          emissiveIntensity={1.6}
          transparent
          opacity={0}
        />
      </instancedMesh>
    </>
  );
}

export default function DeckScene({
  progress,
  active,
  narrow,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  active: boolean;
  narrow: boolean;
  reduceMotion: boolean;
}) {
  const shadows = !narrow;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows={shadows ? "percentage" : false}
      dpr={[1, narrow ? 1.5 : 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: narrow ? 52 : 38, near: 0.1, far: 200, position: KEYS[0].pos }}
      aria-hidden
    >
      <color attach="background" args={[C.abyss]} />
      <fog attach="fog" args={[C.abyss, 26, 60]} />
      <hemisphereLight args={["#d6e7f5", "#4a6178", 1.25]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[12, 20, 14]}
        intensity={1.6}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <CameraRig progress={progress} narrow={narrow} />
      <Structure progress={progress} shadows={shadows} />
      <Water
        progress={progress}
        rainCount={narrow ? 140 : 300}
        flowCount={narrow ? 70 : 150}
        animate={!reduceMotion}
      />
    </Canvas>
  );
}
