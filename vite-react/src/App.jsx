import {Canvas, useFrame} from "@react-three/fiber"
import {OrbitControls, Sparkles} from "@react-three/drei";
import {useRef} from "react";

const RotatingCube = () => {
    const meshRef = useRef();
    useFrame(() => {
        if(meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    })
    return (
        <mesh ref={meshRef}>
            <cylinderGeometry args={[1,1,1]}/>
            <meshLambertMaterial color="#468585" emissive="#468585" />

            <Sparkles count={100} scale={1} size={6} speed={0.003} noise={0.2} color="orange"/>
        </mesh>
    )
}

function App() {

  return (
    <Canvas style={{height: '100vh', width:'100vw'}} className="flex justify-center items-center">
        <OrbitControls enableZoom={true} enablePan enableRotate={true}/>
        <directionalLight position={[1, 1, 1]} intensity={10} color={0x9CDBA6} />
        <color attach="background" args={['#f0f0f0']} />
        <RotatingCube/>
    </Canvas>
  )
}

export default App
