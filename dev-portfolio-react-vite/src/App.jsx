import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import About from './sections/About.jsx';
import Contact from './sections/Contact.jsx';
import ProjectShowcase from './sections/ProjectShowcase.jsx';
import Footer from "./sections/Footer.jsx";
import Experience from "./sections/Experience.jsx";
const App = () => {
    return (
        <main className="w-screen h-screen overflow-x-hidden">
            <Navbar/>
            <Hero/>
            <About/>
            <ProjectShowcase/>
            <Contact/>
            <Footer/>
        </main>
    )
}
export default App

