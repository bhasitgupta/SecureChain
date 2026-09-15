import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ opacity = 0.65 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Cryptographic Geometric Node (Outer Wireframe Icosahedron)
    const icoGeom = new THREE.IcosahedronGeometry(18, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xBBD5DA,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const icosahedron = new THREE.Mesh(icoGeom, icoMat);
    scene.add(icosahedron);

    // Inner Red Accent Core
    const innerGeom = new THREE.OctahedronGeometry(9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerCore);

    // 3. Floating Network Particle Constellation
    const particleCount = 75;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.04,
      });
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x1B2B2F,
      size: 1.6,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Connecting Lines Material
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xBBD5DA,
      transparent: true,
      opacity: 0.25,
    });
    const lineGeom = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lineMesh);

    // 4. Mouse Parallax Tracker
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 5. Animation Loop
    let animId;
    const linePositions = new Float32Array(particleCount * particleCount * 6);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX * 6;
      camera.position.y = -currentMouseY * 6;
      camera.lookAt(scene.position);

      // Rotate geometric core
      icosahedron.rotation.x += 0.0018;
      icosahedron.rotation.y += 0.0028;
      innerCore.rotation.x -= 0.0025;
      innerCore.rotation.y -= 0.0035;

      // Update particle positions
      const posAttr = particleGeom.attributes.position;
      const posArray = posAttr.array;
      let lineIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        // Bounce within boundaries
        if (Math.abs(posArray[i * 3]) > 60) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 50) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > 35) velocities[i].z *= -1;

        // Form network lines between close particles
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 22) {
            linePositions[lineIndex++] = posArray[i * 3];
            linePositions[lineIndex++] = posArray[i * 3 + 1];
            linePositions[lineIndex++] = posArray[i * 3 + 2];
            linePositions[lineIndex++] = posArray[j * 3];
            linePositions[lineIndex++] = posArray[j * 3 + 1];
            linePositions[lineIndex++] = posArray[j * 3 + 2];
          }
        }
      }

      posAttr.needsUpdate = true;
      lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions.subarray(0, lineIndex), 3));

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
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
      }}
      aria-hidden="true"
    />
  );
}
