// useRenderer.js
import * as THREE from 'three';

export function useRenderer(canvas, container, camera) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;

  function resizeRenderer() {
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resizeRenderer);

  // Initial resize
  resizeRenderer();

  return {
    renderer,
    resizeRenderer,
  };
}