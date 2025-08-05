import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0f0f0');

// 2. Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Object

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: '#468585', emissive: '#468585' });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
// 4. Lighting
const light = new THREE.SpotLight(0x006769, 100);
light.position.set(1, 1, 1);
scene.add(light);

// 5. Renderer
const  renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Useful for high DPI displays

// 6. Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;

// Adding objects to the scene
scene.add(cube);

// 7. Animation Loop
const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
};
// Handle window resize -- the animation should adapt to the new size of the window if it changes

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();