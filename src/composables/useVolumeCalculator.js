// useVolumeCalculator.js
import * as THREE from 'three';

export function useVolumeCalculator() {
  const calculateVolume = (mesh) => {
    const geometry = mesh.geometry;
    if (!geometry.isBufferGeometry || geometry.index !== null) {
      console.error('Geometry is not in non-indexed BufferGeometry form');
      return 0;
    }

    const positionAttribute = geometry.getAttribute('position');
    let volume = 0;
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i += 3) {
      p1.fromBufferAttribute(positionAttribute, i);
      p2.fromBufferAttribute(positionAttribute, i + 1);
      p3.fromBufferAttribute(positionAttribute, i + 2);
      volume += p1.dot(p2.cross(p3)) / 6;
    }

    return Math.abs(volume);
  };

  return { calculateVolume };
}
