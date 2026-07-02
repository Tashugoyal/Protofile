import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import ThemeSelector from '../components/ThemeSelector';
import ProfileBlog from '../themes/ProfileBlog';
import { EMPTY_EDUCATION, EMPTY_EXPERIENCE, EMPTY_PROJECT } from '../constants/defaultProfile';
import { formatExternalUrl } from '../utils/urlHelper';

export default function Dashboard() {
  const { user, saveProfile, saveTheme, signout } = useAuth();
  
  const [activeSection, setActiveSection] = useState('resume');
  const [profile, setProfile] = useState(user?.profile || {});
  const [selectedTheme, setSelectedTheme] = useState(user?.theme);
  const [isProgrammatic, setIsProgrammatic] = useState(false);
  
  const [editModes, setEditModes] = useState({
    headline: false,
    summary: false,
    skills: false,
    employment: false,
    education: false,
    projects: false,
    preferences: false,
    personalDetails: false
  });

  const [savingSection, setSavingSection] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user?.profile) setProfile(user.profile);
    if (user?.theme) setSelectedTheme(user.theme);
  }, [user]);

  // Premium Viewport-Center Scrollspy (Fluid, handcrafted, non-jittery)
  useEffect(() => {
    const sectionIds = ['resume', 'profile-info', 'timeline', 'projects', 'public-link'];
    
    function handleScroll() {
      if (isProgrammatic) return;

      const viewportCenter = window.scrollY + (window.innerHeight / 3);
      let active = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportCenter >= top && viewportCenter <= top + height) {
            active = id;
            break;
          }
        }
      }
      setActiveSection(active);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to set the initial scroll state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isProgrammatic]);

  const menuItems = [
    { id: 'resume', label: 'Resume Hub' },
    { id: 'profile-info', label: 'Profile & Preferences' },
    { id: 'timeline', label: 'Timeline (Exp & Edu)' },
    { id: 'projects', label: 'Projects Showcase' },
    { id: 'public-link', label: 'Recruiter URL' }
  ];

  const strengthDetails = useMemo(() => {
    let score = 0;
    const missing = [];

    if (profile.fullName) score += 10; else missing.push('Full Name');
    if (profile.headline) score += 10; else missing.push('Profile Headline');
    if (profile.summary) score += 10; else missing.push('Profile Summary');
    if (profile.phone) score += 5; else missing.push('Phone Number');
    if (profile.location) score += 5; else missing.push('Location');
    if (profile.linkedinUrl) score += 5; else missing.push('LinkedIn Link');
    if (profile.skills && profile.skills.length > 0) score += 15; else missing.push('Key Skills');
    if (profile.experience && profile.experience.length > 0) score += 15; else missing.push('Employment History');
    if (profile.education && profile.education.length > 0) score += 15; else missing.push('Education History');
    if (profile.projects && profile.projects.length > 0) score += 10; else missing.push('Projects');

    return { percentage: score, missing };
  }, [profile]);

  const radius = 26;
  const strokeCircumference = 2 * Math.PI * radius;
  const strokeDashoffset = strokeCircumference - (strengthDetails.percentage / 100) * strokeCircumference;

  function scrollToSection(id) {
    setIsProgrammatic(true);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Small offset calculation for sticky sidebar layout padding
      const offset = element.offsetTop - 40;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsProgrammatic(false);
    }, 800);
  }

  function toggleEdit(section, isEditing) {
    setEditModes(prev => ({ ...prev, [section]: isEditing }));
    if (!isEditing) {
      setProfile(user?.profile || {});
    }
  }

  async function saveSection(sectionName, updatedFields) {
    setSavingSection(sectionName);
    setToastMessage('');
    
    try {
      const mergedProfile = { ...profile, ...updatedFields };
      saveProfile(mergedProfile);
      setProfile(mergedProfile);
      toggleEdit(sectionName, false);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSavingSection('');
    }
  }

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }

  function handleFieldChange(field, val) {
    setProfile(prev => ({ ...prev, [field]: val }));
  }

  function handlePreferencesChange(field, val) {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...(prev.preferences || { targetRoles: '', preferredLocations: '' }),
        [field]: val
      }
    }));
  }

  function handleResumeParsed(parsedProfile, file) {
    const newResume = {
      id: 'res_' + Date.now(),
      filename: file ? file.name : 'Uploaded_Resume.pdf',
      uploadDate: new Date().toLocaleDateString(),
      parsedData: parsedProfile
    };

    const updatedResumes = [...(profile.resumes || []), newResume];
    const merged = { 
      ...profile, 
      ...parsedProfile, 
      resumes: updatedResumes 
    };

    saveProfile(merged);
    setProfile(merged);
    showToast('Resume uploaded and parsing data applied!');
  }

  function handleApplyResume(resume) {
    const merged = {
      ...profile,
      ...resume.parsedData
    };
    saveProfile(merged);
    setProfile(merged);
    showToast(`Applied ${resume.filename} to form fields!`);
  }

  function handleDeleteResume(resumeId) {
    const updatedResumes = (profile.resumes || []).filter((r) => r.id !== resumeId);
    const updatedProfile = { ...profile, resumes: updatedResumes };
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    showToast('Resume deleted successfully.');
  }

  function updateExperienceItem(index, key, val) {
    setProfile(prev => {
      const experience = [...(prev.experience || [])];
      experience[index] = { ...experience[index], [key]: val };
      return { ...prev, experience };
    });
  }

  function addExperienceItem() {
    setProfile(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { ...EMPTY_EXPERIENCE }]
    }));
  }

  function removeExperienceItem(index) {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  }

  function updateEducationItem(index, key, val) {
    setProfile(prev => {
      const education = [...(prev.education || [])];
      education[index] = { ...education[index], [key]: val };
      return { ...prev, education };
    });
  }

  function addEducationItem() {
    setProfile(prev => ({
      ...prev,
      education: [...(prev.education || []), { ...EMPTY_EDUCATION }]
    }));
  }

  function removeEducationItem(index) {
    setProfile(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  }

  function updateProjectItem(index, key, val) {
    setProfile(prev => {
      const projects = [...(prev.projects || [])];
      projects[index] = { ...projects[index], [key]: val };
      return { ...prev, projects };
    });
  }

  const editLinkEl = (
    <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#059669' }}>
      Edit Section
    </span>
  );

  function addProjectItem() {
    setProfile(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { ...EMPTY_PROJECT }]
    }));
  }

  function removeProjectItem(index) {
    setProfile(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  }

  const publicPortfolioUrl = `${window.location.origin}/portfolio/${user?.id}`;
  const [copied, setCopied] = useState(false);
  
  function copyToClipboard() {
    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="dashboard-page">
      <nav className="top-nav">
        <div className="brand">Protofiler</div>
        <div className="nav-actions">
          <button type="button" className="btn btn-ghost" onClick={signout}>
            Sign Out
          </button>
        </div>
      </nav>

      {toastMessage && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#ffffff', color: '#0f172a', padding: '0.85rem 1.5rem', borderRadius: '8px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, borderLeft: '4px solid #10b981', fontSize: '0.875rem', letterSpacing: '-0.01em', animation: 'fadeIn 0.2s ease' }}>
          {toastMessage}
        </div>
      )}

      <main className="dashboard-main">
        <section className="candidate-profile-summary-card">
          <div className="profile-summary-left-pane">
            <div className="profile-summary-avatar-wrapper">
              <div className="profile-summary-avatar">
                {profile.fullName?.charAt(0) || '?'}
              </div>
            </div>
            <div className="profile-summary-details">
              <div className="profile-summary-name-row">
                <span className="profile-summary-name">{profile.fullName || user?.email}</span>
                <button
                  type="button"
                  className="profile-summary-edit-btn-text"
                  onClick={() => toggleEdit('headline', true)}
                  title="Edit Core Info"
                  style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Edit Details
                </button>
              </div>

              <div className="profile-summary-headline-row">
                <span
                  className="profile-summary-headline"
                  onClick={() => toggleEdit('headline', true)}
                >
                  {profile.headline || 'Add profile headline'}
                </span>
              </div>

              <div className="profile-summary-info-strip">
                <div className="profile-summary-info-item">
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginRight: '4px', letterSpacing: '0.04em' }}>LOC</span>
                  {profile.location || 'Location not set'}
                </div>
                <div className="profile-summary-info-item">
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#166534', marginRight: '4px', letterSpacing: '0.04em' }}>EXP</span>
                  {profile.experience?.length || 0} Jobs Listed
                </div>
                <div className="profile-summary-info-item">
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#075985', marginRight: '4px', letterSpacing: '0.04em' }}>SALARY</span>
                  ₹ {profile.currentCtc ? `${profile.currentCtc} LPA` : '0 LPA'} (Expected: ₹ {profile.expectedCtc ? `${profile.expectedCtc} LPA` : '0 LPA'})
                </div>
                <div className="profile-summary-info-item">
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9b1c1c', marginRight: '4px', letterSpacing: '0.04em' }}>NOTICE</span>
                  {profile.noticePeriod ? `${profile.noticePeriod} Days` : '0 Days'}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-strength-widget-box">
            <div className="profile-strength-radial-row">
              <div className="strength-circular-meter">
                <svg viewBox="0 0 64 64">
                  <circle className="circle-bg" cx="32" cy="32" r={radius} />
                  <circle
                    className="circle-fill"
                    cx="32"
                    cy="32"
                    r={radius}
                    strokeDasharray={strokeCircumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <span className="percentage-text">{strengthDetails.percentage}%</span>
              </div>
              <div className="profile-strength-widget-text">
                <strong>Profile Strength</strong>
                <span>Improve your profile</span>
              </div>
            </div>

            {strengthDetails.missing.length > 0 && (
              <div className="profile-strength-missing-box">
                <strong>Missing fields:</strong>
                <p>{strengthDetails.missing.join(', ')}</p>
              </div>
            )}
          </div>
        </section>

        {editModes.headline && (
          <div className="inline-edit-form-panel card" style={{ marginBottom: '2rem' }}>
            <h4>Edit Headline & Core Details</h4>
            <div className="form-grid">
              <label>
                Full Name
                <input
                  value={profile.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                />
              </label>
              <label>
                Profile Headline
                <input
                  value={profile.headline || ''}
                  onChange={(e) => handleFieldChange('headline', e.target.value)}
                />
              </label>
              <label>
                Location
                <input
                  value={profile.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              </label>
              <label>
                Notice Period (Days)
                <input
                  type="number"
                  value={profile.noticePeriod || ''}
                  onChange={(e) => handleFieldChange('noticePeriod', e.target.value)}
                />
              </label>
            </div>
            <div className="inline-form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => toggleEdit('headline', false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-teal-primary"
                onClick={() => saveSection('headline', {
                  fullName: profile.fullName,
                  headline: profile.headline,
                  location: profile.location,
                  noticePeriod: profile.noticePeriod
                })}
                disabled={savingSection === 'headline'}
              >
                {savingSection === 'headline' ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        )}

        <div className="dashboard-layout-container">
          <aside className="dashboard-sidebar-menu">
            <ul className="sidebar-menu-list">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`sidebar-menu-item-btn ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                    style={{ paddingLeft: '1.25rem' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="dashboard-main-content">
            
            <div id="resume" className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>Resume Upload & Multi-Resume Hub</h3>
                <span className="dashboard-card-subtext">Manage, parse, and swap between multiple resumes</span>
              </div>
              <ResumeUpload
                onParsed={handleResumeParsed}
                resumes={profile.resumes || []}
                onApply={handleApplyResume}
                onDelete={handleDeleteResume}
              />
            </div>

            <div id="profile-info" className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>Profile Information</h3>
                <span className="dashboard-card-subtext">Manage bio, key skills, and preferences</span>
              </div>

              {/* 1. Summary Block */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>Professional Summary</h4>
                  <button type="button" className="btn-edit" onClick={() => toggleEdit('summary', true)}>
                    {editLinkEl}
                  </button>
                </div>
                {editModes.summary ? (
                  <div className="inline-edit-form-panel">
                    <textarea
                      rows={4}
                      value={profile.summary || ''}
                      onChange={(e) => handleFieldChange('summary', e.target.value)}
                    />
                    <div className="inline-form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('summary', false)}>Cancel</button>
                      <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('summary', { summary: profile.summary })} disabled={savingSection === 'summary'}>Save</button>
                    </div>
                  </div>
                ) : (
                  <p className="detail-item-value" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {profile.summary || <span className="muted">No summary provided yet.</span>}
                  </p>
                )}
              </div>

              {/* 2. Key Skills Block */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>Key Skills</h4>
                  <button type="button" className="btn-edit" onClick={() => toggleEdit('skills', true)}>
                    {editLinkEl}
                  </button>
                </div>
                {editModes.skills ? (
                  <div className="inline-edit-form-panel">
                    <input
                      value={(profile.skills || []).join(', ')}
                      onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                      placeholder="React, Node.js"
                    />
                    <div className="inline-form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('skills', false)}>Cancel</button>
                      <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('skills', { skills: profile.skills })} disabled={savingSection === 'skills'}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="skill-tags">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill) => <span key={skill} className="skill-tag">{skill}</span>)
                    ) : (
                      <span className="muted">No skills added yet.</span>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Job Preferences Block */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>Job Preferences</h4>
                  <button type="button" className="btn-edit" onClick={() => toggleEdit('preferences', true)}>
                    {editLinkEl}
                  </button>
                </div>
                {editModes.preferences ? (
                  <div className="inline-edit-form-panel">
                    <div className="form-grid">
                      <label>Current CTC (LPA) <input type="number" value={profile.currentCtc || ''} onChange={(e) => handleFieldChange('currentCtc', e.target.value)} /></label>
                      <label>Expected CTC (LPA) <input type="number" value={profile.expectedCtc || ''} onChange={(e) => handleFieldChange('expectedCtc', e.target.value)} /></label>
                      <label>Target Job Roles <input value={profile.preferences?.targetRoles || ''} onChange={(e) => handlePreferencesChange('targetRoles', e.target.value)} /></label>
                      <label>Preferred Locations <input value={profile.preferences?.preferredLocations || ''} onChange={(e) => handlePreferencesChange('preferredLocations', e.target.value)} /></label>
                    </div>
                    <div className="inline-form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('preferences', false)}>Cancel</button>
                      <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('preferences', { currentCtc: profile.currentCtc, expectedCtc: profile.expectedCtc, preferences: profile.preferences })} disabled={savingSection === 'preferences'}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="detail-item-row"><span className="detail-item-title">Current CTC</span><span className="detail-item-value">₹ {profile.currentCtc ? `${profile.currentCtc} LPA` : '0 LPA'}</span></div>
                    <div className="detail-item-row"><span className="detail-item-title">Expected CTC</span><span className="detail-item-value">₹ {profile.expectedCtc ? `${profile.expectedCtc} LPA` : '0 LPA'}</span></div>
                    <div className="detail-item-row"><span className="detail-item-title">Target Roles</span><span className="detail-item-value">{profile.preferences?.targetRoles || <span className="muted">Not Set</span>}</span></div>
                    <div className="detail-item-row"><span className="detail-item-title">Preferred Locations</span><span className="detail-item-value">{profile.preferences?.preferredLocations || <span className="muted">Not Set</span>}</span></div>
                  </div>
                )}
              </div>

              {/* 4. Personal Details Block */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>Personal Details</h4>
                  <button type="button" className="btn-edit" onClick={() => toggleEdit('personalDetails', true)}>
                    {editLinkEl}
                  </button>
                </div>
                {editModes.personalDetails ? (
                  <div className="inline-edit-form-panel">
                    <div className="form-grid">
                      <label>Email Address <input type="email" value={profile.email || ''} onChange={(e) => handleFieldChange('email', e.target.value)} /></label>
                      <label>Phone Number <input value={profile.phone || ''} onChange={(e) => handleFieldChange('phone', e.target.value)} /></label>
                      <label>LinkedIn URL <input value={profile.linkedinUrl || ''} onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)} /></label>
                    </div>
                    <div className="inline-form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('personalDetails', false)}>Cancel</button>
                      <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('personalDetails', { email: profile.email, phone: profile.phone, linkedinUrl: profile.linkedinUrl })} disabled={savingSection === 'personalDetails'}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="detail-item-row"><span className="detail-item-title">Email Address</span><span className="detail-item-value">{profile.email || <span className="muted">Not Set</span>}</span></div>
                    <div className="detail-item-row"><span className="detail-item-title">Phone Number</span><span className="detail-item-value">{profile.phone || <span className="muted">Not Set</span>}</span></div>
                    <div className="detail-item-row"><span className="detail-item-title">LinkedIn Profile</span><span className="detail-item-value">
                      {profile.linkedinUrl ? <a href={formatExternalUrl(profile.linkedinUrl)} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>View LinkedIn</a> : <span className="muted">Not Set</span>}
                    </span></div>
                  </div>
                )}
              </div>

            </div>

            <div id="timeline" className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>Timeline (Experience & Education)</h3>
                <span className="dashboard-card-subtext">Academic history and professional positions</span>
              </div>

              {/* 1. Employment History Block */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b' }}>Employment History</h4>
                  <button type="button" className="btn-edit" onClick={() => toggleEdit('employment', true)}>
                    {editLinkEl}
                  </button>
                </div>
                {editModes.employment ? (
                  <div className="inline-edit-form-panel">
                    { (profile.experience || []).map((exp, i) => (
                      <div key={i} className="repeatable-block">
                        <div className="form-grid">
                          <label>Job Title <input value={exp.title} onChange={(e) => updateExperienceItem(i, 'title', e.target.value)} /></label>
                          <label>Company <input value={exp.company} onChange={(e) => updateExperienceItem(i, 'company', e.target.value)} /></label>
                          <label>Start Date <input value={exp.startDate} onChange={(e) => updateExperienceItem(i, 'startDate', e.target.value)} /></label>
                          <label>End Date <input value={exp.endDate} onChange={(e) => updateExperienceItem(i, 'endDate', e.target.value)} /></label>
                        </div>
                        <label style={{ marginTop: '0.75rem' }}>Description <textarea rows={2} value={exp.description} onChange={(e) => updateExperienceItem(i, 'description', e.target.value)} /></label>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeExperienceItem(i)} style={{ color: '#ef4444', marginTop: '0.5rem' }}>Remove Entry</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addExperienceItem} style={{ marginBottom: '1rem' }}>+ Add Experience</button>
                    <div className="inline-form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('employment', false)}>Cancel</button>
                      <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('employment', { experience: profile.experience })} disabled={savingSection === 'employment'}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="classic-timeline" style={{ borderLeft: '1.5px solid #cbd5e1', paddingLeft: '1rem' }}>
                    {profile.experience && profile.experience.length > 0 ? (
                      profile.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-21px', top: '6px', width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }}></div>
                          <h4 style={{ fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>{exp.title}</h4>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                            <strong>{exp.company}</strong> · {exp.startDate} – {exp.endDate || 'Present'}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem', whiteSpace: 'pre-line' }}>{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <span className="muted">No work experiences added yet.</span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Education History Block */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b' }}>Academic History</h4>
                  <button type="button" className="btn-edit" onClick={() => toggleEdit('education', true)}>
                    {editLinkEl}
                  </button>
                </div>
                {editModes.education ? (
                  <div className="inline-edit-form-panel">
                    { (profile.education || []).map((edu, i) => (
                      <div key={i} className="repeatable-block">
                        <div className="form-grid">
                          <label>School / Uni <input value={edu.school} onChange={(e) => updateEducationItem(i, 'school', e.target.value)} /></label>
                          <label>Degree <input value={edu.degree} onChange={(e) => updateEducationItem(i, 'degree', e.target.value)} /></label>
                          <label>Field of Study <input value={edu.field} onChange={(e) => updateEducationItem(i, 'field', e.target.value)} /></label>
                          <label>Dates (Start / End)
                            <div className="inline-inputs">
                              <input value={edu.startDate} onChange={(e) => updateEducationItem(i, 'startDate', e.target.value)} placeholder="Start" />
                              <input value={edu.endDate} onChange={(e) => updateEducationItem(i, 'endDate', e.target.value)} placeholder="End" />
                            </div>
                          </label>
                        </div>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeEducationItem(i)} style={{ color: '#ef4444', marginTop: '0.5rem' }}>Remove Entry</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addEducationItem} style={{ marginBottom: '1rem' }}>+ Add Education</button>
                    <div className="inline-form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('education', false)}>Cancel</button>
                      <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('education', { education: profile.education })} disabled={savingSection === 'education'}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {profile.education && profile.education.length > 0 ? (
                      profile.education.map((edu, i) => (
                        <div key={i}>
                          <h4 style={{ fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>{edu.school}</h4>
                          <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.2rem 0' }}>{edu.degree} inside {edu.field}</p>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{edu.startDate} – {edu.endDate}</span>
                        </div>
                      ))
                    ) : (
                      <span className="muted">No academic history added yet.</span>
                    )}
                  </div>
                )}
              </div>

            </div>

            <div id="projects" className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>Projects Showcase</h3>
                <span className="dashboard-card-subtext">Demonstrated developer repositories & utilities</span>
                <button type="button" className="btn-edit" onClick={() => toggleEdit('projects', true)}>
                  {editLinkEl}
                </button>
              </div>

              {editModes.projects ? (
                <div className="inline-edit-form-panel">
                  { (profile.projects || []).map((project, i) => (
                    <div key={i} className="repeatable-block">
                      <div className="form-grid">
                        <label>Project Title <input value={project.title} onChange={(e) => updateProjectItem(i, 'title', e.target.value)} /></label>
                        <label>Project Link <input value={project.link} onChange={(e) => updateProjectItem(i, 'link', e.target.value)} /></label>
                        <label>Technologies Used <input value={project.techStack} onChange={(e) => updateProjectItem(i, 'techStack', e.target.value)} /></label>
                      </div>
                      <label style={{ marginTop: '0.75rem' }}>Project Description <textarea rows={2} value={project.description} onChange={(e) => updateProjectItem(i, 'description', e.target.value)} /></label>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeProjectItem(i)} style={{ color: '#ef4444', marginTop: '0.5rem' }}>Remove Entry</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addProjectItem} style={{ marginBottom: '1rem' }}>+ Add Project</button>
                  <div className="inline-form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => toggleEdit('projects', false)}>Cancel</button>
                    <button type="button" className="btn btn-teal-primary" onClick={() => saveSection('projects', { projects: profile.projects })} disabled={savingSection === 'projects'}>Save Projects</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {profile.projects && profile.projects.length > 0 ? (
                    profile.projects.map((proj, i) => (
                      <div key={i} style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', background: '#f8fafc' }}>
                        <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem', margin: 0 }}>{proj.title}</h4>
                        {proj.link && (
                          <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#4f46e5', wordBreak: 'break-all', display: 'block', margin: '0.35rem 0', textDecoration: 'none', fontWeight: 600 }}>
                            View Repository
                          </a>
                        )}
                        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: '0.5rem 0' }}>{proj.description}</p>
                        {proj.techStack && (
                          <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                            {proj.techStack}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="muted">No projects uploaded yet.</span>
                  )}
                </div>
              )}
            </div>


            <div id="public-link" className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>Recruiter URL & Themes</h3>
                <span className="dashboard-card-subtext">Access your custom recruiter URL and themes</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '2rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#334155' }}>Get your personal portfolio & blog URL</strong>
                <p className="muted text-sm" style={{ marginBottom: 0 }}>
                  Create a personalized, clean URL to show off your professional profile, projects, and custom blog.
                </p>
                <div className="public-link-actions-row">
                  <input
                    readOnly
                    value={publicPortfolioUrl}
                    className="public-link-input"
                    style={{ background: '#ffffff', borderColor: '#cbd5e1' }}
                  />
                  <button type="button" className="btn btn-secondary" onClick={copyToClipboard}>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={publicPortfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-teal-primary text-white hover:text-white"
                    style={{ textDecoration: 'none' }}
                  >
                    View Live
                  </a>
                </div>
              </div>

              <ThemeSelector
                selectedTheme={selectedTheme}
                onSelect={(t) => {
                  setSelectedTheme(t);
                  saveTheme(t);
                  showToast('Theme updated successfully!');
                }}
                onSave={() => {}}
                saving={false}
                hasChanges={false}
              />
            </div>

            <div style={{ marginTop: '3rem', borderTop: '2px solid #e2e8f0', paddingTop: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800 }}>Real-Time Live Preview</h2>
                  <p className="muted text-sm" style={{ margin: 0 }}>This is how recruiters see your public portfolio website using your selected theme.</p>
                </div>
                <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #dcfce7' }}>
                  Live Synchronized
                </div>
              </div>
              
              <div style={{ background: selectedTheme === 'modern' ? '#060a13' : '#f8fafc', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)' }}>
                <ProfileBlog profile={profile} theme={selectedTheme} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
