import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
  const { login, continueAsGuest } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in");
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="ss-auth-wrap">
      <div className="ss-auth-grid">
        <div className="ss-card ss-hero">
          <div className="ss-badge">Realtime trust scoring • OSINT-inspired checks • AI-ready product</div>
          <div className="ss-brand">Cyber Intelligence Layer</div>
          <h1 className="ss-title">
            Detect suspicious websites with a
            <br />
            <span className="ss-gradient-text">beautifully ruthless workflow.</span>
          </h1>
          <p className="ss-subtitle">
            SiteSentri blends reputation signals, brand impersonation checks, domain-age analysis,
            Safe Browsing intelligence, urlscan evidence, and high-conviction heuristics into one
            premium decision engine.
          </p>

          <div className="ss-feature-grid">
            <div className="ss-feature">
              <h4>Fast high-signal analysis</h4>
              <p>Known threats return immediately, deeper scans kick in only when needed.</p>
            </div>
            <div className="ss-feature">
              <h4>Built for real-world trust</h4>
              <p>Typosquatting, risky TLDs, domain age, embedded-brand abuse, and threat feeds.</p>
            </div>
            <div className="ss-feature">
              <h4>Guest mode included</h4>
              <p>Use it instantly without signup, then graduate to account-based cloud history.</p>
            </div>
          </div>
        </div>

        <div className="ss-card ss-auth-card">
          <h1>Welcome back</h1>
          <p>Secure your session and continue scanning with your personal history intact.</p>

          <form className="ss-form" onSubmit={handleLogin}>
            <div className="ss-input-wrap">
              <label className="ss-label">Email</label>
              <input
                className="ss-input"
                type="email"
                name="email"
                placeholder="you@domain.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ss-input-wrap">
              <label className="ss-label">Password</label>
              <input
                className="ss-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="ss-btn" type="submit">
              Login to SiteSentri
            </button>
          </form>

          <button className="ss-btn-secondary" onClick={handleGuest} style={{ marginTop: "14px" }}>
            Skip login for now
          </button>

          {error && <div className="ss-error">{error}</div>}

          <div className="ss-auth-footer">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;