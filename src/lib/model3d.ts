import { useGLTF } from "@react-three/drei";

export const HERO_MODEL_PATH = "/camera_optimized.glb";
export const HERO_POSTER_PATH = "/camera-poster.svg";

export function preloadHeroModel(): void {
  useGLTF.preload(HERO_MODEL_PATH);
}
