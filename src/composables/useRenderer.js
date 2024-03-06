//useRenderer.js
import * as THREE from 'three';

export function useRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  return renderer;
}
