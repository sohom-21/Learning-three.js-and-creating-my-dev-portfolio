import * as THREE from "three";
import './style.css';
import getLayer from "./getLayer.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as TWEEN from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

// import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const cubeGroup = new THREE.Group();
const interval = 0.02;
let nextTime = 0;
cubeGroup.userData.update = function (time) {
  if (time > nextTime) {
    let cube = getCube();
    cube.userData.start();
    cubeGroup.add(cube);
    nextTime = time + interval;
  }
  cubeGroup.rotation.y = time;
  cubeGroup.rotation.x = Math.cos(time) * 0.25;
};
scene.add(cubeGroup);

const palette = [0xFFFFFF, 0xF7F7F7, 0xECECEC, 0x333333, 0x0095A8, 0x00616F, 0xFF3300, 0xFF6600];
const geo = new RoundedBoxGeometry();

function doTransforms(cube) {
  cube.position.x = Math.random() - 0.5;
  cube.position.y = Math.random() - 0.5;
  cube.position.z = Math.random() - 0.5;
  const radius = 0.75 + Math.random() * 4;
  cube.position.normalize().multiplyScalar(radius);
  cube.rotation.y = Math.random() * Math.PI * 2;
  return cube;
}
function getCube() {
  const color = palette[Math.floor(Math.random() * palette.length)];
  const mat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.BackSide,
  });
  const cube = new THREE.Mesh(geo, mat);
  let cubeScale = Math.random() * 0.1 + 0.5;
  cube.scale.setScalar(0.0); // initial scale
  const innerColor = palette[Math.floor(Math.random() * palette.length)];
  const innerMat = new THREE.MeshBasicMaterial({
    color: innerColor,
  });
  const innerCube = new THREE.Mesh(geo, innerMat);
  const innerScale = 0.8;
  innerCube.scale.setScalar(innerScale);
  cube.add(innerCube);

  function _tween(needsUp) {
    let goalScale = needsUp ? cubeScale : 0.0;
    let delay = needsUp ? 0 : 2000;
    const scaleTween = new TWEEN.Tween(cube.scale)
    .to({ x: goalScale, y: goalScale, z: goalScale }, 2000)
      .easing(TWEEN.Easing.Elastic.Out)
      .delay(delay)
      .onComplete(() => {
        if (goalScale !== 0.0) {
          _tween(false);
        }
      })
      .start();
  }
  cube.userData.start = function () {
    _tween(true);
  }
  return doTransforms(cube);
}
// Gradient Background
const hex = palette[Math.floor(Math.random() * palette.length)];
const sprites = getLayer({
  hex,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -10.5,
});
scene.add(sprites);

function animate(t = 0) {
  const time = t * 0.0002;
  requestAnimationFrame(animate);
  cubeGroup.userData.update(time);
  TWEEN.update();
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);