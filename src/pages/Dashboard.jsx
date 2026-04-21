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
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at center, black 52%, transparent 100%);
          pointer-events: none;
        }

        .sd-grid-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 18%, rgba(124,58,237,0.12), transparent 24%),
            radial-gradient(circle at 78% 22%, rgba(6,182,212,0.10), transparent 26%),
            radial-gradient(circle at 72% 78%, rgba(34,197,94,0.08), transparent 24%);
          pointer-events: none;
        }

        .sd-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.52;
          pointer-events: none;
        }

        .sd-noise {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image:
            radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.6px);
          background-size: 10px 10px;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .sd-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035));
          backdrop-filter: blur(18px);
          box-shadow:
            0 18px 60px rgba(0,0,0,0.42),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .sd-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          animation: sdShimmer 6s linear infinite;
          pointer-events: none;
        }

        .sd-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 34%);
          pointer-events: none;
        }

        @keyframes sdShimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes sdFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes sdFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes sdHeroGlow {
          0%, 100% { box-shadow: 0 16px 44px rgba(124,58,237,0.24); }
          50% { box-shadow: 0 22px 62px rgba(6,182,212,0.28); }
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
          letter-spacing: -0.055em;
          font-weight: 800;
          max-width: 980px;
          text-shadow: 0 4px 34px rgba(0,0,0,0.28);
        }

        .sd-sub {
          max-width: 780px;
          color: rgba(255,255,255,0.7);
          line-height: 1.78;
          font-size: clamp(15px, 2vw, 18px);
          text-wrap: balance;
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
          padding: 21px 30px;
          min-width: 250px;
          border-radius: 24px;
          color: #fff;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #7c3aed, #2563eb 52%, #06b6d4);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 18px 44px rgba(124,58,237,0.28),
            inset 0 1px 0 rgba(255,255,255,0.16);
          animation: sdHeroGlow 3.2s ease-in-out infinite;
          transition: 0.24s ease;
          position: relative;
          overflow: hidden;
        }

        .sd-primary-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%);
          animation: sdShimmer 4.5s linear infinite;
        }

        .sd-primary-cta:hover {
          transform: translateY(-2px) scale(1.012);
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
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          transition: 0.22s ease;
        }

        .sd-secondary-cta:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.08);
        }

        .sd-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-top: 38px;
        }

        .sd-stat-card {
          min-height: 232px;
          border-radius: 28px;
          padding: 24px;
          animation: sdFadeUp 0.4s ease;
          display: flex;
          gap: 18px;
          align-items: flex-start;
          transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
        }

        .sd-stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.14);
          box-shadow:
            0 26px 68px rgba(0,0,0,0.48),
            0 0 0 1px rgba(255,255,255,0.03),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .sd-stat-icon {
          width: 82px;
          min-width: 82px;
          height: 82px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 10px 32px rgba(0,0,0,0.28);
          animation: sdFloat 4.2s ease-in-out infinite;
        }

        .sd-stat-icon::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(145deg, rgba(255,255,255,0.06), transparent);
          pointer-events: none;
        }

        .sd-icon-code {
          background:
            linear-gradient(180deg, rgba(124,58,237,0.18), rgba(37,99,235,0.1)),
            rgba(255,255,255,0.03);
          border: 1px solid rgba(124,58,237,0.18);
        }

        .sd-icon-safe {
          background:
            linear-gradient(180deg, rgba(6,182,212,0.18), rgba(34,197,94,0.08)),
            rgba(255,255,255,0.03);
          border: 1px solid rgba(6,182,212,0.18);
        }

        .sd-icon-scan {
          background:
            linear-gradient(180deg, rgba(217,70,239,0.16), rgba(124,58,237,0.08)),
            rgba(255,255,255,0.03);
          border: 1px solid rgba(217,70,239,0.18);
        }

        .sd-icon-score {
          background:
            linear-gradient(180deg, rgba(59,130,246,0.18), rgba(124,58,237,0.08)),
            rgba(255,255,255,0.03);
          border: 1px solid rgba(59,130,246,0.18);
        }

        .sd-stat-copy {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .sd-stat-value {
          color: #fff;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
          line-height: 1.15;
        }

        .sd-stat-label {
          color: rgba(255,255,255,0.68);
          line-height: 1.72;
          font-size: 15px;
        }

        .sd-score-wide {
          margin-top: 20px;
          min-height: 116px;
          border-radius: 28px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          transition: transform 0.24s ease, box-shadow 0.24s ease;
        }

        .sd-score-wide:hover {
          transform: translateY(-4px);
          box-shadow:
            0 28px 74px rgba(0,0,0,0.48),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .sd-score-left {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          flex: 1;
        }

        .sd-score-badge {
          min-width: 148px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 22px;
          border-radius: 999px;
          color: #fff;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -0.02em;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          align-self: center;
        }

        .sd-score-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          box-shadow: 0 0 20px rgba(6,182,212,0.7);
        }

        .sd-main-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 24px;
          margin-top: 32px;
        }

        .sd-work-card,
        .sd-side-card {
          border-radius: 30px;
          padding: 28px;
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
          color: rgba(255,255,255,0.68);
          line-height: 1.75;
          font-size: 15px;
        }

        .sd-inline-actions {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 16px;
          margin-top: 24px;
        }

        .sd-focus-card {
          position: relative;
          overflow: hidden;
          text-decoration: none;
          padding: 24px;
          border-radius: 26px;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            linear-gradient(135deg, rgba(124,58,237,0.34), rgba(37,99,235,0.16) 58%, rgba(6,182,212,0.18)),
            rgba(255,255,255,0.05);
          box-shadow:
            0 20px 48px rgba(124,58,237,0.18),
            inset 0 1px 0 rgba(255,255,255,0.14);
          transition: 0.24s ease;
        }

        .sd-focus-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 30px 66px rgba(6,182,212,0.16),
            inset 0 1px 0 rgba(255,255,255,0.16);
        }

        .sd-focus-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          animation: sdShimmer 4.6s linear infinite;
        }

        .sd-focus-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255,255,255,0.74);
          margin-bottom: 12px;
        }

        .sd-focus-title {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .sd-focus-sub {
          color: rgba(255,255,255,0.86);
          line-height: 1.68;
          font-size: 15px;
          max-width: 420px;
        }

        .sd-utility-card {
          text-decoration: none;
          padding: 22px;
          border-radius: 24px;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.045);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          transition: 0.22s ease;
        }

        .sd-utility-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.07);
        }

        .sd-utility-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .sd-utility-sub {
          color: rgba(255,255,255,0.66);
          line-height: 1.65;
          font-size: 14px;
        }

        .sd-list {
          display: grid;
          gap: 14px;
          margin-top: 22px;
        }

        .sd-list-item {
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
          line-height: 1.72;
          font-size: 15px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .sd-auth-card {
          margin-top: 24px;
          border-radius: 26px;
          padding: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .sd-auth-line {
          color: rgba(255,255,255,0.84);
          line-height: 1.7;
          font-size: 15px;
        }

        .sd-logout {
          margin-top: 16px;
          border: none;
          border-radius: 18px;
          padding: 15px 20px;
          color: #fff;
          cursor: pointer;
          font-weight: 800;
          font-size: 15px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          box-shadow:
            0 14px 36px rgba(124,58,237,0.24),
            inset 0 1px 0 rgba(255,255,255,0.12);
          transition: 0.25s ease;
        }

        .sd-logout:hover {
          transform: translateY(-2px);
        }

        .sd-svg {
          width: 42px;
          height: 42px;
          display: block;
        }

        .sd-svg-score {
          width: 48px;
          height: 48px;
          display: block;
        }

        @media (max-width: 1180px) {
          .sd-stats {
            grid-template-columns: 1fr;
          }

          .sd-stat-card {
            min-height: unset;
          }

          .sd-score-wide {
            flex-direction: column;
            align-items: stretch;
          }

          .sd-score-badge {
            width: fit-content;
          }
        }

        @media (max-width: 980px) {
          .sd-main-grid {
            grid-template-columns: 1fr;
          }

          .sd-inline-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .sd-title {
            font-size: clamp(34px, 12vw, 56px);
          }

          .sd-stat-card,
          .sd-work-card,
          .sd-side-card,
          .sd-score-wide {
            padding: 20px;
          }

          .sd-stat-card {
            flex-direction: column;
          }

          .sd-stat-icon {
            width: 74px;
            min-width: 74px;
            height: 74px;
          }

          .sd-primary-cta,
          .sd-secondary-cta {
            width: 100%;
          }

          .sd-score-left {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="sd-grid" />
      <div className="sd-grid-glow" />
      <div className="sd-noise" />

      <div
        className="sd-orb"
        style={{
          width: 360,
          height: 360,
          background: "rgba(124,58,237,0.55)",
          top: -90,
          left: -90,
        }}
      />
      <div
        className="sd-orb"
        style={{
          width: 320,
          height: 320,
          background: "rgba(6,182,212,0.34)",
          right: -90,
          top: 120,
        }}
      />
      <div
        className="sd-orb"
        style={{
          width: 260,
          height: 260,
          background: "rgba(34,197,94,0.16)",
          right: "18%",
          bottom: 30,
        }}
      />

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
          SiteSentri evaluates web trust through layered detection — combining locally
          written logic, Google Safe Browsing intelligence, urlscan analysis, and
          weighted scoring into one clear workflow.
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
            <div className="sd-stat-icon sd-icon-code">
              <svg viewBox="0 0 24 24" fill="none" className="sd-svg">
                <path
                  d="M8.5 6L3.5 12L8.5 18"
                  stroke="#4F8CFF"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 6L20.5 12L15.5 18"
                  stroke="#7C3AED"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.4 4.5L10.6 19.5"
                  stroke="#38BDF8"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="sd-stat-copy">
              <div className="sd-stat-value">Own Detection Logic</div>
              <div className="sd-stat-label">
                Locally written detection logic that reviews suspicious URL patterns,
                risky keywords, and domain-age signals before the final verdict is calculated.
              </div>
            </div>
          </div>

          <div className="sd-panel sd-stat-card">
            <div className="sd-stat-icon sd-icon-safe">
              <svg viewBox="0 0 24 24" fill="none" className="sd-svg">
                <path
                  d="M12 3L18.5 5.5V11.2C18.5 15.55 15.72 18.74 12 20.2C8.28 18.74 5.5 15.55 5.5 11.2V5.5L12 3Z"
                  stroke="#22E6D8"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.2 11.9L11.15 13.85L15 10"
                  stroke="#22E6D8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="sd-stat-copy">
              <div className="sd-stat-value">Google Safe Browsing API</div>
              <div className="sd-stat-label">
                Checks URLs against Google Safe Browsing to identify known phishing,
                malware, and unsafe destinations using trusted threat intelligence.
              </div>
            </div>
          </div>

          <div className="sd-panel sd-stat-card">
            <div className="sd-stat-icon sd-icon-scan">
              <svg viewBox="0 0 24 24" fill="none" className="sd-svg">
                <circle cx="12" cy="12" r="8.2" stroke="#D65BF2" strokeWidth="1.9" />
                <path
                  d="M3.8 12H20.2"
                  stroke="#D65BF2"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <path
                  d="M12 3.8C14.3 6.1 15.6 9 15.6 12C15.6 15 14.3 17.9 12 20.2"
                  stroke="#D65BF2"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <path
                  d="M12 3.8C9.7 6.1 8.4 9 8.4 12C8.4 15 9.7 17.9 12 20.2"
                  stroke="#D65BF2"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="sd-stat-copy">
              <div className="sd-stat-value">URLscan API</div>
              <div className="sd-stat-label">
                Pulls live scan data and deeper context from URLscan to strengthen analysis
                with observed page behavior, technical signals, and scan evidence.
              </div>
            </div>
          </div>
        </div>

        <div className="sd-panel sd-score-wide">
          <div className="sd-score-left">
            <div className="sd-stat-icon sd-icon-score">
              <svg viewBox="0 0 24 24" fill="none" className="sd-svg-score">
                <path
                  d="M5 18.5H19"
                  stroke="#5A8CFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 16V7.5"
                  stroke="#5A8CFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 15.8L11 11.8L13.7 14.3L18 9.5"
                  stroke="#5A8CFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.8 9.5H18V11.7"
                  stroke="#5A8CFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="sd-stat-copy">
              <div className="sd-stat-value">Calculates Unified Risk Score</div>
              <div className="sd-stat-label">
                Brings all sources together into one weighted trust score so users get a
                verdict that feels clear, fast, and backed by real signals.
              </div>
            </div>
          </div>

          <div className="sd-score-badge">
            <span className="sd-score-dot" />
            Risk Score
          </div>
        </div>

        <div className="sd-main-grid">
          <div className="sd-panel sd-work-card">
            <h2 className="sd-work-title">What SiteSentri does</h2>
            <p className="sd-work-sub">
              Enter any URL and get an instant risk assessment. SiteSentri combines
              threat intelligence, pattern analysis, and scan data to deliver a clear
              and dependable safety verdict.
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
                Checks against known threat databases to quickly flag unsafe websites.
              </div>
              <div className="sd-list-item">
                Analyzes URL patterns and page structure to catch hidden phishing signals.
              </div>
              <div className="sd-list-item">
                Combines all signals into a single, easy-to-understand trust score.
              </div>
            </div>
          </div>

          <div className="sd-panel sd-side-card">
            <h2 className="sd-side-title">Session profile</h2>
            <p className="sd-side-sub">
              Your current mode controls how scan history is stored and accessed.
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
                Logged-in users get secure, account-based scan history across sessions.
              </div>
              <div className="sd-list-item">
                Guest mode allows quick access without signup, with data stored locally.
              </div>
              <div className="sd-list-item">
                Designed to feel clear, polished, and reliable from the first interaction.
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
      "radial-gradient(circle at top, rgba(24,38,110,0.42), transparent 28%), linear-gradient(180deg, #020611 0%, #040916 52%, #061127 100%)",
    padding: "110px 18px 84px",
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    boxShadow: "0 0 18px rgba(6,182,212,0.75)",
    display: "inline-block",
  },
};

export default Dashboard;
