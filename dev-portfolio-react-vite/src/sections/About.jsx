import React from 'react'
import MagicBento from "../micro_designs/MagicBento.jsx";
import AnimatedWheel from "../micro_designs/AnimatedWheel.jsx";
import EarthVisualization from '../components/EarthVisualization.jsx';
import Button from '../components/Button.jsx';

const About = () => {
    const [hasCopied, setHasCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText('sohom.official21@gmail.com'); 
        setHasCopied(true)
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }
    return (
        <section className=' c-space my-20'>
            <div className='grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-6 h-full'>
                <div className='col-span-1 xl:row-span-3'>
                    <div className='grid-container'>
                        <img src={'/assets/grid_1.png'} alt='grid1' className='w-full sm:h-[376px] md:h-[396px] lg:h-[426px] h-full object-contain'/>
                        <div className=''>
                            <p className='grid-headtext'>Hey, there ....</p>
                            <p className='grid-subtext'>i am frontend developer and backend developer with focus in animation and seamless ui, also know app development</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 xl:row-span-3'>
                    <div className='grid-container'>
                       <AnimatedWheel/>
                        <div>
                            <p className='grid-headtext lg:mt-7'> Just a bit of my TechStack</p>
                            <p className='grid-subtext'>I know JavaScript/TypeScript, have worked on React and Next EcoSystems...</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 xl:row-span-4'>
                    <div className='grid-container'>
                        <EarthVisualization />
                        <div>
                            <p className='grid-headtext'>Ready to work  remotely across the globe...</p>
                            <p className='grid-subtext'>I'm a dev based in India</p>
                            <Button name ='Contact Me' isBeam containerClass='sm:w-fit w-full sm:min-w-80 border mt-9 border-white/20 bg-white/10 backdrop-blur-xl font-medium transition hover:bg-white/20 hover:text-white shadow-lg'/>
                        </div>
                    </div>
                </div>
                <div className='xl:col-span-2 xl:row-span-3'>
                    <div className='grid-container'>
                        <img src="/assets/grid3.png" alt=" grid-3"  className='w-full sm:h-[396px] h-fit object-contain'/>
                        <div>
                            <p className='grid-headtext'>I'm a tech enthusiast</p>
                            <p className='grid-subtext'>I love to explore new tech and learn new things and solve problems through code. Coding isn't just writing nerdy words using a editor.. for me it's my passion..</p>
                        </div>
                    </div>
                </div>
                <div className='xl:col-span-1 xl:row-span-2'>
                    <div className='grid-container'>
                        <img src='/assets/grid4.png' alt='grid-4' className='w-full md:h-[126px] sm:h-[276px] object-cover sm:object-top lg:h-[226px] lg:object-contain h-fit'/>
                        <div className='space-y-'>
                            <p className='grid-subtext text-center'>Contact me</p>
                            <div className='copy-container' onClick={handleCopy}>
                                <img src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'} alt='copy-icon'/>
                                <p className='lg:text-2xl md:text-xl font-medium text-gray_gradient text-white'>sohom.official21@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About