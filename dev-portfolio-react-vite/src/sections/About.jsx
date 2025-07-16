import React from 'react'
import MagicBento from "../micro_designs/MagicBento.jsx";

const About = () => {
    return (
        <section className=' c-space my-20'>
            <div className='grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-6 h-full'>
                <div className='col-span-1 xl:row-span-3'>
                    <div className='grid-container'>
                        <img src={'/assets/grid1.png'} alt='grid1' className='w-full sm:h-[276px] h-fit object-contain'/>
                        <div className=''>
                            <p className='grid-headtext'>Hey, there ....</p>
                            <p className='grid-subtext'>i am Fresher frontend developer and backend developer with focus in animation and seamless ui also know app development</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About