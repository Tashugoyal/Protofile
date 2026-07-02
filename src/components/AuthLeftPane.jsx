export default function AuthLeftPane() {
  return (
    <div className="auth-left-pane">
      <div className="auth-left-content">
        <div className="brand-logo-container">
          <span className="brand-logo-text">Protofiler</span>
          <span className="brand-subtext">ELEGANT PORTFOLIOS, SHAPING CAREER IDENTITIES</span>
        </div>

        <h2 className="hero-text">
          Showcase Your <br />
          <span className="text-highlight">Professional Journey.</span>
        </h2>
        <p className="hero-subtext">
          Build a stunning, responsive portfolio website from your resume, customize your design theme, and stand out to recruiters with Protofiler.
        </p>

        <div className="features-grid">
          <div className="feature-item-card">
            <div className="feature-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="feature-item-text">
              <h4>AI Resume Parsing</h4>
              <p>Upload your PDF resume and let our smart parser instantly extract and fill out your details.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096m.813 5.096a12.015 12.015 0 0110.158-7.973A12.015 12.015 0 001.655 8.027A12.016 12.016 0 019 21zm0-13a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </div>
            <div className="feature-item-text">
              <h4>Premium Themes</h4>
              <p>Instantly switch between Classic and Modern layouts optimized to make an impact on recruiters.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="feature-item-text">
              <h4>Projects Showcase</h4>
              <p>Highlight your repositories and showcase code links, summaries, and technology tags.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="feature-item-text">
              <h4>Recruiter URL</h4>
              <p>Share a single, verified responsive portfolio URL directly in your job applications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
