"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
const nodes = [
  { p: [-1.7, 0.9, 0] as [number, number, number], c: "#DDF0ED", s: 0.14 },
  { p: [1.6, 1.05, -0.2] as [number, number, number], c: "#F5FAF9", s: 0.12 },
  { p: [-1.25, -1.15, 0.1] as [number, number, number], c: "#A56A18", s: 0.13 },
  { p: [1.45, -1.05, 0] as [number, number, number], c: "#DDF0ED", s: 0.16 },
];
function Scene() {
  const group = useRef<Group>(null);
  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    group.current.rotation.y +=
      (pointer.x * 0.12 - group.current.rotation.y) * delta * 2;
    group.current.rotation.x +=
      (-pointer.y * 0.08 - group.current.rotation.x) * delta * 2;
  });
  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <group key={i}>
          <Line
            points={[[0, 0, 0], n.p]}
            color="#4f8582"
            transparent
            opacity={0.52}
            lineWidth={1}
          />
          <Sphere args={[n.s, 18, 18]} position={n.p}>
            <meshStandardMaterial color={n.c} roughness={0.55} />
          </Sphere>
        </group>
      ))}
      <Sphere args={[0.42, 28, 28]}>
        <meshStandardMaterial color="#176B68" roughness={0.3} />
      </Sphere>
    </group>
  );
}
export default function ProjectConstellationCanvas() {
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0, 0, 5], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} />
      <Scene />
    </Canvas>
  );
}
