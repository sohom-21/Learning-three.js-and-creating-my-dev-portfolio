import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const logos = [
    { src: "/assets/motion-wheel/react-logo.png", alt: "React" },
    { src: "/assets/typescript.png", alt: "TypeScript" },
    { src: "/assets/motion-wheel/tailwind-logo.png", alt: "Tailwind" },
    { src: "/assets/motion-wheel/vue-logo.png", alt: "Vue.js" },
    { src: "/assets/motion-wheel/nodejs-logo.png", alt: "NodeJS" },
    { src: "/assets/framer.svg", alt: "Framer Motion" },
    { src: "/assets/motion-wheel/docker-logo.png", alt: "Docker" },
    { src: "/assets/motion-wheel/firebase-logo.png", alt: "Firebase" },
    { src: "/assets/motion-wheel/mongodb-logo.png", alt: "MongoDB" },
    { src: "/assets/motion-wheel/Android.svg", alt: "Android" },
    { src: "/assets/motion-wheel/Next.js.svg", alt: "Next.JS" },
];

const AnimatedWheel = () => {
    const wheelRef = useRef(null);
    const containerRef = useRef(null);
    const [radius, setRadius] = useState(140);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                const size = containerRef.current.offsetWidth;
                setRadius(size / 2.5);
            }
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        gsap.fromTo(
            ".logo-circle",
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.7)",
            }
        );

        const spin = gsap.to(wheelRef.current, {
            rotation: "+=360",
            repeat: -1,
            ease: "none",
            duration: 60,
        });

        return () => {
            spin.kill();
        };
    }, []);

    const handleClick = (index) => {
        const anglePerLogo = 360 / logos.length;
        const targetAngle = index * anglePerLogo;
        const currentRotation =
            parseFloat(gsap.getProperty(wheelRef.current, "rotation")) % 360;
        const delta = ((targetAngle - currentRotation + 540) % 360) - 180;

        gsap.to(wheelRef.current, {
            rotation: `+=${delta}`,
            duration: 1,
            ease: "power2.inOut",
        });
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <div className="relative mx-auto mt-4">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-0 right-0 px-4 py-2 rounded bg-blue-600 text-white text-sm z-20"
            >
                Toggle Theme
            </button>

            {/* Gradient background */}
            <div
                className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none z-0"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, #23233b 60%, #181824 100%)",
                    opacity: 0.85,
                }}
            />

            {/* Wheel Container */}
            <div
                ref={containerRef}
                className="relative w-[80vw] max-w-[384px] aspect-square z-10"
            >
                <div
                    ref={wheelRef}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {logos.map((logo, i) => {
                        const angle = (i / logos.length) * 360;
                        const x = radius * Math.cos((angle * Math.PI) / 180);
                        const y = radius * Math.sin((angle * Math.PI) / 180);
                        const logoRef = useRef(null);

                        return (
                            <div
                                key={logo.alt}
                                ref={logoRef}
                                className={`logo-circle absolute w-14 md:w-16 h-14 md:h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform duration-300 ${
                                    theme === "dark" ? "bg-gray-900" : "bg-gray-200"
                                }`}
                                style={{ transform: `translate(${x}px, ${y}px)` }}
                                title={logo.alt}
                                onMouseEnter={() =>
                                    gsap.to(logoRef.current, {
                                        scale: 1.3,
                                        duration: 0.3,
                                        ease: "power1.out",
                                    })
                                }
                                onMouseLeave={() =>
                                    gsap.to(logoRef.current, {
                                        scale: 1.0,
                                        duration: 0.3,
                                        ease: "power1.inOut",
                                    })
                                }
                                onClick={() => handleClick(i)}
                            >
                                <img src={logo.src} alt={logo.alt} className="w-8 h-8" />
                            </div>
                        );
                    })}

                    {/* Center Circle */}
                    <div className="absolute w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center shadow-lg bg-gray-900 text-white">
                        <span className="font-bold text-xs">{`JS{javaScript}`}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedWheel;
