import * as THREE from 'three';

export function useCamera(aspectRatio) {
  const camera = new THREE.PerspectiveCamera(35, aspectRatio, 0.1, 10000);

  // Given the object dimensions (width: 22, height: 42, depth: 22)
  // and the object's corner is at (0,0,0), we can deduce the center of the object:
  const objectCenter = new THREE.Vector3(11, 21, 11);

  // Set the camera position
  // This places the camera in front of the object, at the object's height,
  // looking slightly down at the object.
  camera.position.set(2.38, objectCenter.y - 10, 85.65); // Adjust these values as needed

  // Set the initial lookAt point
  const lookAtVector = new THREE.Vector3(0, 66, 10);

  // Use the lookAt vector to orient the camera
  camera.lookAt(lookAtVector);
  // Update the camera's projection matrix
  camera.updateProjectionMatrix();

  return camera;
}
