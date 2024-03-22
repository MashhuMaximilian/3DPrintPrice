// animateLid.js
export function useAnimateLid(scene, camera) {

  function animateProperty({ object, property, targetValue, duration, onAnimate, onComplete }) {
    const startTime = performance.now();
    const initialValue = object[property];
  
    const animate = function (time) {
      const elapsedTime = time - startTime;
      const fraction = Math.min(elapsedTime / duration, 1); // Ensure fraction does not exceed 1
  
      object[property] = initialValue + (targetValue - initialValue) * fraction;
      if (onAnimate) onAnimate(); // Call the provided callback after each update
  
      if (fraction < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final value is set
        object[property] = targetValue;
        if (onAnimate) onAnimate(); // Also call after completing the animation
        console.log("Camera animation complete!");
        if (onComplete) onComplete(); // Call the onComplete callback after the animation completes
      }
    };
  
    requestAnimationFrame(animate);
  }

  function animateCameraZoom(camera) {
  // Confirm camera is not undefined before accessing its properties
      if (!camera) {
        console.error("Camera is undefined in animateCameraZoom");
        return;
    }
    const targetFOV = 15;
    console.log("Initial camera FOV:", camera.fov);

    animateProperty({
      object: camera,
      property: 'fov',
      targetValue: targetFOV,
      duration: 1000,
    });
  }

  function animateCapacGroup(onComplete = () => {}) {
    if (!scene || !scene.getObjectByName('capac')) {
      console.warn('Scene or object not ready for animation.');
      // Optionally, retry after a delay or set up a condition to try again later
      return;
    }
    
    const capacGroup = scene.getObjectByName('capac');
    if (capacGroup) {
      animateCameraZoom(camera); // Trigger camera zoom animation first
  
      animateProperty({
        object: capacGroup.position,
        property: 'y',
        targetValue: 50, // Target Y position
        duration: 1000, // Duration in milliseconds
        onAnimate: () => {
          // Optional: Add any additional animation callbacks here
        },
        onComplete: onComplete, // Call the provided callback after the animation completes
      });
    }
  }
  

  return { animateCapacGroup };
}