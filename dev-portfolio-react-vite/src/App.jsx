import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import About from './sections/About.jsx';
import Contact from './sections/Contact.jsx';
import ProjectShowcase from './sections/ProjectShowcase.jsx';
const App = () => {
    return (
        <main className="w-screen h-screen overflow-x-hidden">
            <Navbar/>
            <Hero/>
            <About/>
            <ProjectShowcase/>
            <Contact/>
        </main>
    )
}
export default App

