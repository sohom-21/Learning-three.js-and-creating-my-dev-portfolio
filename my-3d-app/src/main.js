import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import './style.css';

class CosmicParticleGalaxy {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
        
        this.particleCount = 8000;
        this.particles = [];
        this.rigidBodies = [];
        this.attractors = [];
        this.mousePos = new THREE.Vector3();
        this.mousePressed = false;
        this.explosionForce = 0;
        
        this.initPhysics().then(() => {
            this.init();
            this.createParticles();
            this.createAttractors();
            this.setupControls();
            this.animate();
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    async initPhysics() {
        // Initialize Rapier physics world
        await RAPIER.init();
        
        // Use new initialization format
        this.world = new RAPIER.World({ x: 0.0, y: 0.0, z: 0.0 });
        
        // Create physics bodies for particles
        this.rigidBodies = [];
        
        console.log('✨ Rapier physics initialized!');
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        document.body.appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);
        
        // Add cosmic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x64ffda, 2, 300);
        pointLight.position.set(0, 0, 50);
        this.scene.add(pointLight);
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Create spiral galaxy distribution
            const angle = (i / this.particleCount) * Math.PI * 8;
            const radius = (i / this.particleCount) * 80 + Math.random() * 20;
            
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
            const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 40;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Color based on distance from center
            const distance = Math.sqrt(x ** 2 + y ** 2);
            const colorFactor = 1 - (distance / 100);
            
            colors[i * 3] = 0.4 + colorFactor * 0.6;     // Red
            colors[i * 3 + 1] = 0.8 + colorFactor * 0.2; // Green
            colors[i * 3 + 2] = 1.0;                     // Blue
            
            sizes[i] = Math.random() * 3 + 1;
            
            // Create Rapier rigid body for each particle
            const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
                .setTranslation(x, y, z)
                .setLinearDamping(0.1)
                .setAngularDamping(0.1);
            
            const rigidBody = this.world.createRigidBody(rigidBodyDesc);
            
            // Create collider
            const colliderDesc = RAPIER.ColliderDesc.ball(0.5)
                .setDensity(0.1)
                .setFriction(0.1)
                .setRestitution(0.8);
            
            this.world.createCollider(colliderDesc, rigidBody);
            
            this.rigidBodies.push(rigidBody);
            
            // Store particle data
            this.particles.push({
                originalPosition: new THREE.Vector3(x, y, z),
                mass: sizes[i],
                rigidBody: rigidBody
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                explosionForce: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 customColor;
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                uniform float explosionForce;

                void main() {
                    vColor = customColor;
                    vSize = size;

                    vec3 pos = position;

                    // Add subtle wave motion
                    pos.x += sin(time * 2.0 + position.y * 0.01) * 2.0;
                    pos.y += cos(time * 1.5 + position.x * 0.01) * 2.0;
                    pos.z += sin(time * 1.0 + position.x * 0.005 + position.y * 0.005) * 3.0;

                    // Explosion effect
                    if (explosionForce > 0.0) {
                        vec3 direction = normalize(pos);
                        pos += direction * explosionForce * 50.0;
                    }

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float distance = length(center);
                    
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - distance * 2.0;
                    alpha *= (0.7 + 0.3 * sin(time * 3.0 + vSize * 10.0));
                    
                    vec3 color = vColor;
                    color += vec3(0.2, 0.4, 0.6) * (1.0 - distance);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    createAttractors() {
        // Create gravitational attractors as kinematic bodies
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 40;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = 0;
            
            // Create kinematic rigid body for attractor
            const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
                .setTranslation(x, y, z);
            
            const rigidBody = this.world.createRigidBody(rigidBodyDesc);
            
            // Create large sphere collider for attraction field
            const colliderDesc = RAPIER.ColliderDesc.ball(15)
                .setSensor(true); // Sensor = no collision, just detection
            
            this.world.createCollider(colliderDesc, rigidBody);
            
            this.attractors.push({
                position: new THREE.Vector3(x, y, z),
                rigidBody: rigidBody,
                strength: 0.5,
                radius: 30
            });
        }
    }
    
    setupControls() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersect = raycaster.ray.origin.clone().add(
                raycaster.ray.direction.clone().multiplyScalar(100)
            );
            this.mousePos.copy(intersect);
        });
        window.addEventListener('mousedown', (event) => {
            this.mousePressed = true;
            // Add attractor on right click
            if (event.button === 2) {
                const mouse = new THREE.Vector2(
                    (event.clientX / window.innerWidth) * 2 - 1,
                    -(event.clientY / window.innerHeight) * 2 + 1
                );
                raycaster.setFromCamera(mouse, this.camera);
                const intersect = raycaster.ray.origin.clone().add(
                    raycaster.ray.direction.clone().multiplyScalar(100)
                );
                this.addAttractor(intersect);
            }
        });
        window.addEventListener('mouseup', () => {
            this.mousePressed = false;
        });
        window.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.explode();
            } else if (event.code === 'KeyR') {
                this.reset();
            }
        });
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        // Add slider for explosion strength
        this.addExplosionSlider();
    }
    
    addAttractor(position) {
        // Add a new attractor at the given position
        const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
            .setTranslation(position.x, position.y, position.z);
        const rigidBody = this.world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.ball(15)
            .setSensor(true);
        this.world.createCollider(colliderDesc, rigidBody);
        this.attractors.push({
            position: position.clone(),
            rigidBody: rigidBody,
            strength: 0.7,
            radius: 35
        });
    }
    
    addExplosionSlider() {
        // Add a slider UI for explosion strength
        if (document.getElementById('explosion-slider')) return;
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0.1';
        slider.max = '2';
        slider.step = '0.01';
        slider.value = '0.5';
        slider.id = 'explosion-slider';
        slider.style.position = 'fixed';
        slider.style.left = '20px';
        slider.style.bottom = '20px';
        slider.style.zIndex = '10';
        slider.style.width = '200px';
        slider.title = 'Explosion Strength';
        document.body.appendChild(slider);
        const label = document.createElement('label');
        label.htmlFor = 'explosion-slider';
        label.innerText = '💥 Explosion Strength';
        label.style.position = 'fixed';
        label.style.left = '20px';
        label.style.bottom = '45px';
        label.style.zIndex = '10';
        label.style.color = '#64ffda';
        label.style.fontWeight = 'bold';
        document.body.appendChild(label);
        slider.addEventListener('input', (e) => {
            this.explosionStrength = parseFloat(e.target.value);
        });
        this.explosionStrength = parseFloat(slider.value);
    }
    
    explode() {
        this.explosionForce = 1.0;
        
        // Apply explosion forces through Rapier
        this.rigidBodies.forEach(rigidBody => {
            const translation = rigidBody.translation();
            const direction = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
            
            const force = direction.multiplyScalar((Math.random() + 0.5) * 50);
            rigidBody.applyImpulse(new RAPIER.Vector3(force.x, force.y, force.z), true);
        });
    }
    
    reset() {
        // Reset all rigid bodies to original positions
        this.rigidBodies.forEach((rigidBody, index) => {
            const particle = this.particles[index];
            const pos = particle.originalPosition;
            
            rigidBody.setTranslation(new RAPIER.Vector3(pos.x, pos.y, pos.z), true);
            rigidBody.setLinvel(new RAPIER.Vector3(0, 0, 0), true);
            rigidBody.setAngvel(new RAPIER.Vector3(0, 0, 0), true);
        });
        
        this.explosionForce = 0;
    }
    
    updatePhysics() {
        // Step the physics world
        this.world.step();
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.customColor.array;
        
        // Apply custom forces before stepping
        this.rigidBodies.forEach((rigidBody, index) => {
            const translation = rigidBody.translation();
            const pos = new THREE.Vector3(translation.x, translation.y, translation.z);
            
            // Apply attractor forces
            this.attractors.forEach(attractor => {
                const distance = pos.distanceTo(attractor.position);
                if (distance < attractor.radius) {
                    const force = attractor.position.clone().sub(pos).normalize();
                    force.multiplyScalar(attractor.strength * 10);
                    rigidBody.applyImpulse(new RAPIER.Vector3(force.x, force.y, force.z), true);
                }
            });
            
            // Mouse interaction
            if (this.mousePressed) {
                const mouseDistance = pos.distanceTo(this.mousePos);
                if (mouseDistance < 50) {
                    const force = this.mousePos.clone().sub(pos).normalize();
                    force.multiplyScalar(20.0 / (mouseDistance + 1));
                    rigidBody.applyImpulse(new RAPIER.Vector3(force.x, force.y, force.z), true);
                }
            }
            
            // Update Three.js positions from Rapier
            positions[index * 3] = translation.x;
            positions[index * 3 + 1] = translation.y;
            positions[index * 3 + 2] = translation.z;
            
            // Dynamic coloring based on velocity
            const velocity = rigidBody.linvel();
            const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
            
            colors[index * 3] = Math.min(1, 0.4 + speed * 0.1);
            colors[index * 3 + 1] = Math.min(1, 0.8 + speed * 0.05);
            colors[index * 3 + 2] = 1.0;
        });
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.customColor.needsUpdate = true;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();
        
        // Update physics
        this.updatePhysics();
        
        // Rotate camera slowly
        this.camera.position.x = Math.cos(time * 0.1) * 100;
        this.camera.position.z = Math.sin(time * 0.1) * 100;
        this.camera.lookAt(0, 0, 0);
        
        // Update attractors
        this.attractors.forEach((attractor, index) => {
            const angle = time * 0.5 + (index * Math.PI * 2 / 3);
            const radius = 30 + Math.sin(time * 0.3) * 10;
            
            attractor.position.x = Math.cos(angle) * radius;
            attractor.position.y = Math.sin(angle) * radius;
            attractor.position.z = Math.sin(time * 0.2 + index) * 20;
            
            // Update Rapier attractor position
            attractor.rigidBody.setNextKinematicTranslation(
                new RAPIER.Vector3(attractor.position.x, attractor.position.y, attractor.position.z)
            );
        });
        
        // Update shader uniforms
        this.particleSystem.material.uniforms.time.value = time;
        this.particleSystem.material.uniforms.explosionForce.value = this.explosionForce;
        
        // Decay explosion force
        this.explosionForce *= 0.95;
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the cosmic scene
new CosmicParticleGalaxy();