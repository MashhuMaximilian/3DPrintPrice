import * as THREE from 'three';

export function useLighting(scene) {
  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4); // Adjust color and intensity

  // Directional Light (Sunlight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(-50, 200, 100); // Adjust position

  // Fill Light (Soft light)
  const fillLight = new THREE.DirectionalLight(0xdddddd, 1.7);
  fillLight.position.set(50, 50, 30); // Adjust position

  // Rim Light (Subtle highlight)
  const rimLight = new THREE.SpotLight(0xffffff, 0.3, 0, Math.PI / 4, 1);
  rimLight.position.set(0, 100, -100); // Adjust position

  // Add lights to the scene
  scene.add(ambientLight, directionalLight, fillLight, rimLight);

  // Shadow Configuration (Optional)
  if (scene) {
    directionalLight.castShadow = true;
    fillLight.castShadow = true;
    const shadowMapSize = 1024;  // Adjust shadow map size for quality
    directionalLight.shadow.mapSize.width = shadowMapSize;
    directionalLight.shadow.mapSize.height = shadowMapSize;
    fillLight.shadow.mapSize.width = shadowMapSize;
    fillLight.shadow.mapSize.height = shadowMapSize;
    // Additional shadow quality adjustments (optional)
  }
}
