"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Vector3, type Mesh } from "three";
import { constellationColors as colors } from "@data/marketing";

const members: [number, number, number][] = [
  [-1.65, 0.75, 0],
  [-1.85, 0, 0.12],
  [-1.65, -0.75, 0],
];
function Scene({ phase, progress }: { phase: number; progress: number }) {
  const moving = useRef<Mesh>(null);
  const { invalidate } = useThree();
  const target = new Vector3(
    phase >= 5 ? 1.7 : phase >= 3 ? 1 : 0.35,
    phase >= 5 ? 0.7 : -0.65,
    0.1,
  );
  useEffect(() => {
    invalidate();
  }, [phase, progress, invalidate]);
  useFrame((_, delta) => {
    if (!moving.current) return;
    moving.current.position.lerp(target, Math.min(1, delta * 7));
    if (moving.current.position.distanceTo(target) > 0.002) invalidate();
  });
  const arc = Array.from({ length: 49 }, (_, index) => {
    const angle = Math.PI / 2 - ((index / 48) * Math.PI * 2 * progress) / 100;
    return [Math.cos(angle) * 0.66, Math.sin(angle) * 0.66, 0] as [
      number,
      number,
      number,
    ];
  });
  return (
    <group>
      {members.map((position, index) => (
        <group key={index}>
          <Line
            points={[position, [0, 0, 0]]}
            color={colors.connection}
            opacity={phase >= 2 ? 0.7 : 0.25}
            transparent
            lineWidth={1}
          />
          <Sphere args={[0.12, 16, 16]} position={position}>
            <meshStandardMaterial color={colors.member} roughness={0.6} />
          </Sphere>
        </group>
      ))}
      <Line
        points={[
          [0, 0, 0],
          [1.7, 0.7, 0],
          [1.7, -0.7, 0],
          [0, 0, 0],
        ]}
        color={colors.connection}
        transparent
        opacity={0.4}
        lineWidth={1}
      />
      <Line points={arc} color={colors.done} lineWidth={2} />
      <Sphere args={[0.36, 24, 24]}>
        <meshStandardMaterial
          color={colors.core}
          roughness={0.4}
          metalness={0.15}
        />
      </Sphere>
      <mesh position={[1.7, 0.7, 0]}>
        <boxGeometry args={[0.21, 0.21, 0.21]} />
        <meshStandardMaterial color={colors.done} />
      </mesh>
      <mesh position={[1.7, -0.7, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={colors.task} />
      </mesh>
      <mesh ref={moving} position={[0.35, -0.65, 0.1]}>
        <sphereGeometry args={[0.115, 16, 16]} />
        <meshStandardMaterial
          color={phase >= 5 ? colors.done : colors.active}
        />
      </mesh>
    </group>
  );
}
export default function ProjectConstellationCanvas({
  phase,
  progress,
  onFailure,
}: {
  phase: number;
  progress: number;
  onFailure: () => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 5], fov: 47 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
      }}
    >
      <color attach="background" args={[colors.background]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <Scene phase={phase} progress={progress} />
    </Canvas>
  );
}
