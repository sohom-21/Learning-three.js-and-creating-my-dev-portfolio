import React, {useRef} from 'react'
import {Float, useGLTF} from '@react-three/drei'

const GitHub = (props) => {
    const {nodes, materials} = useGLTF('/models/github.glb')
    return (
        <Float FloatIntensity={1.5} rotationIntensity={1.5}>
            <group {...props} dispose={null}>
                <group position={[-0.055, 2.945, 6.336]} rotation={[Math.PI / 1.5, 0 , Math.PI / -4.7]} scale={28.364}>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Curve021.geometry}
                        material={materials['glossy putih']}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Curve021_1.geometry}
                        material={materials.github}
                    />
                </group>
            </group>
        </Float>
    )
}

useGLTF.preload('/models/github.glb');
export default GitHub;