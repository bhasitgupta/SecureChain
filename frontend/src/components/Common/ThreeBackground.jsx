import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ opacity = 0.65 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Device capability detection & Scene setup
    const isMobile = window.innerWidth < 768;
    const isLowEnd = isMobile || 
      (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4);

    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 80;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: !isLowEnd && (window.devicePixelRatio || 1) < 2,
        powerPreference: 'default',
        precision: isLowEnd ? 'mediump' : 'highp',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('[ThreeBackground] WebGL disabled or failed:', e);
      return;
    }

    // 2. Cryptographic Geometric Node (Outer Wireframe Icosahedron)
    const icoSize = isMobile ? 13 : 18;
    const icoGeom = new THREE.IcosahedronGeometry(icoSize, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xBBD5DA,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const icosahedron = new THREE.Mesh(icoGeom, icoMat);
    scene.add(icosahedron);

    // Inner Red Accent Core
    const innerGeom = new THREE.OctahedronGeometry(isMobile ? 6 : 9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerCore);

    // 3. Floating Network Particle Constellation (Optimized count for screen size & GPU tier)
    const particleCount = isLowEnd ? (isMobile ? 22 : 32) : (window.innerWidth < 1200 ? 45 : 65);
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      velocities.push({
        x: (Math.random() - 0.5) * 0.035,
        y: (Math.random() - 0.5) * 0.035,
        z: (Math.random() - 0.5) * 0.035,
      });
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x1B2B2F,
      size: isMobile ? 1.8 : 1.6,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Connecting Lines Material & Static Pre-allocated Buffer (Zero GC stutter)
    const maxLineSegments = particleCount * 6;
    const maxLineVertices = maxLineSegments * 2;
    const linePositions = new Float32Array(maxLineVertices * 3);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xBBD5DA,
      transparent: true,
      opacity: 0.25,
    });
    const lineMesh = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lineMesh);

    // 4. Mouse Parallax Tracker (Throttled / Passive)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 5. Animation Loop with Visibility & Focus Pause (Zero-leak / No duplicate rAF)
    let animId = null;
    let isTabVisible = !document.hidden;

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const startLoop = () => {
      stopLoop();
      if (!document.hidden) {
        isTabVisible = true;
        animId = requestAnimationFrame(animate);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        isTabVisible = false;
        stopLoop();
      } else {
        isTabVisible = true;
        startLoop();
      }
    };

    const onWindowBlur = () => {
      isTabVisible = false;
      stopLoop();
    };

    const onWindowFocus = () => {
      if (!document.hidden) {
        isTabVisible = true;
        startLoop();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);

    let frameCount = 0;
    const animate = () => {
      if (!isTabVisible || document.hidden) {
        stopLoop();
        return;
      }
      animId = requestAnimationFrame(animate);
      frameCount++;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.045;
      currentMouseY += (targetMouseY - currentMouseY) * 0.045;

      camera.position.x = currentMouseX * 5;
      camera.position.y = -currentMouseY * 5;
      camera.lookAt(scene.position);

      // Rotate geometric core
      icosahedron.rotation.x += 0.0016;
      icosahedron.rotation.y += 0.0024;
      innerCore.rotation.x -= 0.0022;
      innerCore.rotation.y -= 0.0032;

      // Update particle positions
      const posAttr = particleGeom.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        // Bounce within boundaries
        if (Math.abs(posArray[i * 3]) > 60) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 50) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > 35) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Line distance check (interlaced on low-end hardware for silky 60fps)
      if (!isLowEnd || frameCount % 2 === 0) {
        let lineIndex = 0;
        const linePosArray = lineGeom.attributes.position.array;
        const distLimit = isMobile ? 18 : 22;
        const distLimitSq = distLimit * distLimit;

        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            if (lineIndex >= maxLineVertices * 3 - 6) break;

            const dx = posArray[i * 3] - posArray[j * 3];
            const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
            const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < distLimitSq) {
              linePosArray[lineIndex++] = posArray[i * 3];
              linePosArray[lineIndex++] = posArray[i * 3 + 1];
              linePosArray[lineIndex++] = posArray[i * 3 + 2];
              linePosArray[lineIndex++] = posArray[j * 3];
              linePosArray[lineIndex++] = posArray[j * 3 + 1];
              linePosArray[lineIndex++] = posArray[j * 3 + 2];
            }
          }
        }

        lineGeom.attributes.position.needsUpdate = true;
        lineGeom.setDrawRange(0, lineIndex / 3);
      }

      renderer.render(scene, camera);
    };

    startLoop();

    // 6. WebGL Context Loss & Restoration Safety
    const canvas = renderer.domElement;
    const handleContextLost = (e) => {
      e.preventDefault();
      stopLoop();
    };
    const handleContextRestored = () => {
      startLoop();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    // 7. Resize Handler (Passive & Debounced)
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
      icoGeom.dispose();
      icoMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: opacity,
        overflow: 'hidden',
        contain: 'strict',
        transform: 'translateZ(0)',
      }}
      aria-hidden="true"
    />
  );
}
