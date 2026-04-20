import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Signup = () => {
  const { signup, continueAsGuest } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    try {
      await signup(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account");
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
          <div className="ss-badge">Private account history • premium workflow • instant guest fallback</div>
          <div className="ss-brand">Trust Intelligence Platform</div>
          <h1 className="ss-title">
            Create your own
            <br />
            <span className="ss-gradient-text">threat intelligence cockpit.</span>
          </h1>
          <p className="ss-subtitle">
            Build your personal trust-checking dashboard, store past scans in your account, and
            move from quick curiosity to serious verification.
          </p>

          <div className="ss-feature-grid">
            <div className="ss-feature">
              <h4>Cloud history</h4>
              <p>Every scan is tied to your account and accessible from your own history page.</p>
            </div>
            <div className="ss-feature">
              <h4>Guest fallback</h4>
              <p>Need speed? Skip signup and start scanning immediately using local history.</p>
            </div>
            <div className="ss-feature">
              <h4>Expansion-ready</h4>
              <p>Perfect foundation for AI explanations, watchlists, and advanced scan insights.</p>
            </div>
          </div>
        </div>

        <div className="ss-card ss-auth-card">
          <h1>Create account</h1>
          <p>Join SiteSentri and unlock account-based scan history with a polished login flow.</p>

          <form className="ss-form" onSubmit={handleSignup}>
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
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ss-input-wrap">
              <label className="ss-label">Confirm password</label>
              <input
                className="ss-input"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="ss-btn" type="submit">
              Create account
            </button>
          </form>

          <button className="ss-btn-secondary" onClick={handleGuest} style={{ marginTop: "14px" }}>
            Skip login for now
          </button>

          {error && <div className="ss-error">{error}</div>}

          <div className="ss-auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;