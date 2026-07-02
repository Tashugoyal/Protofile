import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../services/storageService';
import ProfileBlog from '../themes/ProfileBlog';

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const found = getUserById(userId);
      setCandidate(found);
    }
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <p className="muted">Loading professional portfolio...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1e293b' }}>404</h1>
        <h2>Portfolio Not Found</h2>
        <p className="muted" style={{ maxWidth: '480px', marginTop: '0.5rem', marginBottom: '2rem' }}>
          The public portfolio link you are trying to view does not exist or may have been removed.
        </p>
        <Link to="/signup" className="btn btn-teal-primary">
          Join Protofiler
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: candidate.theme === 'modern' ? '#060a13' : '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Simple Top Banner for visitor */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0.75rem 1.5rem', background: candidate.theme === 'modern' ? 'rgba(255,255,255,0.03)' : '#ffffff', border: candidate.theme === 'modern' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: '0.85rem', color: candidate.theme === 'modern' ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
            ⚡ Verified Protofiler Portfolio
          </span>
          <Link to="/signup" className="btn btn-teal-primary btn-sm">
            Create Your Portfolio
          </Link>
        </div>

        <ProfileBlog profile={candidate.profile} theme={candidate.theme} />
      </div>
    </div>
  );
}
