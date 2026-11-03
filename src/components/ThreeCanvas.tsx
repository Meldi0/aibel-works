import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useMotionSettings } from '../lib/motion';

const fallback = new URL('../assets/images/webgl_canvas_hero_1787805803451.jpg', import.meta.url).href;

const STAGE_PALETTES = [
  { bell: 0xdde6ef, inner: 0x6c87a8, sweep: 0xd1e4ff, rim: 0x8ca9cf, tentacle: 0x6b84a3, speed: 0.42 },
  { bell: 0xe2dcf5, inner: 0x8468b8, sweep: 0xe0c8ff, rim: 0xa78bfa, tentacle: 0x7e68a8, speed: 0.56 },
  { bell: 0xd5ece6, inner: 0x4d9488, sweep: 0xbdf6e8, rim: 0x5eead4, tentacle: 0x538d84, speed: 0.48 },
  { bell: 0xf2e5d5, inner: 0xb07d4f, sweep: 0xffe4b8, rim: 0xf59e0b, tentacle: 0x9c7450, speed: 0.62 },
  { bell: 0xd8e4f8, inner: 0x4b74b8, sweep: 0xbad6ff, rim: 0x60a5fa, tentacle: 0x587bb0, speed: 0.52 },
];

export const ThreeCanvas = memo(function ThreeCanvas({ activeStage = 0 }: { activeStage?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(activeStage);
  stageRef.current = activeStage;

  const { reduced, desktop } = useMotionSettings();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: desktop, powerPreference: 'low-power', stencil: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, desktop ? 1.5 : 1.2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    container.classList.add('webgl-ready');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xeef5ff, 0x7c818b, 2));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-3, 5, 4);
    scene.add(key);

    const sweep = new THREE.PointLight(0xd1e4ff, 15, 18);
    sweep.position.set(-4, 3, 4);
    scene.add(sweep);

    const rim = new THREE.DirectionalLight(0x8ca9cf, 1.4);
    rim.position.set(3, 1, -2);
    scene.add(rim);

    const jellyfish = new THREE.Group();
    jellyfish.rotation.set(0.12, -0.28, -0.16);
    scene.add(jellyfish);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xdde6ef,
      metalness: 0.12,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.69,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 1.18,
      ior: 1.46,
    });
    const innerGlass = new THREE.MeshPhysicalMaterial({
      color: 0x71859e,
      metalness: 0.22,
      roughness: 0.26,
      transparent: true,
      opacity: 0.19,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, desktop ? 56 : 32, desktop ? 36 : 20, 0, Math.PI * 2, 0, Math.PI * 0.53),
      glass
    );
    bell.scale.y = 0.68;
    bell.position.y = 0.8;
    jellyfish.add(bell);

    const inner = new THREE.Mesh(bell.geometry, innerGlass);
    inner.position.copy(bell.position);
    inner.scale.set(0.94, 0.6, 0.94);
    jellyfish.add(inner);

    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc4d2e3,
      metalness: 0.42,
      roughness: 0.21,
      transparent: true,
      opacity: 0.68,
      clearcoat: 1,
    });
    const edge = new THREE.Mesh(new THREE.TorusGeometry(1.205, 0.018, 8, desktop ? 96 : 48), edgeMaterial);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0.73;
    jellyfish.add(edge);

    const ribsMaterial = new THREE.LineBasicMaterial({ color: 0x8599b1, transparent: true, opacity: 0.25 });
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const points = Array.from({ length: 25 }, (_, j) => {
        const t = (j / 24) * Math.PI * 0.52;
        return new THREE.Vector3(
          Math.sin(t) * 1.225 * Math.cos(angle),
          0.8 + Math.cos(t) * 0.834,
          Math.sin(t) * 1.225 * Math.sin(angle)
        );
      });
      jellyfish.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ribsMaterial));
    }

    const cores = new THREE.Group();
    cores.position.y = 0.84;
    for (let i = 0; i < 4; i++) {
      const core = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 8, 28, Math.PI * 1.6), edgeMaterial);
      const angle = (i / 4) * Math.PI * 2;
      core.rotation.set(Math.PI / 2, 0, angle);
      core.position.set(Math.cos(angle) * 0.3, 0.04, Math.sin(angle) * 0.3);
      cores.add(core);
    }
    jellyfish.add(cores);

    const tentacleMaterial = new THREE.LineBasicMaterial({ color: 0x7188a4, transparent: true, opacity: 0.4 });
    const tentacles: { line: THREE.Line; points: Float32Array; phase: number; length: number; angle: number }[] = [];
    for (let i = 0; i < (desktop ? 18 : 11); i++) {
      const points = new Float32Array(32 * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const line = new THREE.Line(geometry, tentacleMaterial);
      line.frustumCulled = false;
      jellyfish.add(line);
      tentacles.push({
        line,
        points,
        phase: i * 1.7,
        length: 2.2 + (i % 4) * 0.24,
        angle: (i / (desktop ? 18 : 11)) * Math.PI * 2,
      });
    }

    const armsMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb7c8da,
      metalness: 0.08,
      roughness: 0.23,
      transparent: true,
      opacity: 0.38,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const arms: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const points = Array.from({ length: 28 }, (_, j) => {
        const t = j / 27;
        return new THREE.Vector3(
          Math.cos(angle) * 0.26 + Math.sin(t * 8 + angle) * t * 0.22,
          0.77 - t * 2.4,
          Math.sin(angle) * 0.26 + Math.cos(t * 7 + angle) * t * 0.18
        );
      });
      const arm = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), desktop ? 48 : 24, 0.085, 6, false),
        armsMaterial
      );
      jellyfish.add(arm);
      arms.push(arm);
    }

    const targetBellColor = new THREE.Color(STAGE_PALETTES[0].bell);
    const targetInnerColor = new THREE.Color(STAGE_PALETTES[0].inner);
    const targetSweepColor = new THREE.Color(STAGE_PALETTES[0].sweep);
    const targetRimColor = new THREE.Color(STAGE_PALETTES[0].rim);
    const targetTentacleColor = new THREE.Color(STAGE_PALETTES[0].tentacle);

    let frame = 0,
      visible = true,
      disposed = false,
      lastTime = performance.now(),
      elapsed = 0;
    const target = { x: 0, y: 0, scroll: 0 },
      current = { x: 0, y: 0, scroll: 0 };

    const render = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const palette = STAGE_PALETTES[stageRef.current % STAGE_PALETTES.length];
      targetBellColor.setHex(palette.bell);
      targetInnerColor.setHex(palette.inner);
      targetSweepColor.setHex(palette.sweep);
      targetRimColor.setHex(palette.rim);
      targetTentacleColor.setHex(palette.tentacle);

      glass.color.lerp(targetBellColor, dt * 3.2);
      innerGlass.color.lerp(targetInnerColor, dt * 3.2);
      sweep.color.lerp(targetSweepColor, dt * 3.2);
      rim.color.lerp(targetRimColor, dt * 3.2);
      tentacleMaterial.color.lerp(targetTentacleColor, dt * 3.2);

      if (!reduced) elapsed += dt * (palette.speed / 0.45);
      const damping = 1 - Math.exp(-dt * 4.5);
      current.x += (target.x - current.x) * damping;
      current.y += (target.y - current.y) * damping;
      current.scroll += (target.scroll - current.scroll) * damping;

      // Continuous organic breathing pulse
      const breathe = reduced ? 0 : Math.sin(elapsed * 1.45) * 0.045;
      bell.scale.set(1 + breathe * 0.6, 0.68 - breathe * 0.45, 1 + breathe * 0.6);
      cores.rotation.y = elapsed * 0.35;

      camera.position.set(
        0,
        0,
        (desktop ? 8.6 : 9.6) - (reduced ? 0 : Math.min(elapsed / 5, 1) * 0.18 + current.scroll * 0.75)
      );
      jellyfish.position.set(
        desktop ? 1.15 : 0.08,
        (desktop ? -0.1 : -0.18) + Math.sin(elapsed * 0.9) * 0.09,
        0
      );
      jellyfish.rotation.set(
        0.12 + current.y * 0.08 + Math.cos(elapsed * 0.6) * 0.03,
        -0.28 + current.x * 0.16 + current.scroll * 0.55 + stageRef.current * 0.18,
        -0.16 + current.x * 0.04
      );
      jellyfish.scale.setScalar((desktop ? 1 : 0.88) * (1 + current.scroll * 0.16));

      const time = reduced ? 0 : elapsed * 0.52 + current.scroll * 2.4;
      for (const item of tentacles) {
        const attribute = item.line.geometry.attributes.position as THREE.BufferAttribute;
        for (let j = 0; j < 32; j++) {
          const t = j / 31;
          attribute.setXYZ(
            j,
            Math.cos(item.angle) * 1.2 + Math.sin(t * 5.2 + item.phase + time) * t * 0.19 - current.x * t * 0.13,
            0.73 - t * item.length,
            Math.sin(item.angle) * 1.2 + Math.cos(t * 6.2 + item.phase + time) * t * 0.15
          );
        }
        attribute.needsUpdate = true;
      }

      sweep.position.x = reduced ? 2 : Math.sin(elapsed * 0.65) * 3.5 + current.x * 0.6;
      renderer.render(scene, camera);

      if (!reduced && visible && !document.hidden) {
        frame = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      if (!frame && visible && !document.hidden) {
        lastTime = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    const move = (event: PointerEvent) => {
      target.x = (event.clientX / innerWidth) * 2 - 1;
      target.y = (event.clientY / innerHeight) * 2 - 1;
      wake();
    };
    const scroll = () => {
      target.scroll = reduced ? 0 : THREE.MathUtils.clamp(scrollY / (innerHeight * 3.2), 0, 1);
      wake();
    };
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      wake();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    if (!reduced) {
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('scroll', scroll, { passive: true });
    }
    document.addEventListener('visibilitychange', visibility);
    const lost = (event: Event) => {
      event.preventDefault();
      visible = false;
      cancelAnimationFrame(frame);
      container.classList.remove('webgl-ready');
    };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    resize();
    scroll();
    wake();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material =>
            materials.add(material)
          );
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      container.classList.remove('webgl-ready');
    };
  }, [desktop, reduced]);

  return (
    <div ref={containerRef} className="webgl-container" aria-hidden="true">
      <img className="webgl-fallback" src={fallback} alt="" />
    </div>
  );
});
