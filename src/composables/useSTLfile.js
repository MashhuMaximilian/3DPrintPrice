//useSTLfile.js
import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useAnimateLid } from './animateLid';

export function useSTLfile(store, scene) {
  let currentMesh = null;

  async function loadSTLModel(file, camera) {
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

        const height = size.y;
        console.log('STL model height:', height);

        store.dispatch('updateSTLFile', height);

        const desiredSize = 7.5;
        const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
        mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const targetPosition = new THREE.Vector3(0, 27, 10);
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


  return { loadSTLModel };
}
