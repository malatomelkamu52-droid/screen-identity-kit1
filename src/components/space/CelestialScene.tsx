import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  RingGeometry,
  SafeHtml,
  SafeOrbitControls,
  Points,
  SceneColor,
  ShaderMaterial,
  SphereGeometry,
} from "./r3f";
import {
  BODIES,
  EARTH_TEXTURES,
  assetsFor,
  latLonToVec3,
  pinsFor,
  type BodyId,
  type SpaceAsset,
  type SurfacePin,
} from "@/lib/space-data";
import { CONSTELLATIONS, SKY_OBJECTS } from "@/lib/deep-sky";
import { useTexture } from "@react-three/drei";

export interface SceneLayers {
  landingSites: boolean;
  craters: boolean;
  orbiters: boolean;
  terminator: boolean;
  temperature: boolean;
}

interface SceneProps {
  body: BodyId;
  layers: SceneLayers;
  playing: boolean;
  speed: number;
  rideAlong: boolean;
  focus: string | null;
  sunAzimuth: number;
  sunElevation: number;
  zoomRequest: { id: number; factor: number } | null;
  onPinSelect: (pin: SurfacePin) => void;
  onAssetSelect: (asset: SpaceAsset) => void;
  onBodyClick: (body: BodyId) => void;
  starLabels?: boolean;
  constellations?: boolean;
  selectedSkyId?: string | null;
  onSkySelect?: (id: string) => void;
}

export function sunVector(azimuthDeg: number, elevationDeg: number) {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(el) * Math.cos(az),
    Math.sin(el),
    Math.cos(el) * Math.sin(az),
  ).normalize();
}

/* ---------------- Earth Surface ---------------- */

function EarthSurface({
  terminator,
  heat,
  sunDir,
}: {
  terminator: number;
  heat: number;
  sunDir: THREE.Vector3;
}) {
  const [dayT, nightT, specT, cloudsT] = useTexture([
    EARTH_TEXTURES.day,
    EARTH_TEXTURES.night,
    EARTH_TEXTURES.spec,
    EARTH_TEXTURES.clouds,
  ]);
  const cloudRef = useRef<THREE.Mesh>(null);
  const r = BODIES.Earth.radius;

  useFrame((_, dt) => {
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.012;
  });

  return (
    <Group>
      <Mesh>
        <SphereGeometry args={[r, 96, 96]} />
        <MeshStandardMaterial
          map={dayT}
          roughness={0.7}
          metalness={0.1}
        />
      </Mesh>
      {cloudsT && (
        <Mesh ref={cloudRef}>
          <SphereGeometry args={[r * 1.012, 64, 64]} />
          <MeshStandardMaterial map={cloudsT} transparent opacity={0.35} depthWrite={false} />
        </Mesh>
      )}
      <Atmosphere radius={r * 1.05} color="#4da6ff" sunDir={sunDir} />
    </Group>
  );
}

/* ---------------- Atmosphere ---------------- */

function Atmosphere({
  radius,
  color,
  strength = 0.15,
  sunDir,
}: {
  radius: number;
  color: string;
  strength?: number;
  sunDir?: THREE.Vector3;
}) {
  return (
    <Mesh>
      <SphereGeometry args={[radius, 64, 64]} />
      <MeshBasicMaterial
        color={color}
        transparent
        opacity={strength}
        side={THREE.BackSide}
      />
    </Mesh>
  );
}

/* ---------------- Gas Giants & Textured Bodies ---------------- */

function TexturedBody({ id, heat, terminator }: { id: BodyId; heat: number; terminator: number }) {
  const info = BODIES[id];
  const map = useTexture(info.map);

  return (
    <Group>
      <Mesh castShadow>
        <SphereGeometry args={[info.radius, 96, 96]} />
        <MeshStandardMaterial
          map={map}
          roughness={info.roughness ?? 0.8}
          metalness={info.metalness ?? 0.1}
          color="#ffffff"
        />
      </Mesh>
      {id === "Venus" && <Atmosphere radius={info.radius * 1.06} color={info.accent} />}
    </Group>
  );
}

/* ---------------- Sun Surface ---------------- */

function SunSurface() {
  const info = BODIES.Sun;
  const map = useTexture(info.map);
  const r = info.radius;

  return (
    <Group>
      <Mesh>
        <SphereGeometry args={[r, 128, 128]} />
        <MeshBasicMaterial map={map} color="#ffb066" />
      </Mesh>
      <PointLight intensity={100} distance={100} decay={2} color="#ffb066" />
    </Group>
  );
}

/* ---------------- Rings ---------------- */

function PlanetRing({ id }: { id: BodyId }) {
  const ring = BODIES[id].ring;
  if (!ring) return null;
  const texture = useTexture(ring.map);

  return (
    <Mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <RingGeometry args={[ring.inner, ring.outer, 128]} />
      <MeshStandardMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.9} />
    </Mesh>
  );
}

/* ---------------- Surface Pins ---------------- */

function Pins({
  body,
  visible,
  onSelect,
}: {
  body: BodyId;
  visible: boolean;
  onSelect: (pin: SurfacePin) => void;
}) {
  const pins = pinsFor(body);
  const radius = BODIES[body].radius;

  if (!visible || pins.length === 0) return null;

  return (
    <Group>
      {pins.map((pin) => {
        const p = latLonToVec3(pin.lat, pin.lon, radius * 1.01);
        return (
          <Group key={pin.id} position={p}>
            <Mesh onClick={(e: any) => { e.stopPropagation(); onSelect(pin); }}>
              <SphereGeometry args={[radius * 0.025, 12, 12]} />
              <MeshBasicMaterial color="#FACC15" toneMapped={false} />
            </Mesh>
            <SafeHtml distanceFactor={3} zIndexRange={[20, 0]}>
              <button className="pin-label" onClick={() => onSelect(pin)}>
                <i />
                {pin.name}
              </button>
            </SafeHtml>
          </Group>
        );
      })}
    </Group>
  );
}

/* ---------------- Orbiters ---------------- */

function Orbiters({
  body,
  radius,
  playing,
  speed,
  onAssetSelect,
}: {
  body: BodyId;
  radius: number;
  playing: boolean;
  speed: number;
  onAssetSelect: (asset: SpaceAsset) => void;
}) {
  const assets = useMemo(() => assetsFor(body), [body]);
  const refs = useRef<Record<string, THREE.Group | null>>({});

  useFrame((_, dt) => {
    const delta = playing ? dt * speed : 0;
    assets.forEach((a) => {
      const g = refs.current[a.id];
      if (g && delta) g.rotation.y += delta * (a.orbitSpeed ?? 0.4) * 0.25;
    });
  });

  return (
    <Group>
      {assets.map((a) => {
        const r = radius * (a.orbitFactor ?? 1.3);
        return (
          <Group key={a.id} rotation={[((a.inclination ?? 0) * Math.PI) / 180, ((a.phase ?? 0) * Math.PI) / 180, 0]}>
            <Group ref={(el) => { refs.current[a.id] = el; }}>
              <Mesh position={[r, 0, 0]} onClick={(e: any) => { e.stopPropagation(); onAssetSelect(a); }}>
                <SphereGeometry args={[radius * 0.025, 12, 12]} />
                <MeshBasicMaterial color={a.accent ?? "#93c5fd"} toneMapped={false} />
              </Mesh>
            </Group>
            <Mesh rotation={[-Math.PI / 2, 0, 0]}>
              <RingGeometry args={[r - 0.003, r + 0.003, 128]} />
              <MeshBasicMaterial color={a.accent ?? "#1e3a5f"} side={THREE.DoubleSide} transparent opacity={0.3} />
            </Mesh>
          </Group>
        );
      })}
    </Group>
  );
}

/* ---------------- Body Rig ---------------- */

function BodyRig({
  body,
  layers,
  playing,
  speed,
  sunDir,
  onPinSelect,
  onBodyClick,
  onAssetSelect,
}: SceneProps & { sunDir: THREE.Vector3 }) {
  const info = BODIES[body];
  const spinner = useRef<THREE.Group>(null);
  const heat = layers.temperature ? 1 : 0;
  const terminator = layers.terminator ? 1 : 0;

  useFrame((_, dt) => {
    if (spinner.current && playing) spinner.current.rotation.y += dt * (info.spin ?? 0.1) * speed * 0.4;
  });

  return (
    <Group rotation={[0, 0, ((info.tilt ?? 0) * Math.PI) / 180]}>
      <Group ref={spinner} onClick={() => onBodyClick(body)}>
        {body === "Sun" ? (
          <SunSurface />
        ) : body === "Earth" ? (
          <EarthSurface terminator={terminator} heat={heat} sunDir={sunDir} />
        ) : (
          <TexturedBody id={body} heat={heat} terminator={terminator} />
        )}
        <Pins body={body} visible={layers.landingSites || layers.craters} onSelect={onPinSelect} />
      </Group>
      {info.ring ? <PlanetRing id={body} /> : null}
      {layers.orbiters && (
        <Orbiters body={body} radius={info.radius} playing={playing} speed={speed} onAssetSelect={onAssetSelect} />
      )}
    </Group>
  );
}

/* ---------------- Sky Background ---------------- */

function SkyDome() {
  const tex = useTexture(TEXTURES.starfield);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
  }, [tex]);

  return (
    <Mesh scale={[-1, 1, 1]}>
      <SphereGeometry args={[800, 64, 64]} />
      <MeshBasicMaterial map={tex} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </Mesh>
  );
}

/* ---------------- Star Field ---------------- */

function StarField() {
  const geometry = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 1200,
        (Math.random() - 0.5) * 1200,
        (Math.random() - 0.5) * 1200
      ).normalize().multiplyScalar(600 + Math.random() * 100);
      pos[i] = v.x;
      pos[i + 1] = v.y;
      pos[i + 2] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <Points geometry={geometry}>
      <MeshBasicMaterial color="#ffffff" />
    </Points>
  );
}

/* ---------------- Main Canvas Component ---------------- */

export default function CelestialScene(props: SceneProps) {
  const { sunAzimuth, sunElevation } = props;
  const sunDir = useMemo(() => sunVector(sunAzimuth, sunElevation), [sunAzimuth, sunElevation]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
      <Canvas
        camera={{ position: [0, 1.2, 4.5], fov: 45, near: 0.01, far: 2000 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#030712");
        }}
      >
        <AmbientLight intensity={0.8} />
        <DirectionalLight position={sunDir.clone().multiplyScalar(10).toArray()} intensity={2.2} color="#ffffff" />

        <Suspense fallback={null}>
          <SkyDome />
          <StarField />
          <BodyRig {...props} sunDir={sunDir} />
        </Suspense>

        <SafeOrbitControls
          makeDefault
          enablePan
          enableZoom
          enableRotate
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={150}
        />
      </Canvas>
    </div>
  );
}
