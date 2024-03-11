//useBackgroundSphere
import * as THREE from 'three';

const formatColor = (color) => {
  // Extract the raw color value if it's a proxy object, otherwise use it directly
  let colorStr = color.value ? color.value : color;
  // Ensure the color string starts with '#'
  return colorStr.startsWith('#') ? colorStr : `#${colorStr}`;
};

export function useBackgroundSphere() {
  function setBackgroundSphere(scene, properties) {
    // Use the updated formatColor function to process color values
    const sphereColor = formatColor(properties.sphereColor);
    const emissiveColor = formatColor(properties.emissiveColor);

    // Try to find an existing sphere in the scene
    let sphere = scene.getObjectByName('backgroundSphere');
    if (!sphere) {
      // If no sphere exists, create a new one
      const geometry = new THREE.SphereGeometry(150, 150, 150);
      const material = new THREE.MeshStandardMaterial({
        color: sphereColor, // Set sphere color
        metalness: properties.metalness,
        roughness: properties.roughness,
        emissive: emissiveColor, // Set emissive color
        emissiveIntensity: properties.emissiveIntensity,
        side: THREE.BackSide,
        transparent: true,
        opacity: properties.opacity,
        blending: THREE.NormalBlending,
        depthWrite: true,
        visible: true,
        wireframe: false,
      });

      sphere = new THREE.Mesh(geometry, material);
      sphere.name = 'backgroundSphere';
      scene.add(sphere);
    } else {
      // If sphere exists, update its properties
      sphere.material.color.set(sphereColor); // Corrected to use formatted color
      sphere.material.emissive.set(emissiveColor); // Corrected to use formatted emissive color
      // Update other properties
      sphere.material.metalness = properties.metalness;
      sphere.material.roughness = properties.roughness;
      sphere.material.emissiveIntensity = properties.emissiveIntensity;
      sphere.material.opacity = properties.opacity;
      sphere.material.alphaTest = properties.alphaTest;

      sphere.material.needsUpdate = true; // Ensure material updates are applied
    }
  }

  // Function to toggle sphere visibility
  function toggleBackgroundSphereVisibility(scene, visible) {
    const sphere = scene.getObjectByName('backgroundSphere');
    if (sphere) {
      sphere.visible = visible;
    }
  }

  return { setBackgroundSphere, toggleBackgroundSphereVisibility };
}
