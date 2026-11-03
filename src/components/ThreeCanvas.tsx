import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useMotionSettings } from '../lib/motion';

const fallback = new URL('../assets/images/webgl_canvas_hero_1787805803451.jpg', import.meta.url).href;

// Pure optical crystal glass jellyfish with smart on-demand rendering (zero GPU drain when idle).
export const ThreeCanvas = memo(function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reduced, desktop } = useMotionSettings();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: desktop,
        powerPreference: 'high-performance',
        stencil: false,
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, desktop ? 1.35 : 1.1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
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

    const sweep = new THREE.PointLight(0xd1e4ff, 14, 18);
    sweep.position.set(-4, 3, 4);
    scene.add(sweep);

    const rim = new THREE.DirectionalLight(0x8ca9cf, 1.2);
    rim.position.set(3, 1, -2);
    scene.add(rim);

    const jellyfish = new THREE.Group();
    jellyfish.rotation.set(0.12, -0.28, -0.16);
    scene.add(jellyfish);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xdde6ef,
      metalness: 0.12,
      roughness: 0.13,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.67,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 1.1,
      ior: 1.46,
    });
    const innerGlass = new THREE.MeshPhysicalMaterial({
      color: 0x71859e,
      metalness: 0.22,
      roughness: 0.28,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, desktop ? 48 : 28, desktop ? 32 : 18, 0, Math.PI * 2, 0, Math.PI * 0.53),
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
      opacity: 0.65,
      clearcoat: 1,
    });
    const edge = new THREE.Mesh(new THREE.TorusGeometry(1.205, 0.018, 8, desktop ? 80 : 44), edgeMaterial);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0.73;
    jellyfish.add(edge);

    const ribsMaterial = new THREE.LineBasicMaterial({ color: 0x8599b1, transparent: true, opacity: 0.23 });
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
      const core = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 8, 24, Math.PI * 1.6), edgeMaterial);
      const angle = (i / 4) * Math.PI * 2;
      core.rotation.set(Math.PI / 2, 0, angle);
      core.position.set(Math.cos(angle) * 0.3, 0.04, Math.sin(angle) * 0.3);
      cores.add(core);
    }
    jellyfish.add(cores);

    const tentacleMaterial = new THREE.LineBasicMaterial({ color: 0x7188a4, transparent: true, opacity: 0.37 });
    const tentacles: { line: THREE.Line; points: Float32Array; phase: number; length: number; angle: number }[] = [];
    const tentacleCount = desktop ? 16 : 10;
    for (let i = 0; i < tentacleCount; i++) {
      const points = new Float32Array(28 * 3);
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
        angle: (i / tentacleCount) * Math.PI * 2,
      });
    }

    const armsMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb7c8da,
      metalness: 0.08,
      roughness: 0.23,
      transparent: true,
      opacity: 0.36,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const points = Array.from({ length: 24 }, (_, j) => {
        const t = j / 23;
        return new THREE.Vector3(
          Math.cos(angle) * 0.26 + Math.sin(t * 8 + angle) * t * 0.22,
          0.77 - t * 2.4,
          Math.sin(angle) * 0.26 + Math.cos(t * 7 + angle) * t * 0.18
        );
      });
      const arm = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), desktop ? 40 : 20, 0.085, 6, false),
        armsMaterial
      );
      jellyfish.add(arm);
    }

    let frame = 0,
      visible = true,
      disposed = false,
      lastTime = performance.now(),
      elapsed = 0;
    let activeUntil = lastTime + (reduced ? 0 : 4000);
    const target = { x: 0, y: 0, scroll: 0 },
      current = { x: 0, y: 0, scroll: 0 };

    const render = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!reduced) elapsed += dt;

      const damping = 1 - Math.exp(-dt * 4.5);
      current.x += (target.x - current.x) * damping;
      current.y += (target.y - current.y) * damping;
      current.scroll += (target.scroll - current.scroll) * damping;

      camera.position.set(
        0,
        0,
        (desktop ? 8.6 : 9.8) - (reduced ? 0 : Math.min(elapsed / 5, 1) * 0.18 + current.scroll * 0.75)
      );
      jellyfish.position.set(desktop ? 1.2 : 0.15, desktop ? -0.1 : -0.2, 0);
      jellyfish.rotation.set(
        0.12 + current.y * 0.055,
        -0.28 + current.x * 0.12 + current.scroll * 0.48,
        -0.16 + current.x * 0.025
      );
      jellyfish.scale.setScalar((desktop ? 1 : 0.87) * (1 + current.scroll * 0.18));

      const time = reduced ? 0 : elapsed * 0.38 + current.scroll * 2.4;
      for (const item of tentacles) {
        const attribute = item.line.geometry.attributes.position as THREE.BufferAttribute;
        for (let j = 0; j < 28; j++) {
          const t = j / 27;
          attribute.setXYZ(
            j,
            Math.cos(item.angle) * 1.2 + Math.sin(t * 5 + item.phase + time) * t * 0.17 - current.x * t * 0.11,
            0.73 - t * item.length,
            Math.sin(item.angle) * 1.2 + Math.cos(t * 6 + item.phase + time) * t * 0.13
          );
        }
        attribute.needsUpdate = true;
      }

      sweep.position.x = reduced ? 2 : -4 + Math.min(elapsed / 4.5, 1) * 7 + current.x * 0.3;
      renderer.render(scene, camera);

      if (!reduced && now < activeUntil) {
        frame = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      activeUntil = performance.now() + 1200;
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
      target.scroll = reduced ? 0 : THREE.MathUtils.clamp(scrollY / (innerHeight * 3.5), 0, 1);
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
    if (desktop && !reduced) window.addEventListener('pointermove', move, { passive: true });
    if (!reduced) window.addEventListener('scroll', scroll, { passive: true });
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
    activeUntil = performance.now() + (reduced ? 0 : 4000);

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
