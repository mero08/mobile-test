import { useRef, useState, useEffect, Suspense, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { HERO_MODEL_PATH, HERO_POSTER_PATH } from "@/lib/model3d";

class GLTFErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) {
      console.warn("[Model3DViewer] 3D model failed to load:", error.message || error);
    }
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

interface CameraModelProps {
  modelPath: string;
  isHovered: boolean;
  mousePos: { x: number; y: number };
  isScrolling: boolean;
}

function CameraModel({ modelPath, isHovered, mousePos, isScrolling }: CameraModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const material = child.material as THREE.MeshStandardMaterial;
      material.vertexColors = false;
      material.metalness = 0.4;
      material.roughness = 0.3;
      material.envMapIntensity = 0.3;
      material.emissiveIntensity = 0;
      material.needsUpdate = true;
      child.castShadow = true;
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current || isScrolling) return;

    groupRef.current.rotation.y += delta * 0.25;

    if (isHovered) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.y * 0.35,
        0.12
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mousePos.x * 0.2,
        0.12
      );
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.06);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.06);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} scale={1} position={[0, -0.15, 0]} />
    </group>
  );
}

interface CinematicLightingProps {
  transparent: boolean;
}

function CinematicLighting({ transparent }: CinematicLightingProps) {
  return (
    <>
      <directionalLight position={[4, 7, 4]} intensity={transparent ? 1.4 : 1.1} color="#fff8ee" castShadow />
      <directionalLight position={[-5, 3, -3]} intensity={0.3} color="#b0c8ff" />
      <directionalLight position={[0, -3, -6]} intensity={transparent ? 0.9 : 0.7} color="#d4882a" />
      <directionalLight position={[0, 8, 0]} intensity={0.2} color="#ffffff" />
      <ambientLight intensity={transparent ? 0.35 : 0.2} />
    </>
  );
}

interface SceneProps {
  modelPath: string;
  isHovered: boolean;
  mousePos: { x: number; y: number };
  transparent: boolean;
  isScrolling: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

function Scene({
  modelPath,
  isHovered,
  mousePos,
  transparent,
  isScrolling,
  setIsLoaded,
}: SceneProps) {
  useEffect(() => {
    setIsLoaded(true);
  }, [setIsLoaded]);

  return (
    <>
      <CinematicLighting transparent={transparent} />
      <Environment preset="night" />
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3} floatingRange={[-0.04, 0.04]}>
        <CameraModel
          modelPath={modelPath}
          isHovered={isHovered}
          mousePos={mousePos}
          isScrolling={isScrolling}
        />
      </Float>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.65}
          luminanceSmoothing={0.8}
          intensity={0.8}
          mipmapBlur
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}

interface Model3DViewerProps {
  modelPath?: string;
  posterPath?: string;
  height?: string;
  width?: string;
  backgroundColor?: string;
  transparent?: boolean;
}

export default function Model3DViewer({
  modelPath = HERO_MODEL_PATH,
  posterPath = HERO_POSTER_PATH,
  height = "600px",
  width = "100%",
  backgroundColor = "#0a0a0f",
  transparent = false,
}: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setIsScrolling(true);
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
        document.documentElement.classList.remove("is-scrolling");
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      style={{
        width,
        height,
        position: "relative",
        backgroundColor: transparent ? "transparent" : backgroundColor,
        borderRadius: transparent ? "0" : "16px",
        overflow: "hidden",
        cursor: "none",
        filter:
          isHovered && transparent
            ? "drop-shadow(0 0 40px hsl(43 80% 55% / 0.2))"
            : "none",
        transition: "filter 0.4s ease",
      }}
    >
      <img
        src={posterPath}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500"
        style={{ opacity: isLoaded ? 0 : 1 }}
      />
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
        camera={{ position: [0, 0.15, 2.4], fov: 42 }}
        shadows
        gl={{
          antialias: true,
          alpha: transparent,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          if (transparent) gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <GLTFErrorBoundary>
            <Scene
              modelPath={modelPath}
              isHovered={isHovered}
              mousePos={mousePos}
              transparent={transparent}
              isScrolling={isScrolling}
              setIsLoaded={setIsLoaded}
            />
          </GLTFErrorBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
}
