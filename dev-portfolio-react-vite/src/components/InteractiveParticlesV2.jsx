import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

//  shaders/particleShaders.js
// We define the shaders as strings.

const vertexShader = `
  // Uniforms (values sent from React)
  uniform float uTime;
  uniform vec3 uMousePos;

  // Attributes (data unique to each particle)
  attribute vec3 aVelocity;
  attribute vec3 aColor;

  // Varyings (data passed from vertex to fragment shader)
  varying vec3 vColor;
  varying float vMouseDist;

  void main() {
    // 1. --- FLOATING ANIMATION ---
    // Create a looping, floating motion using sine waves
    // We use position and velocity to offset the waves, so they don't all move in sync
    vec3 pos = position;
    pos.x += sin(uTime * aVelocity.x + position.y) * 0.5;
    pos.y += cos(uTime * aVelocity.y + position.x) * 0.5;
    pos.z += sin(uTime * aVelocity.z + position.z) * 0.5;

    // 2. --- MOUSE INTERACTION ---
    // Calculate distance from the particle to the mouse
    float dist = distance(pos.xy, uMousePos.xy);

    // Calculate a "push" force. 
    // smoothstep() is 1.0 when dist is 0, and 0.0 when dist is 4.0
    float force = 1.0 - smoothstep(0.0, 4.0, dist);

    // Find the direction to push the particle away from the mouse
    vec2 pushDirection = normalize(pos.xy - uMousePos.xy);

    // Apply the push force (strongest when close)
    // We multiply by 2.0 to make the push effect more obvious
    pos.xy += pushDirection * force * 2.0;

    // 3. --- FINAL POSITION ---
    // Pass data to the fragment shader
    vColor = aColor; // Pass the particle's original color
    vMouseDist = dist; // Pass the mouse distance

    // Calculate the final position in screen space
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 4. --- SIZE ATTENUATION ---
    // Make particles smaller as they get farther away
    gl_PointSize = 10.0 * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vMouseDist;

  void main() {
    // The color when the mouse is close
    vec3 highlightColor = vec3(1.0, 0.3, 0.8);

    // Use smoothstep() to smoothly blend between colors
    // 1.0 (all highlight) when dist < 1.5
    // 0.0 (all original) when dist > 3.0
    float mixFactor = 1.0 - smoothstep(1.5, 3.0, vMouseDist);

    // mix() blends between the two colors based on the mixFactor
    vec3 finalColor = mix(vColor, highlightColor, mixFactor);

    // We can also make particles near the mouse fade in
    float opacity = 0.8 + (mixFactor * 0.2); // 0.8 normally, 1.0 on highlight

    gl_FragColor = vec4(finalColor, opacity);
  }
`;


// The new component
const InteractiveParticlesV2 = ({ position = [0, 0, 0] }) => {
    const materialRef = useRef();
    const groupRef = useRef();
    const { pointer } = useThree();

    // We use a ref for the mouse position to smoothly lerp (interpolate) it
    const mousePos = useRef(new THREE.Vector2(0, 0));

    // We increased the count from 300 to 5000 to show the performance!
    const particleData = useMemo(() => {
        const count = 1000;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3); // For sin wave speed
        const colors = new Float32Array(count * 3);     // Original color

        for (let i = 0; i < count; i++) {
            // Position particles in a sphere
            const radius = 5 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Random velocities (for animation speed/offset)
            velocities[i * 3] = (Math.random() - 0.5) * 0.4;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

            // Pre-calculate original colors
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, velocities, colors };
    }, []);

    // This is our NEW animation loop. It's tiny!
    useFrame((state, delta) => {
        if (!materialRef.current || !groupRef.current) return;

        // 1. Smoothly update the mouse position ref
        mousePos.current.lerp(new THREE.Vector2(pointer.x * 10, pointer.y * 10), 0.1);

        // 2. Update the shader's 'uniform' values
        materialRef.current.uniforms.uTime.value += delta;
        materialRef.current.uniforms.uMousePos.value.x = mousePos.current.x;
        materialRef.current.uniforms.uMousePos.value.y = mousePos.current.y;

        // Slower rotation (this is still on the CPU, which is fine)
        groupRef.current.rotation.y += delta * 0.1;
        groupRef.current.rotation.x += delta * 0.05;

        // NO MORE LOOPS!
        // NO MORE .needsUpdate = true!
    });

    // Define the uniforms for the shader
    const uniforms = useMemo(() => ({
        uTime: { value: 0.0 },
        uMousePos: { value: new THREE.Vector3(0, 0, 0) },
    }), []);

    return (
        <Center>
            <group ref={groupRef} position={position} scale={0.8}>
                <points>
                    <bufferGeometry>
                        {/* The initial positions */}
                        <bufferAttribute
                            attach="attributes-position"
                            count={particleData.positions.length / 3}
                            array={particleData.positions}
                            itemSize={3}
                        />
                        {/* The new custom attributes */}
                        <bufferAttribute
                            attach="attributes-aVelocity"
                            count={particleData.velocities.length / 3}
                            array={particleData.velocities}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-aColor"
                            count={particleData.colors.length / 3}
                            array={particleData.colors}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    {/* This is where the magic happens! */}
                    <shaderMaterial
                        ref={materialRef}
                        uniforms={uniforms}
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        transparent
                        blending={THREE.AdditiveBlending} // Looks great for particles
                        depthWrite={false} // Important for blending
                    />
                </points>
            </group>
        </Center>
    );
};

export default InteractiveParticlesV2;