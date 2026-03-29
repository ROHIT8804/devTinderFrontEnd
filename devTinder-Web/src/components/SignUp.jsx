import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link } from "react-router-dom";

/* ─── Shared design tokens (mirrors Login.jsx) ─── */
const S = {
    page: {
        display: "flex",
        minHeight: "100vh",
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
    /* ── Right dark panel (illustration) ── */
    right: {
        flex: "0 0 40%",
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
        position: "absolute", inset: 0,
        backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
    },
    blob1: { position: "absolute", top: 60, right: 60, width: 12, height: 12, borderRadius: 2, background: "#facc15", transform: "rotate(30deg)", zIndex: 1 },
    blob2: { position: "absolute", bottom: 120, right: 50, width: 10, height: 10, borderRadius: 2, background: "#4ade80", transform: "rotate(20deg)", zIndex: 1 },
    blob3: { position: "absolute", top: 180, right: 70, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "14px solid #4f8ef7", zIndex: 1 },
    tagline: { position: "relative", zIndex: 1, color: "#ffffff", fontSize: 26, fontWeight: 800, textAlign: "center", letterSpacing: "-0.4px", lineHeight: 1.3, margin: "36px 0 10px" },
    taglineSub: { position: "relative", zIndex: 1, color: "#94a3b8", fontSize: 13, textAlign: "center", lineHeight: 1.6, maxWidth: 260 },
    dots: { display: "flex", gap: 8, marginTop: 32, position: "relative", zIndex: 1 },
    dot: (a) => ({ width: a ? 20 : 8, height: 8, borderRadius: 4, background: a ? "#4f8ef7" : "rgba(255,255,255,0.25)", transition: "width 0.3s" }),

    /* ── Left form panel ── */
    left: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        overflowY: "auto",
        padding: "48px 64px",
        background: "#ffffff",
        textAlign: "left",
    },
    logo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 36 },
    logoIcon: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1a1a2e 60%, #4f8ef7 100%)", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontSize: 18, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.3px" },
    heading: { fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.6px" },
    subheading: { fontSize: 14, color: "#64748b", margin: "0 0 28px" },

    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    fieldWrap: { position: "relative", marginBottom: 14 },
    fieldIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none", display: "flex" },
    input: {
        width: "100%", boxSizing: "border-box",
        padding: "13px 14px 13px 44px",
        borderRadius: 12, border: "1.5px solid #e2e8f0",
        fontSize: 14, color: "#0f172a", background: "#f8fafc",
        outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    },
    select: {
        width: "100%", boxSizing: "border-box",
        padding: "13px 14px 13px 44px",
        borderRadius: 12, border: "1.5px solid #e2e8f0",
        fontSize: 14, color: "#0f172a", background: "#f8fafc",
        outline: "none", appearance: "none", cursor: "pointer",
    },
    textarea: {
        width: "100%", boxSizing: "border-box",
        padding: "13px 14px", borderRadius: 12,
        border: "1.5px solid #e2e8f0", fontSize: 14,
        color: "#0f172a", background: "#f8fafc",
        outline: "none", resize: "none", fontFamily: "inherit",
    },
    charCount: { textAlign: "right", fontSize: 12, color: "#94a3b8", marginTop: 4 },
    skillRow: { display: "flex", gap: 10, marginBottom: 8 },
    skillInput: {
        flex: 1, padding: "11px 14px", borderRadius: 12,
        border: "1.5px solid #e2e8f0", fontSize: 14,
        color: "#0f172a", background: "#f8fafc", outline: "none",
    },
    addBtn: {
        padding: "11px 18px", borderRadius: 12, border: "1.5px solid #0f172a",
        background: "transparent", color: "#0f172a", fontSize: 13,
        fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
        transition: "background 0.15s, color 0.15s",
    },
    skillBadge: {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 20,
        background: "#eff6ff", border: "1px solid #bfdbfe",
        fontSize: 12, fontWeight: 600, color: "#1d4ed8",
    },
    skillsWrap: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 },
    errorText: { fontSize: 12, color: "#ef4444", marginTop: 3, minHeight: 16 },
    btnPrimary: {
        width: "100%", padding: "14px", borderRadius: 12,
        border: "none", background: "#0f172a", color: "#ffffff",
        fontSize: 15, fontWeight: 700, cursor: "pointer",
        letterSpacing: "0.2px", transition: "background 0.2s",
        marginTop: 8,
    },
    loginRow: { textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 20 },
    loginLink: { color: "#0f172a", fontWeight: 700, textDecoration: "none", marginLeft: 4 },
    label: { fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5, textAlign: "left" },
    sectionTitle: { fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.8px", textTransform: "uppercase", margin: "8px 0 14px" },
};

/* ── Icons ── */
const Icon = ({ d, filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled || "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const inputFocus = (e) => { e.target.style.borderColor = "#4f8ef7"; e.target.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.12)"; };
const inputBlur = (e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; };

/* ── SVG Illustration (signup-themed) ── */
function SignUpIllustration() {
    return (
        <svg viewBox="0 0 260 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 260 }}>
            <defs>
                <linearGradient id="sg1" x1="0" y1="0" x2="260" y2="280" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4f8ef7" />
                    <stop offset="1" stopColor="#4ade80" stopOpacity="0.7" />
                </linearGradient>
            </defs>
            {/* hex */}
            <path d="M130 18 L232 75 L232 190 L130 247 L28 190 L28 75 Z" stroke="url(#sg1)" strokeWidth="2" fill="rgba(79,142,247,0.05)" />
            {/* card / form shape */}
            <rect x="72" y="90" width="116" height="100" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* form lines */}
            <rect x="84" y="108" width="92" height="10" rx="5" fill="#0f172a" />
            <rect x="84" y="108" width="55" height="10" rx="5" fill="#4f8ef7" opacity="0.7" />
            <rect x="84" y="126" width="92" height="10" rx="5" fill="#0f172a" />
            <rect x="84" y="126" width="40" height="10" rx="5" fill="#4f8ef7" opacity="0.45" />
            <rect x="84" y="144" width="92" height="10" rx="5" fill="#0f172a" />
            <rect x="84" y="144" width="68" height="10" rx="5" fill="#4f8ef7" opacity="0.35" />
            {/* CTA button */}
            <rect x="84" y="163" width="92" height="16" rx="8" fill="#4f8ef7" />
            <rect x="104" y="167" width="52" height="8" rx="4" fill="white" opacity="0.8" />
            {/* avatar */}
            <circle cx="130" cy="66" r="22" fill="#fbbf24" />
            <path d="M108 62 Q130 38 152 62" fill="#1e293b" />
            {/* plus icon (signup metaphor) */}
            <circle cx="192" cy="52" r="16" fill="#4ade80" opacity="0.15" stroke="#4ade80" strokeWidth="1.5" />
            <line x1="192" y1="44" x2="192" y2="60" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="184" y1="52" x2="200" y2="52" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
            {/* ring */}
            <circle cx="72" cy="210" r="20" stroke="#facc15" strokeWidth="3.5" fill="none" opacity="0.6" />
            <circle cx="72" cy="210" r="12" stroke="#facc15" strokeWidth="1.5" fill="none" opacity="0.25" />
            {/* floating diamond */}
            <polygon points="190,200 200,216 190,222 180,216" fill="#a78bfa" opacity="0.8" />
            <polygon points="190,200 200,216 190,210" fill="#c4b5fd" opacity="0.55" />
        </svg>
    );
}

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', emailId: '', password: '',
        age: '', gender: '', photoUrl: '', about: '', skills: []
    });
    const [skillInput, setSkillInput] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [valErr, setValErr] = useState({});

    const handle = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (valErr[name]) setValErr(p => ({ ...p, [name]: '' }));
    };

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && formData.skills.length < 5 && !formData.skills.includes(s)) {
            setFormData(p => ({ ...p, skills: [...p.skills, s] }));
            setSkillInput('');
        }
    };

    const removeSkill = (s) => setFormData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

    const validate = () => {
        const e = {};
        if (!formData.firstName.trim()) e.firstName = 'First name is required';
        if (!formData.emailId.trim()) e.emailId = 'Email is required';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.emailId)) e.emailId = 'Enter a valid email';
        if (!formData.password) e.password = 'Password is required';
        else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password))
            e.password = 'Min 8 chars with number, upper & lowercase';
        if (formData.age && (parseInt(formData.age) < 18)) e.age = 'Must be 18+';
        setValErr(e);
        return Object.keys(e).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) { setError('Please fix the errors above.'); return; }
        setLoading(true); setError('');
        try {
            await axios.post(BASE_URL + '/signup', { ...formData });
            navigate('/login');
        } catch (err) {
            setError(err?.response?.data || "Sign up failed. Please try again.");
        } finally { setLoading(false); }
    };

    return (
        <div style={S.page} className="signup-page">
            <style>{`
                @media (max-width: 1024px) {
                    .signup-right { display: none !important; }
                    .signup-card { max-width: 500px !important; margin: 0 auto; }
                    .signup-left { flex: 1 !important; padding: 48px 32px !important; }
                }
                @media (max-width: 480px) {
                    .signup-left { padding: 40px 24px !important; }
                    .signup-page { padding: 26px 1px !important; }
                }
            `}</style>
            <div style={S.card} className="signup-card">
                {/* ── Left: Form ── */}
                <div style={S.left} className="signup-left">
                    {/* Logo */}
                    <div style={S.logo}>
                        <div style={S.logoIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
                            </svg>
                        </div>
                        <span style={S.logoText}>devTinder</span>
                    </div>

                    <h1 style={S.heading}>Create Account</h1>
                    <p style={S.subheading}>Join thousands of developers — it's free</p>

                    {/* ── Name row ── */}
                    <div style={S.row2}>
                        <div>
                            <span style={S.label}>First Name *</span>
                            <div style={S.fieldWrap}>
                                <span style={S.fieldIcon}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input name="firstName" value={formData.firstName} onChange={handle} placeholder="Rohit" style={S.input} onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <p style={S.errorText}>{valErr.firstName}</p>
                        </div>
                        <div>
                            <span style={S.label}>Last Name</span>
                            <div style={S.fieldWrap}>
                                <span style={S.fieldIcon}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input name="lastName" value={formData.lastName} onChange={handle} placeholder="Kumar" style={S.input} onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                        </div>
                    </div>

                    {/* ── Email ── */}
                    <span style={S.label}>Email *</span>
                    <div style={S.fieldWrap}>
                        <span style={S.fieldIcon}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </span>
                        <input type="email" name="emailId" value={formData.emailId} onChange={handle} placeholder="mail@site.com" style={S.input} onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                    <p style={S.errorText}>{valErr.emailId}</p>

                    {/* ── Password ── */}
                    <span style={S.label}>Password *</span>
                    <div style={{ ...S.fieldWrap, position: "relative" }}>
                        <span style={S.fieldIcon}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input type={showPw ? "text" : "password"} name="password" value={formData.password} onChange={handle}
                            placeholder="Min 8 chars, A-z, 0-9"
                            style={{ ...S.input, paddingRight: 44 }} onFocus={inputFocus} onBlur={inputBlur} />
                        <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
                            {showPw
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            }
                        </button>
                    </div>
                    <p style={S.errorText}>{valErr.password}</p>

                    {/* ── Age + Gender row ── */}
                    <div style={S.row2}>
                        <div>
                            <span style={S.label}>Age</span>
                            <div style={S.fieldWrap}>
                                <span style={S.fieldIcon}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                                    </svg>
                                </span>
                                <input type="number" name="age" value={formData.age} onChange={handle} placeholder="18+" min="18" style={S.input} onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <p style={S.errorText}>{valErr.age}</p>
                        </div>
                        <div>
                            <span style={S.label}>Gender</span>
                            <div style={S.fieldWrap}>
                                <span style={S.fieldIcon}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="9" r="5" /><path d="M12 14v7M9 18h6" />
                                    </svg>
                                </span>
                                <select name="gender" value={formData.gender} onChange={handle} style={S.select} onFocus={inputFocus} onBlur={inputBlur}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Photo URL ── */}
                    <span style={S.label}>Photo URL</span>
                    <div style={S.fieldWrap}>
                        <span style={S.fieldIcon}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                        </span>
                        <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handle} placeholder="https://..." style={S.input} onFocus={inputFocus} onBlur={inputBlur} />
                    </div>

                    {/* ── About ── */}
                    <span style={{ ...S.label, marginTop: 6 }}>About</span>
                    <textarea name="about" value={formData.about} onChange={handle}
                        placeholder="Tell us about yourself…"
                        maxLength="500" rows={3}
                        style={S.textarea} onFocus={inputFocus} onBlur={inputBlur} />
                    <div style={S.charCount}>{formData.about.length}/500</div>

                    {/* ── Skills ── */}
                    <span style={{ ...S.label, marginTop: 10 }}>Skills <span style={{ color: "#94a3b8", fontWeight: 400 }}>(max 5)</span></span>
                    <div style={S.skillRow}>
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            placeholder="e.g. React, Swift…"
                            style={S.skillInput}
                            disabled={formData.skills.length >= 5}
                            onFocus={inputFocus} onBlur={inputBlur}
                        />
                        <button
                            onClick={addSkill}
                            disabled={!skillInput.trim() || formData.skills.length >= 5}
                            style={{ ...S.addBtn, opacity: (!skillInput.trim() || formData.skills.length >= 5) ? 0.4 : 1 }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f172a"; }}
                        >+ Add</button>
                    </div>
                    {formData.skills.length > 0 && (
                        <div style={S.skillsWrap}>
                            {formData.skills.map((sk, i) => (
                                <span key={i} style={S.skillBadge}>
                                    {sk}
                                    <button onClick={() => removeSkill(sk)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{formData.skills.length}/5 skills added</div>

                    {/* Error */}
                    {error && <p style={{ fontSize: 13, color: "#ef4444", margin: "8px 0 0" }}>{error}</p>}

                    {/* CTA */}
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1e3a5f"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#0f172a"; }}
                    >
                        {loading ? "Creating account…" : "Sign Up"}
                    </button>

                    <p style={S.loginRow}>
                        Already have an account?
                        <Link to="/login" style={S.loginLink}>Sign in</Link>
                    </p>
                </div>

                {/* ── Right: Illustration ── */}
                <div style={S.right} className="signup-right">
                    <div style={S.grid} />
                    <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
                    <SignUpIllustration />
                    <h2 style={S.tagline}>Start Matching with Developers</h2>
                    <p style={S.taglineSub}>Build your profile, showcase your skills, and find your next co-founder or collaborator.</p>
                    <div style={S.dots}>
                        <div style={S.dot(false)} /><div style={S.dot(true)} /><div style={S.dot(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;