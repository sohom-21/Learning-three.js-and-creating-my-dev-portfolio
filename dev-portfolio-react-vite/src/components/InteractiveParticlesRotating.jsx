import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

const InteractiveParticlesRotating = ({ position = [0, 0, 0] }) => {
    const groupRef = useRef();
    const mousePos = useRef({ x: 0, y: 0 });
    const { pointer } = useThree();

    // Create particle system with spheres
    const { positions, velocities, colors } = useMemo(() => {
        const count = 200;
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
        // Uniform rotation around Y axis
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.4;
        }
    });

    return (
        <Center>
            <group ref={groupRef} position={position} scale={0.8}>
                {/* Individual small spheres as particles */}
                {Array.from({ length: positions.length / 3 }, (_, index) => (
                    <mesh key={index} position={[
                        positions[index * 3],
                        positions[index * 3 + 1],
                        positions[index * 3 + 2]
                    ]}>
                        <sphereGeometry args={[0.02, 4, 4]} />
                        <meshBasicMaterial
                            color={new THREE.Color(colors[index * 3], colors[index * 3 + 1], colors[index * 3 + 2])}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                ))}
            </group>
        </Center>
    );
};

export default InteractiveParticlesRotating;