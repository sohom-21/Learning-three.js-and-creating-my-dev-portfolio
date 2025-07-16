import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, MeshTransmissionMaterial, Float, Trail } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCrystals = ({ position = [0, 0, 0] }) => {
    const groupRef = useRef();
    const particlesRef = useRef();

    // Create random crystal positions and rotations
    const crystalData = useMemo(() => 
        Array.from({ length: 6 }, (_, i) => ({
            position: [
                Math.cos((i / 6) * Math.PI * 2) * (2 + i * 0.5),
                Math.sin((i / 6) * Math.PI * 2) * 1.5,
                Math.sin((i / 6) * Math.PI) * 2
            ],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            scale: 0.3 + Math.random() * 0.4,
            speed: 0.5 + Math.random() * 0.5
        })), []
    );

    // Create floating particles
    const particlePositions = useMemo(() => {
        const positions = new Float32Array(200 * 3);
        for (let i = 0; i < 200; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
        
        // Animate particles
        if (particlesRef.current) {
            particlesRef.current.rotation.x += delta * 0.2;
            particlesRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <Center>
            <group ref={groupRef} position={position} scale={0.8}>
                {/* Main crystal formation */}
                {crystalData.map((crystal, index) => (
                    <Float 
                        key={index}
                        speed={crystal.speed}
                        rotationIntensity={0.3}
                        floatIntensity={0.5}
                    >
                        <Trail
                            width={0.5}
                            length={10}
                            color={new THREE.Color(`hsl(${180 + index * 30}, 100%, 70%)`)}
                            attenuation={(t) => t * t}
                        >
                            <mesh
                                position={crystal.position}
                                rotation={crystal.rotation}
                                scale={crystal.scale}
                            >
                                <octahedronGeometry args={[1, 2]} />
                                <MeshTransmissionMaterial
                                    samples={6}
                                    resolution={256}
                                    transmission={0.95}
                                    roughness={0.1}
                                    thickness={0.2}
                                    ior={1.5}
                                    chromaticAberration={0.1}
                                    anisotropy={0.3}
                                    distortion={0.1}
                                    distortionScale={0.2}
                                    temporalDistortion={0.1}
                                    color={`hsl(${180 + index * 30}, 100%, 70%)`}
                                />
                            </mesh>
                        </Trail>
                    </Float>
                ))}

                {/* Floating particles */}
                <group ref={particlesRef}>
                    <points>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={200}
                                array={particlePositions}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <pointsMaterial
                            size={0.05}
                            color="#00eaff"
                            transparent
                            opacity={0.6}
                            sizeAttenuation
                        />
                    </points>
                </group>

                {/* Central energy core */}
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <mesh>
                        <icosahedronGeometry args={[0.5, 4]} />
                        <meshBasicMaterial
                            color="#ff6b6b"
                            transparent
                            opacity={0.7}
                            wireframe
                        />
                    </mesh>
                </Float>
            </group>
        </Center>
    );
};

export default FloatingCrystals;