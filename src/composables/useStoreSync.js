// src/composables/useStoreSync.js

import { useEnvironmentLoader } from '../composables/useEnvironmentLoader';
import { useSTLfile } from '../composables/useSTLfile';
import { watch } from 'vue';

let renderer;
// let currentMesh = null; // Moved outside to maintain its state

export function useStoreSync(store, { scene, loadSkybox, loadFloor, setHDREnvironment, setBackgroundSphere, toggleBackgroundSphereVisibility, updateMaterialEnvMapIntensity }) {

    const { toggleAssetVisibility} = useEnvironmentLoader(scene, renderer);
   
    const { loadSTLModel } = useSTLfile(store, scene);

    watch(
      () => store.state.currentSTLFile,
      async (newFile) => {
        await loadSTLModel(newFile);
      },
      { immediate: true }
    );
  
  

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
