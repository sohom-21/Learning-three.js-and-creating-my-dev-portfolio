import React from 'react'
import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
const App = () => {
    return (
        <main className="w-screen h-screen overflow-x-hidden">
            <Navbar/>
            <Hero/>
            <About/>
            <Projects/>
        </main>
    )
}
export default App

