"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere, Torus, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
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
  const pulseRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (active && pulseRef.current) {
      timeRef.current += delta;
      const t = (timeRef.current * 0.6) % 1;
      pulseRef.current.position.lerpVectors(start, end, t);
    }
  });

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
        <Sphere ref={pulseRef} args={[0.04, 12, 12]}>
          <meshBasicMaterial color="#A56A18" />
        </Sphere>
      )}
    </group>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame(({ pointer }, delta) => {
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.15 - group.current.rotation.y) * delta * 2;
      group.current.rotation.x += (-pointer.y * 0.1 - group.current.rotation.x) * delta * 2;
    }
    if (coreRef.current) {
      timeRef.current += delta;
      coreRef.current.rotation.y = timeRef.current * 0.2;
    }
  });

  const origin = new THREE.Vector3(0, 0, 0);

  return (
    <group ref={group}>
      {/* People Connections */}
      {people.map((n, i) => (
        <group key={`p-${i}`}>
          <Connection start={n.p} end={origin} active={i === 1} />
          <Sphere args={[n.s, 24, 24]} position={n.p}>
            <meshStandardMaterial color={n.c} roughness={0.4} />
          </Sphere>
        </group>
      ))}

      {/* Task Connections */}
      {tasks.map((n, i) => (
        <group key={`t-${i}`}>
          <Connection start={origin} end={n.p} active={i === 1} />
          <Sphere args={[n.s, 24, 24]} position={n.p}>
            <meshStandardMaterial color={n.c} roughness={0.4} />
          </Sphere>
        </group>
      ))}

      {/* Central Project Core */}
      <Sphere ref={coreRef} args={[0.45, 32, 32]}>
        <MeshDistortMaterial color="#176B68" roughness={0.2} distort={0.2} speed={2} />
      </Sphere>

      {/* Progress Arc */}
      <Torus args={[0.7, 0.02, 16, 100, Math.PI * 1.2]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#A56A18" emissive="#A56A18" emissiveIntensity={0.5} roughness={0.2} />
      </Torus>
      
      {/* Background Arc Track */}
      <Torus args={[0.7, 0.01, 16, 100, Math.PI * 2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4f8582" transparent opacity={0.2} />
      </Torus>
    </group>
  );
}

export default function ProjectConstellationCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 5]} intensity={2.5} />
      <directionalLight position={[-3, -5, -5]} intensity={0.5} />
      <Scene />
    </Canvas>
  );
}
