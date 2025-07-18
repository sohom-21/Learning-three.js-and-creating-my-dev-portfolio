import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const canvas = document.getElementById('canvas');

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0f0f0');

// 2. Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
camera.position.z = 2;

// 3. Object
const geometry = new THREE.IcosahedronGeometry(1, 3);
const material = new THREE.MeshLambertMaterial({ color: '#468585', emissive: '#468585', flatShading: true});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true });
const wireMesh = new THREE.Mesh(geometry, wireMat);
wireMesh.scale.setScalar(1.001)
mesh.add(wireMesh);

// 4. Lighting
const light = new THREE.SpotLight(0x006769, 100);
light.position.set(1, 1, 1);
scene.add(light);

// 5. Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.render(scene, camera);

// 6.controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;

//7.animation

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.001;
     renderer.render(scene, camera);
}
animate();