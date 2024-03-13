import * as THREE from 'three';

// useSTLfile.js
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export function useSTLfile(store) {
  function loadSTLModel(file) {
    if (!(file instanceof Blob)) {
      console.error('Invalid file type:', file);
      return;
    }

    const fileReader = new FileReader();
    console.log('Loading STL model:', file.name);
    const loader = new STLLoader();

    fileReader.onload = (e) => {
      console.log('File read completed, parsing geometry');
      const geometry = loader.parse(e.target.result);

      if (!geometry) {
        console.error('Error parsing STL geometry');
        return;
      }

      console.log('Geometry parsed successfully');
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(geometry, material);

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
      const desiredSize = 1; // Adjust this value as needed
      const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Set the position and orientation of the mesh
      const targetPosition = new THREE.Vector3(0, 10, 0); // Adjust the coordinates as needed
      mesh.position.copy(targetPosition);
      mesh.rotation.x = Math.PI; // Rotate the mesh upside down

      store.dispatch('updateCurrentSTLFile', mesh);
    };

    fileReader.onerror = (error) => {
      console.error('Error reading STL file:', error);
    };

    fileReader.readAsArrayBuffer(file);
  }

  return { loadSTLModel };
}