<!-- ThreeViewer.vue  -->
<template>
  <div ref="container">
    <canvas class="h-full w-12 pr-2 border-round-3xl"  ref="canvas"></canvas>
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
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';


import { usePrinterLoader } from '@/composables/usePrinter';
// import { useSTLfile } from '@/composables/useSTLfile.js';


const store = useStore();

const container = ref(null);
const canvas = ref(null);







// const sphereProperties = computed(() => store.state.sphereProperties);


let scene, camera, renderer;

onMounted( () => {
  
 



  if (!container.value || !canvas.value) return;

  scene = useScene();
  store.commit('setScene', scene); // Commit the scene to the Vuex store
  camera = useCamera(container.value.clientWidth / container.value.clientHeight);
  renderer = useRenderer(canvas.value);
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  useLighting(scene);


// After initializing the scene, camera, and renderer
const   { update: updateControls } = useViewerControls(camera, renderer);




  // Correct usage of useBackgroundSphere and useAssetLoader
  
const { setBackgroundSphere, toggleBackgroundSphereVisibility } = useBackgroundSphere(scene.value);
// Correct usage of useEnvironmentLoader, ensure loadHDR is included
const { loadSkybox, loadFloor, setHDREnvironment, toggleAssetVisibility, updateMaterialEnvMapIntensity } = useEnvironmentLoader(scene, renderer);


let currentMesh = null;

watch(() => store.state.currentSTLFile, async (newFile) => {
  if (newFile) {
    const loader = new STLLoader();
    const reader = new FileReader();

    reader.onload = async (event) => {
      const contents = event.target.result;
      const geometry = loader.parse(contents);
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      store.commit('setCurrentSTLFileName', newFile.name);

      // Remove the previous STL mesh from the scene
      if (currentMesh) {
        scene.remove(currentMesh);
      }

      // Calculate the bounding box of the mesh
      const box = new THREE.Box3().setFromObject(mesh);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Calculate the height of the STL model
      const height = size.y;
      console.log('STL model height:', height);

      // Store the height in the Vuex store for pricing calculations
      store.dispatch('updateSTLHeight', height);

      // Scale the mesh to a desired size
      const desiredSize = 8; // Adjust this value as needed
      const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Set the position and orientation of the mesh
      const targetPosition = new THREE.Vector3(0, 27, 10); // Adjust the coordinates as needed
      mesh.position.copy(targetPosition);
      mesh.rotation.x = Math.PI/2; // Rotate the mesh upfside down

      // Add the new STL mesh to the scene
      scene.add(mesh);
      currentMesh = mesh;
    };

    reader.readAsArrayBuffer(newFile);
  } else {
    // Remove the current STL mesh from the scene if newFile is null or undefined
    if (currentMesh) {
      scene.remove(currentMesh);
      currentMesh = null;
      store.commit('setCurrentSTLFileName', null);
    }
  }
}, { immediate: true });


  watch(() => store.state.sphereProperties, (newProperties) => {
  setBackgroundSphere(scene, newProperties);
  toggleBackgroundSphereVisibility(scene, true); // Adjust visibility as needed
}, { deep: true });



watch(() => store.state.selectedSkybox, async (newSkybox) => {
  if (newSkybox === 'No Skybox') {
    // Remove existing skybox
    await loadSkybox('No Skybox');
    toggleBackgroundSphereVisibility(scene, true); // Show the background sphere
  } else {
    try {
      await loadSkybox(newSkybox);
      toggleBackgroundSphereVisibility(scene, false); // Hide the background sphere
    } catch (error) {
      console.error('Error loading skybox:', error);
      // Handle the error, e.g., show an error message to the user
    }
  }
});




watch(() => store.state.selectedFloor, (newFloor) => {
  if (newFloor) {
    loadFloor(newFloor, store.state.floorProperties.floorColor); // Ensure loadFloor expects a string filename and a color
  } else {
    toggleAssetVisibility('floor', false); // This hides the floor if 'newFloor' is null or undefined
  }
}, { immediate: true });


watch(() => store.state.hdrIntensity, (newIntensity) => {
  console.log('HDR Intensity changed. Updating environment and material intensities:', newIntensity);
  const currentHDR = store.state.selectedHDR;
  if (currentHDR) {
    setHDREnvironment(currentHDR, newIntensity);
    // Update the material intensities as well
    updateMaterialEnvMapIntensity(scene, newIntensity);
  }
}, { immediate: true });


watch(() => store.state.selectedHDR, (newHDR) => {
  if (newHDR) {
  
    setHDREnvironment(newHDR, 3);
    store.dispatch('updateHDRIntensity', 3);
  } else {
    setHDREnvironment(null, 0);
  }
}, { immediate: true });

watch(() => store.state.hdrIntensity, (newIntensity) => {
  if (scene.environment) {
    scene.environment.intensity = newIntensity;
  }
});

// Similar adjustments for any other properties you're watching from the Vuex store


watch(() => store.state.floorProperties.floorColor, (newColor) => {
  const filename = store.state.selectedFloor; // Ensure this is correctly accessing the selected floor's filename
  if (filename) {
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


  // Enable shadow casting for the renderer

  function animate() {
    requestAnimationFrame(animate);
    updateControls(); // Update the viewer controls each frame
    renderer.render(scene, camera);


  }

  animate();
});
</script>

<style>

</style>