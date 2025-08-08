import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from './spline';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import getStarfield from './getStarfield';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { Loader } from 'three';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
scene.fog = new THREE.FogExp2(0x000000, 0.5 ); // Add fog for depth effect

// 2. Camera
let w = window.innerWidth;
let h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

// 3. Object
//adding starfield to the scene
scene.add(getStarfield());

//creating a line using the spline.js file
const points = spline.getPoints(100); // Get 100 points along the spline
const geometry = new THREE.BufferGeometry().setFromPoints(points);

//creating a tube geometry along the spline
const tubeGeometry = new THREE.TubeGeometry(spline, 250, 0.65, 16, true);
  // try to make a edge geometry from the tube geometry
  
const tubeColor = 0x00099ff;
const edgeGeometry = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const edgeMaterial = new THREE.LineBasicMaterial({ color: tubeColor, linewidth: 2 });
const tubeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
scene.add(tubeLines); // Adding the edge mesh to the scene 

// this is new section where we will create a colision system
const hitMat = new THREE.MeshBasicMaterial({
  color: tubeColor,
  side: THREE.BackSide,
  transparent: true,
  opacity:0.0
})
const tubeHitArea = new THREE.Mesh(tubeGeometry, hitMat);
scene.add(tubeHitArea); // Adding the hit area mesh to the scene


// 4. Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

//adding floating boxes to the scene
const boxGroup = new THREE.Group();
scene.add(boxGroup);
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
// const boxMat = new THREE.MeshBasicMaterial({
// color: 0x9900ff,
// wireframe: true
// });
const numBoxes = 65;
for (let i = 0; i < numBoxes; i += 1) {
const p = (i / numBoxes + Math.random() * 0.1) % 1;
const pos = tubeGeometry.parameters.path.getPointAt(p);
const color = new THREE.Color().setHSL(1.0 - p, 1, 0.5);
const boxMat = new THREE.MeshBasicMaterial({
  color,
  wireframe: false,
  opacity: 0.1,
  transparent: true,
});
const hitBox = new THREE.Mesh(boxGeo, boxMat);
hitBox.name = 'box';
pos.x += Math.random() - 0.4;
pos.z += Math.random() - 0.4;
hitBox.position.copy(pos);
const rote = new THREE. Vector3(
Math.random() * Math.PI,
Math.random() * Math.PI,
Math.random() * Math.PI
);
hitBox.rotation.set(rote.x, rote.y, rote.z);
const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({color});
const boxLines = new THREE.LineSegments(edges, lineMat);
boxLines.position.copy(pos);
boxLines.rotation.set(rote.x, rote.y, rote.z);
hitBox.userData.box = boxLines;
boxGroup.add(hitBox);
// scene.add(boxLines);  
}

// lets create a vector2 to hold the mouse position
let mousePos = new THREE.Vector2();
const crosshairs = new THREE.Group();
crosshairs.position.z = -1; // Set the crosshairs slightly in front of the camera
camera.add(crosshairs);
const crosshairsMat = new THREE.LineBasicMaterial({
  color: 0xffffff, // Green color for the crosshairs
})
const LineGeometry = new THREE.BufferGeometry();
const LineVertices = [0, 0.05, 0,0,0.02, 0]
LineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(LineVertices, 3));

for (let i = 0; i < 4; i++) {
  const line = new THREE.Line(LineGeometry, crosshairsMat);
  line.rotation.z =i * 0.5 * Math.PI;
  crosshairs.add(line);
}

const raycaster = new THREE.Raycaster();
const direction =new THREE.Vector3();
const impactPos = new THREE.Vector3();
const impactColor = new THREE.Color();
let impactBox = null;

// now we will create our lazer bolt function here
let lazer = [];
const lazerGeometry = new THREE.IcosahedronGeometry(0.05, 2);
function createlazerBolt(){
  const lazerMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00, // Green color for the lazer bolt
    transparent: true,
    fog: false,
  }) 
  var lazerBolt = new THREE.Mesh(lazerGeometry, lazerMat);

  lazerBolt.position.copy(camera.position);
  let active = true;
  let speed = 0.5;
  let goalPos = camera.position.clone().setFromMatrixPosition(crosshairs.matrixWorld);
  const lazerDirection = new THREE.Vector3(0,0,0);
  lazerDirection.subVectors(lazerBolt.position, goalPos).normalize().multiplyScalar(speed);

  direction.subVectors(goalPos,camera.position);
  raycaster.set(camera.position, direction);
  let intersects = raycaster.intersectObjects([...boxGroup.children, tubeHitArea],true);

  if(intersects.length > 0){
    impactPos.copy(intersects[0].point);
    impactColor.copy(intersects[0].object.material.color);
    if(intersects[0].object.name === 'box') {
      impactBox = intersects[0].object;
      boxGroup.remove(intersects[0].object);
    }
  }

  let scale = 1.0;
  let opacity = 1.0;
  let isExploding = false;

  function updateLazerBolt() {
    if (active === true){
      if( isExploding === false){
        lazerBolt.position.sub(lazerDirection);
        if(lazerBolt.position.distanceTo(impactPos) < 0.5){
          lazerBolt.position.copy(impactPos);
          lazerBolt.material.color.set(impactColor);
          isExploding = true;
          impactBox?.scale.setScalar(0.0);
        }
    }
    else{
      if(opacity > 0.01){
        scale += 0.02;
        opacity *= 0.85;
      }
      else{
        opacity = 0.0;
        scale = 0.01;
        active = false;
      }
      lazerBolt.scale.setScalar(scale);
      lazerBolt.material.opacity = opacity;
      lazerBolt.userData.active = active;
    }
  }
}
  lazerBolt.userData = {updateLazerBolt,active};
  return lazerBolt;
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
renderer.setSize(w,h);
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
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.enableZoom = true;
// controls.enablePan = true;

// 7. Animation Loop
const animate = ( t = 0 ) => {
  requestAnimationFrame(animate);
  updateCamera(t)
  // controls.update();
  crosshairs.position.set(mousePos.x, mousePos.y, -1); // Update crosshairs position based on mouse
  lazer.forEach((l)=>l.userData.updateLazerBolt());
  composer.render(scene, camera);
};
animate();

function onMouseMove(event) {
w = window. innerWidth;
h = window. innerHeight;
let aspect = w / h;
let fudge = { x: aspect * 0.75, y: 0.75 };
mousePos.x = ((event.clientX / w) * 2 - 1) * fudge.x;
mousePos.y = (-1* (event.clientY / h)*2 + 1) * fudge.y;
}

function firelazer(){
  const lazerVolt = createlazerBolt();
  lazer.push(lazerVolt)
  scene.add(lazerVolt)

  let inactiveLazer = lazer.filter((l) => l.userData.active === false);
  scene.remove(...inactiveLazer);
  lazer = lazer.filter((l) => l.userData.active === true);
}
window.addEventListener('mousemove', onMouseMove,false);
window.addEventListener('click', () => firelazer());
// Handle window resize -- the animation should adapt to the new size of the window if it changes

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
