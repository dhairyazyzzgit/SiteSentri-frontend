import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, logout, exitGuestMode, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  const handleExit = async () => {
    if (isGuest) {
      exitGuestMode();
      navigate("/login");
      return;
    }

    await logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .ss-nav-wrap {
          position: sticky;
          top: 14px;
          z-index: 1000;
          padding: 14px 18px 0;
        }

        .ss-nav {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 16px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
          backdrop-filter: blur(18px);
          box-shadow:
            0 18px 46px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .ss-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
          flex-shrink: 0;
        }

        .ss-brand-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4, #22c55e);
          box-shadow: 0 0 18px rgba(124,58,237,0.8);
        }

        .ss-nav-links {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .ss-nav-link {
          text-decoration: none;
          color: rgba(255,255,255,0.74);
          padding: 11px 16px;
          border-radius: 14px;
          font-weight: 600;
          transition: 0.22s ease;
          border: 1px solid transparent;
          background: transparent;
        }

        .ss-nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.06);
        }

        .ss-nav-link.active {
          color: #fff;
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .ss-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .ss-nav-mode {
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          white-space: nowrap;
        }

        .ss-nav-exit {
          border: none;
          border-radius: 14px;
          padding: 12px 16px;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          box-shadow: 0 14px 34px rgba(124,58,237,0.22);
          transition: 0.22s ease;
        }

        .ss-nav-exit:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 920px) {
          .ss-nav {
            flex-direction: column;
            align-items: stretch;
          }

          .ss-nav-links {
            justify-content: flex-start;
          }

          .ss-nav-right {
            justify-content: space-between;
          }
        }
      `}</style>

      <div className="ss-nav-wrap">
        <div className="ss-nav">
          <Link to="/dashboard" className="ss-brand">
            <span className="ss-brand-dot" />
            SiteSentri
          </Link>

          <div className="ss-nav-links">
            <Link
              to="/dashboard"
              className={`ss-nav-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              Dashboard
            </Link>

            <Link
              to="/analyze"
              className={`ss-nav-link ${isActive("/analyze") ? "active" : ""}`}
            >
              Analyze
            </Link>

            <Link
              to="/history"
              className={`ss-nav-link ${isActive("/history") ? "active" : ""}`}
            >
              History
            </Link>
          </div>

          <div className="ss-nav-right">
            <div className="ss-nav-mode">
              {user ? user.email : isGuest ? "Guest mode" : ""}
            </div>

            <button className="ss-nav-exit" onClick={handleExit}>
              {isGuest ? "Exit Guest" : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;