import React, { useState } from 'react'
import {navLinks} from "../constants/index.js";

const NavItems = () => {
    return (
        <ul className="nav-ul">
            {navLinks.map(({id, href, name}) => (
                <li key={id} className="nav-li">
                    <a href={href} className="nav-li_a" onClick={() =>{}}>
                        {name}
                    </a>
                </li>
            ))}
        </ul>
    )
}
       /*<ul className="nav-ul">
           {["Home", "About", "Projects", "Contact"].map((item, index) => (
               <li key={index} className="nav-li">{item}</li>
           ))}
       </ul>*/
//keeping this code here as it shows how the code above works ...

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen( (prevIsOpen) =>!prevIsOpen)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 hover:border border-white/20 bg-white/0 backdrop-blur-sm font-medium transition rounded-full hover:bg-white/5 hover:text-white shadow-lg">
            <div className="max-w-7xl mx-auto ">
                <div className={"flex justify-between items-center py-5 mx-auto c-space"}>
                    <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                        Sohom
                    </a>
                    <button onClick={toggleMenu} className="text-neutral-400 hover:text-white flex focus:outline-none sm:hidden transition-colors" aria-label="Toggle menu">
                        <img src={isOpen ? "/assets/close.svg": "/assets/menu.svg"} alt={"toggle"} className="w-6 h-6"/>
                    </button>

                    <nav className="sm:flex hidden">
                        <NavItems/>
                    </nav>
                </div>
            </div>
            <div className={`nav-sidebar ${isOpen ? "max-h-screen": "max-h-0"}`}>
                <nav className="p-5">
                    <NavItems/>
                </nav>
            </div>
        </header>
    )
}
export default Navbar;
