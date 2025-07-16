import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

const InteractiveParticles = ({ position = [0, 0, 0] }) => {
    const particlesRef = useRef();
    const groupRef = useRef();
    const mousePos = useRef({ x: 0, y: 0 });
    const { pointer } = useThree();

    // Create particle system with spheres
    const { positions, velocities, colors } = useMemo(() => {
        const count = 300;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Position particles in a sphere
            const radius = 5 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Random velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

            // Rainbow colors
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, velocities, colors };
    }, []);

    useFrame((state, delta) => {
        if (!particlesRef.current || !groupRef.current) return;

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.4;
        }
        const positions = particlesRef.current.geometry.attributes.position.array;
        const colors = particlesRef.current.geometry.attributes.color.array;

        // Update mouse position
        mousePos.current.x = pointer.x * 10;
        mousePos.current.y = pointer.y * 10;


        // Animate particles
        for (let i = 0; i < positions.length; i += 3) {
            // Basic floating motion
            positions[i] += velocities[i] * delta * 10;
            positions[i + 1] += velocities[i + 1] * delta * 10;
            positions[i + 2] += velocities[i + 2] * delta * 10;

            // Mouse attraction effect
            const mouseDistance = Math.sqrt(
                Math.pow(positions[i] - mousePos.current.x, 2) +
                Math.pow(positions[i + 1] - mousePos.current.y, 2)
            );

            if (mouseDistance < 3) {
                const attractionForce = (3 - mouseDistance) * 0.001;
                positions[i] += (mousePos.current.x - positions[i]) * attractionForce;
                positions[i + 1] += (mousePos.current.y - positions[i + 1]) * attractionForce;

                // Color change on proximity
                colors[i] = 1; // Red
                colors[i + 1] = 0.3; // Green
                colors[i + 2] = 0.8; // Blue
            } else {
                // Return to original colors gradually
                const originalHue = (i / 3) / (positions.length / 3);
                const color = new THREE.Color().setHSL(originalHue, 0.8, 0.6);
                colors[i] = THREE.MathUtils.lerp(colors[i], color.r, 0.02);
                colors[i + 1] = THREE.MathUtils.lerp(colors[i + 1], color.g, 0.02);
                colors[i + 2] = THREE.MathUtils.lerp(colors[i + 2], color.b, 0.02);
            }

            // Boundary wrapping
            if (Math.abs(positions[i]) > 15) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 15) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 15) velocities[i + 2] *= -1;
        }

        // Rotate the entire system
        groupRef.current.rotation.y += delta * 0.1;
        groupRef.current.rotation.x += delta * 0.05;

        // Mark for update
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <Center>
            <group ref={groupRef} position={position} scale={0.8}>
                {/* Individual small spheres as particles */}
                {Array.from({ length: 200 }, (_, index) => (
                    <mesh key={index} position={[
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20
                    ]}>
                        <sphereGeometry args={[0.02, 4, 4]} />
                        <meshBasicMaterial
                            color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                ))}
            </group>
        </Center>
    );
};

export default InteractiveParticles;