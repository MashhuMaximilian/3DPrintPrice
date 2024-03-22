//useSTLfile.js
import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useAnimateLid } from './animateLid';
import { useVolumeCalculator } from './useVolumeCalculator'; // Adjust the path as necessary

export let currentMesh = null;


export function useSTLfile(store) {
  const getScene = () => store.state.scene; // Function to get scene from Vuex

  async function loadSTLModel(file, camera) {
    const scene = getScene(); // Access scene from Vuex

    const { animateCapacGroup } = useAnimateLid(scene, camera); // Initialize animateCapacGroup

    if (file) {
      const loader = new STLLoader();
      const reader = new FileReader();

      reader.onload = async (event) => {
        const contents = event.target.result;
        const geometry = loader.parse(contents);


        const material = new THREE.MeshStandardMaterial({
          color: store.state.stlMaterialProperties.color,
          metalness: store.state.stlMaterialProperties.metalness,
          roughness: store.state.stlMaterialProperties.roughness,
          emissive: store.state.stlMaterialProperties.emissiveColor,
          emissiveIntensity: store.state.stlMaterialProperties.emissiveIntensity,
        });
    
        const mesh = new THREE.Mesh(geometry, material);

        if (currentMesh) {
          scene.remove(currentMesh);
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);

        const height = size.z; // Convert to mm
        store.commit('setOriginalModelHeight', height);
        // console.log('STL model height:', height + ' mm');
        console.log('width:'+ size.x.toFixed(2) + ' mm', 'depth:' + size.y.toFixed(2) + ' mm', 'height:' + size.z.toFixed(2) + ' mm');

        store.dispatch('updateSTLFile', height);

        const desiredSize = store.state.originalModelHeight * 0.1; // Convert to cm
        const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
        mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);            
        const targetPosition = new THREE.Vector3(0, 32.2, 10);
        mesh.position.copy(targetPosition);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = Math.PI;

        mesh.name = 'capac'; // Name the mesh to be recognized by the animation function.
        scene.add(mesh);
        store.dispatch('updateSTLFile', { file: currentMesh, fileName: 'yourFileName.stl', height });


        const { calculateVolume } = useVolumeCalculator();
        const initialVolume = calculateVolume(mesh)/1000; // Calculate initial volume
        console.log('Initial STL model volume:', initialVolume + ' mL'); // Log initial volume
        // Proceed to dispatch this volume or further use it as needed
        store.dispatch('updateSTLVolume', initialVolume);

        currentMesh = mesh;

        console.log(camera); // This should log the camera object or undefined
        animateCapacGroup(); // Directly trigger the animation

      };

      reader.readAsArrayBuffer(file);
    } else {
      if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh = null;
        store.commit('setCurrentSTLFile', null);
      }
    }
  }

  function removeCurrentMesh() {
    const scene = getScene(); // Access scene from Vuex
    // Ensure scene is being passed correctly
    console.log("Scene before removal attempt:", scene);
    console.log("Before removal, scene children count:", scene.children.length);
    if (currentMesh && scene) {
      scene.remove(currentMesh);
      currentMesh = null;
      console.log("Attempting to remove mesh");
    }
    console.log("After removal, scene children count:", scene.children.length);
    store.commit('clearSTL'); // Clear the STL-related state
  }

  function updateSTLMaterialProperties(properties) {
    if (currentMesh) {
      const color = properties.color.startsWith('#') ? properties.color : `#${properties.color}`;
      currentMesh.material.color.set(color);
  
      // Format the emissive color value
      const emissiveColor = properties.emissiveColor.startsWith('#') ? properties.emissiveColor : `#${properties.emissiveColor}`;
      currentMesh.material.emissive.set(emissiveColor);
  
      currentMesh.material.metalness = properties.metalness;
      currentMesh.material.roughness = properties.roughness;
      currentMesh.material.emissiveIntensity = properties.emissiveIntensity;
      currentMesh.material.needsUpdate = true;
    }
  }

  function updateSTLScale(desiredHeight) {
    if (currentMesh) {
      // Log the updated height
      console.log("Updated height:", desiredHeight + " mm");

      const originalHeight = store.state.originalModelHeight * 10;
      const scaleFactor = desiredHeight / originalHeight;
      currentMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      console.log("updateSTLScale scaleFactor: ", scaleFactor);
  
      const { calculateVolume } = useVolumeCalculator();
      const newVolume = calculateVolume(currentMesh) * Math.pow(scaleFactor, 3);
      console.log("New volume after height change:", newVolume + " mL");
  
      store.dispatch('updateSTLVolume', newVolume);
    }
}

//TODO: Add a function either here or in usePrinter.js to add a bounding box as big as the print volume that is 130 mm x 82 mm x 160 mm.
// I guess it starts from (0, 32.2, 10); downwards. I know 32.2 is the good value, not sure about the other.
  return { loadSTLModel, removeCurrentMesh, updateSTLScale, updateSTLMaterialProperties };
}
