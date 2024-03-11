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

import { usePrinterLoader } from '@/composables/usePrinter';



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




  // Correct usage of useBackgroundSphere and useAssetLoader
  
const { setBackgroundSphere, toggleBackgroundSphereVisibility } = useBackgroundSphere(scene.value);
// Correct usage of useEnvironmentLoader, ensure loadHDR is included
const { loadSkybox, loadFloor, setHDREnvironment, toggleAssetVisibility } = useEnvironmentLoader(scene, renderer);






  watch(() => store.state.sphereProperties, (newProperties) => {
  setBackgroundSphere(scene, newProperties);
  console.log("Sphere properties being used:", newProperties);
  toggleBackgroundSphereVisibility(scene, true); // Adjust visibility as needed
}, { deep: true });







// Then, inside your setup function or script

// Ensure the scene update functions are correctly called within watchers
watch(() => store.state.selectedSkybox, (newSkybox) => {
  if (newSkybox) {
    console.log('Loading skybox with filename:', newSkybox);
    loadSkybox(newSkybox); // Assumed that 'loadSkybox' expects a string filename
    toggleBackgroundSphereVisibility(scene, false); // Adjust this call if necessary
  }
}, { immediate: true });

watch(() => store.state.selectedFloor, (newFloor) => {
  if (newFloor) {
    console.log('Loading floor with filename:', newFloor);
    loadFloor(newFloor, store.state.floorProperties.floorColor); // Ensure loadFloor expects a string filename and a color
  } else {
    toggleAssetVisibility('floor', false); // This hides the floor if 'newFloor' is null or undefined
  }
}, { immediate: true });


watch(() => store.state.selectedHDR, (newHDR) => {
  if (newHDR) {
    console.log('Setting HDR environment with filename:', newHDR);
    setHDREnvironment(newHDR); // Assumes 'setHDREnvironment' expects a string filename or null
  } else {
    setHDREnvironment(null); // Clear the HDR environment if 'newHDR' is null or undefined
  }
}, { immediate: true });

// Similar adjustments for any other properties you're watching from the Vuex store


watch(() => store.state.floorProperties.floorColor, (newColor) => {
  const filename = store.state.selectedFloor; // Ensure this is correctly accessing the selected floor's filename
  console.log(`Watcher: Floor color changed to ${newColor}`);
  if (filename) {
    console.log(`Loading floor with filename: ${filename} and color: ${newColor}`);
    loadFloor(filename, `#${newColor}`); // Assuming loadFloor function takes the filename and hex color code
  } else {
    console.error("Filename is not defined.");
  }
}, { deep: true, immediate: true });


  // Load default assets
  loadSkybox(store.state.selectedSkybox);
  loadFloor(store.state.selectedFloor, store.state.floorProperties.floorColor);
  setHDREnvironment(store.state.selectedHDR);

//load default printer
const { loadPrinter } = usePrinterLoader(scene);

    const printerType = 'resinprinters';
    const printerName = 'CrealityLD002H';
    const printerFileName = 'LD002H';
    const textureName = 'Gltf_Import'


    try {
      loadPrinter(printerType, printerName, printerFileName, textureName);
    } catch (error) {
      console.error('Error loading printer model:', error);
      // Handle the error appropriately (e.g., display an error message to the user)
    }

    


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