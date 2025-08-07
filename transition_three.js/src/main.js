import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

// 4. lights
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemisphereLight);

// 5. Create a renderer
const  renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Useful for high DPI displays
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Set tone mapping for better color reproduction
renderer.toneMappingExposure = 1.0; // Adjust exposure for the scene
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type for softer shadows
renderer.setClearColor(0x000000, 1); // Set clear color to black
renderer.physicallyCorrectLights = true; // Enable physically correct lighting
renderer.outputColorSpace = THREE.SRGBColorSpace; // Set output color space for correct color rendering


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
