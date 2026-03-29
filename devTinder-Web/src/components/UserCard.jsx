import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/userSlice';
import { setFeed } from '../utils/feedSlice';
import { useNavigate } from 'react-router-dom';
import NoDataCard from './NoDataCard';

/* ── Single tinder-style card ── */
function ProfileCard({ user, onIgnore, onInterested }) {
  const [leaving, setLeaving] = useState(null); // 'left' | 'right' | null

  const handleAction = (type) => {
    setLeaving(type === 'ignored' ? 'left' : 'right');
    setTimeout(() => {
      if (type === 'ignored') onIgnore(user._id);
      else onInterested(user._id);
    }, 320);
  };

  return (
    <div
      style={{
        width: 300,
        borderRadius: 24,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        transform: leaving === 'left'
          ? 'translateX(-120%) rotate(-12deg)'
          : leaving === 'right'
            ? 'translateX(120%) rotate(12deg)'
            : 'translateX(0) rotate(0deg)',
        opacity: leaving ? 0 : 1,
        transition: 'transform 0.32s cubic-bezier(.4,0,.2,1), opacity 0.28s ease',
        flexShrink: 0,
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', width: '100%', height: 340, overflow: 'hidden' }}>
        <img
          src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=400&background=1e293b&color=fff`}
          alt={`${user.firstName} ${user.lastName}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
        }} />
        {/* Online badge */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '4px 12px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Online</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
            {user.firstName} {user.lastName}
          </span>
          {user.age && (
            <span style={{ fontSize: 20, fontWeight: 400, color: '#94a3b8' }}>{user.age}</span>
          )}
        </div>

        {user.about && (
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {user.about}
          </p>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0 4px' }}>
            {user.skills.slice(0, 4).map((sk, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600, color: '#3b82f6',
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: 20, padding: '3px 10px',
              }}>{sk}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px 22px' }}>
        {/* Ignore */}
        <button
          onClick={() => handleAction('ignored')}
          title="Ignore"
          style={{
            width: 46, height: 46, borderRadius: '50%',
            border: 'none',
            background: '#fde8e8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fbc4c4'; e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fde8e8'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c53030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Interested / Like */}
        <button
          onClick={() => handleAction('interested')}
          style={{
            flex: 1, height: 46, borderRadius: 23,
            border: 'none', background: '#d1fae5', color: '#166534',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#a7f3d0'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#d1fae5'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Interested
        </button>

        {/* Bookmark / star */}
        <button
          title="Save"
          style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '1.5px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'border-color 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#facc15'; e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Main UserCard (feed) ── */
function UserCard({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [noRequestsMessage, setNoRequestsMessage] = useState('');

  const handleRequests = async (type, _id) => {
    try {
      const url = `${BASE_URL}/request/send/${type}/${_id}`;
      const response = await axios.post(url, {}, { withCredentials: true });
      if (response.status === 200) {
        dispatch(setFeed(user.feedData.filter(d => d._id !== _id)));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/login');
      }
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const empty =
      (Array.isArray(user?.feedData) && user.feedData.length === 0) ||
      user?.feedData == null;
    if (empty) setNoRequestsMessage('No more users available');
  });

  const empty =
    (Array.isArray(user?.feedData) && user.feedData.length === 0) ||
    user?.feedData == null;

  if (empty) {
    return (
      <div style={{ padding: 24, borderRadius: 16, background: '#f1f5f9' }}>
        <NoDataCard message={noRequestsMessage || 'No users found'} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      justifyContent: 'center',
      padding: '32px 16px',
    }}>
      {Array.isArray(user?.feedData) && user.feedData.map((u, index) => (
        <ProfileCard
          key={u._id || index}
          user={u}
          onIgnore={(id) => handleRequests('ignored', id)}
          onInterested={(id) => handleRequests('interested', id)}
        />
      ))}
    </div>
  );
}

export default UserCard;