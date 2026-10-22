import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useMotionSettings } from '../lib/motion';
const fallback = new URL('../assets/images/webgl_canvas_hero_1787805803451.jpg', import.meta.url).href;

// The original jellyfish, rendered as optical glass. All continuous state stays outside React.
export const ThreeCanvas = memo(function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reduced, desktop } = useMotionSettings();
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: desktop, powerPreference: 'low-power', stencil: false }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, desktop ? 1.5 : 1.15));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    container.classList.add('webgl-ready');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 50);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xeef5ff, 0x7c818b, 2));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-3, 5, 4); scene.add(key);
    const sweep = new THREE.PointLight(0xd1e4ff, 14, 18);
    sweep.position.set(-4, 3, 4); scene.add(sweep);
    const rim = new THREE.DirectionalLight(0x8ca9cf, 1.2);
    rim.position.set(3, 1, -2); scene.add(rim);
    const jellyfish = new THREE.Group();
    jellyfish.rotation.set(.12, -.28, -.16); scene.add(jellyfish);
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xdde6ef, metalness: .12, roughness: .13, clearcoat: 1, clearcoatRoughness: .06, transparent: true, opacity: .67, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.1, ior: 1.46 });
    const innerGlass = new THREE.MeshPhysicalMaterial({ color: 0x71859e, metalness: .22, roughness: .28, transparent: true, opacity: .16, side: THREE.BackSide, depthWrite: false });
    const bell = new THREE.Mesh(new THREE.SphereGeometry(1.22, desktop ? 56 : 32, desktop ? 36 : 20, 0, Math.PI * 2, 0, Math.PI * .53), glass);
    bell.scale.y = .68; bell.position.y = .8; jellyfish.add(bell);
    const inner = new THREE.Mesh(bell.geometry, innerGlass);
    inner.position.copy(bell.position); inner.scale.set(.94, .60, .94); jellyfish.add(inner);
    const edgeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc4d2e3, metalness: .42, roughness: .21, transparent: true, opacity: .65, clearcoat: 1 });
    const edge = new THREE.Mesh(new THREE.TorusGeometry(1.205, .018, 8, desktop ? 96 : 48), edgeMaterial);
    edge.rotation.x = Math.PI / 2; edge.position.y = .73; jellyfish.add(edge);
    const ribsMaterial = new THREE.LineBasicMaterial({ color: 0x8599b1, transparent: true, opacity: .23 });
    for (let i = 0; i < 24; i++) {
      const angle = i / 24 * Math.PI * 2;
      const points = Array.from({ length: 25 }, (_, j) => {
        const t = j / 24 * Math.PI * .52;
        return new THREE.Vector3(Math.sin(t) * 1.225 * Math.cos(angle), .8 + Math.cos(t) * .834, Math.sin(t) * 1.225 * Math.sin(angle));
      });
      jellyfish.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ribsMaterial));
    }
    const cores = new THREE.Group(); cores.position.y = .84;
    for (let i = 0; i < 4; i++) {
      const core = new THREE.Mesh(new THREE.TorusGeometry(.19, .035, 8, 28, Math.PI * 1.6), edgeMaterial);
      const angle = i / 4 * Math.PI * 2;
      core.rotation.set(Math.PI / 2, 0, angle); core.position.set(Math.cos(angle) * .3, .04, Math.sin(angle) * .3); cores.add(core);
    }
    jellyfish.add(cores);
    const tentacleMaterial = new THREE.LineBasicMaterial({ color: 0x7188a4, transparent: true, opacity: .37 });
    const tentacles: { line: THREE.Line; points: Float32Array; phase: number; length: number; angle: number }[] = [];
    for (let i = 0; i < (desktop ? 18 : 10); i++) {
      const points = new Float32Array(32 * 3);
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const line = new THREE.Line(geometry, tentacleMaterial); line.frustumCulled = false;
      jellyfish.add(line); tentacles.push({ line, points, phase: i * 1.7, length: 2.2 + (i % 4) * .24, angle: i / (desktop ? 18 : 10) * Math.PI * 2 });
    }
    const armsMaterial = new THREE.MeshPhysicalMaterial({ color: 0xb7c8da, metalness: .08, roughness: .23, transparent: true, opacity: .36, clearcoat: .8, side: THREE.DoubleSide, depthWrite: false });
    const arms: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = i / 4 * Math.PI * 2;
      const points = Array.from({ length: 28 }, (_, j) => {
        const t = j / 27;
        return new THREE.Vector3(Math.cos(angle) * .26 + Math.sin(t * 8 + angle) * t * .22, .77 - t * 2.4, Math.sin(angle) * .26 + Math.cos(t * 7 + angle) * t * .18);
      });
      const arm = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), desktop ? 48 : 24, .085, 6, false), armsMaterial);
      jellyfish.add(arm); arms.push(arm);
    }
    if (desktop && !reduced) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(18 * 3);
      for (let i = 0; i < 18; i++) { positions[i * 3] = Math.sin(i * 2.4) * 4; positions[i * 3 + 1] = Math.cos(i * 3.7) * 2.4; positions[i * 3 + 2] = -2; }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x77889b, size: .012, transparent: true, opacity: .17 })));
    }
    let frame = 0, visible = true, disposed = false, lastTime = performance.now(), elapsed = 0;
    let activeUntil = lastTime + (reduced ? 0 : 5000);
    const target = { x: 0, y: 0, scroll: 0 }, current = { x: 0, y: 0, scroll: 0 };
    const render = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = Math.min((now - lastTime) / 1000, .05); lastTime = now;
      // Movement settles after the reveal; it only wakes for a visitor's input.
      if (!reduced) elapsed += dt;
      const damping = 1 - Math.exp(-dt * 4.2);
      current.x += (target.x - current.x) * damping; current.y += (target.y - current.y) * damping; current.scroll += (target.scroll - current.scroll) * damping;
      camera.position.set(0, 0, (desktop ? 8.6 : 9.8) - (reduced ? 0 : Math.min(elapsed / 5, 1) * .18 + current.scroll * .75));
      jellyfish.position.set(desktop ? 1.2 : .15, desktop ? -.1 : -.2, 0);
      jellyfish.rotation.set(.12 + current.y * .055, -.28 + current.x * .12 + current.scroll * .42, -.16 + current.x * .025);
      jellyfish.scale.setScalar((desktop ? 1 : .87) * (1 + current.scroll * .18));
      const time = reduced ? 0 : elapsed * .35 + current.scroll * 2.4;
      for (const item of tentacles) {
        const attribute = item.line.geometry.attributes.position as THREE.BufferAttribute;
        for (let j = 0; j < 32; j++) {
          const t = j / 31;
          attribute.setXYZ(j, Math.cos(item.angle) * 1.2 + Math.sin(t * 5 + item.phase + time) * t * .17 - current.x * t * .11, .73 - t * item.length, Math.sin(item.angle) * 1.2 + Math.cos(t * 6 + item.phase + time) * t * .13);
        }
        attribute.needsUpdate = true;
      }
      sweep.position.x = reduced ? 2 : -4 + Math.min(elapsed / 4.5, 1) * 7 + current.x * .3;
      renderer.render(scene, camera);
      if (!reduced && now < activeUntil) frame = requestAnimationFrame(render);
    };
    const wake = () => { activeUntil = performance.now() + 1400; if (!frame && visible && !document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(render); } };
    const move = (event: PointerEvent) => { target.x = event.clientX / innerWidth * 2 - 1; target.y = event.clientY / innerHeight * 2 - 1; wake(); };
    const scroll = () => { target.scroll = reduced ? 0 : THREE.MathUtils.clamp(scrollY / (innerHeight * 3.8), 0, 1); wake(); };
    const resize = () => { const w = container.clientWidth, h = container.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); wake(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
    if (desktop && !reduced) window.addEventListener('pointermove', move, { passive: true });
    if (!reduced) window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    const lost = (event: Event) => { event.preventDefault(); visible = false; cancelAnimationFrame(frame); container.classList.remove('webgl-ready'); };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    resize(); scroll(); activeUntil = performance.now() + (reduced ? 0 : 5000);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener('pointermove', move); window.removeEventListener('scroll', scroll); document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); } });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); environment.dispose();
      renderer.dispose(); renderer.domElement.remove(); container.classList.remove('webgl-ready');
    };
  }, [desktop, reduced]);
  return <div ref={containerRef} className="webgl-container" aria-hidden="true"><img className="webgl-fallback" src={fallback} alt="" /></div>;
});
