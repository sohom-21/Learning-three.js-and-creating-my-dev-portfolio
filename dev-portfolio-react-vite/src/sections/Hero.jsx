import React, {Suspense} from 'react'
import {Canvas} from "@react-three/fiber"
import {PerspectiveCamera} from "@react-three/drei";
import Desktop_blend from "../components/Desktop_blend.jsx";
import CanvasLoader from "../components/CanvasLoader.jsx";
// import {Leva, useControls} from "leva";
import UseMediaQuery from "react-responsive/src/useMediaQuery.js";
import {calculateSizesForDesk} from "../constants/index.js";
import Target from "../components/Target.jsx";
import ReactLogo from "../components/ReactLogo.jsx";
import Cube from "../components/Cube.jsx";
import Python from "../components/Python.jsx";
import GitHub from "../components/GitHub.jsx";
import HeroCamera from "../components/HeroCamera.jsx";
import InteractiveParticles from "../components/InteractiveParticles.jsx";
import Button from "../components/Button.jsx";
import InteractiveParticlesV2 from "../components/InteractiveParticlesV2.jsx";


const Hero = () => {

    // const controls = useControls('Desktop', {
    //     positionX: {
    //         value: 0,
    //         min: -20,
    //         max: 10,
    //     },
    //     positionY: {
    //         value: 0,
    //         min: -10,
    //         max: 20,
    //     },
    //     positionZ: {
    //         value: 0,
    //         min: -10,
    //         max: 10,
    //     },
    //     rotationX: {
    //         value: 0,
    //         min: -10,
    //         max: 10,
    //     },
    //     rotationY: {
    //         value: 0,
    //         min: -10,
    //         max: 10,
    //     },
    //     rotationZ: {
    //         value: 0,
    //         min: -10,
    //         max: 10
    //     },
    //     scale: {
    //         value: 1,
    //         min: 0.5,
    //         max: 10,
    //     }
    // })

    const isSmall = UseMediaQuery({maxWidth: 425});
    const isMobile = UseMediaQuery({maxWidth: 768});
    const isTablet = UseMediaQuery({minWidth: 768, maxWidth: 1024});
    const Sizes = calculateSizesForDesk(isSmall, isMobile, isTablet);

    return (
        <section className="min-h-screen w-full flex flex-col relative">
            <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
                <p className="sm:text-3xl  text-2xl font-medium text-white text-center font-generalsans">Hi, I am
                    Sohom <span className="waving-hand">👋</span></p>
                <p className="hero_tag text-gray_gradient">Full Stack Developer, Building Scalable Systems</p>
            </div>
            <div className="w-full h-full absolute inset-0">
                {/*<Leva/>*/}
                <Canvas className="w-full h-full">
                    <Suspense fallback={<CanvasLoader/>}>
                        <PerspectiveCamera makeDefault position={[0, 0, 10]}/>
                        <HeroCamera isMobile={isMobile}>
                            <Desktop_blend
                                position={Sizes.Desk_blend_position}
                                scale={Sizes.Desk_blend_Scale}
                                rotation={[0.0, 0.02, 0.0]}
                            />
                        </HeroCamera>
                        <group>
                            <Target position={Sizes.targetPosition}/>
                            <ReactLogo position={Sizes.reactLogoPosition} scale={Sizes.reactScale}/>
                            <Cube position={Sizes.cubePosition} scale={Sizes.CubeScale}/>
                            <InteractiveParticlesV2 position={Sizes.ringPosition}/>
                            <Python
                                position={Sizes.pythonLogoPosition}
                                scale={Sizes.PythonLogoScale}
                            />
                            <GitHub
                                position={Sizes.githubLogoPosition}
                                scale={Sizes.GitLogoScale}
                            />
                        </group>
                        <ambientLight intensity={1}/>
                        <directionalLight position={[10, 10, 10]}/>
                    </Suspense>
                </Canvas>
            </div>
            <div className="absolute bottom-2 left-0 right-0 w-full z-10 c-space">
                <a href="#" className="w-fit">
                    <Button name="let's work together" isBeam containerClass='sm:w-fit w-full sm:min-w-96 border border-white/20 bg-white/10 backdrop-blur-xl font-medium transition hover:bg-white/20 hover:text-white shadow-lg'/>
                </a>
            </div>
        </section>
    )
}
export default Hero
