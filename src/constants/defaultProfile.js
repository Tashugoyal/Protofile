export const THEMES = {
  CLASSIC: 'classic',
  MODERN: 'modern',
};

export const DEFAULT_BLOGS = [
  {
    id: 'post-1',
    title: 'Mastering React 19 Server Components',
    excerpt: 'Explore how React 19 server components can drastically reduce your client bundle size and optimize LCP.',
    content: 'React 19 Server Components (RSC) represent a paradigm shift in how we build React applications. By running component rendering on the server, we eliminate client-side JavaScript overhead and allow direct database queries within our components. In this guide, we walk through setting up a modern Vite-based app utilizing RSCs, handling data mutations via Server Actions, and leveraging the new React 19 hook APIs such as useOptimistic and useTransition. Discover how to create ultra-fast, visually stable experiences with minimal client footprint.',
    date: '2026-06-15',
    readTime: '5 min read',
    category: 'React'
  },
  {
    id: 'post-2',
    title: 'The Future of Web Styling: Native CSS Nesting and container queries',
    excerpt: 'Ditch the preprocessor. Native CSS nesting, container queries, and the :has() selector are now baseline widely available.',
    content: 'We no longer need Sass or PostCSS for basic nesting. Browser support for native CSS nesting has officially reached baseline coverage, unlocking clean, structured, and readable styles directly in standard stylesheets. Combined with container queries and the incredibly powerful :has() relational selector, frontend developers now have unprecedented layout capabilities. In this article, we showcase how to refactor old SCSS files to native CSS, how to create components that adapt to parent container widths, and how to style labels dynamically based on input validation states.',
    date: '2026-06-01',
    readTime: '4 min read',
    category: 'CSS'
  }
];

export const EMPTY_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  headline: '',
  location: '',
  linkedinUrl: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
  blogPosts: [...DEFAULT_BLOGS],
  currentCtc: '0',
  expectedCtc: '0',
  noticePeriod: '0',
  projects: [],
  preferences: {
    targetRoles: '',
    preferredLocations: '',
  },
  resumes: []
};

export const EMPTY_EXPERIENCE = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  description: '',
};

export const EMPTY_EDUCATION = {
  school: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
};

export const EMPTY_PROJECT = {
  title: '',
  description: '',
  link: '',
  techStack: '',
};

export const MOCK_LINKEDIN_PROFILE = {
  fullName: 'Alexander Wright',
  email: 'alexander.wright@protofiler.dev',
  phone: '+1 (555) 234-5678',
  headline: 'Senior Full-Stack Engineer & Technical Writer',
  location: 'San Francisco, CA',
  linkedinUrl: 'https://linkedin.com/in/alexander-wright-dev',
  summary: 'Passionate software engineer with 7+ years of experience building modern web architectures. Focused on React, Node.js, and cloud platforms. Active technical blogger sharing insights on modern engineering practices and web performance.',
  skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'AWS', 'Web Performance', 'UI/UX Design'],
  experience: [
    {
      company: 'TechSphere Labs',
      title: 'Lead Software Engineer',
      startDate: '2023-01',
      endDate: 'Present',
      description: 'Architected and built micro-frontends with React 19 and Vite. Improved LCP by 40% across all customer-facing portals. Led a team of 6 engineers.'
    },
    {
      company: 'InnovateCorp',
      title: 'Senior Web Developer',
      startDate: '2020-03',
      endDate: '2022-12',
      description: 'Developed scalable API gateways using Node.js and Express. Integrated Stripe payments and third-party dashboard analytics.'
    }
  ],
  education: [
    {
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016',
      endDate: '2020'
    }
  ],
  blogPosts: [...DEFAULT_BLOGS],
  currentCtc: '15', // LPA
  expectedCtc: '18', // LPA
  noticePeriod: '30', // Days
  projects: [
    {
      title: 'Glassmorphic Design System',
      description: 'A React component library focusing on clean CSS micro-animations, glassmorphic UI components, and accessible themes.',
      link: 'https://github.com/alexwright/glass-design',
      techStack: 'React, CSS, Storybook'
    },
    {
      title: 'Server-Driven Blog Platform',
      description: 'A blog engine built on React Server Components, featuring instant search indexing and pre-rendered markdown posts.',
      link: 'https://github.com/alexwright/rsc-blog',
      techStack: 'Next.js, React, PostgreSQL'
    }
  ],
  preferences: {
    targetRoles: 'Senior Full-Stack Engineer, Tech Lead',
    preferredLocations: 'San Francisco, CA, Remote',
  },
  resumes: [
    {
      id: 'res_default',
      filename: 'Alexander_Wright_Resume.pdf',
      uploadDate: '2026-06-10',
      parsedData: {
        fullName: 'Alexander Wright',
        headline: 'Senior Full-Stack Engineer & Technical Writer',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Node.js', 'Next.js']
      }
    }
  ]
};
