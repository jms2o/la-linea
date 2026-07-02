"use client";

import { Suspense, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const SHIRT_MODEL_PATH = "/models/shirt.glb";
const MODEL_RECENTER: [number, number, number] = [-0.006, -1.275, 0.003];

useGLTF.preload(SHIRT_MODEL_PATH);

type ProductSpinViewerProps = {
  productName: string;
  color?: string;
  className?: string;
  compact?: boolean;
  thumbnail?: boolean;
};

export function ProductSpinViewer({
  productName,
  color = "#f4f1ea",
  className,
  compact = false,
  thumbnail = false
}: ProductSpinViewerProps) {
  const rotationRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const previousXRef = useRef(0);
  const cameraDistance = thumbnail ? 4.2 : compact ? 5.8 : 5.2;
  const cameraFov = thumbnail ? 30 : compact ? 34 : 32;

  return (
    <div
      className={cn(
        "relative h-full w-full cursor-grab overflow-hidden bg-[radial-gradient(circle_at_50%_18%,#ffffff_0%,#f3f4f6_46%,#e5e7eb_100%)] active:cursor-grabbing",
        className
      )}
      onPointerDown={(event) => {
        setDragging(true);
        previousXRef.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging) return;
        const delta = event.clientX - previousXRef.current;
        previousXRef.current = event.clientX;
        rotationRef.current += delta * 0.015;
      }}
      onPointerUp={(event) => {
        setDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => setDragging(false)}
      aria-label={`Vista 360 de ${productName}`}
      role="img"
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, cameraDistance], fov: cameraFov }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.82} />
        <directionalLight position={[3, 4, 5]} intensity={1.35} />
        <directionalLight position={[-4, 2, 3]} intensity={0.35} />
        <Suspense fallback={null}>
          <SpinShirt
            color={color}
            compact={compact}
            thumbnail={thumbnail}
            dragging={dragging}
            rotationRef={rotationRef}
          />
          <ContactShadows
            position={[0, thumbnail ? -1.42 : compact ? -1.55 : -1.45, 0]}
            opacity={thumbnail ? 0.22 : 0.26}
            scale={thumbnail ? 3.8 : compact ? 4.2 : 5}
            blur={2.2}
            far={3}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--foreground)] shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        360
      </div>
    </div>
  );
}

function SpinShirt({
  color,
  compact,
  thumbnail,
  dragging,
  rotationRef
}: {
  color: string;
  compact: boolean;
  thumbnail: boolean;
  dragging: boolean;
  rotationRef: MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(SHIRT_MODEL_PATH);

  const shirtScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = (child.material as THREE.MeshStandardMaterial).clone();
        material.color.set(color);
        material.roughness = 0.82;
        material.metalness = 0.02;
        child.material = material;
      }
    });
    return cloned;
  }, [scene, color]);

  useFrame((_, delta) => {
    if (!dragging) {
      rotationRef.current += delta * 0.55;
    }

    const group = groupRef.current;
    if (!group) return;

    group.rotation.y = rotationRef.current;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -0.08, 0.08);
  });

  return (
    <group
      ref={groupRef}
      scale={thumbnail ? 2.45 : compact ? 1.95 : 2.35}
      position={[0, thumbnail ? -0.02 : compact ? -0.08 : -0.02, 0]}
    >
      <primitive object={shirtScene} position={MODEL_RECENTER} />
    </group>
  );
}
