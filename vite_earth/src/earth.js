import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from "./getStarfield.js";
import {getFresnelMat} from "./getFresnelMat.js";
const canvas = document.getElementById('canvas');

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');

// 2. Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

// 3. Object
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshPhongMaterial({
    map: loader.load("/assets/textures/earthmap1k.jpg"),
    specularMap: loader.load("/assets/textures/02_earthspec1k.jpg"),
    bumpMap: loader.load("/assetstextures/01_earthbump1k.jpg"),
    bumpScale: 0.05,
});
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load('/assets/textures/03_earthlights1k.jpg'),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
mesh.add(lightsMesh);


// adding stars
const stars = getStarfield({numStars: 2000})
scene.add(stars);

// so this is new we are using a group
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
earthGroup.add(mesh);
scene.add(earthGroup);

// adding clouds
const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load('/assets/textures/04_earthcloudmap.jpg'),
    blending: THREE.AdditiveBlending,
    opacity: 0.8,
    alphaMap: loader.load('/assets/textures/05_earthcloudmaptrans.jpg'),
    transparent: true,
})
const cloudMesh = new THREE.Mesh(geometry, cloudMat);
cloudMesh.scale.setScalar(1.006)
earthGroup.add(cloudMesh);

// add the earthly glow
const fresnelMat = new getFresnelMat();
const earthGlow = new THREE.Mesh(geometry, fresnelMat);
mesh.add(earthGlow);
earthGlow.scale.setScalar(1.02)

// 4. Lighting
const sunlight = new THREE.DirectionalLight(0xffffff, 2.0);
sunlight.position.set(-2, -0.5, 1.5);
scene.add(sunlight);

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
    earthGroup.rotation.y += 0.001;
    cloudMesh.rotation.y += 0.0010;
    renderer.render(scene, camera);
}
animate();