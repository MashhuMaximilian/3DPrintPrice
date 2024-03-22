//useSTLfile.js
import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useAnimateLid } from './animateLid';

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
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        if (currentMesh) {
          scene.remove(currentMesh);
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);

        const height = size.y; // Convert to mm
        store.commit('setOriginalModelHeight', height);
        // console.log('STL model height:', height + ' mm');
        console.log('width:'+ size.x.toFixed(2) + ' mm', 'depth:' + size.y.toFixed(2) + ' mm', 'height:' + size.z.toFixed(2) + ' mm');

        store.dispatch('updateSTLFile', height);

        const desiredSize = store.state.originalModelHeight * 0.1; // Convert to cm
        const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
        mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);


            // Example volume calculation function (this is a simplification)
            function calculateVolume(mesh) {
              const geometry = mesh.geometry;
            
              // Ensure the geometry is merged and not indexed for simplicity
              if (!geometry.isBufferGeometry || geometry.index !== null) {
                console.error('Geometry is not in non-indexed BufferGeometry form');
                return 0;
              }
            
              const positionAttribute = geometry.getAttribute('position');
              if (positionAttribute === undefined) {
                console.error('Position attribute not found in geometry');
                return 0;
              }
            
              let volume = 0;
              const p1 = new THREE.Vector3();
              const p2 = new THREE.Vector3();
              const p3 = new THREE.Vector3();
            
              // Split the geometry into triangles and sum their volumes
              for (let i = 0; i < positionAttribute.count; i += 3) {
                p1.fromBufferAttribute(positionAttribute, i);
                p2.fromBufferAttribute(positionAttribute, i + 1);
                p3.fromBufferAttribute(positionAttribute, i + 2);
            
                // Compute the volume of the parallelepiped
                volume += p1.dot(p2.cross(p3)) / 6;
              }
            
              return Math.abs(volume); // Return the absolute value of the total volume
            }
            
            
            const volumeInml = calculateVolume(mesh) / 1000;
            store.dispatch('updateSTLVolume', volumeInml);
            console.log('STL model volume:', volumeInml + ' mL');
            
        const targetPosition = new THREE.Vector3(0, 32.2, 10);
        mesh.position.copy(targetPosition);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = Math.PI;

        mesh.name = 'capac'; // Name the mesh to be recognized by the animation function.
        scene.add(mesh);
        store.dispatch('updateSTLFile', { file: currentMesh, fileName: 'yourFileName.stl', height });

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

  function updateSTLScale(desiredHeight) {
    if (currentMesh) {
      const originalHeight = store.state.originalModelHeight * 10;
      const scaleFactor = desiredHeight / originalHeight;
      currentMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      console.log("updateSTLScale scaleFactor: ", scaleFactor);
    }
  }
  
  


  return { loadSTLModel, removeCurrentMesh, updateSTLScale };
}
