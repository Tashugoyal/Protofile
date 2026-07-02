import { formatExternalUrl } from '../utils/urlHelper';

export default function ClassicTheme({ profile }) {
  const {
    fullName,
    headline,
    location,
    email,
    phone,
    linkedinUrl,
    summary,
    skills,
    experience,
    education,
    projects
  } = profile;

  return (
    <div className="blog-theme blog-theme--classic">
      {/* Top Header Card */}
      <header className="classic-header" style={{ marginBottom: '2.5rem' }}>
        <div className="classic-header-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="classic-avatar" style={{ marginBottom: '1rem' }}>
            {fullName?.charAt(0) || '?'}
          </div>
          <div className="classic-title-info">
            <h1 className="classic-name" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{fullName || 'Your Name'}</h1>
            <p className="classic-headline" style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>{headline || 'Professional Headline'}</p>
            <div className="classic-meta" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem', fontSize: '0.9rem' }}>
              {location && (
                <span className="classic-meta-item">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location}
                </span>
              )}
              {email && (
                <span className="classic-meta-item">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {email}
                </span>
              )}
              {phone && (
                <span className="classic-meta-item">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {phone}
                </span>
              )}
              {linkedinUrl && (
                <span className="classic-meta-item">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <a href={formatExternalUrl(linkedinUrl)} target="_blank" rel="noreferrer" className="classic-linkedin-link">
                    LinkedIn
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Single Column Vertical Stack Layout */}
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {summary && (
          <section className="classic-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '12px' }}>
            <h2 className="classic-section-title">About Me</h2>
            <p className="classic-summary-text" style={{ margin: 0 }}>{summary}</p>
          </section>
        )}

        {skills?.length > 0 && (
          <section className="classic-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '12px' }}>
            <h2 className="classic-section-title">Key Skills</h2>
            <div className="classic-skills-tags">
              {skills.map((skill) => (
                <span key={skill} className="classic-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="classic-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '12px' }}>
            <h2 className="classic-section-title">Professional Experience</h2>
            <div className="classic-timeline">
              {experience.map((exp, i) => (
                <article key={i} className="classic-timeline-item">
                  <div className="classic-timeline-marker"></div>
                  <div className="classic-timeline-content">
                    <h4 className="timeline-title">{exp.title}</h4>
                    <div className="timeline-meta-org">
                      <strong>{exp.company}</strong>
                      <span> · </span>
                      <span className="timeline-dates">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    {exp.description && <p className="timeline-description">{exp.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section className="classic-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '12px' }}>
            <h2 className="classic-section-title">Featured Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {projects.map((proj, i) => (
                <article key={i} style={{ borderBottom: i < projects.length - 1 ? '1px dashed #e2e8f0' : 'none', paddingBottom: i < projects.length - 1 ? '1.5rem' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: 0 }}>{proj.title}</h3>
                    {proj.link && (
                      <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600 }}>
                        View Project 🔗
                      </a>
                    )}
                  </div>
                  <p className="muted text-sm" style={{ marginTop: '0.5rem', marginBottom: '0.75rem', lineHeight: '1.6' }}>{proj.description}</p>
                  {proj.techStack && (
                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: 700, display: 'inline-block' }}>
                      {proj.techStack}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section className="classic-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '12px' }}>
            <h2 className="classic-section-title">Education</h2>
            <div className="classic-education-list">
              {education.map((edu, i) => (
                <article key={i} className="classic-education-item">
                  <h4 className="edu-school">{edu.school}</h4>
                  <p className="edu-details">
                    {edu.degree} · {edu.field}
                  </p>
                  <span className="edu-dates">{edu.startDate} – {edu.endDate}</span>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
