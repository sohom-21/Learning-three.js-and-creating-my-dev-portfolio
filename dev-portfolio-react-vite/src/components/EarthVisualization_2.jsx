import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import CanvasLoader from './CanvasLoader.jsx';
import * as THREE from 'three';

// Fresnel Material Hook
function useFresnelMaterial({ rimHex = 0x0088ff, facingHex = 0x000000 } = {}) {
  const material = useMemo(() => {
    const uniforms = {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.4 },
      fresnelPower: { value: 6.0 },
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
function Starfield({ numStars = 600, texturesLow = false }) {
  // reduce star count to save CPU/GPU
  const points = useMemo(() => {
    const verts = [];
    const colors = [];

    for (let i = 0; i < numStars; i++) {
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
  if (circleTexture) {
    if (texturesLow) {
      // cheaper sampling for low quality
      circleTexture.minFilter = THREE.LinearFilter;
      circleTexture.magFilter = THREE.LinearFilter;
      circleTexture.generateMipmaps = false;
      circleTexture.anisotropy = 1;
    } else {
      // keep better sampling for high/ultra
      circleTexture.minFilter = THREE.LinearMipMapLinearFilter;
      circleTexture.magFilter = THREE.LinearFilter;
      circleTexture.generateMipmaps = true;
      circleTexture.anisotropy = Math.min(4, THREE.Cache ? 4 : 4);
    }
    circleTexture.needsUpdate = true;
  }

  return (
    <points frustumCulled={true}>
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
        size={0.18}
        vertexColors
        map={circleTexture}
        transparent={true}
        depthWrite={false}
      />
    </points>
  );
}

// Earth Component
function Earth({ earthSub = 4, cloudSub = 4, glowSub = 4, texturesLow = false }) {
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

  // when texturesLow is true, reduce mipmaps/anisotropy to save memory and sampling cost
  if (texturesLow) {
    [earthTexture, specularTexture, bumpTexture, lightsTexture, cloudTexture, cloudAlphaTexture].forEach((tex) => {
      if (!tex) return;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.anisotropy = 1;
      tex.needsUpdate = true;
    });
  }

  // Throttled animation (~30 FPS): reduces CPU/GPU work
  const lastRef = useRef(0);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const minDelta = 1 / 30; // target ~30 FPS updates
    const elapsed = t - (lastRef.current || 0);
    if (elapsed < minDelta) return;
    lastRef.current = t;

    const factor = Math.min(elapsed / (1 / 60), 2);
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += 0.0013 * factor;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0004 * factor;
      cloudsRef.current.rotation.z += 0.0004 * factor;
    }
  });

  return (
    <group ref={earthGroupRef} rotation-z={-23.4 * Math.PI / 180}>
      {/* Main Earth */}
      <mesh ref={earthRef} receiveShadow={true}>
        {/* subdivision controlled by prop to tune quality */}
        <icosahedronGeometry args={[1, earthSub]} />
        <meshPhongMaterial
          map={earthTexture}
          specularMap={specularTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
        />
        
        {/* Night Lights */}
        <mesh>
          <icosahedronGeometry args={[1, glowSub]} />
          <meshBasicMaterial
            map={lightsTexture}
            blending={THREE.AdditiveBlending}
            transparent={true}
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
        
      {/* Clouds */}
      <mesh ref={cloudsRef} scale={1.009} castShadow={true}>
        <icosahedronGeometry args={[1, cloudSub]} />
        <meshPhongMaterial
          map={cloudTexture}
          alphaMap={cloudAlphaTexture}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={true}
        />

        {/* Earth Glow */}
        <mesh scale={1.02}>
          <icosahedronGeometry args={[1, glowSub]} />
          <primitive object={fresnelMaterial} />
        </mesh>
      </mesh>

      </mesh>
    </group>
  );
}

// Main App Component
export default function EarthVisualization({ quality = 'auto', enableControlsOnClick = true }) {
  // resolve quality (auto -> low on small screens, high otherwise)
  let resolved = quality;
  if (quality === 'auto') {
    if (typeof window !== 'undefined') resolved = window.innerWidth < 768 ? 'low' : 'high';
    else resolved = 'low';
  }

  const params = useMemo(() => {
    if (resolved === 'low') {
      return { earthSub: 4, cloudSub: 4, glowSub: 4, starCount: 300, dprCap: 1.0, fov: 60, texturesLow: true };
    }
    if (resolved === 'ultra') {
      return { earthSub: 15, cloudSub: 15, glowSub: 15, starCount: 2000, dprCap: Math.max(window.devicePixelRatio || 1, 2), fov: 75, texturesLow: false };
    }
    // high
    return { earthSub: 10, cloudSub: 8, glowSub: 8, starCount: 800, dprCap: 1.5, fov: 60, texturesLow: false };
  }, [resolved]);

  const [controlsEnabled, setControlsEnabled] = useState(false);

  const handleEnableControls = () => {
    if (enableControlsOnClick && !controlsEnabled) setControlsEnabled(true);
  };

  return (
    <div onClick={handleEnableControls} style={{ width: '100%', height: '100%', minHeight: '300px', maxHeight: '600px', background: '#000', cursor: enableControlsOnClick && !controlsEnabled ? 'pointer' : 'default' }}>
      {/*
        Performance-oriented Canvas settings:
        - lower DPR cap
        - request lower-power GPU preference
        - disable expensive soft shadows by leaving shadows off
      */}
      {typeof window !== 'undefined' ? (
        <Canvas
          dpr={Math.min(window.devicePixelRatio || 1, params.dprCap)}
          gl={{ antialias: true, powerPreference: resolved === 'ultra' ? 'high-performance' : 'low-power' }}
        >
          <color attach="background" args={['#000000']} />

          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={params.fov} />

          {/* Lighting: lower intensity to reduce shader cost */}
          <directionalLight
            position={[-2, -0.5, 1.5]}
            intensity={1.0}
            color={0xffffff}
          />

          {/* Wrap loader-using components in Suspense so react-three/drei's loading manager
              does not trigger React state updates during render (avoids "setState in render" errors). */}
          <Suspense fallback={<CanvasLoader />}>
            <Earth earthSub={params.earthSub} cloudSub={params.cloudSub} glowSub={params.glowSub} texturesLow={params.texturesLow} />
            <Starfield numStars={params.starCount} texturesLow={params.texturesLow} />
          </Suspense>

          {/* OrbitControls only when explicitly enabled (click to enable) */}
          {controlsEnabled ? (
            <OrbitControls enableDamping dampingFactor={0.05} enableZoom enablePan />
          ) : null}
        </Canvas>
      ) : null}
    </div>
  );
}