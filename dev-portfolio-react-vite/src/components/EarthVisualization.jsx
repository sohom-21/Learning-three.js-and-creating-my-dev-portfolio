import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Fresnel Material Hook
function useFresnelMaterial({ rimHex = 0x0088ff, facingHex = 0x000000 } = {}) {
  const material = useMemo(() => {
    const uniforms = {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };

    const vertexShader = `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      
      varying float vReflectionFactor;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
      
        vec3 I = worldPosition.xyz - cameraPosition;
      
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
      
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      
      varying float vReflectionFactor;
      
      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, [rimHex, facingHex]);

  return material;
}

// Starfield Component
function Starfield({ numStars = 2000 }) {
  const points = useMemo(() => {
    const verts = [];
    const colors = [];
    
    for (let i = 0; i < numStars; i++) {
      // Random sphere point generation
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      verts.push(x, y, z);
      
      const color = new THREE.Color().setHSL(0.6, 0.2, Math.random());
      colors.push(color.r, color.g, color.b);
    }
    
    return { verts, colors };
  }, [numStars]);

  const circleTexture = useLoader(THREE.TextureLoader, '/assets/textures/circle.png');

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.verts.length / 3}
          array={new Float32Array(points.verts)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={points.colors.length / 3}
          array={new Float32Array(points.colors)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        map={circleTexture}
      />
    </points>
  );
}

// Earth Component
function Earth() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const earthGroupRef = useRef();
  
  // Load textures
  const earthTexture = useLoader(THREE.TextureLoader, '/assets/textures/earthmap1k.jpg');
  const specularTexture = useLoader(THREE.TextureLoader, '/assets/textures/02_earthspec1k.jpg');
  const bumpTexture = useLoader(THREE.TextureLoader, '/assets/textures/01_earthbump1k.jpg');
  const lightsTexture = useLoader(THREE.TextureLoader, '/assets/textures/03_earthlights1k.jpg');
  const cloudTexture = useLoader(THREE.TextureLoader, '/assets/textures/04_earthcloudmap.jpg');
  const cloudAlphaTexture = useLoader(THREE.TextureLoader, '/assets/textures/05_earthcloudmaptrans.jpg');

  const fresnelMaterial = useFresnelMaterial();

  // Animation
  useFrame((state, delta) => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0010;
    }
  });

  return (
    <group ref={earthGroupRef} rotation-z={-23.4 * Math.PI / 180}>
      {/* Main Earth */}
      <mesh ref={earthRef}>
        <icosahedronGeometry args={[1, 15]} />
        <meshPhongMaterial
          map={earthTexture}
          specularMap={specularTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
        />
        
        {/* Night Lights */}
        <mesh>
          <icosahedronGeometry args={[1, 15]} />
          <meshBasicMaterial
            map={lightsTexture}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Earth Glow */}
        <mesh scale={1.02}>
          <icosahedronGeometry args={[1, 15]} />
          <primitive object={fresnelMaterial} />
        </mesh>
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef} scale={1.006}>
        <icosahedronGeometry args={[1, 15]} />
        <meshStandardMaterial
          map={cloudTexture}
          alphaMap={cloudAlphaTexture}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Main App Component
export default function EarthVisualization() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas>
        <color attach="background" args={['#000000']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        
        {/* Lighting */}
        <directionalLight 
          position={[-2, -0.5, 1.5]} 
          intensity={2.0} 
          color={0xffffff} 
        />
        
        {/* Earth */}
        <Earth />
        
        {/* Starfield */}
        <Starfield numStars={2000} />
        
        {/* Controls */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom 
          enablePan 
        />
      </Canvas>
    </div>
  );
}