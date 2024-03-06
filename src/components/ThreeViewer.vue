<!-- ThreeViewer.vue  -->
<template>
  <div ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as THREE from 'three';
import { useStore } from 'vuex';
import { useScene} from '../composables/useScene'
import { useRenderer} from '../composables/useRenderer'
import { useCamera} from '../composables/useCamera'
import { useLighting} from '../composables/useLighting'
import { useBackgroundSphere} from '../composables/useBackgroundSphere'
import { useEnvironmentLoader} from '../composables/useEnvironmentLoader'
import { useViewerControls } from '../composables/viewerControls';





const store = useStore();

const container = ref(null);
const canvas = ref(null);

// const sphereProperties = computed(() => store.state.sphereProperties);


let scene, camera, renderer;

onMounted(() => {
  
  if (!container.value || !canvas.value) return;

  scene = useScene();
  camera = useCamera(container.value.clientWidth / container.value.clientHeight);
  renderer = useRenderer(canvas.value);
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  useLighting(scene);


// After initializing the scene, camera, and renderer
const   { update: updateControls } = useViewerControls(camera, renderer);


// const floorColor = computed(() => store.state.floorProperties.floorColor);


  // Correct usage of useBackgroundSphere and useEnvironmentLoader
  
const { setBackgroundSphere, toggleBackgroundSphereVisibility } = useBackgroundSphere(scene.value);
// Correct usage of useEnvironmentLoader, ensure loadHDR is included
const { loadSkybox, loadFloor, setHDREnvironment, toggleAssetVisibility } = useEnvironmentLoader(scene, renderer);






  watch(() => store.state.sphereProperties, (newProperties) => {
  setBackgroundSphere(scene, newProperties);
  console.log("Sphere properties being used:", newProperties);
  toggleBackgroundSphereVisibility(scene, true); // Adjust visibility as needed
}, { deep: true });





  watch(() => store.state.selectedSkybox, (newSkybox) => {
  if(newSkybox && newSkybox.value) {
    console.log('Loading skybox with filename:', newSkybox.value); // Correctly log the filename
    loadSkybox(newSkybox.value); // Pass the string filename to loadSkybox
    toggleBackgroundSphereVisibility(scene, false);
  }
});




watch(() => store.state.selectedFloor, (newFloor) => {
  const floorFilename = newFloor ? newFloor.value : 'No Floor'; // Use 'No Floor' as a default
  if (floorFilename === 'No Floor') {
    toggleAssetVisibility('floor', false); // Hides the floor
  } else {
    toggleAssetVisibility('floor', true); // Shows the floor
    console.log('Loading floor with filename:', floorFilename);
    loadFloor(floorFilename, store.state.floorProperties.floorColor); // Pass the color as well
  }
});



watch(() => store.state.selectedHDR, (newHDR) => {
  console.log('HDR watcher triggered with newHDR:', newHDR);

  const hdrFilename = newHDR && newHDR.value ? newHDR.value : null;
  if (hdrFilename === 'No HDR') {
    console.log('No HDR selected, attempting to clear HDR environment');
    setHDREnvironment(null); // Adjusted to pass null for clarity
  } else {
    toggleAssetVisibility('hdr', true); // Shows the HDR
    console.log('Setting HDR environment with filename:', hdrFilename);
    setHDREnvironment(hdrFilename);
  }
});

watch(() => store.state.floorProperties.floorColor, (newColor) => {
  console.log(`Watcher: Floor color changed to ${newColor}`);
  const filename = store.state.selectedFloor.value; 
  if (filename) {
    loadFloor(filename, `#${newColor}`); 
  } else {
    console.error("Filename is not defined.");
  }
});




  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);


  // Enable shadow casting for the renderer

  function animate() {
    requestAnimationFrame(animate);
    updateControls(); // Update the viewer controls each frame

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
});
</script>

<style>
canvas{
  border-radius: 33px;
  height: 24rem;
  width: stretch;
}
</style>