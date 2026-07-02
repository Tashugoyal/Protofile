import { formatExternalUrl } from '../utils/urlHelper';

function getInitials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'CP'
  );
}

function splitHeadline(headline = '') {
  const words = (headline || 'Full Stack Developer').split(/\s+/).filter(Boolean);
  if (words.length <= 2) return [words.join(' ')];

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

export default function ClassicTheme({ profile }) {
  const {
    fullName,
    headline,
    email,
    linkedinUrl,
    summary,
    skills = [],
    experience = [],
    projects = [],
  } = profile;

  const name = fullName || 'Emad Almagdy';
  const [firstName, ...restName] = name.split(/\s+/);
  const brandTail = restName.join('') || 'Portfolio';
  const headlineLines = splitHeadline(headline);
  const featuredSkills = (skills.length ? skills : ['Front-End', 'Python', 'Machine Learning']).slice(0, 3);
  const workItems = (projects.length ? projects : experience).slice(0, 2);
  const contactHref = email ? `mailto:${email}` : linkedinUrl ? formatExternalUrl(linkedinUrl) : '#classic-about';
  const profileHref = linkedinUrl ? formatExternalUrl(linkedinUrl) : contactHref;

  return (
    <article className="blog-theme blog-theme--classic classic-pro-theme">
      <nav className="classic-pro-nav" aria-label="Portfolio navigation">
        <a href="#classic-home" className="classic-pro-brand">
          <strong>{firstName}</strong>
          <span>{brandTail}</span>
        </a>
        <div className="classic-pro-nav-links">
          <a href="#classic-home">Home</a>
          <a href="#classic-about">About</a>
          <a href="#classic-work">Work</a>
        </div>
        <a
          href={profileHref}
          className="classic-pro-mark"
          target={profileHref.startsWith('http') ? '_blank' : undefined}
          rel={profileHref.startsWith('http') ? 'noreferrer' : undefined}
          aria-label="Open professional profile"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
          </svg>
        </a>
      </nav>

      <section className="classic-pro-hero" id="classic-home">
        <div className="classic-pro-hero-copy">
          <p className="classic-pro-kicker">Hello, I'm {firstName},</p>
          <h1 aria-label={headline || 'Full Stack Developer'}>
            {headlineLines.map((line, index) => (
              <span key={line} className="classic-pro-title-line" style={{ '--delay': `${index * 120}ms` }}>
                {line}
              </span>
            ))}
          </h1>
          <a
            href={contactHref}
            className="classic-pro-contact"
            target={contactHref.startsWith('http') ? '_blank' : undefined}
            rel={contactHref.startsWith('http') ? 'noreferrer' : undefined}
          >
            Contact Me
          </a>
        </div>

        <div className="classic-pro-portrait-card" aria-label={`${name} portrait illustration`}>
          <div className="classic-pro-portrait-orbit"></div>
          <div className="classic-pro-portrait-figure">
            <span className="classic-pro-initials">{getInitials(name)}</span>
            <span className="classic-pro-hair"></span>
            <span className="classic-pro-face">
              <span className="classic-pro-eye classic-pro-eye-left"></span>
              <span className="classic-pro-eye classic-pro-eye-right"></span>
              <span className="classic-pro-nose"></span>
              <span className="classic-pro-mouth"></span>
            </span>
            <span className="classic-pro-suit"></span>
          </div>
        </div>
      </section>

      <section className="classic-pro-about" id="classic-about">
        <div className="classic-pro-section-title">
          <h2>about</h2>
          <span></span>
        </div>
        <p>
          {summary ||
            'I build polished digital products with clean interfaces, thoughtful interactions, and practical engineering decisions.'}
        </p>
      </section>

      <section className="classic-pro-skill-row" aria-label="Highlighted capabilities">
        {featuredSkills.map((skill, index) => (
          <article key={skill} style={{ '--delay': `${index * 90}ms` }}>
            <h3>{skill}</h3>
            <p>{index === 0 ? '500+ Hours Experience' : index === 1 ? '4 Years Experience' : '120+ Hours Experience'}</p>
          </article>
        ))}
      </section>

      {workItems.length > 0 && (
        <section className="classic-pro-work" id="classic-work">
          {workItems.map((item, index) => (
            <article key={`${item.title || item.company}-${index}`} style={{ '--delay': `${index * 110}ms` }}>
              <span>0{index + 1}</span>
              <h3>{item.title || item.company || 'Featured Work'}</h3>
              <p>{item.description || item.company || 'Selected professional highlight from the mapped resume profile.'}</p>
              {item.link && (
                <a href={formatExternalUrl(item.link)} target="_blank" rel="noreferrer">
                  View work
                </a>
              )}
            </article>
          ))}
        </section>
      )}
    </article>
  );
}
