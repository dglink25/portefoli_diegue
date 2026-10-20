'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 4, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    /* ── Lights ── */
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    const sun = new THREE.DirectionalLight(0x4499ff, 2.2);
    sun.position.set(6, 10, 6);
    sun.castShadow = true;
    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(-8, 2, -6);
    const accent = new THREE.PointLight(0x0066ff, 4, 30);
    accent.position.set(0, 5, 0);
    scene.add(ambient, sun, rim, accent);

    /* ── Instanced mesh - wave grid ── */
    const COLS = 26, ROWS = 16;
    const COUNT = COLS * ROWS;
    const SPACING = 0.7;

    const geo = new THREE.IcosahedronGeometry(0.16, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0066ff,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0x001133,
      emissiveIntensity: 0.3,
    });

    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    const ox: number[] = [], oz: number[] = [];
    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        ox[i] = (x - COLS / 2) * SPACING;
        oz[i] = (z - ROWS / 2) * SPACING;
        i++;
      }
    }

    /* ── Floating particles ── */
    const PARTICLE_COUNT = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pVel = new Float32Array(PARTICLE_COUNT * 3);
    for (let j = 0; j < PARTICLE_COUNT; j++) {
      pPos[j * 3] = (Math.random() - 0.5) * 20;
      pPos[j * 3 + 1] = Math.random() * 10 - 2;
      pPos[j * 3 + 2] = (Math.random() - 0.5) * 10;
      pVel[j * 3] = (Math.random() - 0.5) * 0.008;
      pVel[j * 3 + 1] = Math.random() * 0.004 + 0.002;
      pVel[j * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x66aaff, size: 0.06, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Ring orbiting ── */
    const ringGeo = new THREE.TorusGeometry(4.5, 0.04, 8, 80);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x0066ff, emissive: 0x0044cc, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.9 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    ring.position.y = 1;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.02, 6, 100),
      new THREE.MeshStandardMaterial({ color: 0x3399ff, emissive: 0x002266, emissiveIntensity: 0.5, roughness: 0.2, transparent: true, opacity: 0.5 })
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    ring2.position.y = 1;
    scene.add(ring2);

    /* ── Mouse parallax ── */
    let mouseX = 0, mouseY = 0;
    function onMouseMove(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove);

    /* ── Animation loop ── */
    const dummy = new THREE.Object3D();
    let raf = 0, t = 0;

    function render() {
      if (!prefersReducedMotion) t += 0.007;

      /* wave grid */
      for (let idx = 0; idx < COUNT; idx++) {
        const x = ox[idx], z = oz[idx];
        const dist = Math.sqrt(x * x + z * z);
        const y = Math.sin(dist * 0.8 - t * 2.0) * 0.55 + Math.sin(x * 0.5 - t * 1.2) * 0.2;
        dummy.position.set(x, y, z);
        const s = 0.5 + 0.5 * ((y + 0.75) / 1.5);
        dummy.scale.setScalar(Math.max(0.2, Math.min(1.2, s)));
        dummy.rotation.set(y * 0.5, x * 0.2 + t * 0.3, z * 0.2);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      /* particles drift */
      if (!prefersReducedMotion) {
        const pos = pGeo.attributes.position.array as Float32Array;
        for (let j = 0; j < PARTICLE_COUNT; j++) {
          pos[j * 3] += pVel[j * 3];
          pos[j * 3 + 1] += pVel[j * 3 + 1];
          pos[j * 3 + 2] += pVel[j * 3 + 2];
          if (pos[j * 3 + 1] > 8) pos[j * 3 + 1] = -2;
          if (Math.abs(pos[j * 3]) > 10) pVel[j * 3] *= -1;
          if (Math.abs(pos[j * 3 + 2]) > 5) pVel[j * 3 + 2] *= -1;
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      /* rings */
      ring.rotation.y = t * 0.4;
      ring.rotation.z = Math.sin(t * 0.3) * 0.1;
      ring2.rotation.y = -t * 0.25;
      ring2.rotation.z = Math.cos(t * 0.2) * 0.05;
      accent.position.x = Math.sin(t * 0.8) * 5;
      accent.position.z = Math.cos(t * 0.8) * 5;

      /* camera parallax */
      scene.rotation.y = Math.sin(t * 0.1) * 0.06 + mouseX * 0.04;
      scene.rotation.x = Math.sin(t * 0.07) * 0.02 - mouseY * 0.02;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    }
    render();

    function handleResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      geo.dispose(); mat.dispose();
      pGeo.dispose(); pMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 -z-10"
    />
  );
}
