//usePrinter.js
import * as THREE from 'three';

import { getDownloadURL, getStorage, ref } from 'firebase/storage';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// import { useStore } from 'vuex';

// const store = useStore();


export function usePrinterLoader(scene) {
  const storage = getStorage();

  // Helper function to get the download URL for an asset from Firebase Storage
  async function fetchAssetURL(assetPath) {
    try {
      const storageRef = ref(storage, assetPath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(`Error fetching asset URL from Firebase Storage: ${assetPath}`, error);
      // You can throw a custom error to indicate permission issue
      throw new Error(`Permission error accessing asset: ${assetPath}`);
    }
  }
  

  // Function to load the printer model, binary files, and textures
  async function loadPrinter(printerType, printerName, printerFileName, textureName) {
    // Paths to the assets in Firebase Storage
    const basePath = `assets/printers/${printerType}/${printerName}`;
    const modelURL = await fetchAssetURL(`${basePath}/${printerFileName}.gltf`);
    const binURL = await fetchAssetURL(`${basePath}/${printerFileName}.bin`); // Assuming bin file has the same name
    const textureURL = await fetchAssetURL(`${basePath}/textures/${textureName}.jpg`); // Replace with actual texture file name if different

    

    // Load the model using the GLTFLoader
    const loader = new GLTFLoader();
    if (binURL) {
      // Set the resource path for associated assets like .bin files
      loader.setResourcePath(binURL);
    }
    loader.load(modelURL, (gltf) => {
      // Scale the model to desired dimensions
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const currentDimensions = box.getSize(new THREE.Vector3());
      const desiredDimensions = new THREE.Vector3(22.1, 40.3, 22.1); // Preset dimensions in mm
      const scaleX = desiredDimensions.x / currentDimensions.x;
      const scaleY = desiredDimensions.y / currentDimensions.y;
      const scaleZ = desiredDimensions.z / currentDimensions.z;

      gltf.scene.scale.set(scaleX, scaleY, scaleZ);


      gltf.scene.name = 'PrinterModel'; // This line sets the name

      
      scene.add(gltf.scene);

      // Apply texture if texture URL is available
      if (textureURL) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(textureURL, texture => {
          gltf.scene.traverse(child => {
            if (child.isMesh) {
      
              // Set new emissiveness (example: a slightly tinted white emissive)
              child.material.map = texture;
              // child.material.color.multiplyScalar(1.8); // Multiplies base color by a factor (adjust carefully)
              child.material.userData.originalColor = child.material.color.clone();

              // child.material.color.multiplyScalar(store.state.printerColorIntensity); // Use the value from the store

              child.material.needsUpdate = true;
             
            }
          });
        }, undefined, error => {
          console.error(`Error loading texture: ${error}`);
        });
      }

      
    }, undefined, error => {
      console.error(`Error loading GLTF model: ${error}`);
    });
  }


  function updatePrinterAppearance(scene, newIntensity) {
    const printer = scene.getObjectByName('PrinterModel');
    if (printer) {
        printer.traverse((child) => {
            if (child.isMesh && child.material.userData.originalColor) {
                const originalColor = child.material.userData.originalColor;
                child.material.color.copy(originalColor);
                child.material.color.multiplyScalar(newIntensity);
                child.material.needsUpdate = true;
            }
        });
    }
}

  return { loadPrinter, updatePrinterAppearance };
}

