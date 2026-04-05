import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

/* ─── Inline styles matching Login page aesthetic ─── */
const styles = {
  page: {
    display: 'flex',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    minHeight: 'calc(100vh - 80px)',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '1040px',
    background: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    minHeight: '580px',
  },
  left: {
    flex: '0 0 52%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 72px',
    background: '#ffffff',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a1a2e 60%, #4f8ef7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a1a2e',
    letterSpacing: '-0.3px',
  },
  heading: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 6px',
    letterSpacing: '-0.6px',
  },
  subheading: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 0 32px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 8,
  },
  fieldLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    marginBottom: 5,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  },
  fieldWrap: {
    position: 'relative',
  },
  fieldIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 16px 13px 46px',
    borderRadius: 12,
    border: '1.5px solid #e2e8f0',
    fontSize: 14,
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  row: {
    display: 'flex',
    gap: 14,
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.2px',
    transition: 'background 0.2s, transform 0.1s',
    marginTop: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    margin: '12px 0 0',
    minHeight: 18,
  },
  successText: {
    fontSize: 12,
    color: '#22c55e',
    margin: '12px 0 0',
    minHeight: 18,
  },
  /* Right panel — dark, matches Login */
  right: {
    flex: 1,
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f2044 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 40,
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
  blob1: { position: 'absolute', top: 60, right: 60, width: 12, height: 12, borderRadius: 2, background: '#facc15', transform: 'rotate(30deg)', zIndex: 1 },
  blob2: { position: 'absolute', bottom: 120, left: 50, width: 10, height: 10, borderRadius: 2, background: '#4ade80', transform: 'rotate(20deg)', zIndex: 1 },
  blob3: { position: 'absolute', top: 180, left: 70, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid #4f8ef7', zIndex: 1 },
  previewWrap: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 280,
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.12)',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  previewImg: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    display: 'block',
  },
  previewImgPlaceholder: {
    width: '100%',
    height: 200,
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb40)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBody: {
    padding: '18px 20px 20px',
  },
  previewName: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 700,
    margin: '0 0 6px',
    letterSpacing: '-0.3px',
  },
  previewGender: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    color: '#4f8ef7',
    background: 'rgba(79,142,247,0.15)',
    borderRadius: 20,
    padding: '3px 10px',
    marginBottom: 10,
    textTransform: 'capitalize',
    letterSpacing: '0.3px',
  },
  previewUrl: {
    fontSize: 11,
    color: '#94a3b8',
    wordBreak: 'break-all',
    margin: 0,
  },
  tagline: {
    position: 'relative',
    zIndex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: '-0.2px',
  },
  taglineSub: {
    position: 'relative',
    zIndex: 1,
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 240,
    lineHeight: 1.6,
  },
};

/* ─── Icons ─── */
const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const GenderIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M16 8l4-4m0 0h-4m4 0v4"/><path d="M8 16l-4 4m0 0h4m-4 0v-4"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

function focusInput(e) {
  e.target.style.borderColor = '#4f8ef7';
  e.target.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.12)';
}
function blurInput(e) {
  e.target.style.borderColor = '#e2e8f0';
  e.target.style.boxShadow = 'none';
}

function Profile() {
  const user = useSelector((state) => state.user?.userData || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName]   = useState(user.lastName  || '');
  const [gender, setGender]       = useState(user.gender    || '');
  const [photoUrl, setPhotoUrl]   = useState(user.photoUrl  || '');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  const handleProfileEdit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.patch(
        BASE_URL + '/profile/update',
        { firstName, lastName, gender, photoUrl },
        { withCredentials: true }
      );
      dispatch(setUser(res.data.user || res.data));
      setSuccess(res.data.message || 'Profile updated successfully!');
    } catch (err) {
      setError(err?.response?.data || 'Update failed. Please try again.');
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div style={styles.page} className="profile-page">
      <style>{`
        @media (max-width: 1024px) {
          .profile-right { display: none !important; }
          .profile-card  { max-width: 480px !important; }
          .profile-left  { flex: 1 !important; padding: 48px 32px !important; }
        }
        @media (max-width: 480px) {
          .profile-left  { padding: 36px 20px !important; }
          .profile-page  { padding: 20px 12px !important; }
        }
      `}</style>

      <div style={styles.card} className="profile-card">

        {/* ── Left: Form Panel ── */}
        <div style={styles.left} className="profile-left">
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <span style={styles.logoText}>devTinder</span>
          </div>

          <h1 style={styles.heading}>Edit Profile</h1>
          <p style={styles.subheading}>Update your public developer profile</p>

          <div style={styles.fieldGroup}>
            {/* First + Last name row */}
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>First Name</label>
                <div style={styles.fieldWrap}>
                  <span style={styles.fieldIcon}><UserIcon /></span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    style={styles.input}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Last Name</label>
                <div style={styles.fieldWrap}>
                  <span style={styles.fieldIcon}><UserIcon /></span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    style={styles.input}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label style={styles.fieldLabel}>Gender</label>
              <div style={styles.fieldWrap}>
                <span style={styles.fieldIcon}><GenderIcon /></span>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="e.g. male / female / other"
                  style={styles.input}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label style={styles.fieldLabel}>Photo URL</label>
              <div style={styles.fieldWrap}>
                <span style={styles.fieldIcon}><ImageIcon /></span>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  style={styles.input}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>
          </div>

          {error   && <p style={styles.errorText}>{error}</p>}
          {success && <p style={styles.successText}>{success}</p>}

          <button
            onClick={handleProfileEdit}
            disabled={loading}
            style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1e3a5f'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#0f172a'; }}
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* ── Right: Preview Panel ── */}
        <div style={styles.right} className="profile-right">
          <div style={styles.grid} />
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.blob3} />

          {/* Live Preview Card */}
          <div style={styles.previewWrap}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                style={styles.previewImg}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }}
              />
            ) : (
              <div style={styles.previewImgPlaceholder}>
                <PersonIcon />
              </div>
            )}
            <div style={styles.previewBody}>
              <p style={styles.previewName}>{displayName}</p>
              {gender && <span style={styles.previewGender}>{gender}</span>}
            </div>
          </div>

          <p style={styles.tagline}>Live Preview</p>
          <p style={styles.taglineSub}>Changes appear here as you type your profile details.</p>
        </div>

      </div>
    </div>
  );
}

export default Profile;