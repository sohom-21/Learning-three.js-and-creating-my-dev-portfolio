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
        name: 'Projects',
        href: '#projects',
    },
    {
        id: 4,
        name: 'Contact',
        href: '#contact',
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
        live_link:'https://gym-management-system-36fcf.web.app/login',
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
        image_1: '/projects/Apps/Real Scout - Real-Estate App.png',
        image_2: '/projects/Apps/appDesign.png',
        project_url:'https://github.com/sohom-21/Estate-Application-in-ReactNative',
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
        image_1: '/projects/landingpage/image.png',
        spotlight: '/assets/spotlight4.png',
        live_link:'https://gsap-landing-revision.vercel.app/',
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

export const expCards = [
  {
    review: "Adrian brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Frontend Developer",
    date: "January 2023 - Present",
    responsibilities: [
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review: "Adrian’s contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo2.png",
    title: "Full Stack Developer",
    date: "June 2020 - December 2023",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review: "Adrian’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "React Native Developer",
    date: "March 2019 - May 2020",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
];

export const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];


export const socialImgs = [
  {
    name: "fb",
    url: "https://www.facebook.com/share/1CQf5AEhMu/",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    url: "https://x.com/SohomG17460?t=lbcqGvLjJgZVh51SMzhibg&s=09",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/sohom-ghosh-3894b130a",
    imgPath: "/images/linkedin.png",
  },
];