import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
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
import milkyWayAsset from "@/assets/tex/milkyway.json";


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
  /** id of the asset the camera should fly to, or null */
  focus: string | null;
  /** Sun gizmo / timeline driven light direction, in degrees */
  sunAzimuth: number;
  sunElevation: number;
  /** Incrementing zoom command from the floating +/- buttons */
  zoomRequest: { id: number; factor: number } | null;
  onPinSelect: (pin: SurfacePin) => void;
  onAssetSelect: (asset: SpaceAsset) => void;
  onBodyClick: (body: BodyId) => void;
  /** Deep-sky HUD annotations for catalogued stars / DSOs */
  starLabels?: boolean;
  /** Constellation stick figures */
  constellations?: boolean;
  /** id of the selected catalogue object, or null */
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

/* ---------------- Earth day/night shader ---------------- */

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFrag = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specMap;
  uniform vec3 sunDir;
  uniform float terminator;
  uniform float heat;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    float ocean = texture2D(specMap, vUv).r;
    float d = dot(normalize(vNormalW), normalize(sunDir));
    float lit = mix(1.0, smoothstep(-0.12, 0.28, d), terminator);
    vec3 color = mix(night * 1.25, day, lit);
    // ocean specular sheen
    float sheen = pow(max(d, 0.0), 12.0) * ocean * 0.55;
    color += vec3(0.35, 0.55, 0.9) * sheen;
    color = mix(color, vec3(0.95, 0.35, 0.15) * (0.35 + lit), heat * 0.55);
    gl_FragColor = vec4(color, 1.0);
  }
`;

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
  const day = dayT!;
  const night = nightT!;
  const spec = specT!;
  const clouds = cloudsT!;
  const cloudRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      dayMap: { value: day },
      nightMap: { value: night },
      specMap: { value: spec },
      sunDir: { value: sunDir.clone() },
      terminator: { value: terminator },
      heat: { value: heat },
    }),
    [day, night, spec],
  );

  useEffect(() => {
    uniforms.terminator.value = terminator;
    uniforms.heat.value = heat;
    uniforms.sunDir.value.copy(sunDir);
  }, [terminator, heat, sunDir, uniforms]);

  useFrame((_, dt) => {
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.012;
  });

  const r = BODIES.Earth.radius;
  return (
    <Group>
      <Mesh>
        <SphereGeometry args={[r, 96, 96]} />
        <ShaderMaterial vertexShader={earthVert} fragmentShader={earthFrag} uniforms={uniforms} />
      </Mesh>
      <Mesh ref={cloudRef}>
        <SphereGeometry args={[r * 1.012, 64, 64]} />
        <MeshStandardMaterial map={clouds} transparent opacity={0.32} depthWrite={false} />
      </Mesh>
      <Atmosphere radius={r * 1.07} color="#4da6ff" />
    </Group>
  );
}

/* ---------------- Atmospheric Fresnel shell ---------------- */

/**
 * Thin atmospheric shell. Physically this is a few-km haze layer, so it stays
 * faint (strength <= 0.12 by default) and only brightens where sunlight
 * actually grazes the limb — no neon outline on the night side.
 */
function Atmosphere({
  radius,
  color,
  strength = 0.1,
  sunDir,
}: {
  radius: number;
  color: string;
  strength?: number;
  sunDir?: THREE.Vector3;
}) {
  const uniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(color) },
      strength: { value: strength },
      sunDir: { value: (sunDir ?? new THREE.Vector3(1, 0, 0)).clone() },
      useSun: { value: sunDir ? 1 : 0 },
    }),
    [color],
  );

  useEffect(() => {
    uniforms.strength.value = strength;
    uniforms.useSun.value = sunDir ? 1 : 0;
    if (sunDir) uniforms.sunDir.value.copy(sunDir);
  }, [strength, sunDir, uniforms]);

  return (
    <Mesh>
      <SphereGeometry args={[radius, 64, 64]} />
      <ShaderMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vNormalV;
          varying vec3 vNormalW;
          void main() {
            vNormalV = normalize(normalMatrix * normal);
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 glowColor;
          uniform vec3 sunDir;
          uniform float strength;
          uniform float useSun;
          varying vec3 vNormalV;
          varying vec3 vNormalW;
          void main() {
            // Tight limb falloff: high exponent keeps the haze hugging the edge.
            float rim = pow(clamp(1.0 - abs(dot(vNormalV, vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 6.0);
            float sun = mix(1.0, clamp(dot(normalize(vNormalW), normalize(sunDir)) * 0.5 + 0.5, 0.0, 1.0), useSun);
            float a = rim * strength * sun;
            gl_FragColor = vec4(glowColor * a, a);
          }
        `}
      />
    </Mesh>
  );
}

/* ---------------- Gas giants: limb darkening + Rayleigh rim ---------------- */

const GAS_GIANTS: BodyId[] = ["Jupiter", "Saturn", "Uranus", "Neptune"];

const gasVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const gasFrag = /* glsl */ `
  uniform sampler2D cloudMap;
  uniform vec3 sunDir;
  uniform vec3 rayleigh;
  uniform float terminator;
  uniform float heat;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vec3 bands = texture2D(cloudMap, vUv).rgb;
    vec3 n = normalize(vNormalW);
    float ndl = dot(n, normalize(sunDir));
    // Wrapped diffuse — gas envelopes scatter light slightly past the terminator,
    // but the dark side stays genuinely dark for a crisp physical edge.
    float diffuse = clamp((ndl + 0.14) / 1.14, 0.0, 1.0);
    float lit = mix(0.9, diffuse * diffuse, terminator);
    // Limb darkening (Minnaert-like): the disc dims towards the visible edge.
    float mu = clamp(dot(n, normalize(vViewDir)), 0.0, 1.0);
    float limb = pow(mu, 0.45);
    vec3 color = bands * lit * mix(1.0, limb, 0.9);
    // Very faint forward scattering, confined to the sunlit limb only.
    float rim = pow(1.0 - mu, 6.0);
    color += rayleigh * rim * 0.06 * max(ndl, 0.0);
    // Trace deep-atmosphere ambient so the night side is not crushed to pure black.
    color += bands * 0.015;
    color = mix(color, vec3(0.95, 0.35, 0.15) * (0.4 + lit), heat * 0.5);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function GasGiantSurface({
  id,
  sunDir,
  terminator,
  heat,
}: {
  id: BodyId;
  sunDir: THREE.Vector3;
  terminator: number;
  heat: number;
}) {
  const info = BODIES[id];
  const map = useTexture(info.map);
  const uniforms = useMemo(
    () => ({
      cloudMap: { value: map },
      sunDir: { value: sunDir.clone() },
      rayleigh: { value: new THREE.Color(info.accent) },
      terminator: { value: terminator },
      heat: { value: heat },
    }),
    [map, info.accent],
  );

  useEffect(() => {
    uniforms.sunDir.value.copy(sunDir);
    uniforms.terminator.value = terminator;
    uniforms.heat.value = heat;
  }, [sunDir, terminator, heat, uniforms]);

  return (
    <Group>
      <Mesh castShadow>
        <SphereGeometry args={[info.radius, 128, 128]} />
        <ShaderMaterial vertexShader={gasVert} fragmentShader={gasFrag} uniforms={uniforms} />
      </Mesh>
      <Atmosphere radius={info.radius * 1.035} color={info.accent} />
      <Atmosphere radius={info.radius * 1.11} color={info.accent} />
    </Group>
  );
}

/* ---------------- Generic textured body ---------------- */

/* ---------------- Photorealistic Sun (SDO / Solar Orbiter look) ---------------- */

const sunVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const sunFrag = /* glsl */ `
  uniform sampler2D photoMap;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  // --- value noise / fbm for convective granulation ---
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = 0.0;
    for (int dx = 0; dx <= 1; dx++)
      for (int dy = 0; dy <= 1; dy++)
        for (int dz = 0; dz <= 1; dz++) {
          vec3 o = vec3(float(dx), float(dy), float(dz));
          float h = hash3(i + o).x;
          vec3 w = mix(1.0 - f, f, o);
          n += h * w.x * w.y * w.z;
        }
    return n;
  }
  float fbm(vec3 p) {
    float a = 0.5, s = 0.0;
    for (int k = 0; k < 5; k++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
    return s;
  }

  void main() {
    vec3 n = normalize(vNormalW);
    // Slowly churning convection cells + finer granulation
    float cells = fbm(n * 5.5 + vec3(0.0, time * 0.045, 0.0));
    float gran  = fbm(n * 22.0 - vec3(time * 0.11, 0.0, time * 0.07));
    float plasma = mix(cells, gran, 0.42);

    float tex = texture2D(photoMap, vUv).r;
    plasma = plasma * 0.78 + tex * 0.34;

    // Deep fiery orange-red plasma ramp
    vec3 deep  = vec3(0.22, 0.020, 0.002);
    vec3 mid   = vec3(0.72, 0.115, 0.010);
    vec3 hot   = vec3(0.98, 0.34, 0.045);
    vec3 white = vec3(1.00, 0.62, 0.20);
    vec3 color = mix(deep, mid, smoothstep(0.20, 0.52, plasma));
    color = mix(color, hot, smoothstep(0.52, 0.80, plasma));
    color = mix(color, white, smoothstep(0.86, 1.00, plasma) * 0.8);

    // Bright supergranular flare veins
    float veins = pow(clamp(fbm(n * 9.0 + vec3(time * 0.09)) , 0.0, 1.0), 5.0);
    color += vec3(1.0, 0.42, 0.10) * veins * 1.2;


    // Darker, cooler pores (sunspot-like)
    float pores = smoothstep(0.66, 0.90, fbm(n * 3.1 - vec3(time * 0.02)));
    color *= 1.0 - pores * 0.55;

    // Limb darkening then a hot chromospheric rim right at the edge
    float mu = clamp(dot(n, normalize(vViewDir)), 0.0, 1.0);
    color *= 0.42 + 0.58 * pow(mu, 0.55);
    color += vec3(1.0, 0.45, 0.12) * pow(1.0 - mu, 3.2) * 0.85;

    gl_FragColor = vec4(color * 1.15, 1.0);
  }
`;

function SunSurface() {
  const info = BODIES.Sun;
  const map = useTexture(info.map);
  const uniforms = useMemo(
    () => ({ photoMap: { value: map }, time: { value: 0 } }),
    [map],
  );
  const coronaRef = useRef<THREE.ShaderMaterial>(null);
  const coronaUniforms = useMemo(
    () => ({ time: { value: 0 }, tint: { value: new THREE.Color("#ff8a2b") } }),
    [],
  );

  useFrame((_, dt) => {
    uniforms.time.value += dt;
    coronaUniforms.time.value += dt;
  });

  const r = info.radius;
  return (
    <Group>
      <Mesh>
        <SphereGeometry args={[r, 128, 128]} />
        <ShaderMaterial vertexShader={sunVert} fragmentShader={sunFrag} uniforms={uniforms} />
      </Mesh>
      {/* Soft, wispy corona — one shell, additive, no hard neon ring */}
      <Mesh>
        <SphereGeometry args={[r * 1.9, 96, 96]} />
        <ShaderMaterial
          ref={coronaRef}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={coronaUniforms}
          vertexShader={/* glsl */ `
            varying vec3 vNormalV;
            varying vec3 vNormalW;
            void main() {
              vNormalV = normalize(normalMatrix * normal);
              vNormalW = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 tint;
            uniform float time;
            varying vec3 vNormalV;
            varying vec3 vNormalW;
            float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
            float nz(vec3 p){
              vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
              float a = mix(mix(mix(h(i), h(i+vec3(1,0,0)), f.x), mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
                            mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x), mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y), f.z);
              return a;
            }
            void main() {
              float rim = pow(clamp(1.0 - abs(dot(vNormalV, vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 2.2);
              float streamers = 0.55 + 0.45 * nz(normalize(vNormalW) * 7.0 + vec3(time * 0.05));
              float a = rim * streamers * 0.26;
              gl_FragColor = vec4(tint * a, a);
            }
          `}
        />
      </Mesh>
      <PointLight intensity={150} distance={80} decay={2} color="#ffb066" />
    </Group>
  );
}

/* ---------------- Generic textured body ---------------- */

function TexturedBody({ id, heat, terminator }: { id: BodyId; heat: number; terminator: number }) {
  const info = BODIES[id];
  const maps = useTexture(info.bump ? [info.map, info.bump] : [info.map]);
  const map = maps[0]!;
  const bump = info.bump ? maps[1] : undefined;



  return (
    <Group>
      <Mesh castShadow>
        <SphereGeometry args={[info.radius, 96, 96]} />
        <MeshStandardMaterial
          map={map}
          bumpMap={bump ?? null}
          bumpScale={info.bumpScale ?? 0}
          roughness={info.roughness}
          metalness={info.metalness}
          emissive={new THREE.Color(heat > 0 ? "#ff5b1f" : "#000000")}
          emissiveIntensity={heat * 0.35}
          color={terminator < 0.5 ? "#ffffff" : "#e8eef7"}
        />
      </Mesh>
      {(id === "Venus") && <Atmosphere radius={info.radius * 1.06} color={info.accent} />}
    </Group>
  );
}

/* ---------------- Rings ---------------- */

function PlanetRing({ id }: { id: BodyId }) {
  const ring = BODIES[id].ring!;
  const texture = useTexture(ring.map);
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(ring.inner, ring.outer, 256, 4);
    const pos = geo.attributes["position"] as THREE.BufferAttribute;
    const uv = geo.attributes["uv"] as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const t = (v.length() - ring.inner) / (ring.outer - ring.inner);
      uv.setXY(i, t, i % 2 === 0 ? 0 : 1);
    }
    uv.needsUpdate = true;
    return geo;
  }, [ring.inner, ring.outer]);

  return (
    <Mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
      <MeshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.94}
        alphaMap={texture}
        alphaTest={0.02}
        roughness={0.85}
        metalness={0.05}
        depthWrite={false}
      />
    </Mesh>
  );
}


/* ---------------- Surface pins ---------------- */

function Pins({
  body,
  visible,
  onSelect,
  onPosition,
}: {
  body: BodyId;
  visible: boolean;
  onSelect: (pin: SurfacePin) => void;
  onPosition: (id: string, pos: THREE.Vector3) => void;
}) {
  const pins = pinsFor(body);
  const radius = BODIES[body].radius;
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const world = useRef(new THREE.Vector3());

  useFrame(() => {
    pins.forEach((pin) => {
      const g = refs.current[pin.id];
      if (g) onPosition(pin.id, g.getWorldPosition(world.current).clone());
    });
  });

  if (!visible || pins.length === 0) return null;

  return (
    <Group>
      {pins.map((pin) => {
        const p = latLonToVec3(pin.lat, pin.lon, radius * 1.01);
        return (
          <Group key={pin.id} position={p} ref={(el: THREE.Group | null) => void (refs.current[pin.id] = el)}>
            <Mesh
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                onSelect(pin);
              }}
            >
              <SphereGeometry args={[radius * 0.022, 12, 12]} />
              <MeshBasicMaterial color="#FACC15" toneMapped={false} />
            </Mesh>
            {/* Soft coordinate halo so pins stay legible against bright terrain */}
            <Mesh>
              <SphereGeometry args={[radius * 0.05, 16, 16]} />
              <MeshBasicMaterial
                color="#FACC15"
                transparent
                opacity={0.16}
                toneMapped={false}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
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


/* ---------------- Live orbiters (real hardware) ---------------- */

function Orbiters({
  body,
  radius,
  playing,
  speed,
  onAssetSelect,
  onAssetPosition,
}: {
  body: BodyId;
  radius: number;
  playing: boolean;
  speed: number;
  onAssetSelect: (asset: SpaceAsset) => void;
  onAssetPosition: (id: string, pos: THREE.Vector3) => void;
}) {
  const assets = useMemo(() => assetsFor(body), [body]);
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const world = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const delta = playing ? dt * speed : 0;
    assets.forEach((a) => {
      const g = refs.current[a.id];
      if (!g) return;
      if (delta) g.rotation.y += delta * (a.orbitSpeed ?? 0.4) * 0.25;
      const marker = g.children[0];
      if (marker) onAssetPosition(a.id, marker.getWorldPosition(world.current).clone());
    });
  });

  return (
    <Group>
      {assets.map((a) => {
        const r = radius * (a.orbitFactor ?? 1.3);
        const isShell = a.count > 1;
        return (
          <Group key={a.id} rotation={[((a.inclination ?? 0) * Math.PI) / 180, ((a.phase ?? 0) * Math.PI) / 180, 0]}>
            <Group ref={(el: THREE.Group | null) => void (refs.current[a.id] = el)}>
              <Mesh
                position={[r, 0, 0]}
                onClick={(e: { stopPropagation: () => void }) => {
                  e.stopPropagation();
                  onAssetSelect(a);
                }}
              >
                <SphereGeometry args={[radius * (isShell ? 0.03 : 0.022), 12, 12]} />
                <MeshBasicMaterial color={a.accent ?? "#93c5fd"} toneMapped={false} />
              </Mesh>
              <SafeHtml position={[r, radius * 0.06, 0]} distanceFactor={2.4} zIndexRange={[20, 0]}>
                <button className="pin-label" onClick={() => onAssetSelect(a)}>
                  <i />
                  {a.name.split(" (")[0]}
                </button>
              </SafeHtml>
            </Group>
            {/* Shell / orbit trace */}
            {isShell
              ? Array.from({ length: 5 }, (_, k) => (
                  <Mesh key={k} rotation={[-Math.PI / 2, 0, (k * Math.PI) / 5]}>
                    <RingGeometry args={[r - 0.002, r + 0.002, 128]} />
                    <MeshBasicMaterial
                      color={a.accent ?? "#1e3a5f"}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={0.16}
                    />
                  </Mesh>
                ))
              : (
                  <Mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <RingGeometry args={[r - 0.002, r + 0.002, 128]} />
                    <MeshBasicMaterial
                      color={a.accent ?? "#1e3a5f"}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={0.3}
                    />
                  </Mesh>
                )}
          </Group>
        );
      })}
    </Group>
  );
}

/* ---------------- Body rig ---------------- */

function BodyRig({
  body,
  layers,
  playing,
  speed,
  sunDir,
  onPinSelect,
  onBodyClick,
  onAssetSelect,
  onAssetPosition,
}: Omit<SceneProps, "rideAlong" | "focus" | "zoomRequest" | "sunAzimuth" | "sunElevation"> & {
  sunDir: THREE.Vector3;
  onAssetPosition: (id: string, pos: THREE.Vector3) => void;
}) {
  const info = BODIES[body];
  const spinner = useRef<THREE.Group>(null);
  const heat = layers.temperature ? 1 : 0;
  const terminator = layers.terminator ? 1 : 0;

  useFrame((_, dt) => {
    if (spinner.current && playing) spinner.current.rotation.y += dt * info.spin * speed * 0.4;
  });

  const showPins = layers.landingSites || layers.craters;

  return (
    <Group rotation={[0, 0, (info.tilt * Math.PI) / 180]}>
      <Group ref={spinner} onClick={() => onBodyClick(body)}>
        {body === "Sun" ? (
          <SunSurface />
        ) : body === "Earth" ? (
          <EarthSurface terminator={terminator} heat={heat} sunDir={sunDir} />

        ) : GAS_GIANTS.includes(body) ? (
          <GasGiantSurface id={body} sunDir={sunDir} terminator={terminator} heat={heat} />
        ) : (
          <TexturedBody id={body} heat={heat} terminator={terminator} />
        )}

        <Pins body={body} visible={showPins} onSelect={onPinSelect} onPosition={onAssetPosition} />
      </Group>
      {info.ring ? <PlanetRing id={body} /> : null}
      {layers.orbiters ? (
        <Orbiters
          body={body}
          radius={info.radius}
          playing={playing}
          speed={speed}
          onAssetSelect={onAssetSelect}
          onAssetPosition={onAssetPosition}
        />
      ) : null}
    </Group>
  );
}



/* ---------------- Camera interpolation & fly-to ---------------- */

function CameraRig({
  body,
  rideAlong,
  focus,
  zoomRequest,
  positions,
  controls,
}: {
  body: BodyId;
  rideAlong: boolean;
  focus: string | null;
  zoomRequest: { id: number; factor: number } | null;
  positions: React.RefObject<Record<string, THREE.Vector3>>;
  controls: React.RefObject<{ target: THREE.Vector3; update: () => void } | null>;
}) {
  const { camera } = useThree();
  const distTarget = useRef<number | null>(BODIES[body].radius * 3.4);
  const recenter = useRef(true);
  const focusPoint = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());
  const zero = useRef(new THREE.Vector3());

  useEffect(() => {
    const r = BODIES[body].radius;
    distTarget.current = rideAlong ? r * 1.55 : r * 3.4;
    recenter.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, rideAlong]);


  // Floating +/- buttons: step the orbit distance and let the frame loop lerp there.
  useEffect(() => {
    if (!zoomRequest) return;
    const origin = controls.current?.target ?? zero.current;
    const current = camera.position.distanceTo(origin) || 1;
    distTarget.current = THREE.MathUtils.clamp(current * zoomRequest.factor, 1.2, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomRequest?.id]);

  useFrame((_, dt) => {
    const ctl = controls.current;
    const target = focus ? positions.current?.[focus] : null;

    if (target) {
      // Smooth fly-to: lerp the orbit target onto the selected asset and close in.
      focusPoint.current.copy(target);
      if (ctl) ctl.target.lerp(focusPoint.current, Math.min(1, dt * 2.6));
      const stand = BODIES[body].radius * 2.1;
      const len = focusPoint.current.length() || 1;
      tmp.current.copy(focusPoint.current).multiplyScalar((len + stand) / len);
      camera.position.lerp(tmp.current, Math.min(1, dt * 1.8));
      ctl?.update();
      distTarget.current = null;
      recenter.current = false;
      return;
    }

    // Only re-centre right after a body / mode change — otherwise panning stays free.
    if (recenter.current && ctl) {
      ctl.target.lerp(zero.current.set(0, 0, 0), Math.min(1, dt * 2.4));
      if (ctl.target.lengthSq() < 1e-5) {
        ctl.target.set(0, 0, 0);
        recenter.current = false;
      }
      ctl.update();
    }

    if (distTarget.current != null) {
      const origin = ctl?.target ?? zero.current.set(0, 0, 0);
      tmp.current.copy(camera.position).sub(origin);
      const len = tmp.current.length() || 1;
      const next = THREE.MathUtils.damp(len, distTarget.current, 3.2, dt);
      camera.position.copy(origin).addScaledVector(tmp.current.multiplyScalar(1 / len), next);
      if (Math.abs(next - distTarget.current) < 0.005) distTarget.current = null;
      ctl?.update();
    }
  });

  return null;
}

/* ---------------- Deep space: star field, Milky Way dust, named stars ---------------- */

const SKY_R = 700;

/* Bright catalogued stars and deep-space objects come from @/lib/deep-sky. */

function raDecToVec3(raHours: number, decDeg: number, r: number) {
  const ra = (raHours / 24) * Math.PI * 2;
  const dec = (decDeg * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(dec) * Math.cos(ra),
    r * Math.sin(dec),
    -r * Math.cos(dec) * Math.sin(ra),
  );
}

/**
 * Photorealistic Milky Way skybox: ESO / S. Brunier 360-degree deep-sky
 * panorama (equirectangular), mapped to the inside of the sky sphere.
 */
function useMilkyWayTexture() {
  const tex = useTexture(milkyWayAsset.url);
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
  }, [tex]);
  return tex;
}


const starVert = /* glsl */ `
  attribute float size;
  attribute float twinkle;
  varying vec3 vColor;
  varying float vTwinkle;
  uniform float time;
  void main() {
    vColor = color;
    vTwinkle = 0.78 + 0.22 * sin(time * 1.6 + twinkle * 6.283);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mv;
  }
`;

const starFrag = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = length(d) * 2.0;
    float core = smoothstep(1.0, 0.0, r);
    float glow = pow(core, 3.4);
    float a = glow * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

function StarField() {
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  const geometry = useMemo(() => {
    const count = 14000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const twinkle = new Float32Array(count);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // Uniform direction, mildly concentrated toward the galactic band
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const v = new THREE.Vector3(s * Math.cos(theta), u, s * Math.sin(theta));
      if (Math.random() < 0.45) v.y *= 0.22;
      v.normalize().multiplyScalar(SKY_R * (0.92 + Math.random() * 0.08));
      pos.set([v.x, v.y, v.z], i * 3);

      // Realistic magnitude distribution: mostly faint pinpoints
      const bright = Math.pow(Math.random(), 3.2);
      size[i] = 0.9 + bright * 4.4;
      twinkle[i] = Math.random();

      // Spectral colours from cool red through hot blue-white
      const t = Math.random();
      const hue = t < 0.12 ? 0.06 : t < 0.32 ? 0.1 : t < 0.75 ? 0.14 : 0.58;
      c.setHSL(hue, t < 0.75 ? 0.35 : 0.42, 0.62 + bright * 0.3);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("twinkle", new THREE.BufferAttribute(twinkle, 1));
    return geo;
  }, []);

  useFrame((_, dt) => {
    uniforms.time.value += dt;
  });

  return (
    <Points geometry={geometry} frustumCulled={false}>
      <ShaderMaterial
        vertexShader={starVert}
        fragmentShader={starFrag}
        uniforms={uniforms}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}


/** Warm the catalogue colour toward solar gold / aerospace orange for HUD markers. */
function warmTint(hex: string) {
  const c = new THREE.Color(hex);
  return c.lerp(new THREE.Color("#FF9A2E"), 0.55).getStyle();
}

/**
 * Catalogued stars and deep-space objects rendered as clickable sky markers
 * with scientific HUD annotations (tick + connector line + name block).
 */
function NamedStars({
  showLabels,
  selectedId,
  onSelect,
}: {
  showLabels: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { camera } = useThree();
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const prev = useRef(new THREE.Vector3());
  const fade = useRef(1);
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, dt) => {
    // Fade the labels while the user is orbiting, restore them when the view settles.
    const moved = camera.position.distanceTo(prev.current);
    prev.current.copy(camera.position);
    // Close-up planetary inspection (camera tucked in near the body) shrinks and
    // fades the deep-sky annotations so they never clutter the surface view.
    const dist = camera.position.length();
    const proximity = THREE.MathUtils.clamp((dist - 3) / 9, 0, 1);
    const want = (moved > 0.02 ? 0.3 : 1) * (0.12 + proximity * 0.88);
    fade.current = THREE.MathUtils.damp(fade.current, want, 5, dt);
    const scale = 0.62 + proximity * 0.38;
    labels.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = String(fade.current);
      el.style.setProperty("--sky-label-scale", scale.toFixed(3));
      el.style.pointerEvents = fade.current < 0.25 ? "none" : "auto";
    });
    if (pulse.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.16;
      pulse.current.scale.setScalar(s);
    }
  });

  return (
    <Group>
      {SKY_OBJECTS.map((s, i) => {
        const p = raDecToVec3(s.ra, s.dec, SKY_R * 0.86);
        const isStar = s.kind === "star";
        const scale = isStar ? 1.9 - Math.min(s.mag, 2) * 0.28 : 2.2;
        const selected = selectedId === s.id;
        const tint = warmTint(s.color);
        return (
          <Group key={s.id} position={p}>
            <Mesh
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                onSelect(s.id);
              }}
            >
              <SphereGeometry args={[(isStar ? 1.5 : 3.2) * scale, 12, 12]} />
              <MeshBasicMaterial color={tint} toneMapped={false} />
            </Mesh>
            <Mesh>
              <SphereGeometry args={[(isStar ? 6.5 : 11) * scale, 16, 16]} />
              <MeshBasicMaterial
                color={tint}
                transparent
                opacity={selected ? 0.3 : 0.14}
                toneMapped={false}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </Mesh>
            {selected && (
              <Mesh ref={pulse}>
                <SphereGeometry args={[16 * scale, 20, 20]} />
                <MeshBasicMaterial
                  color={tint}
                  transparent
                  opacity={0.12}
                  toneMapped={false}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </Mesh>
            )}
            {showLabels && (
              <SafeHtml center distanceFactor={SKY_R * 0.5} zIndexRange={[8, 0]}>
                <button
                  ref={(el: HTMLButtonElement | null) =>
                    void (labels.current[i] = el as unknown as HTMLDivElement)
                  }
                  onClick={() => onSelect(s.id)}
                  className={`sky-annotation ${selected ? "is-selected" : ""}`}
                >
                  <span className="sky-annotation-line" aria-hidden />
                  <span className="sky-annotation-body">
                    <b>{s.name}</b>
                    <em>{s.designation}</em>
                    <i>{s.blurb}</i>
                  </span>
                </button>
              </SafeHtml>
            )}
          </Group>
        );
      })}
    </Group>
  );
}

/** Constellation stick figures drawn on the celestial sphere. */
function ConstellationLines() {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (const c of CONSTELLATIONS) {
      for (const path of c.lines) {
        for (let i = 0; i < path.length - 1; i++) {
          const a = raDecToVec3(path[i]![0], path[i]![1], SKY_R * 0.855);
          const b = raDecToVec3(path[i + 1]![0], path[i + 1]![1], SKY_R * 0.855);
          pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <Group>
      <LineSegments geometry={geometry} frustumCulled={false}>
        <LineBasicMaterial
          color="#F5A623"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </LineSegments>
      {CONSTELLATIONS.map((c) => {
        const all = c.lines.flat();
        const centre = all
          .reduce(
            (acc, [ra, dec]) => acc.add(raDecToVec3(ra, dec, SKY_R * 0.855)),
            new THREE.Vector3(),
          )
          .divideScalar(all.length);
        return (
          <Group key={c.id} position={centre}>
            <SafeHtml center distanceFactor={SKY_R * 0.62} zIndexRange={[6, 0]}>
              <div className="constellation-label">{c.name}</div>
            </SafeHtml>
          </Group>
        );
      })}
    </Group>
  );
}

function DeepSpace({
  showLabels,
  showConstellations,
  selectedId,
  onSelect,
}: {
  showLabels: boolean;
  showConstellations: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const tex = useMilkyWayTexture();
  return (
    <Group rotation={[0, 0, (-60.2 * Math.PI) / 180]}>
      <Mesh frustumCulled={false}>
        <SphereGeometry args={[SKY_R * 1.35, 64, 64]} />
        <MeshBasicMaterial
          map={tex}
          color="#9aa0b4"
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </Mesh>
      <StarField />
      {showConstellations && <ConstellationLines />}
      <NamedStars showLabels={showLabels} selectedId={selectedId} onSelect={onSelect} />
    </Group>
  );
}

/* ---------------- Canvas ---------------- */


export default function CelestialScene(props: SceneProps) {
  const {
    body,
    layers,
    rideAlong,
    focus,
    zoomRequest,
    sunAzimuth,
    sunElevation,
    starLabels = true,
    constellations = false,
    selectedSkyId = null,
    onSkySelect,
  } = props;
  const [ready, setReady] = useState(false);
  const positions = useRef<Record<string, THREE.Vector3>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controls = useRef<any>(null);
  const sunDir = useMemo(() => sunVector(sunAzimuth, sunElevation), [sunAzimuth, sunElevation]);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  const dynamic = layers.terminator;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.4, 6], fov: 45, near: 0.01, far: 2000 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <SceneColor attach="background" args={["#050811"]} />
      <AmbientLight intensity={dynamic ? 0.12 : 0.9} />
      {body !== "Sun" && (
        <DirectionalLight
          position={sunDir.clone().multiplyScalar(12).toArray()}
          intensity={dynamic ? 2.8 : 1.4}
          color="#fff5e0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={40}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
      )}

      <DeepSpace
        showLabels={starLabels}
        showConstellations={constellations}
        selectedId={selectedSkyId}
        onSelect={(id) => onSkySelect?.(id)}
      />
      <BodyRig
        {...props}
        sunDir={sunDir}
        onAssetPosition={(id, pos) => {
          positions.current[id] = pos;
        }}
      />
      <CameraRig
        body={body}
        rideAlong={rideAlong}
        focus={focus}
        zoomRequest={zoomRequest}
        positions={positions}
        controls={controls}
      />
      <SafeOrbitControls
        ref={controls}
        makeDefault
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.08}
        screenSpacePanning
        minDistance={0.05}
        maxDistance={400}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        zoomSpeed={0.9}
        panSpeed={0.7}
        rotateSpeed={0.55}
        autoRotate={rideAlong}
        autoRotateSpeed={0.9}
      />
    </Canvas>
  );
}

