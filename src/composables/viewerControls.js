// viewerControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useViewerControls(camera, renderer) {
  let controls = new OrbitControls(camera, renderer.domElement);

  // Set up max and min zoom levels
  controls.maxDistance = 140; // Example max zoom out
  controls.minDistance = 30; // Example min zoom in
  // const controls = useViewerControls(camera, renderer);
  

  // Update the OrbitControls target to match your desired lookAt vector
  controls.target.set(0.4688548386244148, 22.51569445353515, -4.102124229380156);
  controls.update();
  // Update controls on each frame

   // Add an event listener to the controls to log the camera position on interaction
  //  controls.addEventListener('change', () => {
  //   console.log('Camera Position:', camera.position);
  //   console.log('Camera LookAt:', controls.target);
  // });


  return { controls, update: () => controls.update() };
}
