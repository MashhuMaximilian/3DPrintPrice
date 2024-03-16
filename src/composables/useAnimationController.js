// useAnimationController.js
import { ref } from 'vue';

export function useAnimationController() {
  const animatingMeshes = ref([]);

  function animateMesh(mesh, animationProps) {
    // The animationProps could include target position, speed, etc.
    const { targetY, speed } = animationProps;

    function animate() {
      if (mesh.position.y < targetY) {
        mesh.position.y += speed;
        requestAnimationFrame(animate);
      } else {
        mesh.position.y = targetY;
        // Remove from animating meshes
        const index = animatingMeshes.value.indexOf(mesh);
        if (index > -1) {
          animatingMeshes.value.splice(index, 1);
        }
      }
    }

    animatingMeshes.value.push(mesh);
    requestAnimationFrame(animate);
  }

  return {
    animateMesh,
    animatingMeshes // Expose this if you want to access the currently animating meshes elsewhere
  };
}
