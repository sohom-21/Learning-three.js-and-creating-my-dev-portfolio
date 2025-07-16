// main.js
// Scene, Camera, and Renderer Setup
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

async function init() {
    await RAPIER.init();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 35);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Rapier Physics World Setup
    const physics = new RAPIER.World({ gravity: { x: 0, y: -9.81, z: 0 } });

    // Create Static Ground
    const groundGeometry = new THREE.BoxGeometry(50, 0.1, 50);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    scene.add(ground);

    // Physics Collider for Ground
    const groundBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0);
    const groundBody = physics.createRigidBody(groundBodyDesc);
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(25, 0.05, 25);
    physics.createCollider(groundColliderDesc, groundBody);

    // Function to Create Dynamic Cubes
    function createDynamicCube(x, y, z, size, color) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
        const body = physics.createRigidBody(bodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2).setRestitution(0.8);
        physics.createCollider(colliderDesc, body);

        cube.userData.physicsBody = body;
        return cube;
    }

    // Create Colorful Cubes
    const cubes = [
        createDynamicCube(10, 10, 0, 2, 0xFF0000), // Red
        createDynamicCube(-10, 10, 0, 2, 0x00FF00), // Green
        createDynamicCube(0, 10, 10, 2, 0x0000FF), // Blue
        createDynamicCube(0, 10, -10, 2, 0xFFFF00) // Yellow
    ];

    // Particle System for Collisions (simple stub, not real collision detection)
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Camera Animation
    function animateCamera() {
        if (cubes.length > 0) {
            const avgPos = cubes.reduce((sum, cube) => sum.add(cube.position), new THREE.Vector3()).divideScalar(cubes.length);
            camera.position.lerp(new THREE.Vector3(avgPos.x, avgPos.y + 5, avgPos.z + 15), 0.05);
            controls.target.lerp(avgPos, 0.05);
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        physics.step();

        // Sync Three.js meshes with Rapier bodies
        cubes.forEach(cube => {
            const body = cube.userData.physicsBody;
            const pos = body.translation();
            cube.position.set(pos.x, pos.y, pos.z);
        });

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
}

init();
