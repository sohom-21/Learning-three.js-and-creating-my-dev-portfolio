export const navLinks = [
    {
        id: 1,
        name: 'Home',
        href: '#home',
    },
    {
        id: 2,
        name: 'About',
        href: '#about',
    },
    {
        id: 3,
        name: 'Work',
        href: '#work',
    },
    {
        id: 4,
        name: 'Experience',
        href: '#experience',
    },
];

export const clientReviews = [
    {
        id: 1,
        name: 'Emily Johnson',
        position: 'Marketing Director at GreenLeaf',
        img: 'assets/review1.png',
        review:
            'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
    },
    {
        id: 2,
        name: 'Mark Rogers',
        position: 'Founder of TechGear Shop',
        img: 'assets/review2.png',
        review:
            'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
    },
    {
        id: 3,
        name: 'John Dohsas',
        position: 'Project Manager at UrbanTech ',
        img: 'assets/review3.png',
        review:
            'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
    },
    {
        id: 4,
        name: 'Ether Smith',
        position: 'CEO of BrightStar Enterprises',
        img: 'assets/review4.png',
        review:
            'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
    },
];

export const myProjects = [
    {
        title: 'Zutok Fitness - GymCRM',
        desc: 'Zutok Fitness CRM — modern, all-in-one membership management designed for gyms and fitness studios. Clean dashboard UI (see attached screenshots) gives staff instant visibility into members, payments, schedules and day-to-day operations so teams spend less time on admin and more time on members.',
        subdesc:
            'Built with Firebase (Authentication, Firestore, Storage and Security Rules), React & Next.js, Tailwind CSS and shadcn/ui (or similar) for a secure, responsive, production-ready admin experience.',
        image_1: '/projects/crm/zutokfitnesscrm.png',
        image_2: '/projects/crm/zutokfitnesscrm-2.png',
        image_3: '/projects/crm/zutokfitnesscrm-3.png',
        image_4: '/projects/crm/zutokfitnesscrm-4.png',
        spotlight: '/assets/spotlight1.png',
        tags: [
            {
                id: 1,
                name: 'React.js',
                path: '/assets/react.svg',
            },
            {
                id: 2,
                name: 'TailwindCSS',
                path: 'assets/tailwindcss.png',
            },
            {
                id: 3,
                name: 'TypeScript',
                path: '/assets/typescript.png',
            },
            {
                id: 4,
                name: 'Framer Motion',
                path: '/assets/framer.png',
            },
        ],
    },
    {
        title: 'Zylokart - An Modern ecommerces Website',
        desc: 'Zylokart is a modern, conversion-focused e‑commerce platform designed to showcase products and streamline checkout. It features a clean product grid, quick product previews, category filtering, and a responsive storefront that converts visitors into customers.',
        subdesc:
            'Built with React, Next.js, Tailwind CSS and Supabase for authentication and data/storage — a fast, scalable stack for commerce with realtime features and secure persistence.',
        spotlight: '/assets/spotlight2.png',
        image_1: '/projects/e-com/zylokart_ecommerce.png',
        tags: [
            {
                id: 1,
                name: 'React.js',
                path: '/assets/react.svg',
            },
            {
                id: 2,
                name: 'TailwindCSS',
                path: 'assets/tailwindcss.png',
            },
            {
                id: 3,
                name: 'TypeScript',
                path: '/assets/typescript.png',
            },
            {
                id: 4,
                name: 'Framer Motion',
                path: '/assets/framer.png',
            },
        ],
    },
    {
        title: 'RealScout - A real estate react native app',
        desc: 'RealScout is a mobile-first real estate app that helps users discover, filter and book properties with an intuitive card-and-map interface — fast search, saved favorites and smooth booking flow.',
        subdesc:
            'Backend powered by Appwrite for authentication, database and storage; built with React Native, Appwrite functions, Twilio for SMS notifications and Sentry for monitoring to ensure secure, realtime features and reliable error tracking.',
        image_1: '/public/projects/Apps/Real Scout - Real-Estate App.png',
        image_2: '/public/projects/Apps/appDesign.png',
        spotlight: '/assets/spotlight3.png',
        tags: [
            {
                id: 1,
                name: 'React.js',
                path: '/assets/react.svg',
            },
            {
                id: 2,
                name: 'TailwindCSS',
                path: 'assets/tailwindcss.png',
            },
            {
                id: 3,
                name: 'TypeScript',
                path: '/assets/typescript.png',
            },
            {
                id: 4,
                name: 'Framer Motion',
                path: '/assets/framer.png',
            },
        ],
    },
    {
        title: 'Noble Nectar - A animated landing page',
        desc: 'Sleek landing showcasing Noble Nectar’s Martini: bold headline, rich imagery and refined typography with smooth, immersive animations powered by React + Vite, Tailwindcss and GSAP for silky transitions and micro-interactions. Fast, responsive and highly polished — designed to draw attention and invite exploration',
        subdesc:
            'Built with React, Vite, Tailwindcss and GSAP for performant, cinematic animations and a responsive, highly polished landing experience.',
        image_1: '/public/projects/landingpage/image.png',
        spotlight: '/assets/spotlight4.png',
        tags: [
            {
                id: 1,
                name: 'React.js',
                path: '/assets/react.svg',
            },
            {
                id: 2,
                name: 'TailwindCSS',
                path: 'assets/tailwindcss.png',
            },
            {
                id: 3,
                name: 'TypeScript',
                path: '/assets/typescript.png',
            },
            {
                id: 4,
                name: 'Framer Motion',
                path: '/assets/framer.png',
            },
        ],
    },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
    return {
        deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
        deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
        cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
        reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
        ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
        targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
    };
};
export const calculateSizesForDesk = (isSmall, isMobile, isTablet) => {
    return {
        deskScale: isSmall ? 0.5 : isMobile ? 0.5 : 0.5,
        CubeScale: isSmall ? 0.24 : isMobile ? 0.25 : 0.35,
        reactScale: isSmall ? 0.1 : isMobile ? 0.19 : 0.24,
        ringScale: isSmall ? 0.09 : isMobile ? 0.1 : 0.2,
        PythonLogoScale: isSmall ? 0.2 : isMobile ? 0.2 : 0.3,
        GitLogoScale: isSmall ? 0.24 : isMobile ? 0.25 : 0.3,
        Desk_blend_Scale: isSmall ? 0.9 : isMobile? 1.2 :isTablet? 1.4 : 1.8,


        deskPosition: isMobile ? [-1.0, 1.1, 5.4] : [-1.0, 1.1, 6.4],
        cubePosition: isSmall ? [1.9, -3.4, 0] : isMobile ? [3, -4.0, -2] : isTablet ? [5, -3, -2] : [6.8, -3, 0],
        reactLogoPosition: isSmall ? [1.9, 3.3, 0] : isMobile ? [2.1, 3.34, 0] : isTablet ? [3.3, 3.6, 0] : [6, 3, 0],
        ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-50, 10, 0],
        targetPosition: isSmall ? [-4, -9, -10] : isMobile ? [-4.9, -7.8, -10] : isTablet ? [-10, -8, -10] : [-12.5, -8.5, -10],
        // targetScale: isSmall ? 0.09 : isMobile ? 0.1 : 1,
        pythonLogoPosition: isSmall ? [2.7, -1.2, -0.4] : isMobile ? [4.8, -1.2, -0.4] : isTablet ? [1.5, 1.5, 0] : [6.6, 0.0, 0.5],
        githubLogoPosition: isSmall ? [-1.4, 0.5, 0] : isMobile ? [-1.8, 0.3, 0.5] : isTablet ? [-3.82, 0.5, 0] : [-3.8, 1.6, 0.6],
        Desk_blend_position: isSmall ? [-0.5,-1.5, 4.0] : isMobile? [-0.5,-1.2,4.0] : isTablet? [-0.9,-2.0, 3.8] : [-0.9,-2.1,4.0],
    };
};

export const workExperiences = [
    {
        id: 1,
        name: 'Framer',
        pos: 'Lead Web Developer',
        duration: '2022 - Present',
        title: "Framer serves as my go-to tool for creating interactive prototypes. I use it to bring designs to  life, allowing stakeholders to experience the user flow and interactions before development.",
        icon: '/assets/framer.svg',
        animation: 'victory',
    },
    {
        id: 2,
        name: 'Figma',
        pos: 'Web Developer',
        duration: '2020 - 2022',
        title: "Figma is my collaborative design platform of choice. I utilize it to work seamlessly with team members and clients, facilitating real-time feedback and design iterations. Its cloud-based.",
        icon: '/assets/figma.svg',
        animation: 'clapping',
    },
    {
        id: 3,
        name: 'Notion',
        pos: 'Junior Web Developer',
        duration: '2019 - 2020',
        title: "Notion helps me keep my projects organized. I use it for project management, task tracking, and as a central hub for documentation, ensuring that everything from design notes to.",
        icon: '/assets/notion.svg',
        animation: 'salute',
    },
];

export const socialImgs = [
  {
    name: "insta",
    url: "https://www.instagram.com/",
    imgPath: "/images/insta.png",
  },
  {
    name: "fb",
    url: "https://www.facebook.com/",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    url: "https://www.x.com/",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/",
    imgPath: "/images/linkedin.png",
  },
];