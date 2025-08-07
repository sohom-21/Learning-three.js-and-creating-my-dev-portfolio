import * as THREE from 'three';
import {TTFLoader} from 'three/addons/loaders/TTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import getBgSphere from './getBgsphere';

// 1. Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 2. Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 3. objects
const icoGeo = new THREE.IcosahedronGeometry(1, 0);
const icoMat = new THREE.MeshStandardMaterial({
    color: 0x99ccff,
    flatShading: true,
});
const icoMesh = new THREE.Mesh(icoGeo, icoMat);
scene.add(icoMesh);

const bgSphere = getBgSphere();
scene.add(bgSphere);

// 4. lights
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemisphereLight);

// 5. Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 6. Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// 7. Load a font and create text geometry

// 8. Render the scene  
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// 9. Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
