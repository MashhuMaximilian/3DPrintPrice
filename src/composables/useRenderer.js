//useRenderer.js
import * as THREE from 'three';

export function useRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  return renderer;
}
