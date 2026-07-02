import { useEffect, useRef, useState } from "react";
import { formatExternalUrl } from "../utils/urlHelper";

// Internal hook to trigger entry slide transitions on scroll per element (repeats on scroll)
function useIndividualScrollEntrance() {
  const [hasEntered, setHasEntered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        } else {
          setHasEntered(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" } 
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [elementRef, hasEntered ? "scroll-revealed" : "scroll-hidden"];
}

// Separate observer block for general layout arrays (repeats on scroll)
function useScrollEntrance() {
  const [hasEntered, setHasEntered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        } else {
          setHasEntered(false);
        }
      },
      { threshold: 0.10 } 
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [elementRef, hasEntered ? "scroll-revealed" : "scroll-hidden"];
}

// Individual animated timeline row sub-component to handle independent entry slides
function TimelineRow({ exp, isLeft }) {
  const [rowRef, rowVisibility] = useIndividualScrollEntrance();

  return (
    <div ref={rowRef} className={`timeline-container-row ${rowVisibility} ${isLeft ? 'row-slide-left' : 'row-slide-right'}`}>
      <div className="timeline-center-node"></div>
      
      {/* Active Content Block Card */}
      <div className="timeline-side-block">
        <div style={{ background: 'rgba(22, 22, 26, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', padding: '2rem', borderRadius: '20px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', fontFamily: 'monospace', fontSize: '0.75rem', color: '#22d3ee', background: 'rgba(34, 211, 238, 0.06)', padding: '0.25rem 0.6rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
            [{exp.startDate} – {exp.endDate || 'Present'}]
          </div>
          <h4 style={{ fontSize: '1.35rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#ffffff' }}>{exp.title}</h4>
          <div style={{ fontSize: '1rem', color: '#a1a1aa', marginBottom: '1.25rem' }}>at <span style={{ color: '#ffffff', fontWeight: '600' }}>{exp.company}</span></div>
          
          {exp.description && (
            <div className="timeline-scroll-desc" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <p style={{ color: '#71717a', fontSize: '0.95rem', lineHeight: '1.65', margin: 0, whiteSpace: 'pre-wrap' }}>{exp.description}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Balanced Structural Empty Space Layout Component */}
      <div className="timeline-empty-filler" style={{ width: '48%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2rem', alignItems: isLeft ? 'flex-start' : 'flex-end' }}>
        <div style={{ width: '24px', height: '1px', background: 'linear-gradient(90deg, #22d3ee, transparent)', marginBottom: '0.75rem' }}></div>
      </div>
    </div>
  );
}

export default function ModernTheme({ profile }) {
  const {
    fullName,
    headline,
    location,
    email,
    phone,
    linkedinUrl,
    summary,
    skills = [],
    experience = [],
    education = [],
    projects = [],
  } = profile;

  const [activeProject, setActiveProject] = useState(0);

  // Split name for visual typographic contrast
  const nameParts = fullName ? fullName.split(" ") : ["CREATIVE", "DEVELOPER"];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  // Assign scroll nodes hooks
  const [intentRef, intentVisibility] = useScrollEntrance();
  const [skillsRef, skillsVisibility] = useScrollEntrance();
  const [projectsRef, projectsVisibility] = useScrollEntrance();
  const [infraRef, infraVisibility] = useScrollEntrance();

  const cardSkills = skills.slice(0, 4); 
  const marqueeSkills = skills.length > 4 ? skills.slice(4) : skills;

  // Generative SVG Graphic encoded as a data URI
  const techSchematicSrc = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">
    <defs>
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%236366f1" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="%2322d3ee" stop-opacity="1"/>
        <stop offset="100%" stop-color="%2322d3ee" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="1" fill="%23ffffff" opacity="0.1"/>
    <circle cx="60" cy="20" r="1" fill="%23ffffff" opacity="0.1"/>
    <path d="M 10 20 L 70 20 L 90 45 L 220 45" stroke="url(%23lineGrad)" stroke-width="2" fill="none" />
    <circle cx="70" cy="20" r="4" fill="%2322d3ee" />
    <circle cx="220" cy="45" r="5" fill="%2322d3ee" />
  </svg>`;

  return (
    <div className="portfolio-website-theme" style={{ backgroundColor: "#0a0a0c", color: "#ffffff", minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
      
      {/* Dynamic Structural Layout CSS Matrix */}
      <style>{`
        html { scroll-behavior: smooth; }
        
        @keyframes subtleReveal {
          0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes floatAsymmetric {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-8px) translateX(4px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(8px) translateX(-4px); }
        }
        @keyframes spinOrbit {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spinOrbitReverse {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes marqueeScan {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scannerLine {
          0% { top: 0%; opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        .animate-entrance { animation: subtleReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        
        .scroll-hidden { opacity: 0; filter: blur(4px); transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease; }
        
        /* Direct slide translation styles map */
        .row-slide-left.scroll-hidden { transform: translateX(-40px); opacity: 0; }
        .row-slide-right.scroll-hidden { transform: translateX(40px); opacity: 0; }
        
        .scroll-revealed { opacity: 1; transform: translateX(0) translateY(0); filter: blur(0); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease; }
        
        .bento-card { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); background: rgba(22, 22, 26, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); position: relative; }
        
        .intent-card-frame { overflow: hidden; background: radial-gradient(calc(100% - 10px) 100% at top left, rgba(99, 102, 241, 0.04), transparent), rgba(16, 16, 20, 0.8) !important; border: 1px solid rgba(255,255,255,0.08) !important; }
        .intent-card-frame::before { content: ''; position: absolute; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #22d3ee, transparent); animation: scannerLine 4s linear infinite; pointer-events: none; z-index: 3; }
        
        .intent-text-cell::-webkit-scrollbar, .timeline-scroll-desc::-webkit-scrollbar { width: 5px; }
        .intent-text-cell::-webkit-scrollbar-track, .timeline-scroll-desc::-webkit-scrollbar-track { background: transparent; }
        .intent-text-cell::-webkit-scrollbar-thumb, .timeline-scroll-desc::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 99px; }
        .intent-text-cell::-webkit-scrollbar-thumb:hover, .timeline-scroll-desc::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.6); }

        .interactive-btn { transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); position: relative; overflow: hidden; }
        .interactive-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); }
        
        .skill-float-card-1 { animation: floatAsymmetric 5s ease-in-out infinite; }
        .skill-float-card-2 { animation: floatReverse 6s ease-in-out infinite 0.5s; }
        
        .marquee-container { overflow: hidden; display: flex; width: 100%; position: relative; mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); }
        .marquee-track { display: flex; gap: 1rem; padding: 1rem 0; width: max-content; animation: marqueeScan 25s linear infinite; }
        
        .tech-badge { transition: all 0.2s ease; background: rgba(255,255,255,0.02); color: #a1a1aa; border: 1px solid rgba(255,255,255,0.06); }
        .tech-badge:hover { background: rgba(99, 102, 241, 0.15) !important; border-color: #6366f1 !important; color: #fff !important; }

        .schematic-img { opacity: 0.75; transition: opacity 0.3s ease, transform 0.3s ease; }
        .intent-card-frame:hover .schematic-img { opacity: 1; transform: scale(1.02); }

        .deck-wrapper { display: grid; grid-template-columns: 4fr 8fr; gap: 4rem; min-height: 400px; align-items: start; width: 100%; }
        .deck-nav-sidebar { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
        .deck-nav-item { padding: 1.25rem 1.5rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); text-align: left; width: 100%; color: #71717a; font-size: 0.95rem; }
        .deck-nav-item.active { background: rgba(99, 102, 241, 0.08); border-color: rgba(99, 102, 241, 0.3); color: #ffffff; padding-left: 2rem; font-weight: 700; box-shadow: inset 4px 0 0 #6366f1; }
        
        .deck-container-view { position: relative; width: 100%; height: auto; min-height: 400px; display: flex; flex-direction: column; perspective: 1200px; }
        
        .kinetic-deck-card { position: absolute; inset: 0; border-radius: 28px; padding: 3rem; background: #111115; border: 1px solid transparent; box-shadow: none; display: flex; flex-direction: column; justify-content: space-between; transform-origin: center right; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; opacity: 0; height: max-content; }
        .kinetic-deck-card > * { display: none; }
        
        .kinetic-deck-card.active-layer { position: relative; opacity: 1; z-index: 10; transform: translateZ(0px) translateY(0px) rotateY(0deg); pointer-events: auto; border-color: rgba(34, 211, 238, 0.3); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
        .kinetic-deck-card.active-layer > * { display: flex; flex-direction: column; }
        
        .kinetic-deck-card.behind-layer-1 { opacity: 0.6; z-index: 5; transform: translateZ(-30px) translateX(25px) scale(0.96); border-color: rgba(255,255,255,0.06); background: rgba(17, 17, 21, 0.9); }
        .kinetic-deck-card.behind-layer-2 { opacity: 0.25; z-index: 2; transform: translateZ(-60px) translateX(50px) scale(0.92); border-color: rgba(255,255,255,0.03); background: rgba(17, 17, 21, 0.5); }

        .premium-timeline-track { position: relative; padding-left: 2.5rem; border-left: 2px dashed rgba(255, 255, 255, 0.05); }
        .timeline-interactive-block { position: relative; transition: all 0.4s ease; }
        .timeline-interactive-block::before { content: ''; position: absolute; left: calc(-2.5rem - 7px); top: 6px; width: 12px; height: 12px; border-radius: 50%; background: #0a0a0c; border: 3px solid #22d3ee; z-index: 2; transition: all 0.3s ease; box-shadow: 0 0 10px #22d3ee; }
        .timeline-interactive-block:hover { transform: translateX(6px); }

        /* Alternating Center Timeline Engine Layout Matrix */
        .center-timeline-wrapper { position: relative; width: 100%; margin: 1rem auto; display: flex; flex-direction: column; }
        .center-timeline-wrapper::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, rgba(34, 211, 238, 0.6), rgba(99, 102, 241, 0.1)); transform: translateX(-50%); }
        
        .timeline-container-row { display: flex; width: 100%; margin-bottom: 2rem; position: relative; justify-content: space-between; align-items: center; }
        .timeline-container-row:nth-child(even) { flex-direction: row-reverse; }
        
        .timeline-side-block { width: 48%; position: relative; z-index: 2; }
        .timeline-center-node { position: absolute; left: 50%; top: 50%; width: 14px; height: 14px; border-radius: 50%; background: #0a0a0c; border: 3px solid #22d3ee; transform: translate(-50%, -50%); z-index: 5; box-shadow: 0 0 8px #22d3ee; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .timeline-container-row:hover .timeline-center-node { background: #22d3ee; scale: 1.3; box-shadow: 0 0 14px #22d3ee; }

        .academic-interactive-line { position: relative; padding-left: 3rem; border-left: 2px solid rgba(99, 102, 241, 0.15); margin-left: 0.5rem; }
        .academic-step-node { position: relative; margin-bottom: 4rem; opacity: 0; transform: translateX(-15px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .academic-step-node::before { content: ''; position: absolute; left: calc(-3rem - 6px); top: 8px; width: 10px; height: 10px; background: #0a0a0c; border: 2px solid #6366f1; border-radius: 50%; z-index: 2; transition: all 0.3s ease; }
        
        .scroll-revealed .academic-step-node { opacity: 1; transform: translateX(0); }
        .scroll-revealed .academic-step-node:nth-child(1) { transition-delay: 0.1s; }
        .scroll-revealed .academic-step-node:nth-child(2) { transition-delay: 0.25s; }
        .scroll-revealed .academic-step-node:nth-child(3) { transition-delay: 0.4s; }
        
        .academic-step-node:hover::before { background: #6366f1; scale: 1.3; box-shadow: 0 0 12px #6366f1; }
        .academic-step-node:hover .edu-field-reveal { color: #22d3ee !important; transform: translateX(6px); }
        .edu-field-reveal { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

        @media (max-width: 968px) {
          .deck-wrapper { grid-template-columns: 1fr; gap: 2rem; }
          .deck-nav-sidebar { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; }
          .deck-nav-item { margin-bottom: 0; padding: 0.85rem 1rem; font-size: 0.85rem; }
          .deck-container-view { min-height: auto; height: auto; display: flex; flex-direction: column; perspective: none; }
          .kinetic-deck-card { position: absolute; inset: 0; padding: 2rem; border-radius: 20px; opacity: 0; transform: none !important; pointer-events: none; transition: opacity 0.3s ease; height: auto; }
          .kinetic-deck-card.active-layer { position: relative; opacity: 1; pointer-events: auto; border-color: rgba(34, 211, 238, 0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .kinetic-deck-card.active-layer > * { display: flex; }
          .kinetic-deck-card.behind-layer-1, .kinetic-deck-card.behind-layer-2 { display: none; }
          
          .center-timeline-wrapper::before { left: 16px; transform: none; }
          .timeline-container-row { flex-direction: column !important; margin-bottom: 2rem; }
          .timeline-side-block { width: 100%; padding-left: 2.5rem; }
          .timeline-center-node { left: 16px; top: 24px; }
          .timeline-empty-filler { display: none !important; }
          
          .single-project-box { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 2.5rem !important; }
        }

        @media (max-width: 768px) {
          h1 { font-size: 3.5rem !important; }
          .intent-card-frame { grid-template-columns: 1fr !important; padding: 2.5rem 1.5rem !important; gap: 2rem !important; }
          .intent-text-cell { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.08) !important; padding-left: 0 !important; padding-top: 2rem !important; max-height: 350px !important; }
          .academic-interactive-line { padding-left: 1.5rem; margin-left: 0; }
          .academic-step-node::before { left: calc(-1.5rem - 6px); }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="animate-entrance" style={{ display: 'flex', flexWrap: 'wrap', minHeight: '95vh', position: 'relative', background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)', padding: '2rem' }}>
        <div style={{ flex: '1 1 500px', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#a1a1aa' }}>Available for Core Engineering</span>
          </div>

          <h1 style={{ fontSize: '5rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1.0', textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>
            {firstName} <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{lastName}</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '540px', lineHeight: '1.6', margin: '0 0 2.5rem 0' }}>
            {headline || "Building highly interactive, high-performance web applications with clean architecture and pixel-perfect design engineering."}
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a href="#production-archive-anchor" className="interactive-btn" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#ffffff', textDecoration: 'none', padding: '1rem 2.25rem', fontWeight: '600', fontSize: '0.9rem', borderRadius: '12px' }}>
              Explore Projects
            </a>
            <a href="#about-intent-anchor" className="interactive-btn" style={{ background: 'rgba(255,255,255,0.03)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', padding: '1rem 2.25rem', fontWeight: '600', fontSize: '0.9rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              About Strategy
            </a>
          </div>
        </div>

        <div style={{ flex: '1 1 500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '500px', width: '100%' }}>
          <div style={{ position: 'absolute', width: '380px', height: '380px', background: 'rgba(99, 102, 241, 0.22)', filter: 'blur(90px)', borderRadius: '50%', animation: 'pulseGlow 6s ease-in-out infinite' }}></div>
          <div style={{ position: 'absolute', width: '280px', height: '280px', background: 'rgba(34, 211, 238, 0.12)', filter: 'blur(70px)', borderRadius: '50%', animation: 'pulseGlow 4s ease-in-out infinite alternate' }}></div>

          <div style={{ position: 'relative', width: '440px', height: '440px', animation: 'floatEffect 6s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '50%', animation: 'spinOrbit 28s linear infinite' }}>
              <div style={{ position: 'absolute', top: '0', left: '50%', width: '10px', height: '10px', background: '#22d3ee', borderRadius: '50%', boxShadow: '0 0 14px #22d3ee' }}></div>
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '85%', height: '85%', border: '1px solid rgba(99, 102, 241, 0.12)', borderRadius: '50%', animation: 'spinOrbitReverse 18s linear infinite' }}>
              <div style={{ position: 'absolute', top: '15%', left: '15%', width: '6px', height: '6px', background: '#6366f1', borderRadius: '50%' }}></div>
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '280px', height: '340px', background: 'linear-gradient(145deg, #141418 0%, #09090b 100%)', borderRadius: '44px', border: '1px solid rgba(255,255,255,0.09)', overflow: 'hidden', zIndex: 3, boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
              <img
                src="/OIP (2).jpg"
                alt="Portfolio visual"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT STRIP --- */}
      <div style={{ background: '#0e0e12', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', color: '#71717a' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {location && <span style={{ color: '#e4e4e7' }}>📍 {location}</span>}
            {email && <span>✉️ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          {linkedinUrl && <a href={formatExternalUrl(linkedinUrl)} target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>LinkedIn ↗</a>}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        
        {/* EXECUTIVE INTENT SUMMARY SECTION */}
        {summary && (
          <div id="about-intent-anchor" ref={intentRef} className={intentVisibility}>
            <div className="bento-card intent-card-frame" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', padding: '4rem 3.5rem', borderRadius: '32px', marginBottom: '6rem', scrollMarginTop: '2rem', alignItems: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px', pointerEvents: 'none' }}></div>
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <span style={{ width: '6px', height: '6px', background: '#22d3ee', borderRadius: '50%', animation: 'pulseDot 2s infinite' }}></span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#22d3ee' }}>MISSION OVERVIEW</span>
                  </div>
                  <h2 style={{ fontSize: '2.75rem', fontWeight: '900', textTransform: 'uppercase', margin: 0, lineHeight: '1.05' }}>
                    Executive <br />
                    <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Strategic Focus</span>
                  </h2>
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <img src={techSchematicSrc} alt="Technical Vector Blueprint Matrix" className="schematic-img" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
              
              <div className="intent-text-cell" style={{ display: 'block', zIndex: 2, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '2rem', paddingRight: '0.5rem', minWidth: 0, maxHeight: '420px', overflowY: 'auto' }}>
                <p style={{ fontSize: '1.15rem', lineHeight: '1.85', color: '#e4e4e7', margin: 0, whiteSpace: 'pre-wrap' }}>{summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS MARQUEE SECTION */}
        {skills?.length > 0 && (
          <div ref={skillsRef} className={skillsVisibility} style={{ marginBottom: '6rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e4e4e7' }}>
              <span style={{ width: '8px', height: '8px', background: '#22d3ee', borderRadius: '50%' }}></span> Engine Tech-Stack Pipeline
            </h3>
            
            {cardSkills.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {cardSkills.map((skill, index) => (
                  <div key={skill} className={`bento-card ${index % 2 === 0 ? 'skill-float-card-1' : 'skill-float-card-2'}`} style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: index % 2 === 0 ? '3px solid #6366f1' : '3px solid #22d3ee' }}>
                    <div style={{ color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Core Module 0{index + 1}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{skill}</div>
                  </div>
                ))}
              </div>
            )}

            {marqueeSkills.length > 0 && (
              <div className="marquee-container">
                <div className="marquee-track">
                  {marqueeSkills.concat(marqueeSkills).map((skill, index) => (
                    <span key={`${skill}-${index}`} className="tech-badge" style={{ fontSize: '0.9rem', padding: '0.75rem 1.75rem', borderRadius: '14px', fontWeight: '600', whiteSpace: 'nowrap', display: 'inline-block' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FEATURED CASE PROJECTS DECK */}
        {projects && projects.length > 0 && (
          <div ref={projectsRef} className={projectsVisibility} id="production-archive-anchor" style={{ marginBottom: '8rem', scrollMarginTop: '4rem' }}>
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 211, 238, 0.05)', padding: '0.35rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#22d3ee' }}>PRODUCTION ARCHIVE</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>
                Featured <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Case Modules</span>
              </h2>
            </div>

            {projects.length === 1 ? (
              /* CLEAN SPLIT-SCREEN BOX LAYOUT FOR A SINGLE PROJECT */
              <div className="single-project-box" style={{ background: '#111115', border: '1px solid rgba(34, 211, 238, 0.25)', borderRadius: '28px', padding: '3.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', minHeight: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
                {/* Left Side: Name and system meta indicators */}
                <div>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                    {projects[0].title}
                  </h3>
                  {projects[0].techStack && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6366f1', fontWeight: '600', letterSpacing: '0.05em', marginTop: '2rem' }}>
                      <span style={{ color: '#22d3ee' }}>⚡ SYSTEM //</span> {projects[0].techStack}
                    </div>
                  )}
                </div>

                {/* Right Side: Description text content and live action items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <p style={{ color: '#a1a1aa', fontSize: '1.05rem', lineHeight: '1.75', margin: 0 }}>
                    {projects[0].description}
                  </p>
                  {projects[0].link && (
                    <div>
                      <a href={formatExternalUrl(projects[0].link)} target="_blank" rel="noreferrer" style={{ color: '#22d3ee', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', borderBottom: '1px dashed #22d3ee', paddingBottom: '2px' }}>
                        DEPLOYED LIVE ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ORIGINAL CYCLING CAROUSEL CARD DECK ARCHITECTURE FOR MULTIPLE PROJECTS */
              <div className="deck-wrapper">
                <div className="deck-nav-sidebar">
                  {projects.map((proj, index) => (
                    <button
                      key={index}
                      className={`deck-nav-item ${activeProject === index ? "active" : ""}`}
                      onMouseEnter={() => setActiveProject(index)}
                      onClick={() => setActiveProject(index)}
                    >
                      <span>0{index + 1} // {proj.title}</span>
                      <span>↗</span>
                    </button>
                  ))}
                </div>

                <div className="deck-container-view">
                  {projects.map((proj, i) => {
                    let layerClass = "";
                    if (activeProject === i) layerClass = "active-layer";
                    else if (i === activeProject + 1 || (activeProject === projects.length - 1 && i === 0)) layerClass = "behind-layer-1";
                    else if (i === activeProject + 2 || (activeProject >= projects.length - 2 && i === activeProject - projects.length + 2)) layerClass = "behind-layer-2";

                    return (
                      <article key={i} className={`kinetic-deck-card ${layerClass}`}>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
                            {proj.link && (
                              <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" style={{ color: '#22d3ee', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                                DEPLOYED LIVE ↗
                              </a>
                            )}
                          </div>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 1.25rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>{proj.title}</h3>
                          <p style={{ color: '#a1a1aa', fontSize: '1.01rem', lineHeight: '1.65', margin: 0 }}>{proj.description}</p>
                        </div>

                        {proj.techStack && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6366f1', fontWeight: '600', letterSpacing: '0.05em', width: '100%' }}>
                            <span style={{ color: '#22d3ee' }}>⚡ SYSTEM //</span> {proj.techStack}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- SECTION 4: EXPERIENCE AND ACADEMICS SYSTEM --- */}
        <div ref={infraRef} className={infraVisibility} style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          {/* Centered Alternating Slide Timeline History */}
          {experience?.length > 0 && (
            <section style={{ width: '100%' }}>
              <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#22d3ee', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>ENGINE.HISTORY</div>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>Timeline History</h3>
              </div>
              
              {experience.length === 1 ? (
                <div className="premium-timeline-track" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {experience.map((exp, i) => (
                    <div key={i} className="timeline-interactive-block">
                      <div style={{ display: 'inline-flex', fontFamily: 'monospace', fontSize: '0.75rem', color: '#22d3ee', background: 'rgba(34, 211, 238, 0.06)', padding: '0.25rem 0.6rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                        [{exp.startDate} – {exp.endDate || 'Present'}]
                      </div>
                      <h4 style={{ fontSize: '1.35rem', fontWeight: '700', margin: '0 0 0.25rem 0' }}>{exp.title}</h4>
                      <div style={{ fontSize: '1rem', color: '#a1a1aa', marginBottom: '1.25rem' }}>at <span style={{ color: '#ffffff', fontWeight: '600' }}>{exp.company}</span></div>
                      
                      {exp.description && (
                        <div className="timeline-scroll-desc" style={{ maxHeight: '320px', overflowY: 'auto', background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <p style={{ color: '#71717a', fontSize: '0.95rem', lineHeight: '1.65', margin: 0, whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="center-timeline-wrapper">
                  {experience.map((exp, i) => (
                    <TimelineRow 
                      key={i} 
                      exp={exp} 
                      isLeft={i % 2 === 0} 
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Academic Infrastructure Grid Display */}
          {education?.length > 0 && (
            <section style={{ width: '100%' }}>
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#6366f1', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>CORE.FOUNDATION</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>Academic Infrastructure</h3>
              </div>
              
              <div className="academic-interactive-line">
                {education.map((edu, i) => (
                  <div key={i} className="academic-step-node">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>0{i + 1} //</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6366f1', letterSpacing: '0.05em' }}>[ DEGREE // ACQUIRED ]</span>
                      <span style={{ fontSize: '0.8rem', color: '#4a4a58', fontFamily: 'monospace', marginLeft: 'auto' }}>{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <h4 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.5rem 0', letterSpacing: '-0.01em' }}>{edu.school}</h4>
                    <div className="edu-field-reveal" style={{ fontSize: '1rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}>
                      <span style={{ color: '#6366f1', fontFamily: 'monospace' }}>&lt;</span>
                      {edu.degree} · <span style={{ color: '#ffffff', fontWeight: '500' }}>{edu.field}</span>
                      <span style={{ color: '#6366f1', fontFamily: 'monospace' }}>/&gt;</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#070709', textAlign: 'center', padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', color: '#52525b', fontSize: '0.85rem' }}>
        <div>© {new Date().getFullYear()} {fullName || "Portfolio Engine"}.</div>
      </footer>
    </div>
  );
}