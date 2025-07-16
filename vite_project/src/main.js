import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const canvas = document.getElementById('canvas');

//1. Scene

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0f0f0');

//2.Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

//3. Object

const geometry = new THREE.DodecahedronGeometry();
const material = new THREE.MeshLambertMaterial({ color: '#468585', emissive: '#468585' });
const dodecahedron = new THREE.Mesh(geometry, material);

const boxGeometry = new THREE.BoxGeometry(2,0.1,2);
const boxMaterial = new THREE.MeshStandardMaterial({color: '#c0c0c0',emissive: '#c0c0c0'});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.y = -1.5;

// adding to Scene
scene.add(dodecahedron);
scene.add(box);


//4. lighting
const light = new THREE.SpotLight(0x006769,100);
light.position.set(1,1,1);
scene.add(light);

//5. Renderer

const renderer = new THREE.WebGLRenderer({ canvas } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);  //very useful for mobile devices as well
// renderer.render(scene, camera);

// 6. Orbit Controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;

// 7. Animations
const animate = () => {
    requestAnimationFrame(animate);
    dodecahedron.rotation.x += 0.001;
    dodecahedron.rotation.y += 0.01;
    dodecahedron.rotation.z += 0.01;

    box.rotation.y += 0.001;
    controls.update();

    renderer.render(scene, camera);
}
// Handle Window resizing -- the animation and controls should work if the window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.render(scene, camera);
})
animate();