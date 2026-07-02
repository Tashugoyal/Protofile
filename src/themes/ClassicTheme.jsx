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

function getDisplayLink(link = '') {
  return link.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
}

function splitRole(role = '') {
  const words = (role || 'Digital Portfolio').split(/\s+/).filter(Boolean);

  if (!words.length) {
    return ['Digital', 'Portfolio'];
  }

  return words.reduce((lines, word) => {
    const currentLine = lines[lines.length - 1] || '';
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (!currentLine || nextLine.length <= 12) {
      return [...lines.slice(0, -1), nextLine];
    }

    return [...lines, word];
  }, []);
}

export default function ClassicTheme({ profile }) {
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

  const name = fullName || 'Creative Portfolio';
  const [firstName, ...restName] = name.split(/\s+/);
  const brandTail = restName.join(' ') || 'Studio';
  const role = headline || 'Digital Portfolio';
  const roleLines = splitRole(role);
  const contactHref = email ? `mailto:${email}` : linkedinUrl ? formatExternalUrl(linkedinUrl) : '#classic-work';
  const primaryLink = linkedinUrl ? formatExternalUrl(linkedinUrl) : contactHref;
  const featuredSkills = (skills.length ? skills : ['Brand Strategy', 'Web Design', 'Content Systems']).slice(0, 3);
  const showcaseItems = [
    ...(projects.length ? projects : []),
    ...(experience.length ? experience : []),
    ...(education.length ? education : []),
    { title: 'Portfolio Storyline', description: 'A polished profile narrative generated from mapped resume data.' },
  ].slice(0, 3);

  const stats = [
    { label: 'Experience', value: experience.length ? `${experience.length}+` : '01' },
    { label: 'Skills', value: skills.length ? `${skills.length}+` : '03' },
    { label: 'Projects', value: projects.length ? `${projects.length}+` : '01' },
  ];

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
          <a href="#classic-work">Portfolio</a>
          <a href={contactHref}>Contact</a>
        </div>
        <a
          href={primaryLink}
          className="classic-pro-mark"
          target={primaryLink.startsWith('http') ? '_blank' : undefined}
          rel={primaryLink.startsWith('http') ? 'noreferrer' : undefined}
          aria-label="Open professional profile"
        >
          {getInitials(name)}
        </a>
      </nav>

      <section className="classic-pro-hero" id="classic-home">
        <div className="classic-pro-hero-copy">
          <p className="classic-pro-kicker">Personal website and digital presence</p>
          <h1 aria-label={`Meet my ${role}`}>
            <span className="classic-pro-title-line">Meet my</span>
            {roleLines.map((line, index) => (
              <span
                className="classic-pro-title-line is-accent"
                key={`${line}-${index}`}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="classic-pro-summary">
            {summary ||
              'A polished portfolio landing page that turns resume data into a visual story, featured work, and recruiter-ready proof of capability.'}
          </p>
          <div className="classic-pro-actions">
            <a href="#classic-work">Featured Work</a>
            <a
              href={contactHref}
              target={contactHref.startsWith('http') ? '_blank' : undefined}
              rel={contactHref.startsWith('http') ? 'noreferrer' : undefined}
            >
              Book Call
            </a>
          </div>
        </div>

        <aside className="classic-pro-portrait-card" aria-label={`${name} portfolio preview`}>
          <div className="classic-pro-portfolio-card">
            <div className="classic-pro-profile-strip">
              <span className="classic-pro-initials">{getInitials(name)}</span>
              <div>
                <strong>{name}</strong>
                <small>{location || 'Open to opportunities'}</small>
              </div>
            </div>
            <div className="classic-pro-phone-stack">
              <div className="classic-pro-phone is-main">
                <span></span>
                <strong>{firstName}</strong>
                <small>{featuredSkills[0]}</small>
              </div>
              <div className="classic-pro-phone is-secondary">
                {featuredSkills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="classic-pro-contact-card">
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {linkedinUrl && <span>{getDisplayLink(linkedinUrl)}</span>}
          </div>
        </aside>
      </section>

      <section className="classic-pro-about" id="classic-about">
        <div className="classic-pro-section-title">
          <h2>Portfolio snapshot</h2>
          <span></span>
        </div>
        <p>
          {summary ||
            'Resume information is mapped directly into this portfolio: headline, summary, skills, work history, education, projects, and contact details.'}
        </p>
      </section>

      <section className="classic-pro-skill-row" aria-label="Profile metrics">
        {stats.map((stat, index) => (
          <article key={stat.label} style={{ '--delay': `${index * 90}ms` }}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="classic-pro-work" id="classic-work">
        {showcaseItems.map((item, index) => (
          <article key={`${item.title || item.company || item.school}-${index}`} style={{ '--delay': `${index * 110}ms` }}>
            <div className="classic-pro-card-media">
              <span>0{index + 1}</span>
            </div>
            <h3>{item.title || item.company || item.school || 'Portfolio Highlight'}</h3>
            <p>
              {item.description ||
                item.degree ||
                item.field ||
                item.company ||
                'Selected work, experience, and presentation details from the uploaded resume.'}
            </p>
            {item.link && (
              <a href={formatExternalUrl(item.link)} target="_blank" rel="noreferrer">
                View work
              </a>
            )}
          </article>
        ))}
      </section>
    </article>
  );
}
