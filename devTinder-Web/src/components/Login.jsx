import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

/* ─── Inline styles (no Tailwind dependency for the new design) ─── */
const styles = {
  page: {
    display: "flex",
    // minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 40px",
    borderRadius: "24px",
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "1040px",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  /* ── Left panel ── */
  left: {
    flex: "0 0 52%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 72px",
    background: "#ffffff",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 52,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1a1a2e 60%, #4f8ef7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a1a2e",
    letterSpacing: "-0.3px",
  },
  heading: {
    fontSize: 34,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "-0.6px",
  },
  subheading: {
    fontSize: 14,
    color: "#64748b",
    margin: "0 0 36px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 8,
  },
  fieldWrap: {
    position: "relative",
  },
  fieldIcon: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
    display: "flex",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px 14px 46px",
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "4px 0 24px",
  },
  forgotLink: {
    fontSize: 13,
    color: "#64748b",
    textDecoration: "none",
    cursor: "pointer",
  },
  btnPrimary: {
    width: "100%",
    padding: "15px",
    borderRadius: 12,
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.2px",
    transition: "background 0.2s, transform 0.1s",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    margin: "10px 0 0",
    minHeight: 18,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "24px 0",
    color: "#cbd5e1",
    fontSize: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#e2e8f0",
  },
  signupRow: {
    textAlign: "center",
    fontSize: 13,
    color: "#64748b",
    marginTop: 28,
  },
  signupLink: {
    color: "#0f172a",
    fontWeight: 700,
    textDecoration: "none",
    marginLeft: 4,
  },
  /* ── Right panel ── */
  right: {
    flex: 1,
    background: "linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f2044 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: 48,
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },
  hexRing: {
    position: "relative",
    zIndex: 1,
    width: 280,
    height: 280,
    marginBottom: 36,
  },
  illustrationContent: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 90,
  },
  tagline: {
    position: "relative",
    zIndex: 1,
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 800,
    textAlign: "center",
    letterSpacing: "-0.4px",
    lineHeight: 1.3,
    margin: "0 0 10px",
  },
  taglineSub: {
    position: "relative",
    zIndex: 1,
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 280,
  },
  dots: {
    display: "flex",
    gap: 8,
    marginTop: 32,
    position: "relative",
    zIndex: 1,
  },
  dot: (active) => ({
    width: active ? 20 : 8,
    height: 8,
    borderRadius: 4,
    background: active ? "#4f8ef7" : "rgba(255,255,255,0.25)",
    transition: "width 0.3s",
  }),
  /* accent blobs */
  blob1: {
    position: "absolute",
    top: 60,
    right: 60,
    width: 12,
    height: 12,
    borderRadius: 2,
    background: "#facc15",
    transform: "rotate(30deg)",
    zIndex: 1,
  },
  blob2: {
    position: "absolute",
    bottom: 120,
    left: 50,
    width: 10,
    height: 10,
    borderRadius: 2,
    background: "#4ade80",
    transform: "rotate(20deg)",
    zIndex: 1,
  },
  blob3: {
    position: "absolute",
    top: 180,
    left: 70,
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderBottom: "14px solid #4f8ef7",
    zIndex: 1,
  },
};

/* ── SVG Hexagon illustration placeholder ── */
function HexIllustration() {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* hex shape */}
      <path
        d="M140 20 L250 80 L250 200 L140 260 L30 200 L30 80 Z"
        stroke="url(#hexGrad)"
        strokeWidth="2"
        fill="rgba(79,142,247,0.06)"
      />
      <defs>
        <linearGradient id="hexGrad" x1="30" y1="20" x2="250" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f8ef7" />
          <stop offset="1" stopColor="#4ade80" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="laptopGrad" x1="80" y1="120" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      {/* laptop base */}
      <rect x="80" y="170" width="120" height="8" rx="4" fill="url(#laptopGrad)" />
      {/* laptop body */}
      <rect x="88" y="120" width="104" height="52" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      {/* screen */}
      <rect x="94" y="126" width="92" height="40" rx="3" fill="#0f172a" />
      {/* screen glow lines */}
      <rect x="100" y="132" width="50" height="3" rx="1.5" fill="#4f8ef7" opacity="0.7" />
      <rect x="100" y="139" width="36" height="3" rx="1.5" fill="#4f8ef7" opacity="0.4" />
      <rect x="100" y="146" width="42" height="3" rx="1.5" fill="#4f8ef7" opacity="0.3" />
      {/* avatar head */}
      <circle cx="140" cy="98" r="22" fill="#fbbf24" />
      {/* hair */}
      <path d="M118 94 Q140 68 162 94" fill="#1e293b" />
      {/* body */}
      <rect x="118" y="118" width="44" height="6" rx="3" fill="#e2e8f0" opacity="0.5" />
      {/* floating gem */}
      <polygon points="140,48 152,62 140,68 128,62" fill="#a78bfa" opacity="0.85" />
      <polygon points="140,48 152,62 140,56" fill="#c4b5fd" opacity="0.6" />
      {/* ring bottom-right */}
      <circle cx="210" cy="210" r="22" stroke="#4ade80" strokeWidth="4" fill="none" opacity="0.7" />
      <circle cx="210" cy="210" r="14" stroke="#4ade80" strokeWidth="2" fill="none" opacity="0.3" />
    </svg>
  );
}

/* ── Email icon ── */
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

/* ── Password icon ── */
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ── Eye toggle icon ── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        { emailId: email, password },
        { withCredentials: true }
      );
      const { firstName, emailId } = response.data.user;
      localStorage.setItem("user", JSON.stringify({ name: firstName, email: emailId }));
      dispatch(setUser(response.data.user));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/feed");
  }, [navigate]);

  return (
    <div style={styles.page} className="login-page">
      <style>{`
        @media (max-width: 1024px) {
          .login-right { display: none !important; }
          .login-card {
            max-width: 440px !important;
          }
          .login-left { 
            flex: 1 !important;
            padding: 48px 32px !important; 
          }
        }
        @media (max-width: 480px) {
          .login-left {
            padding: 40px 24px !important;
          }
          .login-page {
            padding: 26px 1px !important;
          }
        }
      `}</style>
      <div style={styles.card} className="login-card">
        {/* ── Left ── */}
        <div style={styles.left} className="login-left">
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <span style={styles.logoText}>devTinder</span>
          </div>

          <h1 style={styles.heading}>Welcome Back!</h1>
          <p style={styles.subheading}>Please enter your login details below</p>

          <div style={styles.fieldGroup}>
            {/* Email */}
            <div style={styles.fieldWrap}>
              <span style={styles.fieldIcon}><EmailIcon /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@site.com"
                style={styles.input}
                onFocus={(e) => { e.target.style.borderColor = "#4f8ef7"; e.target.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldWrap}>
              <span style={styles.fieldIcon}><LockIcon /></span>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ ...styles.input, paddingRight: 46 }}
                onFocus={(e) => { e.target.style.borderColor = "#4f8ef7"; e.target.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0,
                }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={styles.forgotRow}>
            <a href="#" style={styles.forgotLink}>Forget password?</a>
          </div>

          {/* Error */}
          <p style={styles.errorText}>{error}</p>

          {/* CTA */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.btnPrimary,
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1e3a5f"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0f172a"; }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Sign up */}
          <p style={styles.signupRow}>
            Don't have an account?
            <Link to="/signUp" style={styles.signupLink}>Sign Up</Link>
          </p>
        </div>

        {/* ── Right ── */}
        <div style={styles.right} className="login-right">
          <div style={styles.grid} />
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.blob3} />

          {/* Hex illustration */}
          <div style={styles.hexRing}>
            <HexIllustration />
          </div>

          <h2 style={styles.tagline}>Connect with Developers Anywhere</h2>
          <p style={styles.taglineSub}>
            Swipe, match, and collaborate with talented developers on projects you love.
          </p>

          {/* Dots indicator */}
          <div style={styles.dots}>
            <div style={styles.dot(true)} />
            <div style={styles.dot(false)} />
            <div style={styles.dot(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
