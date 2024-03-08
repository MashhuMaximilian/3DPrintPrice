import * as THREE from 'three';

export function useCamera(aspectRatio) {
  const camera = new THREE.PerspectiveCamera(35, aspectRatio, 0.1, 10000);

  // Adjust camera position for better framing
  const objectCenter = new THREE.Vector3(11, 60, 61); // Adjust Z value based on object's position on the surface (y:20)
  const offset = new THREE.Vector3(5, 80, objectCenter.z * 10); // Set the camera slightly behind the center of the object

  camera.position.copy(objectCenter.add(offset));

  // Adjust camera lookAt target to center of the object
  camera.lookAt(objectCenter);

  // Enable camera controls for user interaction (optional)
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true; // Enable smooth camera movement

  // Adjust camera settings as needed
  camera.near = 0.1;
  camera.far = 10000;
  camera.updateProjectionMatrix();

  return camera;
}
