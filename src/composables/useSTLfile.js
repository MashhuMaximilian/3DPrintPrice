import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export function useSTLfile(store, scene) {
  let currentMesh = null;

  async function loadSTLModel(file) {
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

        store.dispatch('updateSTLHeight', height);

        const desiredSize = 8;
        const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
        mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const targetPosition = new THREE.Vector3(0, 27, 10);
        mesh.position.copy(targetPosition);
        mesh.rotation.x = Math.PI / 2;

        scene.add(mesh);
        store.commit('setSTLUploadCompleted', true);
        currentMesh = mesh;

        // Trigger the animation after the STL model is loaded
        animateCapacGroup();
      };

      reader.readAsArrayBuffer(file);
    } else {
      if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh = null;
        store.commit('setCurrentSTLFileName', null);
      }
    }
  }

  function animateCapacGroup() {
    const capacGroup = scene.getObjectByName('capac');
    if (capacGroup) {
      const targetY = 80; // Define how high you want to move the capac group
      const duration = 3000; // Duration of the animation in milliseconds
      const startTime = performance.now();

      const animate = function (time) {
        const elapsedTime = time - startTime;
        const fraction = elapsedTime / duration;

        if (fraction < 1) {
          capacGroup.position.y += (targetY * fraction) - capacGroup.position.y;
          requestAnimationFrame(animate);
        } else {
          capacGroup.position.y = targetY;
        }
      };

      requestAnimationFrame(animate);
    }
  }

  return { loadSTLModel };
}
