"use client";
import { Canvas } from "@react-three/fiber";
import { Line, Sphere, Torus } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

// Real-world concepts
const people = [
  { p: new THREE.Vector3(-1.8, 0.8, 0.2), c: "#DDF0ED", s: 0.12 },
  { p: new THREE.Vector3(-1.9, 0, -0.2), c: "#DDF0ED", s: 0.14 },
  { p: new THREE.Vector3(-1.6, -0.9, 0.1), c: "#DDF0ED", s: 0.12 },
];

const tasks = [
  { p: new THREE.Vector3(1.7, 1.1, -0.1), c: "#F5FAF9", s: 0.1 },
  { p: new THREE.Vector3(2.0, 0.2, 0.2), c: "#A56A18", s: 0.14 },
  { p: new THREE.Vector3(1.6, -0.8, -0.2), c: "#F5FAF9", s: 0.12 },
];

function Connection({ start, end, active }: { start: THREE.Vector3; end: THREE.Vector3; active?: boolean }) {
  return (
    <group>
      <Line
        points={[start, end]}
        color={active ? "#A56A18" : "#4f8582"}
        transparent
        opacity={active ? 0.8 : 0.4}
        lineWidth={active ? 2 : 1}
      />
      {active && (
        <Sphere args={[0.04, 12, 12]} position={start.clone().lerp(end, 0.5)}>
          <meshBasicMaterial color="#A56A18" />
        </Sphere>
      )}
    </group>
  );
}

function Scene({ phase }: { phase: number }) {
  const origin = new THREE.Vector3(0, 0, 0);

  // Phase mapping
  const personConnected = phase >= 2;
  const taskConnected = phase >= 3;
  const progressLength = phase >= 4 ? Math.PI * 1.2 : 0.1;

  return (
    <group>
      {/* People Connections */}
      {people.map((n, i) => (
        <group key={`p-${i}`}>
          <Connection start={n.p} end={origin} active={i === 1 && personConnected} />
          <Sphere args={[n.s, 24, 24]} position={n.p}>
            <meshStandardMaterial color={n.c} roughness={0.4} />
          </Sphere>
        </group>
      ))}

      {/* Task Connections */}
      {tasks.map((n, i) => (
        <group key={`t-${i}`}>
          <Connection start={origin} end={n.p} active={i === 1 && taskConnected} />
          <Sphere args={[n.s, 24, 24]} position={n.p}>
            <meshStandardMaterial color={n.c} roughness={0.4} />
          </Sphere>
        </group>
      ))}

      {/* Central Project Core */}
      <Sphere args={[0.45, 32, 32]}>
        <meshStandardMaterial color="#176B68" roughness={0.2} />
      </Sphere>

      {/* Progress Arc */}
      <Torus args={[0.7, 0.02, 16, 100, progressLength]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#A56A18" emissive="#A56A18" emissiveIntensity={0.5} roughness={0.2} />
      </Torus>
      
      {/* Background Arc Track */}
      <Torus args={[0.7, 0.01, 16, 100, Math.PI * 2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4f8582" transparent opacity={0.2} />
      </Torus>
    </group>
  );
}

export default function ProjectConstellationCanvas({ phase = 0 }: { phase?: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 5]} intensity={2.5} />
      <Scene phase={phase} />
    </Canvas>
  );
}
