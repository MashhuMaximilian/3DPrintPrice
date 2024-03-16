<!-- ThreeViewer.vue  -->
<template>
  <div ref="container">
    <canvas class="max-h-29rem border-round-3xl"  ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useScene } from '../composables/useScene';
import { useRenderer } from '../composables/useRenderer';
import { useCamera } from '../composables/useCamera';
import { useLighting } from '../composables/useLighting';
import { useBackgroundSphere } from '../composables/useBackgroundSphere';
import { useEnvironmentLoader } from '../composables/useEnvironmentLoader';
import { useViewerControls } from '../composables/viewerControls';
import { usePrinterLoader } from '@/composables/usePrinter';
import { useStoreSync } from '@/composables/useStoreSync'; // Import the new composable

const store = useStore();
const container = ref(null);
const canvas = ref(null);

let scene, camera;

onMounted(() => {
  if (!container.value || !canvas.value) return;

  scene = useScene();
  store.commit('setScene', scene);
  camera = useCamera(container.value.clientWidth / container.value.clientHeight);
  const { renderer, resizeRenderer } = useRenderer(canvas.value, container, camera);

  useLighting(scene);

  const { update: updateControls } = useViewerControls(camera, renderer);

  const { setBackgroundSphere, toggleBackgroundSphereVisibility } = useBackgroundSphere(scene.value);
  const { loadSkybox, loadFloor, setHDREnvironment, updateMaterialEnvMapIntensity } = useEnvironmentLoader(scene, renderer);

  // Use the new composable to set up the watchers
  useStoreSync(store, {
    scene,
    loadSkybox,
    loadFloor,
    setHDREnvironment,
    setBackgroundSphere,
    toggleBackgroundSphereVisibility,
    updateMaterialEnvMapIntensity,
  });

  // Load default assets
  loadSkybox(store.state.selectedSkybox);
  loadFloor(store.state.selectedFloor, store.state.floorProperties.floorColor);
  setHDREnvironment(store.state.selectedHDR);

  // Load default printer
  const { loadPrinter } = usePrinterLoader(scene);
  const printerType = 'resinprinters';
  const printerName = 'CrealityLD002H';
  const printerFileName = 'LD002H';
  const textureName = 'Gltf_Import';

  try {
    loadPrinter(printerType, printerName, printerFileName, textureName);
  } catch (error) {
    console.error('Error loading printer model:', error);
  }

  function animate() {
    requestAnimationFrame(animate);
    updateControls();
    resizeRenderer(); // Call resizeRenderer in the animation loop
    renderer.render(scene, camera);
  }

  animate();
});
</script>