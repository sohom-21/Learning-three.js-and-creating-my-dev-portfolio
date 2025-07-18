import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

const InteractiveParticlesV2 = ({ position = [0, 0, 0] }) => {
    const particlesRef = useRef();
    const groupRef = useRef();
    const mousePos = useRef({ x: 0, y: 0 });
    const frameCount = useRef(0);
    const { pointer } = useThree();

    // Pre-calculate colors to avoid creating new Color objects each frame
    const { positions, velocities, colors, originalColors } = useMemo(() => {
        const count = 300;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const originalColors = new Float32Array(count * 3);

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

            // Pre-calculate original colors
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            originalColors[i * 3] = color.r;
            originalColors[i * 3 + 1] = color.g;
            originalColors[i * 3 + 2] = color.b;

            // Set initial colors
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, velocities, colors, originalColors };
    }, []);

    useFrame((state, delta) => {
        if (!particlesRef.current || !groupRef.current) return;

        // Limit frame rate to reduce CPU usage
        frameCount.current++;
        if (frameCount.current % 2 !== 0) return; // Skip every other frame

        const positions = particlesRef.current.geometry.attributes.position.array;
        const colors = particlesRef.current.geometry.attributes.color.array;

        // Update mouse position less frequently
        mousePos.current.x = pointer.x * 10;
        mousePos.current.y = pointer.y * 10;

        // Simplified animation with reduced calculations
        for (let i = 0; i < positions.length; i += 3) {
            // Basic floating motion
            positions[i] += velocities[i] * delta * 10;
            positions[i + 1] += velocities[i + 1] * delta * 10;
            positions[i + 2] += velocities[i + 2] * delta * 10;

            // Simplified mouse interaction (only check every 5th particle)
            if (i % 15 === 0) {
                const dx = positions[i] - mousePos.current.x;
                const dy = positions[i + 1] - mousePos.current.y;
                const mouseDistance = Math.sqrt(dx * dx + dy * dy);

                if (mouseDistance < 3) {
                    const attractionForce = (3 - mouseDistance) * 0.001;
                    positions[i] += -dx * attractionForce;
                    positions[i + 1] += -dy * attractionForce;

                    // Simplified color change
                    colors[i] = 1;
                    colors[i + 1] = 0.3;
                    colors[i + 2] = 0.8;
                } else {
                    // Return to original colors using pre-calculated values
                    const lerpFactor = 0.02;
                    colors[i] += (originalColors[i] - colors[i]) * lerpFactor;
                    colors[i + 1] += (originalColors[i + 1] - colors[i + 1]) * lerpFactor;
                    colors[i + 2] += (originalColors[i + 2] - colors[i + 2]) * lerpFactor;
                }
            }

            // Simplified boundary wrapping
            if (positions[i] > 15 || positions[i] < -15) velocities[i] *= -1;
            if (positions[i + 1] > 15 || positions[i + 1] < -15) velocities[i + 1] *= -1;
            if (positions[i + 2] > 15 || positions[i + 2] < -15) velocities[i + 2] *= -1;
        }

        // Slower rotation to reduce calculations
        groupRef.current.rotation.y += delta * 0.2;
        groupRef.current.rotation.x += delta * 0.1;

        // Mark for update
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <Center>
            <group ref={groupRef} position={position} scale={0.8}>
                {/* Single optimized particle system */}
                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={positions.length / 3}
                            array={positions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-color"
                            count={colors.length / 3}
                            array={colors}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.03}
                        vertexColors
                        transparent
                        opacity={0.8}
                        sizeAttenuation={true}
                    />
                </points>
            </group>
        </Center>
    );
};

export default InteractiveParticlesV2;