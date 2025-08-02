import React, { useRef } from 'react'
import {Float, useGLTF} from '@react-three/drei'

const Python = (props) => {
    const { nodes, materials } = useGLTF('/models/python.glb')
    return (
        <Float>
            <group {...props} dispose={null}>
                <group scale={0.01}>
                    <mesh
                        geometry={nodes.Python_Python_0.geometry}
                        material={materials.Python}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={5}
                    />
                </group>
            </group>
        </Float>
    )
}

useGLTF.preload('/models/python.glb');
export default Python;
