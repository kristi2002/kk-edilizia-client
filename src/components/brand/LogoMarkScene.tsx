"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ART_FILL } from "./logo-mark-frame";

/**
 * The crest as an actual object: a stack of alpha-clipped layers in gold metal, lit by a
 * baked studio environment and turned by the pointer.
 *
 * It is deliberately not a CSS `rotate3d` on the flat PNG — that version could tilt, but
 * the highlights stayed painted where the illustrator left them. Here the linework is a
 * real silhouette cut out of real geometry, so the specular actually travels across the
 * ribs as the mark turns, which is the whole cue that says "metal" rather than "sticker".
 *
 * Mounted only by `LogoMark`, which owns the fallback and the decision to load this at
 * all — nothing here is server-safe.
 */

const ALBEDO_URL = "/media/logo/albedo.webp";
const NORMAL_URL = "/media/logo/normal.webp";

/** Layers in the extrusion, and how deep the stack runs in plane widths. */
const LAYERS = 10;
const DEPTH = 0.018;

/**
 * Where the extruded body is cut off. Deliberately well inside the face's own edge: the
 * face keeps its real antialiased alpha, so the outline you see is the illustrator's
 * hairline, and the body — which has to stay opaque to write depth — hides behind it
 * instead of ringing every stroke with a hard halo a pixel wider than the art.
 */
const BODY_ALPHA_TEST = 0.55;

/** How far the crest leans, and the radius of cursor travel that covers that lean. */
const YAW = 0.5;
const PITCH = 0.34;
const AIM_RADIUS = 420;

/**
 * A four-panel studio, baked once into a PMREM cubemap.
 *
 * Gold is almost pure specular, so with no environment the crest renders as a flat brown
 * silhouette however the lights are placed. Panels rather than point lights because what
 * has to travel across the ribs is a *shape* — a reflected highlight with edges.
 */
function useStudioEnvironment() {
  const renderer = useThree((s) => s.gl);

  const environment = useMemo(() => {
    const scene = new THREE.Scene();
    const spent: Array<THREE.BufferGeometry | THREE.Material> = [];

    const add = (
      color: string,
      intensity: number,
      [w, h]: [number, number],
      [x, y, z]: [number, number, number],
    ) => {
      const geometry = new THREE.PlaneGeometry(w, h);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      });
      const panel = new THREE.Mesh(geometry, material);
      panel.position.set(x, y, z);
      panel.lookAt(0, 0, 0);
      scene.add(panel);
      spent.push(geometry, material);
    };

    const shell = new THREE.SphereGeometry(9, 16, 12);
    const shellSkin = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#7d766a"),
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(shell, shellSkin));
    spent.push(shell, shellSkin);

    add("#fff3dd", 3.0, [6, 6], [-3.2, 3.4, 4.2]); // key, upper left
    add("#ffffff", 2.2, [9, 1.4], [0, 5.2, 1.6]); // overhead strip: the travelling glint
    add("#8fb6ff", 1.2, [5, 5], [4.4, 1.2, -3.4]); // cool rim, to separate from a dark page
    add("#ffcb84", 1.2, [8, 4], [2.4, -3.4, 3]); // warm bounce off the floor

    const pmrem = new THREE.PMREMGenerator(renderer);
    const baked = pmrem.fromScene(scene, 0.02);
    pmrem.dispose();
    for (const item of spent) item.dispose();

    return baked;
  }, [renderer]);

  useEffect(() => () => environment.dispose(), [environment]);

  return environment.texture;
}

/**
 * Loads and configures the two maps by hand rather than through `useLoader`, so colour
 * space and anisotropy are set on textures this hook owns, and a 404 leaves the crest
 * unmounted — which is exactly the state `LogoMark` reads as "keep showing the PNG".
 */
function useBrandTextures() {
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const [maps, setMaps] = useState<{ albedo: THREE.Texture; normal: THREE.Texture } | null>(
    null,
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let live = true;
    let loaded: THREE.Texture[] = [];

    void Promise.all([loader.loadAsync(ALBEDO_URL), loader.loadAsync(NORMAL_URL)])
      .then(([albedo, normal]) => {
        loaded = [albedo, normal];
        if (!live) return;
        albedo.colorSpace = THREE.SRGBColorSpace;
        normal.colorSpace = THREE.NoColorSpace;
        for (const map of loaded) map.anisotropy = maxAnisotropy;
        setMaps({ albedo, normal });
      })
      .catch(() => undefined);

    return () => {
      live = false;
      for (const map of loaded) map.dispose();
    };
  }, [maxAnisotropy]);

  return maps;
}

/**
 * Pointer aim in the mark's own frame: -1..1 across a radius around the canvas, so the
 * crest leans toward the cursor while it is anywhere nearby and settles back to its idle
 * sway once the cursor leaves. Window-level rather than canvas-level because the mark is
 * 44px in the header — nobody would ever hover it precisely enough for a local listener.
 */
function usePointerAim() {
  const canvas = useThree((s) => s.gl.domElement);
  const aim = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      aim.set(
        THREE.MathUtils.clamp((e.clientX - (box.left + box.width / 2)) / AIM_RADIUS, -1, 1),
        THREE.MathUtils.clamp((e.clientY - (box.top + box.height / 2)) / AIM_RADIUS, -1, 1),
      );
    };
    const onLeave = () => aim.set(0, 0);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [canvas, aim]);

  return aim;
}

function Crest({ animated, onReady }: { animated: boolean; onReady: () => void }) {
  const maps = useBrandTextures();
  const environment = useStudioEnvironment();
  const aim = usePointerAim();

  /** One quad, shared by the face and every layer of the body behind it. */
  const quad = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  useEffect(() => () => quad.dispose(), [quad]);

  /**
   * Front face: the art at its true coverage, with relief from the normal map.
   *
   * The artwork doubles as the emissive map, at roughly half strength. Lit purely as
   * metal the crest came out bronze — a metal's albedo *is* its specular tint, so every
   * ray that misses a light panel returns near-black and the brand gold drops two stops.
   * The emissive floor puts the illustrator's own colour back underneath, and the metal
   * response then rides on top of it as the highlight that moves.
   */
  const face = useMemo(() => {
    if (!maps) return null;
    return new THREE.MeshPhysicalMaterial({
      map: maps.albedo,
      normalMap: maps.normal,
      normalScale: new THREE.Vector2(0.35, 0.35),
      emissiveMap: maps.albedo,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.52,
      transparent: true,
      depthWrite: true,
      metalness: 0.8,
      roughness: 0.28,
      envMapIntensity: 1.5,
      clearcoat: 0.6,
      clearcoatRoughness: 0.24,
    });
  }, [maps]);

  /**
   * The body behind it: same cutout, no relief, much darker gold. These layers are only
   * ever seen edge-on as the extruded wall, and lighting them like the face makes the mark
   * read as a stack of prints rather than one solid piece.
   */
  const body = useMemo(() => {
    if (!maps) return null;
    return new THREE.MeshStandardMaterial({
      map: maps.albedo,
      color: new THREE.Color("#a07c2c"),
      alphaTest: BODY_ALPHA_TEST,
      metalness: 0.8,
      roughness: 0.6,
      envMapIntensity: 0.8,
      side: THREE.DoubleSide,
    });
  }, [maps]);

  useEffect(
    () => () => {
      face?.dispose();
      body?.dispose();
    },
    [face, body],
  );

  if (!face || !body) return null;

  return (
    <>
      <primitive object={environment} attach="environment" />
      <Turntable animated={animated} aim={aim}>
        <mesh geometry={quad} material={face} />
        {Array.from({ length: LAYERS }, (_, i) => (
          <mesh
            key={i}
            geometry={quad}
            material={body}
            position={[0, 0, -DEPTH * ((i + 1) / LAYERS)]}
          />
        ))}
      </Turntable>
      <Ready onReady={onReady} />
    </>
  );
}

/** Idle sway plus cursor lean, eased frame-rate independently so the mark never snaps. */
function Turntable({
  animated,
  aim,
  children,
}: {
  animated: boolean;
  aim: THREE.Vector2;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Under reduced motion the group keeps its authored pose and nothing tracks anything.
    if (!animated || !group.current) return;
    const { rotation } = group.current;
    const t = state.clock.elapsedTime;
    const yaw = aim.x * YAW + Math.sin(t * 0.45) * 0.11;
    const pitch = -aim.y * PITCH + Math.sin(t * 0.63 + 1.2) * 0.06;
    rotation.y = THREE.MathUtils.damp(rotation.y, yaw, 4.5, delta);
    rotation.x = THREE.MathUtils.damp(rotation.x, pitch, 4.5, delta);
  });

  return (
    <group ref={group} rotation={[0.06, -0.16, 0]}>
      {children}
    </group>
  );
}

/** Fires once a frame with the crest actually on it has been drawn. */
function Ready({ onReady }: { onReady: () => void }) {
  const [fired, setFired] = useState(false);
  useFrame(() => {
    if (fired) return;
    setFired(true);
    onReady();
  });
  return null;
}

export default function LogoMarkScene({
  animated,
  onReady,
}: {
  /** False under `prefers-reduced-motion`: one static frame, no sway and no cursor lean. */
  animated: boolean;
  onReady: () => void;
}) {
  const fov = 32;
  /** Pull back until the 1-unit crest covers exactly `ART_FILL` of the frame height. */
  const distance = 0.5 / (ART_FILL * Math.tan(THREE.MathUtils.degToRad(fov) / 2));

  return (
    <Canvas
      frameloop={animated ? "always" : "demand"}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov, position: [0, 0, distance], near: 0.1, far: 20 }}
      onCreated={({ gl }) => {
        // Neutral over ACES: ACES is graded for film and pulls the brand gold toward brown.
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
      style={{ pointerEvents: "none" }}
    >
      <Crest animated={animated} onReady={onReady} />
    </Canvas>
  );
}
