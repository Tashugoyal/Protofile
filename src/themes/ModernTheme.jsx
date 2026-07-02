import { formatExternalUrl } from "../utils/urlHelper";

export default function ModernTheme({ profile }) {
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
    projects,
  } = profile;

  return (
    <div className="blog-theme blog-theme--modern">
      {/* Glow Backdrops */}
      <div className="modern-glow-circle primary"></div>
      <div className="modern-glow-circle secondary"></div>

      {/* Hero Section */}
      <div className="modern-hero-panel">
        <div className="modern-avatar-frame">
          <div className="modern-avatar-content">
            {fullName?.charAt(0) || "?"}
          </div>
          <span className="modern-avatar-pulse"></span>
        </div>
        <h1 className="modern-name-text">{fullName || "Candidate Name"}</h1>
        <p className="modern-headline-text">
          {headline || "Headline / Expertise"}
        </p>

        <div className="modern-social-strip">
          {location && (
            <span className="modern-social-item">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {location}
            </span>
          )}
          {email && (
            <span className="modern-social-item">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {email}
            </span>
          )}
          {phone && (
            <span className="modern-social-item">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {phone}
            </span>
          )}
          {linkedinUrl && (
            <span className="modern-social-item">
              <svg
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <a
                href={formatExternalUrl(linkedinUrl)}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Content Area - Profile Details Rendered Directly */}
      <div className="modern-tab-content">
        <div className="modern-portfolio-grid">
          {summary && (
            <section className="modern-glass-card bio-card">
              <h3 className="modern-card-title">Professional Bio</h3>
              <p>{summary}</p>
            </section>
          )}

          {skills?.length > 0 && (
            <section className="modern-glass-card skills-card">
              <h3 className="modern-card-title">Technical Skills</h3>
              <div className="modern-skills-grid">
                {skills.map((skill) => (
                  <span key={skill} className="modern-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section
              className="modern-glass-card projects-card"
              style={{ gridColumn: "1 / -1" }}
            >
              <h3 className="modern-card-title">Featured Projects</h3>
              <div
                style={{
                  display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                  gap: "1.5rem",
                }}
              >
                {projects.map((proj, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.01)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minWidth: 0,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: "1rem",
                          marginBottom: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <h4
                          style={{
                            color: "#ffffff",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            margin: 0,
                            minWidth: 0,
                            wordBreak: "break-word",
                          }}
                        >
                          {proj.title}
                        </h4>
                        {proj.link && (
                          <a
                            href={formatExternalUrl(proj.link)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "0.8rem",
                              color: "#818cf8",
                              fontWeight: 600,
                              whiteSpace: "normal",
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                              flexShrink: 0,
                            }}
                          >
                            GitHub 🔗
                          </a>
                        )}
                      </div>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.85rem",
                          lineHeight: "1.5",
                          margin: "0.5rem 0 1rem",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {proj.description}
                      </p>
                    </div>
                    {proj.techStack && (
                      <div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(99, 102, 241, 0.12)",
                            color: "#c7d2fe",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "6px",
                            fontWeight: 700,
                            display: "inline-block",
                          }}
                        >
                          {proj.techStack}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="modern-glass-card experience-card">
              <h3 className="modern-card-title">Work Experience</h3>
              <div className="modern-timeline">
                {experience.map((exp, i) => (
                  <div key={i} className="modern-timeline-node">
                    <div className="node-indicator"></div>
                    <div className="node-body">
                      <h4>{exp.title}</h4>
                      <h5>
                        {exp.company}{" "}
                        <span className="node-time">
                          ({exp.startDate} – {exp.endDate || "Present"})
                        </span>
                      </h5>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education?.length > 0 && (
            <section className="modern-glass-card education-card">
              <h3 className="modern-card-title">Education</h3>
              <div className="modern-education-list">
                {education.map((edu, i) => (
                  <div key={i} className="modern-edu-item">
                    <h4>{edu.school}</h4>
                    <p>
                      {edu.degree} · {edu.field}
                    </p>
                    <span className="node-time">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
