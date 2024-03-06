// useSTLfile.js
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function useSTLfile(scene) {
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
      mesh.scale.set(0.1, 0.1, 0.1);
      mesh.rotation.z = Math.PI;
      mesh.rotation.x = Math.PI / 2;

      const gltfLoader = new GLTFLoader();
      gltfLoader.load('/assets/resinprinter/scene.gltf', (gltf) => {
        const gltfBox = new THREE.Box3().setFromObject(gltf.scene);
        const gltfCenter = gltfBox.getCenter(new THREE.Vector3());

        mesh.position.set(gltfCenter.x - 1, gltfCenter.y + 18.5, gltfCenter.z + 11);
        scene.add(mesh);
      });
    };

    fileReader.onerror = (error) => {
      console.error('Error reading STL file:', error);
    };

    fileReader.readAsArrayBuffer(file);
  }

  return { loadSTLModel };
}
