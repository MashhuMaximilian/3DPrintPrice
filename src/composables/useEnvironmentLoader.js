import * as THREE from 'three';

import { getDownloadURL, getStorage, listAll, ref as storageRef } from 'firebase/storage';
import { onMounted, ref } from 'vue';

// useAssetLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// Define contexts for assets
// const skyboxesContext = require.context('@/assets/skyboxes', false, /\.glb$/);
// const floorsContext = require.context('@/assets/floors', false, /\.glb$/);
// const hdrsContext = require.context('@/assets/hdrs', false, /\.hdr$/);

export function useEnvironmentLoader(scene, renderer) {

  const storage = getStorage(); // Make sure Firebase is initialized before calling this

  const skyboxes = ref([]);
  const floors = ref([]);
  const hdrs = ref([]);



  // Helper function to fetch asset URL from Firebase Storage
  async function fetchAssetURL(assetPath) {
    const fileRef = storageRef(storage, assetPath);
    try {
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error(`Error fetching asset URL for ${assetPath}:`, error);
      return ''; // Return an empty string or a default URL in case of an error
    }
  }
  
  async function fetchAssetNames(folderPath, refList) {
    const listRef = storageRef(storage, folderPath);
    try {
      const res = await listAll(listRef);
      refList.value = res.items.map(item => item.name);
    } catch (error) {
      console.error(`Error fetching asset names for ${folderPath}:`, error);
      refList.value = [];
    }
  }


  onMounted(async () => {
    await fetchAssetNames('assets/skyboxes', skyboxes);
    await fetchAssetNames('/assets/floors', floors);
    await fetchAssetNames('/assets/hdrs', hdrs);
  });

  // Helper function to dynamically load GLTF assets
  function loadGLTF(path, callback) {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      callback(gltf);
    }, null, console.error);
  }

  

  
// Dynamically load a skybox
async function loadSkybox(filename) {
  if (filename === 'No Skybox') {
    // Remove existing skybox if present
    if (scene.userData.skybox) {
      scene.remove(scene.userData.skybox);
      scene.userData.skybox = null;
    }
    return; // Exit the function to avoid further execution
  }

  // Continue with loading the skybox if a valid filename is provided
  const skyboxPath = `assets/skyboxes/${filename}`; // Ensure your filenames include the .glb extension
  const skyboxURL = await fetchAssetURL(skyboxPath);

  await loadGLTF(skyboxURL, (gltf) => {
    // Remove existing skybox if present
    if (scene.userData.skybox) {
      scene.remove(scene.userData.skybox);
    }
    scene.userData.skybox = gltf.scene;
    scene.add(gltf.scene);
  });
}



async function loadFloor(filename, color) {
  // Early exit if 'No Floor' is selected
  if (filename === 'No Floor') {
    console.log('No floor is selected, visibility will be toggled off.');
    // Here you can call toggleAssetVisibility or directly set visibility to false
    if (scene.userData.floor) {
      scene.userData.floor.visible = false;
    }
    return; // Exit the function to avoid further execution
  }

  // Continue with loading the floor if a valid filename is provided
  const floorPath = `assets/floors/${filename}`; // Ensure your filenames include the .glb extension
  const floorURL = await fetchAssetURL(floorPath);

  await loadGLTF(floorURL, (gltf) => {
    // Ensure any existing floor is removed first
    if (scene.userData.floor) {
      scene.remove(scene.userData.floor);
    }
    // Proceed with setting up the new floor object
    gltf.scene.scale.set(150, 1, 150); // Scale the floor object
    gltf.scene.name = 'floor'; // Name it for future reference

    // Apply the color if provided
    if (color) {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.set(color); // Change the material color
          child.material.side = THREE.FrontSide; // Render the back side (top) of the floor
        }
      });
    }

    
    // Set the floor object to visible and add it to the scene
    gltf.scene.visible = true;
    scene.userData.floor = gltf.scene;
    scene.add(gltf.scene);
  });
}

function updateMaterialEnvMapIntensity(scene, intensity) {
  scene.traverse((object) => {
    if (object.material && object.material.isMaterial) {
      if ('envMapIntensity' in object.material) {
        object.material.envMapIntensity = intensity;
        object.material.needsUpdate = true; // Ensure the material is updated
      }
    }
  });
}

async function setHDREnvironment(filename, hdrIntensity) {
  console.log('setHDREnvironment', { filename, hdrIntensity });

  // When "No HDR" is selected, clear the environment and return early
  if (filename === 'No HDR' || !filename) {
    console.log('No HDR is selected, clearing the HDR environment.');
    scene.environment = null;
    return;
  }

  // Continue with HDR environment setup if a valid filename is provided
  const hdrPath = `assets/hdrs/${filename}`; // Ensure your filenames include the .hdr extension
  const hdrURL = await fetchAssetURL(hdrPath);

  const loader = new RGBELoader();
  loader.load(hdrURL, (texture) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    // Apply the HDR intensity
    envMap.intensity = hdrIntensity;

    scene.environment = envMap;
    console.log('New HDR Intensity applied:', scene.environment.intensity);
    updateMaterialEnvMapIntensity(scene, hdrIntensity);

    pmremGenerator.dispose();
  }, null, (error) => {
    console.error('An error occurred while loading the HDR environment:', error);
  });
}



  function removeAsset(type) {
    switch(type) {
      case 'floor':
        // Check if floor exists before removing
        if(scene.userData.floor) {
          scene.remove(scene.userData.floor);
          scene.userData.floor = null;  
        }
        break;
    
      case 'hdr':
        // Set environment to null to remove HDR
        scene.environment = null;
        break;
    }
  }
  
  
  function toggleAssetVisibility(type, visible) {
    switch (type) {
      case 'floor':
        // Check if floor exists before changing visibility
        if (scene.userData.floor) {
          scene.userData.floor.visible = visible;
        }
        break;
  
      case 'hdr':
        // Assuming you have a way to access the HDR object, toggle its visibility
        if (scene.userData.hdr) {
          scene.userData.hdr.visible = visible; // Replace with the actual way to hide HDR
        }
        break;
    }
  }


// Add removeAsset to the returned object so it can be used externally
return {
  loadSkybox,
  loadFloor,
  setHDREnvironment,
  removeAsset,
  toggleAssetVisibility,
  fetchAssetNames,
  updateMaterialEnvMapIntensity,
  skyboxes,
  floors,
  hdrs
};
}