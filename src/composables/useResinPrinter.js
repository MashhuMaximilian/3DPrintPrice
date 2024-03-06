// useResinPrinter.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function useResinPrinter(scene) {
  function loadGLTFModel() {
    const loader = new GLTFLoader();

    loader.load('/assets/resinprinter/scene.gltf', (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const currentDimensions = box.getSize(new THREE.Vector3());
      const desiredDimensions = new THREE.Vector3(22.1, 40.3, 22.1);
      const scaleX = desiredDimensions.x / currentDimensions.x;
      const scaleY = desiredDimensions.y / currentDimensions.y;
      const scaleZ = desiredDimensions.z / currentDimensions.z;

      gltf.scene.scale.set(scaleX, scaleY, scaleZ);

      gltf.scene.traverse(node => {
        if (node.isMesh && node.material) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.specular = new THREE.Color(0xaaaaaa);
          node.material.shininess = 30;
        }
      });

      scene.add(gltf.scene);

      const center = new THREE.Box3().setFromObject(gltf.scene).getCenter(new THREE.Vector3());
      const innerLight = new THREE.PointLight(0xffffff, 0.1, 10);
      innerLight.position.set(center.x, center.y, center.z);
      scene.add(innerLight);
    });
  }

  return { loadGLTFModel };
}
