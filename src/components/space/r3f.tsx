/* eslint-disable @typescript-eslint/no-explicit-any */
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { createElement, forwardRef, type ComponentType } from "react";

/**
 * The dev JSX transform tags every JSX element with a `data-tsd-source`
 * attribute. Three.js instances reject unknown props on update, so every
 * three element used in the scene goes through these thin wrappers, which
 * strip the debug attribute before it reaches the renderer.
 */
function clean(props: any) {
  const next = { ...props };
  delete next["data-tsd-source"];
  delete next["data-lov-id"];
  return next;
}

function intrinsic(tag: string) {
  return forwardRef<any, any>((props, ref) => createElement(tag, { ...clean(props), ref }));
}

function wrap<P>(Component: ComponentType<P>) {
  return forwardRef<any, any>((props, ref) => createElement(Component as any, { ...clean(props), ref }));
}

export const Group = intrinsic("group");
export const Mesh = intrinsic("mesh");
export const Points = intrinsic("points");
export const SphereGeometry = intrinsic("sphereGeometry");
export const RingGeometry = intrinsic("ringGeometry");
export const MeshStandardMaterial = intrinsic("meshStandardMaterial");
export const MeshBasicMaterial = intrinsic("meshBasicMaterial");
export const ShaderMaterial = intrinsic("shaderMaterial");
export const AmbientLight = intrinsic("ambientLight");
export const DirectionalLight = intrinsic("directionalLight");
export const PointLight = intrinsic("pointLight");
export const SceneColor = intrinsic("color");
export const BufferGeometry = intrinsic("bufferGeometry");
export const PointsMaterial = intrinsic("pointsMaterial");
export const LineSegments = intrinsic("lineSegments");
export const LineBasicMaterial = intrinsic("lineBasicMaterial");

export const SafeStars = wrap(Stars as any);
export const SafeOrbitControls = wrap(OrbitControls as any);
export const SafeHtml = wrap(Html as any);
