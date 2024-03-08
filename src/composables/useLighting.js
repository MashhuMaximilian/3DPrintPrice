import * as THREE from 'three';

export function useLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8); // Adjust intensity and color for subtle ambient light

  // Key light (main light source)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.0); // Adjust intensity here
  keyLight.position.set(-50, 50, 50); // Adjust position for directional lighting

  // Fill light (soft, less intense light to fill in shadows)
  const fillLight = new THREE.DirectionalLight(0xdddddd, 0.7); // Adjust intensity and color for softer light
  fillLight.position.set(50, 50, -50); // Adjust position

  // Rim light (creates a subtle highlight on the subject's edges)
  const rimLight = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI / 8, 1); // Adjust intensity, angle, and falloff
  rimLight.position.set(0, 0, 80); // Adjust position for rim lighting effect


    // // Add a PointLight at the center of the model
    const innerLight = new THREE.PointLight(0xffffff, 0.6, 1);
    innerLight.position.set(11, 40, 11);


  scene.add(ambientLight, keyLight, fillLight, rimLight, innerLight);

  // Configure shadow maps for key light and fill light
  keyLight.castShadow = true;
  fillLight.castShadow = true;

  const shadowMapSize = 1024; // Adjust shadow map size based on performance and quality needs

  keyLight.shadow.mapSize.width = shadowMapSize;
  keyLight.shadow.mapSize.height = shadowMapSize;
  fillLight.shadow.mapSize.width = shadowMapSize;
  fillLight.shadow.mapSize.height = shadowMapSize;

  // Additional shadow quality adjustments (optional)
  keyLight.shadow.bias = -0.005; // Reduce shadow acne (adjust as needed)
  fillLight.shadow.bias = -0.005;
  keyLight.shadow.mapSize.width = Math.pow(512, 2); // Higher resolution for better quality (adjust based on performance)
  keyLight.shadow.mapSize.height = Math.pow(512, 2);
  fillLight.shadow.mapSize.width = Math.pow(512, 2);
  fillLight.shadow.mapSize.height = Math.pow(512, 2);

  // Set the shadow camera's near and far planes for better shadow depth
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 1000;
  fillLight.shadow.camera.near = 0.1;
  fillLight.shadow.camera.far = 1000;

}
