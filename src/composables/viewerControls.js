// viewerControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useViewerControls(camera, renderer) {
  let controls = new OrbitControls(camera, renderer.domElement);

  // Set up max and min zoom levels
  controls.maxDistance = 140; // Example max zoom out
  controls.minDistance = 30; // Example min zoom in 
  

  // Update the OrbitControls target to match your desired lookAt vector
  controls.target.set(0, 29, 0);
  controls.update();

  return { controls, update: () => controls.update() };
}
