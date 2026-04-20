import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, isGuest, logout, exitGuestMode } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isGuest) {
      exitGuestMode();
      navigate("/login");
      return;
    }

    await logout();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }

        .sd-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at center, black 48%, transparent 100%);
          pointer-events: none;
        }

        .sd-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.42;
          pointer-events: none;
        }

        .sd-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
          backdrop-filter: blur(18px);
          box-shadow:
            0 20px 70px rgba(0,0,0,0.42),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .sd-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          animation: sdShimmer 5.5s linear infinite;
          pointer-events: none;
        }

        @keyframes sdShimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes sdFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes sdHeroGlow {
          0%, 100% { box-shadow: 0 16px 44px rgba(124,58,237,0.22); }
          50% { box-shadow: 0 20px 56px rgba(6,182,212,0.26); }
        }

        .sd-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .sd-title {
          margin: 18px 0 14px;
          color: #fff;
          font-size: clamp(40px, 6vw, 78px);
          line-height: 0.97;
          letter-spacing: -0.05em;
          font-weight: 800;
          max-width: 940px;
        }

        .sd-sub {
          max-width: 760px;
          color: rgba(255,255,255,0.68);
          line-height: 1.75;
          font-size: clamp(15px, 2vw, 18px);
        }

        .sd-hero-cta-wrap {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }

        .sd-primary-cta {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px 28px;
          min-width: 250px;
          border-radius: 22px;
          color: #fff;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #7c3aed, #06b6d4, #22c55e);
          background-size: 200% 200%;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 18px 44px rgba(124,58,237,0.28),
            inset 0 1px 0 rgba(255,255,255,0.16);
          animation: sdHeroGlow 3.2s ease-in-out infinite;
          transition: 0.22s ease;
        }

        .sd-primary-cta:hover {
          transform: translateY(-2px) scale(1.01);
        }

        .sd-secondary-cta {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 18px 24px;
          border-radius: 20px;
          color: #fff;
          font-weight: 700;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          transition: 0.22s ease;
        }

        .sd-secondary-cta:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.08);
        }

        .sd-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-top: 34px;
        }

        .sd-stat-card {
          border-radius: 24px;
          padding: 22px;
          animation: sdFadeUp 0.35s ease;
        }

        .sd-stat-value {
          color: #fff;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }

        .sd-stat-label {
          color: rgba(255,255,255,0.64);
          line-height: 1.65;
          font-size: 14px;
        }

        .sd-main-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 22px;
          margin-top: 30px;
        }

        .sd-work-card,
        .sd-side-card {
          border-radius: 28px;
          padding: 24px;
        }

        .sd-work-title,
        .sd-side-title {
          margin: 0;
          color: #fff;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .sd-work-sub,
        .sd-side-sub {
          margin-top: 12px;
          color: rgba(255,255,255,0.66);
          line-height: 1.7;
          font-size: 15px;
        }

        .sd-inline-actions {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 14px;
          margin-top: 22px;
        }

        .sd-focus-card {
          position: relative;
          overflow: hidden;
          text-decoration: none;
          padding: 22px;
          border-radius: 24px;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            linear-gradient(135deg, rgba(124,58,237,0.28), rgba(6,182,212,0.18)),
            rgba(255,255,255,0.05);
          box-shadow:
            0 20px 48px rgba(124,58,237,0.18),
            inset 0 1px 0 rgba(255,255,255,0.14);
          transition: 0.24s ease;
        }

        .sd-focus-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 26px 60px rgba(6,182,212,0.18),
            inset 0 1px 0 rgba(255,255,255,0.16);
        }

        .sd-focus-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-100%);
          animation: sdShimmer 4.8s linear infinite;
        }

        .sd-focus-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.72);
          margin-bottom: 10px;
        }

        .sd-focus-title {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }

        .sd-focus-sub {
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
          font-size: 15px;
          max-width: 420px;
        }

        .sd-utility-card {
          text-decoration: none;
          padding: 20px;
          border-radius: 22px;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.045);
          transition: 0.22s ease;
        }

        .sd-utility-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.07);
        }

        .sd-utility-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .sd-utility-sub {
          color: rgba(255,255,255,0.64);
          line-height: 1.6;
          font-size: 14px;
        }

        .sd-list {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }

        .sd-list-item {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.78);
          line-height: 1.65;
        }

        .sd-auth-card {
          margin-top: 22px;
          border-radius: 24px;
          padding: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .sd-auth-line {
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          font-size: 15px;
        }

        .sd-logout {
          margin-top: 16px;
          border: none;
          border-radius: 18px;
          padding: 14px 18px;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          box-shadow: 0 14px 36px rgba(124,58,237,0.24);
          transition: 0.25s ease;
        }

        .sd-logout:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 980px) {
          .sd-main-grid {
            grid-template-columns: 1fr;
          }

          .sd-inline-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="sd-grid" />
      <div className="sd-orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.52)", top: -90, left: -90 }} />
      <div className="sd-orb" style={{ width: 320, height: 320, background: "rgba(6,182,212,0.34)", right: -90, top: 120 }} />
      <div className="sd-orb" style={{ width: 240, height: 240, background: "rgba(34,197,94,0.2)", right: "18%", bottom: 30 }} />

      <div style={styles.container}>
        <div className="sd-badge">
          <span style={styles.dot} />
          SiteSentri Command Center
        </div>

        <h1 className="sd-title">
          Enterprise-grade trust analysis,
          <br />
          designed to feel effortless.
        </h1>

        <p className="sd-sub">
          SiteSentri evaluates web trust through layered detection — bringing together phishing
          signal analysis, domain-age intelligence, threat reputation checks, and scan-based
          evidence in one premium workflow built for clarity, speed, and credibility.
        </p>

        <div className="sd-hero-cta-wrap">
          <Link to="/analyze" className="sd-primary-cta">
            Launch Analysis →
          </Link>

          <Link to="/history" className="sd-secondary-cta">
            Review History
          </Link>
        </div>

        <div className="sd-stats">
          <div className="sd-panel sd-stat-card">
            <div className="sd-stat-value">Multi-Signal Engine</div>
            <div className="sd-stat-label">
              Heuristics, Safe Browsing, urlscan, and domain-age checks working as one.
            </div>
          </div>

          <div className="sd-panel sd-stat-card">
            <div className="sd-stat-value">Account + Guest Ready</div>
            <div className="sd-stat-label">
              Full login flow, cloud history for users, and local history for guest sessions.
            </div>
          </div>

          <div className="sd-panel sd-stat-card">
            <div className="sd-stat-value">Pitch-ready Product Feel</div>
            <div className="sd-stat-label">
              Built to communicate trust, intelligence, and product maturity at first glance.
            </div>
          </div>
        </div>

        <div className="sd-main-grid">
          <div className="sd-panel sd-work-card">
            <h2 className="sd-work-title">What the platform does</h2>
            <p className="sd-work-sub">
              Analyze any URL through a trust-first cyber workflow. SiteSentri helps surface
              suspicious patterns, detect impersonation risk, and present a refined verdict that
              users can understand quickly.
            </p>

            <div className="sd-inline-actions">
              <Link to="/analyze" className="sd-focus-card">
                <div className="sd-focus-label">Primary Workflow</div>
                <div className="sd-focus-title">Launch Analysis</div>
                <div className="sd-focus-sub">
                  Open the main workstation and run a full trust check on any URL.
                </div>
              </Link>

              <Link to="/history" className="sd-utility-card">
                <div className="sd-utility-title">Review History</div>
                <div className="sd-utility-sub">
                  Revisit previous evaluations, compare verdicts, and manage stored scans.
                </div>
              </Link>
            </div>

            <div className="sd-list">
              <div className="sd-list-item">
                Reputation checks catch known threats faster than visual judgment alone.
              </div>
              <div className="sd-list-item">
                Structural analysis helps expose phishing patterns even when a site looks polished.
              </div>
              <div className="sd-list-item">
                Trust scoring becomes more meaningful when multiple weak signals align together.
              </div>
            </div>
          </div>

          <div className="sd-panel sd-side-card">
            <h2 className="sd-side-title">Session profile</h2>
            <p className="sd-side-sub">
              Your current workspace mode determines how SiteSentri stores and retrieves your scan history.
            </p>

            <div className="sd-auth-card">
              <div className="sd-auth-line">
                {user
                  ? `Logged in as ${user.email}`
                  : isGuest
                  ? "You are using guest mode with local-only history."
                  : "No active session detected."}
              </div>

              <button className="sd-logout" onClick={handleLogout}>
                {isGuest ? "Exit Guest Mode" : "Logout"}
              </button>
            </div>

            <div className="sd-list">
              <div className="sd-list-item">
                Logged-in users get account-based cloud history with per-user isolation.
              </div>
              <div className="sd-list-item">
                Guest mode keeps the experience frictionless while preserving temporary local history.
              </div>
              <div className="sd-list-item">
                The interface is designed to feel premium, deliberate, and enterprise-presentable.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top, rgba(20,30,90,0.42), transparent 28%), linear-gradient(180deg, #030712 0%, #050816 55%, #071126 100%)",
    padding: "110px 18px 84px",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#7c3aed",
    boxShadow: "0 0 16px rgba(124,58,237,0.8)",
    display: "inline-block",
  },
};

export default Dashboard;