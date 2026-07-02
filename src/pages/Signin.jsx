import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLeftPane from '../components/AuthLeftPane';

export default function Signin() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      signin(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page-container">
      {/* Left Pane: Info & Brand */}
      <AuthLeftPane />

      {/* Right Pane: Login Card */}
      <div className="auth-right-pane">
        <div className="auth-form-card">
          <div className="mobile-brand-header">
            <span className="brand-logo-text">Protofiler</span>
          </div>

          <h1 className="auth-card-title">Candidate Login</h1>
          <p className="auth-card-subtitle">
            Sign in to access your candidate profile and portfolio dashboard.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">EMAIL</label>
              <input
                id="email"
                name="email"
                type="text"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">PASSWORD</label>
                <a href="#forgot" className="forgot-password-link" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
              </div>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="auth-input password-input"
                  style={{ width: '100%', paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="error-msg text-center">{error}</p>}

            <button type="submit" className="btn btn-teal-primary btn-block">
              Login to Protofiler
            </button>
          </form>

          <div className="auth-card-footer">
            <p>
              New to Protofiler? <Link to="/signup" className="footer-action-link">Create Free Account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Circle Logo */}
      <div className="floating-logo-badge">
        <span>pf</span>
      </div>
    </div>
  );
}
