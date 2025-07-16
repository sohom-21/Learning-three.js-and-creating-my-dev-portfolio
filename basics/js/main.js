import * as THREE from 'three';
// how to use three js to create a scene

// 1. Create a Scene just like in the lines below
const scene = new THREE.Scene();
scene.background = new THREE.Color('#F0F0F0');

// 2. Now we need to add a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // we are defining the camera positions

// 3. Create and add a cube object
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: '#468585', emissive: '#468585' });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//4. Add lighting
const light = new THREE.DirectionalLight(0x9CDBA6, 10);
light.position.set(1, 1, 1);
scene.add(light);

//5. Set Up the Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//6. Animate the Scene
const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.001; // Rotate the cube on the x-axis
    cube.rotation.y += 0.01; // Rotate the cube on the y-axis
    cube.rotation.z += 0.01; // Rotate the cube on the z-axis
    renderer.render(scene, camera);
};
animate();

// renderer.render(scene, camera);