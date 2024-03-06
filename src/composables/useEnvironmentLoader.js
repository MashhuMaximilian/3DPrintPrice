// useAssetLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';

// Define contexts for assets
const skyboxesContext = require.context('@/assets/skyboxes', false, /\.glb$/);
const floorsContext = require.context('@/assets/floors', false, /\.glb$/);
const hdrsContext = require.context('@/assets/hdrs', false, /\.hdr$/);

export function useEnvironmentLoader(scene, renderer) {

  // Helper function to dynamically load GLTF assets
  function loadGLTF(path, callback) {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      callback(gltf);
    }, null, console.error);
  }

  

  
// Dynamically load a skybox
function loadSkybox(filename) {
  console.log('loadSkybox filename:', filename);
  const modulePath = skyboxesContext(`./${filename}`).default;
  loadGLTF(modulePath, (gltf) => {
    // Remove existing skybox if present
    if (scene.userData.skybox) {
      scene.remove(scene.userData.skybox);
    }
    // gltf.scene.scale.set(75, 75, 75); // Scale the floor object
    scene.userData.skybox = gltf.scene; // Update userData with the new skybox
    scene.add(gltf.scene);
  });
}

function loadFloor(filename, color) {
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
  console.log(`Loading floor: ${filename} with color ${color}`);
  const modulePath = floorsContext(`./${filename}`).default;
  loadGLTF(modulePath, (gltf) => {
    // Ensure any existing floor is removed first
    if (scene.userData.floor) {
      scene.remove(scene.userData.floor);
    }
    // Proceed with setting up the new floor object
    gltf.scene.scale.set(50, 1, 50); // Scale the floor object
    gltf.scene.name = 'floor'; // Name it for future reference

    // Apply the color if provided
    if (color) {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          console.log(`Applying color ${color} to mesh`);
          child.material.color.set(color); // Change the material color
        }
      });
    }

    // Set the floor object to visible and add it to the scene
    gltf.scene.visible = true;
    scene.userData.floor = gltf.scene;
    scene.add(gltf.scene);
  });
}



function setHDREnvironment(filename) {
  // When "No HDR" is selected, clear the environment and return early
  if (filename === 'No HDR' || !filename) {
    console.log('No HDR is selected, clearing the HDR environment.');
    scene.environment = null;
    return;
  }

  // Continue with HDR environment setup if a valid filename is provided
  const modulePath = hdrsContext(`./${filename}`).default;
  const loader = new RGBELoader();
  loader.load(modulePath, (texture) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose();
  }, null, (error) => {
    console.error('An error occurred while loading the HDR environment:', error);
  });
}

  // Function to get asset names by type
  function getAssetNames(type) {
    let context;
    switch (type) {
      case 'skybox':
        context = skyboxesContext;
        break;
      case 'floor':
        context = floorsContext;
        break;
      case 'hdr':
        context = hdrsContext;
        break;
      default:
        throw new Error('Unknown asset type');
    }
    return context.keys().map(filename => filename.replace('./', ''));
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
  getAssetNames,
  removeAsset,
  toggleAssetVisibility
};
}