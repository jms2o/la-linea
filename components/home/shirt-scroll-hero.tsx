"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimatedButton } from "@/components/ui/animated-button";

type ShirtScrollHeroProps = {
  whatsappHref: string;
};

const SHIRT_MODEL_PATH = "/models/shirt.glb";
useGLTF.preload(SHIRT_MODEL_PATH);

// Model's own bounding box (from gltf-transform inspect) isn't centered on
// origin, so we shift it back by its center. Scale is animated separately.
const MODEL_RECENTER: [number, number, number] = [-0.006, -1.275, 0.003];

type Waypoint = [number, number, number];

type ShirtPlan = {
  color: string;
  start: Waypoint;
  peak: Waypoint;
  end: Waypoint;
  scaleStart: number;
};

// Camisa 1 (main/front), camisa 2 (ends left), camisa 3 (ends right). All
// three move together through the same three stages as you scroll:
// middle (start) -> right (peak, together) -> centered row (end, together).
// Waypoints and margins were checked by hand at t=0/.25/.5/.6/.75/.809/.85/.9/1
// for every pair so none of them clip through each other along the way.
// Positions are scaled up 15% together with SCALE_REST below (not just the
// shirt size on its own) so the relative gaps grow with them and those
// checked margins still hold.
const SHIRT_PLANS: ShirtPlan[] = [
  {
    // y lowered so the much bigger start scale doesn't push the collar
    // above the top of frame.
    color: "#f2f2f2",
    start: [0, -0.5, 1.15],
    peak: [1.54, 0, 1.15],
    end: [0, 0, 0.69],
    scaleStart: 5.06
  },
  {
    // z pulled back further (-0.2 -> -0.75) to stay clear of shirt 1's now
    // even bigger starting scale (checked by hand across raw local
    // 0/.1/.2/.3/.6/.9 in segment 1 - tightest margin ~6% right at t=0,
    // where shirt 2 is still scale ~0.06 and effectively invisible anyway).
    color: "#8a8a8a",
    start: [-0.23, 0, -0.75],
    peak: [0.965, 0.72, -0.345],
    end: [-1.495, 0, -0.92],
    scaleStart: 0.0575
  },
  {
    color: "#2e2e2e",
    start: [0.23, 0, -0.75],
    peak: [2.915, -0.92, -0.345],
    end: [1.495, 0, -0.92],
    scaleStart: 0.0575
  }
];

const SCALE_REST = 2.07;
// Final centered-row size: two stacked 15% bumps over SCALE_REST (only the
// very end of the sequence grows further; the right-side hold stays at
// SCALE_REST). Margins near the end were rechecked by hand at several
// local fractions and stay positive but tighter now (~8.5% minimum).
const SCALE_END = SCALE_REST * 1.15 * 1.15;

// A single full turn each, so rotation.y ends on a multiple of 2*PI (facing
// the camera) without spinning so much it feels dizzying.
const SPIN_TURNS = [1, 1, 1];

// The shirts travel to the right-side waypoint, hold still there facing the
// camera for a beat, then swing back together to the centered row.
const HOLD_START_T = 0.45;
const HOLD_END_T = 0.55;

// Shirt 1 now starts huge (150% bigger than its resting size) and shrinks
// down as it heads right. Shirts 2 and 3 stay hidden at their tiny start
// scale/position until shirt 1 has shrunk for a while, then emerge over the
// remaining fraction of segment 1 - otherwise they'd grow into shirt 1's
// still-large volume and clip (checked by hand across local 0/.3/.4/.5/.7/.9;
// with this delay, margins stay positive at ~7-22%).
const EMERGE_DELAY = 0.4;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

// Below this breakpoint the scroll-jacked 3D hero is skipped entirely (no
// Canvas/WebGL mounted, not just visually hidden) since it's the heaviest
// thing on the page and not worth the battery/CPU cost on phones.
const DESKTOP_QUERY = "(min-width: 768px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export function ShirtScrollHero({ whatsappHref }: ShirtScrollHeroProps) {
  const isDesktop = useIsDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  // Title rises while the shirts head out to the right together, stays up
  // through their hold at the right, then starts fading out right as they
  // begin swinging back to the centered row (progress ~0.45, matching
  // HOLD_END_T translated from the shirts' eased "t" back into raw scroll
  // progress). On mobile there's no 3D animation driving this, so the text
  // just stays fully visible instead of tracking scroll progress.
  const desktopTextOpacity = useTransform(scrollYProgress, [0, 0.32, 0.45, 0.85], [0, 1, 1, 0]);
  const desktopTextX = useTransform(scrollYProgress, [0, 0.32], [-30, 0]);

  return (
    <section
      ref={containerRef}
      id="inicio"
      className={isDesktop ? "relative h-[460vh] bg-white" : "relative bg-white"}
    >
      <div
        className={
          isDesktop
            ? "sticky top-0 flex h-screen items-center overflow-hidden"
            : "flex items-center px-4 py-16 sm:px-6 lg:px-8"
        }
      >
        {isDesktop && (
          <>
            <div
              aria-hidden
              className="float-slow pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--blue)]/20 blur-3xl"
            />
            <div
              aria-hidden
              className="float-slow-delay pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--red)]/20 blur-3xl"
            />
          </>
        )}

        <div
          className={
            isDesktop
              ? "relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-4 sm:px-6 lg:px-8"
              : "mx-auto w-full max-w-xl"
          }
        >
          <motion.div
            style={isDesktop ? { opacity: desktopTextOpacity, x: desktopTextX } : undefined}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
              Camisas al menudeo y mayoreo
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              La Linea
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              Catalogo claro, precios por volumen y pedidos rapidos por WhatsApp
              para surtir desde una pieza hasta paquetes completos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AnimatedButton href="/catalogo" variant="solid">
                Ver catalogo{" "}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </AnimatedButton>
              <AnimatedButton href={whatsappHref} variant="outline">
                <MessageCircle size={18} /> Comprar por WhatsApp
              </AnimatedButton>
            </div>
          </motion.div>
        </div>

        {isDesktop && (
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 6.5], fov: 30 }}>
              <ambientLight intensity={0.75} />
              <directionalLight position={[3, 4, 5]} intensity={1.2} />
              <directionalLight position={[-3, -2, 3]} intensity={0.35} />
              <directionalLight position={[0, 3, -5]} intensity={0.4} />
              <Suspense fallback={null}>
                {SHIRT_PLANS.map((plan, index) => (
                  <Shirt3D key={index} index={index} plan={plan} progressRef={progressRef} />
                ))}
                <ContactShadows position={[0, -1.4, 0]} opacity={0.3} scale={8} blur={2.4} far={3} />
              </Suspense>
            </Canvas>
          </div>
        )}
      </div>
    </section>
  );
}

function Shirt3D({
  index,
  plan,
  progressRef
}: {
  index: number;
  plan: ShirtPlan;
  progressRef: MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(SHIRT_MODEL_PATH);

  const shirtScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = (child.material as THREE.MeshStandardMaterial).clone();
        material.color.set(plan.color);
        child.material = material;
      }
    });
    return cloned;
  }, [scene, plan.color]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current;
    const t = smoothstep(clamp01(progress / 0.85));

    // Full turn completes exactly as the shirts arrive at the right-side
    // waypoint (t = HOLD_START_T), so they're already facing the camera for
    // the hold and never spin again afterward.
    const spinT = smoothstep(clamp01(t / HOLD_START_T));
    group.rotation.y = spinT * Math.PI * 2 * (SPIN_TURNS[index] ?? 1);

    if (t <= HOLD_START_T) {
      const rawLocal = t / HOLD_START_T;
      const local =
        index === 0 ? rawLocal : clamp01((rawLocal - EMERGE_DELAY) / (1 - EMERGE_DELAY));
      lerpPosition(group, plan.start, plan.peak, local);
      group.scale.setScalar(THREE.MathUtils.lerp(plan.scaleStart, SCALE_REST, local));
    } else if (t <= HOLD_END_T) {
      group.position.set(...plan.peak);
      group.scale.setScalar(SCALE_REST);
    } else {
      const local = (t - HOLD_END_T) / (1 - HOLD_END_T);
      lerpPosition(group, plan.peak, plan.end, local);
      group.scale.setScalar(THREE.MathUtils.lerp(SCALE_REST, SCALE_END, local));
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={shirtScene} position={MODEL_RECENTER} />
    </group>
  );
}

function lerpPosition(group: THREE.Group, from: Waypoint, to: Waypoint, local: number) {
  group.position.x = THREE.MathUtils.lerp(from[0], to[0], local);
  group.position.y = THREE.MathUtils.lerp(from[1], to[1], local);
  group.position.z = THREE.MathUtils.lerp(from[2], to[2], local);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
