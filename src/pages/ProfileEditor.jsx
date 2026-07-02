import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import ThemeSelector from '../components/ThemeSelector';
import { EMPTY_EDUCATION, EMPTY_EXPERIENCE } from '../constants/defaultProfile';
import { useAuth } from '../context/AuthContext';
import ProfileBlog from '../themes/ProfileBlog';
import { profilesEqual } from '../utils/profileCompare';

export default function ProfileEditor() {
  const { user, saveProfile, saveTheme } = useAuth();
  const [profile, setProfile] = useState(user?.profile || {});
  const [selectedTheme, setSelectedTheme] = useState(user?.theme);
  const [savedProfile, setSavedProfile] = useState(user?.profile || {});
  const [savedTheme, setSavedTheme] = useState(user?.theme);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [themeSaving, setThemeSaving] = useState(false);

  const profileDirty = useMemo(
    () => !profilesEqual(profile, savedProfile),
    [profile, savedProfile],
  );

  const themeDirty = useMemo(
    () => selectedTheme !== savedTheme,
    [selectedTheme, savedTheme],
  );

  useEffect(() => {
    setProfile(user?.profile || {});
    setSelectedTheme(user?.theme);
    setSavedProfile(user?.profile || {});
    setSavedTheme(user?.theme);
  }, [user]);

  function updateField(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function updateSkills(value) {
    updateField(
      'skills',
      value.split(',').map((s) => s.trim()).filter(Boolean),
    );
  }

  function updateExperience(index, field, value) {
    setProfile((prev) => {
      const experience = [...(prev.experience || [])];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  }

  function addExperience() {
    setProfile((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { ...EMPTY_EXPERIENCE }],
    }));
  }

  function removeExperience(index) {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }

  function updateEducation(index, field, value) {
    setProfile((prev) => {
      const education = [...(prev.education || [])];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  }

  function addEducation() {
    setProfile((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...EMPTY_EDUCATION }],
    }));
  }

  function removeEducation(index) {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }

  function handleProfileParsed(parsedProfile) {
    setProfile((prev) => ({ ...prev, ...parsedProfile }));
    setMessage('Profile data parsed and updated below! Click "Save Profile" to apply changes.');
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    if (!profileDirty) return;

    setSaving(true);
    setMessage('');
    try {
      saveProfile(profile);
      setSavedProfile(structuredClone(profile));
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(`Error saving profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function handleSaveTheme() {
    if (!themeDirty) return;

    setThemeSaving(true);
    setMessage('');
    try {
      saveTheme(selectedTheme);
      setSavedTheme(selectedTheme);
      setMessage('Default theme updated. It will load next time you log in!');
    } catch (err) {
      setMessage(`Error saving theme: ${err.message}`);
    } finally {
      setThemeSaving(false);
    }
  }

  return (
    <div className="editor-page">
      <nav className="top-nav">
        <div className="brand">Protofiler</div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </nav>

      <main className="editor-main">
        <header className="editor-header-section">
          <h1>Edit Candidate Profile</h1>
          <p className="muted">
            Manage your personal data, experiences, and professional credentials.
          </p>
        </header>

        {message && (
          <div className="editor-alert-message">
            <span className="info-icon">🛈</span>
            <span className="msg-text">{message}</span>
          </div>
        )}

        <ResumeUpload onParsed={handleProfileParsed} />

        <form onSubmit={handleSaveProfile} className="profile-form card">
          <div className="editor-section-card">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <label>
                Full Name
                <input value={profile.fullName || ''} onChange={(e) => updateField('fullName', e.target.value)} placeholder="e.g. John Doe" />
              </label>
              <label>
                Email Address
                <input type="email" value={profile.email || ''} onChange={(e) => updateField('email', e.target.value)} placeholder="e.g. john@domain.com" />
              </label>
              <label>
                Phone Number
                <input value={profile.phone || ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="e.g. +1 (555) 123-4567" />
              </label>
              <label>
                Location
                <input value={profile.location || ''} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g. Austin, TX" />
              </label>
              <label>
                Headline
                <input value={profile.headline || ''} onChange={(e) => updateField('headline', e.target.value)} placeholder="e.g. Senior Software Architect" />
              </label>
              <label>
                LinkedIn Profile URL
                <input value={profile.linkedinUrl || ''} onChange={(e) => updateField('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/username" />
              </label>
            </div>

            <label style={{ marginTop: '1rem' }}>
              Professional Summary
              <textarea rows={4} value={profile.summary || ''} onChange={(e) => updateField('summary', e.target.value)} placeholder="A short bio summarizing your professional career..." />
            </label>

            <label style={{ marginTop: '1rem' }}>
              Skills (comma-separated list)
              <input
                value={(profile.skills || []).join(', ')}
                onChange={(e) => updateSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, GraphQL"
              />
            </label>
          </div>

          <hr className="editor-divider" />

          <section className="repeatable-section">
            <div className="section-header">
              <h3>Experience</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addExperience}>
                + Add Experience
              </button>
            </div>
            {(profile.experience || []).map((exp, i) => (
              <div key={i} className="repeatable-block">
                <div className="form-grid">
                  <label>
                    Job Title
                    <input value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} placeholder="e.g. Frontend Dev" />
                  </label>
                  <label>
                    Company Name
                    <input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="e.g. Google" />
                  </label>
                  <label>
                    Start Date
                    <input value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} placeholder="e.g. 2021-06" />
                  </label>
                  <label>
                    End Date
                    <input value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} placeholder="e.g. Present" />
                  </label>
                </div>
                <label style={{ marginTop: '0.75rem' }}>
                  Description / Responsibilities
                  <textarea rows={3} value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Key accomplishments and technical stack used..." />
                </label>
                <button type="button" className="btn btn-ghost btn-sm btn-remove-item" onClick={() => removeExperience(i)}>
                  Remove Entry
                </button>
              </div>
            ))}
          </section>

          <hr className="editor-divider" />

          <section className="repeatable-section">
            <div className="section-header">
              <h3>Education</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addEducation}>
                + Add Education
              </button>
            </div>
            {(profile.education || []).map((edu, i) => (
              <div key={i} className="repeatable-block">
                <div className="form-grid">
                  <label>
                    School / University
                    <input value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} placeholder="e.g. Stanford University" />
                  </label>
                  <label>
                    Degree Obtained
                    <input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="e.g. M.S." />
                  </label>
                  <label>
                    Field of Study
                    <input value={edu.field} onChange={(e) => updateEducation(i, 'field', e.target.value)} placeholder="e.g. Software Systems" />
                  </label>
                  <label>
                    Timeline (Start / End)
                    <div className="inline-inputs">
                      <input value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} placeholder="Start Year" />
                      <input value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} placeholder="End Year" />
                    </div>
                  </label>
                </div>
                <button type="button" className="btn btn-ghost btn-sm btn-remove-item" onClick={() => removeEducation(i)}>
                  Remove Entry
                </button>
              </div>
            ))}
          </section>

          <hr className="editor-divider" />

          <button
            type="submit"
            className={`btn btn-teal-primary btn-save-profile ${!profileDirty ? 'btn-saved' : ''}`}
            disabled={saving || !profileDirty}
          >
            {saving ? 'Saving...' : profileDirty ? 'Save Profile' : 'Profile Saved'}
          </button>
        </form>

        <ThemeSelector
          selectedTheme={selectedTheme}
          onSelect={setSelectedTheme}
          onSave={handleSaveTheme}
          saving={themeSaving}
          hasChanges={themeDirty}
        />

        <div className="preview-section">
          <div className="preview-section-header">
            <h2>Live theme preview</h2>
            <span className="live-badge">Interactive Live View</span>
          </div>
          <ProfileBlog profile={profile} theme={selectedTheme} />
        </div>
      </main>
    </div>
  );
}
