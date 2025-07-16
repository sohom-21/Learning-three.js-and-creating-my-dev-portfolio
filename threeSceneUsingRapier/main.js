// main.js
// Scene, Camera, and Renderer Setup
// import RAPIER from 'Rapier';
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 35);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;

// Rapier Physics World Setup
const physics = new RAPIER.World(
    new RAPIER.WorldConfig({ gravity: [0, -9.81, 0] })
);

// Create Static Ground
const groundGeometry = new THREE.BoxGeometry(50, 0.1, 50);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(ground);

// Physics Collider for Ground
const groundCollider = RAPIER.ColliderBuilder.buildFromShape(
    groundGeometry,
    RAPID2DerealizationMode.World,
    RAPID2DRelevanceixture.Redirected,
    true
);
groundCollider.setRigidBody(physics.createRigidBody(RAPIER.RigidBodyDesc.Static()));
groundCollider.setTranslation(0, -1, 0);

// Function to Create Dynamic Cubes
function createDynamicCube(x, y, z, size, color) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const colliderBuilder = RAPIER.ColliderBuilder.buildFromShape(
        new RAPIER.ConvexHull(geometry),
        RAPID2DerealizationMode.World,
        RAPID2DRelevanceixture.Redirected,
        true
    );

    const rigidBodyDesc = RAPIER.RigidBodyDesc.Dynamic()
        .setTranslation(x, y, z)
        .setGravityScale(1)
        .build();
    colliderBuilder.setRigidBody(rigidBodyDesc);
    colliderBuilder.setRestitution(0.8);
    colliderBuilder.setType(RAPIER.ColliderType.Collider);
}

// Create Colorful Cubes
createDynamicCube(10, 10, 0, 2, 0xFF0000); // Red
createDynamicCube(-10, 10, 0, 2, 0x00FF00); // Green
createDynamicCube(0, 10, 10, 2, 0x0000FF); // Blue
createDynamicCube(0, 10, -10, 2, 0xFFFF00); // Yellow

// Particle System for Collisions
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Update Particles on Collision
physics.onCollisionEvent.add((event) => {
    const position = event.colliderA.translation();
    const positions = particleGeometry.getAttribute('position').array;
    positions.push(position.x, position.y, position.z);
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
});

// Camera Animation
function animateCamera() {
    const cubes = scene.children.filter(obj => obj.type === 'Mesh');
    if (cubes.length > 0) {
        const avgPos = cubes.reduce((sum, cube) => sum.add(cube.position), new THREE.Vector3()).divideScalar(cubes.length);
        camera.position.lerp(new THREE.Vector3(avgPos.x, avgPos.y + 5, avgPos.z + 15), 0.05);
        controls.target.lerp(avgPos, 0.05);
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    physics.step(1/60.0);
    animateCamera();
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});