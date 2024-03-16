// src/composables/useStoreSync.js
import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useEnvironmentLoader } from '../composables/useEnvironmentLoader';
import { watch } from 'vue';

let renderer;
let currentMesh = null; // Moved outside to maintain its state

export function useStoreSync(store, { scene, loadSkybox, loadFloor, setHDREnvironment, setBackgroundSphere, toggleBackgroundSphereVisibility, updateMaterialEnvMapIntensity }) {

    const { toggleAssetVisibility} = useEnvironmentLoader(scene, renderer);
   
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

  watch(() => store.state.selectedSkybox, (newSkybox) => {
    loadSkybox(newSkybox);
  }, { immediate: true });

  watch(() => store.state.sphereProperties, (newProperties) => {
    setBackgroundSphere(scene, newProperties);
    toggleBackgroundSphereVisibility(scene, true);
  }, { deep: true, immediate: true });
  
  
  watch(() => store.state.selectedFloor, (newFloor) => {
    if (newFloor) {
      loadFloor(newFloor, store.state.floorProperties.floorColor); // Ensure loadFloor expects a string filename and a color
    } else {
      toggleAssetVisibility('floor', false); // This hides the floor if 'newFloor' is null or undefined
    }
  }, { immediate: true });

  watch(() => store.state.floorProperties.floorColor, (newColor) => {
    const filename = store.state.selectedFloor; // Ensure this is correctly accessing the selected floor's filename
    if (filename) {
      loadFloor(filename, `#${newColor}`); // Assuming loadFloor function takes the filename and hex color code
    } else {
      console.error("Filename is not defined.");
    }
  }, { deep: true, immediate: true });

    
  watch(() => store.state.selectedHDR, (newHDR) => {
    if (newHDR) {
    
      setHDREnvironment(newHDR, 3);
      store.dispatch('updateHDRIntensity', 3);
    } else {
      setHDREnvironment(null, 0);
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
  
  
}  
