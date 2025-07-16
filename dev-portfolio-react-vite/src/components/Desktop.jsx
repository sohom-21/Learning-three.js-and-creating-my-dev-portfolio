import React, { useRef } from 'react'
import {useGLTF, useTexture} from '@react-three/drei'

const Desktop = (props) => {
    const { nodes, materials } = useGLTF('/models/my_computer.glb')
    const CpuTexture = useTexture('/textures/desk/cpu.png')
    const chairTexture = useTexture('/textures/desk/chair.png')
    const WoodTexture = useTexture('/textures/desk/wood-material-background-wallpaper-texture-concept.jpg')
    const WoodTexture2 = useTexture('/textures/desk/dark_wood_diff_4k.jpg')
    return (
        <group {...props} dispose={null}>
            <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
                <mesh
                    name="Object_2"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_2.geometry}
                    material={materials.mat0}

                >
                    <meshMatcapMaterial map={WoodTexture2}/>
                </mesh>
                <mesh
                    name="Object_3"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_3.geometry}
                    material={materials.mat1}
                />
                <mesh
                    name="Object_4"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_4.geometry}
                    material={materials.mat10}
                />
                <mesh
                    name="Object_5"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_5.geometry}
                    material={materials.mat11}
                />
                <mesh
                    name="Object_6"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_6.geometry}
                    material={materials.mat2}
                />
                <mesh
                    name="Object_7"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_7.geometry}
                    material={materials.mat3}
                />
                <mesh
                    name="Object_8"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_8.geometry}
                    material={materials.mat4}
                />
                <mesh
                    name="Object_9"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_9.geometry}
                    material={materials.mat5}
                />
                <mesh
                    name="Object_10"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_10.geometry}
                    material={materials.mat6}
                />
                <mesh
                    name="Object_11"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_11.geometry}
                    material={materials.mat7}
                />
                <mesh
                    name="Object_12"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_12.geometry}
                    material={materials.mat8}
                />
                <mesh
                    name="Object_13"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_13.geometry}
                    material={materials.mat9}
                />
            </group>
        </group>
    )
}
useGLTF.preload('/models/my_computer.glb')
export default Desktop;