import { useState, useEffect } from 'react';
import { downloadResume, extractTextFromPdf } from '../services/resumeParser';
import { extractProfileFromResume } from '../services/groqService';
import { MOCK_LINKEDIN_PROFILE } from '../constants/defaultProfile';

const stepsList = [
  'Initializing secure LinkedIn link...',
  'Fetching public profile node...',
  'Parsing bio and headline details...',
  'Extracting professional experiences...',
  'Extracting academic achievements...',
  'Structuring custom blog posts...',
  'Import complete! Transferring to profile editor...'
];

export default function ResumeUpload({ onParsed, resumes = [], onApply, onDelete }) {
  const [activeTab, setActiveTab] = useState('resume');
  const [file, setFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [linkedinSteps, setLinkedinSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    let interval;
    if (status === 'loading' && activeTab === 'linkedin') {
      setCurrentStepIndex(0);
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < stepsList.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [status, activeTab]);

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < stepsList.length) {
      setProgress(stepsList[currentStepIndex]);
      setLinkedinSteps((prev) => {
        const nextSteps = [...prev];
        if (!nextSteps.includes(stepsList[currentStepIndex])) {
          nextSteps.push(stepsList[currentStepIndex]);
        }
        return nextSteps;
      });

      if (currentStepIndex === stepsList.length - 1) {
        const timeout = setTimeout(() => {
          let customProfile = { ...MOCK_LINKEDIN_PROFILE };
          if (linkedinUrl) {
            const matches = linkedinUrl.match(/in\/([^/]+)/);
            if (matches && matches[1]) {
              const cleanedName = matches[1]
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              customProfile.fullName = cleanedName;
              customProfile.email = `${matches[1]}@protofiler.dev`;
            }
          }
          setStatus('success');
          onParsed(customProfile, { name: 'LinkedIn_Sync_Profile.pdf' });
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, linkedinUrl]);

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setStatus('idle');
    }
  }

  function handleDownload() {
    if (file) downloadResume(file);
  }

  async function handleParseResume() {
    if (!file) return;
    setStatus('loading');
    setProgress('Extracting text from PDF...');
    setError('');

    try {
      const extractedText = await extractTextFromPdf(file);
      setProgress('Analyzing text and structuring profile...');
      const structuredData = await extractProfileFromResume(extractedText);
      setStatus('success');
      onParsed(structuredData, file);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'Parsing failed. Please check files or API Key.');
    }
  }

  function handleImportLinkedin(e) {
    e.preventDefault();
    if (!linkedinUrl) return;
    setStatus('loading');
    setLinkedinSteps([]);
    setError('');
  }

  return (
    <div className="resume-uploader-container">
      <div className="import-tabs">
        <button
          type="button"
          className={`import-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('resume');
            setStatus('idle');
            setError('');
          }}
        >
          PDF Uploader
        </button>
        {/* <button
          type="button"
          className={`import-tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('linkedin');
            setStatus('idle');
            setError('');
          }}
        >
          LinkedIn Sync
        </button> */}
      </div>

      <div className="import-content">
        {activeTab === 'resume' ? (
          <div className="file-uploader-box">
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-file-input" className="custom-file-upload">
              <div className="upload-icon-circle">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
              </div>
              <strong>Choose PDF Resume</strong>
              <span>Drag & drop files here or click to browse</span>
            </label>

            {file && (
              <div className="selected-file-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.75rem 1rem', marginTop: '1rem' }}>
                <span className="file-info-text" style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                  📁 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <span className="file-remove-x" onClick={() => setFile(null)} style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' }}>
                  ✕
                </span>
              </div>
            )}

            <div className="actions-row" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              {file && (
                <button type="button" className="btn btn-secondary" onClick={handleDownload} disabled={status === 'loading'}>
                  Download Selected
                </button>
              )}
              <button
                type="button"
                className="btn btn-teal-primary"
                onClick={handleParseResume}
                disabled={!file || status === 'loading'}
                style={{ marginLeft: 'auto' }}
              >
                {status === 'loading' ? (
                  <span className="spinner-loader">Parsing...</span>
                ) : 'Parse Resume & Fill'}
              </button>
            </div>

            {resumes.length > 0 && (
              <div className="my-resumes-list-section" style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.75rem' }}>
                  My Uploaded Resumes ({resumes.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {resumes.map((res) => (
                    <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>📄 {res.filename}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Uploaded on {res.uploadDate}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onApply(res)}
                        >
                          Apply to Profile
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => onDelete(res.id)}
                          style={{ color: '#ef4444', padding: '0.25rem 0.5rem' }}
                          title="Delete Resume"
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="linkedin-import-pane">
            <form onSubmit={handleImportLinkedin} className="linkedin-form">
              <div className="linkedin-input-group">
                <div className="input-icon-wrapper">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="e.g. https://www.linkedin.com/in/alexander-wright"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  disabled={status === 'loading'}
                  className="linkedin-url-input"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-linkedin-blue"
                disabled={!linkedinUrl || status === 'loading'}
              >
                {status === 'loading' ? 'Syncing...' : 'Sync LinkedIn Profile'}
              </button>
            </form>
          </div>
        )}

        {status === 'loading' && activeTab === 'linkedin' && (
          <div className="linkedin-loading-tracker">
            <div className="progress-bar-container">
              <div
                className="progress-bar-indicator"
                style={{ width: `${((currentStepIndex + 1) / stepsList.length) * 100}%` }}
              />
            </div>
            <div className="steps-tracker-list">
              {linkedinSteps.map((step, idx) => (
                <div key={idx} className="step-tracker-item finished">
                  <div className="step-circle success">
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{step}</span>
                </div>
              ))}
              {currentStepIndex < stepsList.length - 1 && (
                <div className="step-tracker-item active">
                  <div className="step-circle active-circle"></div>
                  <span>{stepsList[currentStepIndex + 1]}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'loading' && activeTab === 'resume' && (
          <div className="resume-loading-tracker">
            <div className="loading-dots-container">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <p className="progress-text">{progress}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="import-success-alert">
            <div className="success-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="success-text">
              <strong>Import Successful!</strong>
              <p>Credentials structured and saved. Review details in your dashboard fields.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="import-error-alert">
            <div className="error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="error-text">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
}
