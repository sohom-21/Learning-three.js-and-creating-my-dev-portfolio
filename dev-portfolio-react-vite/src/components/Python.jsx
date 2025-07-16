import React, { useRef } from 'react'
import {Float, useGLTF} from '@react-three/drei'

const Python = (props) => {
    const { nodes, materials } = useGLTF('/models/python.glb')
    return (
        <Float floatIntensity={2} rotationIntensity={0.5}>
            <group {...props} dispose={null}>
                <group scale={0.01}>
                    <mesh
                        geometry={nodes.Python_Python_0.geometry}
                        material={materials.Python}
                        rotation={[-Math.PI / 2, 0, Math.PI / -0.2]}
                        scale={5}
                    />
                </group>
            </group>
        </Float>
    )
}

useGLTF.preload('/models/python.glb');
export default Python;
