import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const TopNav = () => {
  const { user, isGuest, logout, exitGuestMode } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (isGuest) {
      exitGuestMode();
      navigate("/login");
      return;
    }

    await logout();
    navigate("/login");
  };

  const linkStyle = (path) => ({
    background:
      location.pathname === path ? "rgba(255,255,255,0.08)" : "transparent",
  });

  return (
    <div className="ss-card ss-topbar">
      <div className="ss-topbar-inner">
        <div className="ss-logo">
          <h2>SiteSentri</h2>
          <span>Website Trust Intelligence</span>
        </div>

        <div className="ss-nav">
          <Link to="/dashboard" style={linkStyle("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/analyze" style={linkStyle("/analyze")}>
            Analyze
          </Link>
          <Link to="/history" style={linkStyle("/history")}>
            History
          </Link>
        </div>
      </div>

      <div className="ss-topbar-inner">
        <div className="ss-user-chip">
          {user ? user.email : isGuest ? "Guest mode" : "Session"}
        </div>

        <button className="ss-btn-ghost" onClick={handleLogout}>
          {isGuest ? "Exit Guest" : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default TopNav;