import * as THREE from 'three';

export function useCamera(aspectRatio, initialPosition = { x: 0, y: 5, z: 10 }) {
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 10000);

  // Set initial camera position with flexibility for adjustments
  camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);

  // Enable camera controls for user interaction (optional)
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true; // Enable smooth camera movement

  // Adjust camera settings as needed
  camera.near = 0.1;
  camera.far = 10000;
  camera.updateProjectionMatrix();

  return camera;
}
