import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from './spline';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { Loader } from 'three';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
scene.fog = new THREE.FogExp2(0x000000, 0.5 ); // Add fog for depth effect

// 2. Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Object

  //creating a line using the spline.js file
const points = spline.getPoints(100); // Get 100 points along the spline
const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// const line = new THREE.Line(geometry, material);
//scene.add(line); // Adding the spline line to the scene


//creating a tube geometry along the spline
const tubeGeometry = new THREE.TubeGeometry(spline, 250, 0.65, 16, true);
// const tubeMaterial = new THREE.MeshStandardMaterial({
//   side: THREE.DoubleSide,
//   wireframe:true,
//   color: 0x0099ff,
// });
// const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
// scene.add(tubeMesh); // Adding the tube mesh to the scene

  // try to make a edge geometry from the tube geometry
const edgeGeometry = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00099ff, linewidth: 2 });
const tubeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
scene.add(tubeLines); // Adding the edge mesh to the scene 

// 4. Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

//adding floating boxes to the scene
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
const boxMat = new THREE.MeshBasicMaterial({
color: 0x9900ff,
wireframe: true
});
const numBoxes = 55;
for (let i = 0; i < numBoxes; i += 1) {
const box = new THREE.Mesh(boxGeo, boxMat);
const p = (i / numBoxes + Math.random() * 0.1) % 1;
const pos = tubeGeometry.parameters.path.getPointAt(p);
pos.x += Math.random() - 0.4;
pos.z += Math.random() - 0.4;
box.position.copy(pos);
const rote = new THREE. Vector3(
Math.random() * Math.PI,
Math.random() * Math.PI,
Math.random() * Math.PI
);
box.rotation.set(rote.x, rote.y, rote.z);
const color = new THREE.Color().setHSL(1.0 - p, 1, 0.5);
const boxHelper = new THREE.BoxHelper(box, color);
// scene.add(box);
scene.add(boxHelper);
}

// fly through the tube geometry to create the wormhole effect
function updateCamera(t){
  const time = t * 0.1; // Get current time in seconds 
  const looptime = 8 * 1000; // setting the loop time to 8 seconds
  const point = (time % looptime) / looptime; // Normalize time to a value between 0 and 1
  const pos = tubeGeometry.parameters.path.getPointAt(point); // Get point on the spline at time t
  const lookAt = tubeGeometry.parameters.path.getPointAt((point + 0.03) % 1);
  camera.position.copy(pos); // Get the next point to look at
  camera.lookAt(lookAt); // Set camera to look at the next point
}


// 5. Renderer
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

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 100);
bloomPass.threshold = 0.001;
bloomPass.strength = 3.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// 6. Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;


// 7. Animation Loop
const animate = ( t = 0 ) => {
  requestAnimationFrame(animate);
  updateCamera(t)
  // controls.update();
  composer.render(scene, camera);
};
// Handle window resize -- the animation should adapt to the new size of the window if it changes

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();