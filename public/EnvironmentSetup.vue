<template>
  <div></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// Props from parent component
const props = defineProps({
  scene: Object,
  skyboxPath: { type: String, default: '/assets/skyboxes/DreamlikeLandscape.glb' },
  floorPath: { type: String, default: '/assets/floors/pinkfloor2.glb' },
  hdrPath: { type: String, default: '/assets/hdrs/blouberg.hdr' },
});

const backgroundSphere = ref(null);

watchEffect(() => {
  if (props.scene) {
    if (props.skyboxPath) {
      loadSkybox(props.skyboxPath);
    }
    if (props.floorPath) {
      loadFloor(props.floorPath);
    }
    if (props.hdrPath) {
      loadHDR(props.hdrPath);
    }
  }
});


onMounted(() => {
  if (!props.scene) {
    console.error("EnvironmentSetup: No scene object provided.");
    return;
  }
  // Call these functions to load the initial environment
  loadSkybox(props.skyboxPath);
  loadFloor(props.floorPath);
  loadHDR(props.hdrPath);
});

// Watchers for changes in props
watch(() => props.skyboxPath, loadSkybox);
watch(() => props.floorPath, loadFloor);
watch(() => props.hdrPath, loadHDR);





</script>