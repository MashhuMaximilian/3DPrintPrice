// viewerControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useViewerControls(camera, renderer) {
  let controls = new OrbitControls(camera, renderer.domElement);

  // Set up max and min zoom levels
  controls.maxDistance = 50; // Example max zoom out
  controls.minDistance = 1; // Example min zoom in

  // Update controls on each frame
  function update() {
    controls.update();
  }

  return { update };
}
