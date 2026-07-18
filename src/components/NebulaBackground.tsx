import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function getParticleCount(): number {
  if (typeof window === 'undefined') return 2000;
  return window.innerWidth < 768 ? 800 : 2000;
}

function Particles({ particleCount }: { particleCount: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vel];
  }, [particleCount]);

  const sizes = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      s[i] = Math.random() * 3 + 0.5;
    }
    return s;
  }, [particleCount]);

  useFrame(({ pointer }) => {
    if (!meshRef.current) return;

    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    mouseRef.current.x = pointer.x * viewport.width * 0.5;
    mouseRef.current.y = pointer.y * viewport.height * 0.5;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const dx = mouseRef.current.x - arr[ix];
      const dy = mouseRef.current.y - arr[ix + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 3 - dist) * 0.002;

      arr[ix] += velocities[ix] + dx * force;
      arr[ix + 1] += velocities[ix + 1] + dy * force;
      arr[ix + 2] += velocities[ix + 2];

      if (arr[ix] > 10) arr[ix] = -10;
      if (arr[ix] < -10) arr[ix] = 10;
      if (arr[ix + 1] > 10) arr[ix + 1] = -10;
      if (arr[ix + 1] < -10) arr[ix + 1] = 10;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d4a843"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function NebulaBackground() {
  const particleCount = useMemo(() => getParticleCount(), []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles particleCount={particleCount} />
      </Canvas>
    </div>
  );
}
