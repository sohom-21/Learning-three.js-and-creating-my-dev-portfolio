function onMouseMove(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1) for both components
  mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // Update crosshairs position based on mouse position
  crosshairs.position.x = mousePos.x * 2;
  crosshairs.position.y = mousePos.y * 2;
  // Update crosshairs rotation to face the camera
  crosshairs.lookAt(camera.position);
  // Update the crosshairs scale based on distance to camera
  const distance = camera.position.distanceTo(crosshairs.position);
  crosshairs.scale.set(distance * 0.1, distance * 0.1, distance * 0.1);
}