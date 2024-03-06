// src/composables/useScene.js
// import { markRaw } from 'vue';
import * as THREE from 'three';
// import { useResizeRenderer } from './useResizeRenderer';import * as THREE from 'three';

export function useScene() {
  const scene = new THREE.Scene();
  scene.userData = {
    skybox: null,
    floor: null,
  };
  return scene;
}

