import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  getUserHistory,
  deleteUserHistoryItem,
} from "../services/historyService";
import {
  getLocalHistory,
  deleteLocalHistoryItem,
} from "../services/localHistory";

const History = () => {
  const { user, isGuest } = useAuthContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      if (user) {
        const data = await getUserHistory(user.uid);
        setHistory(data);
      } else if (isGuest) {
        setHistory(getLocalHistory());
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("History load failed:", err);
      setError(err.message || "Failed to load history");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user, isGuest]);

  const handleDelete = async (id) => {
    try {
      if (user) {
        await deleteUserHistoryItem(id);
        await load();
      } else if (isGuest) {
        setHistory(deleteLocalHistoryItem(id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.message || "Failed to delete history item");
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }

        .sh-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at center, black 48%, transparent 100%);
          pointer-events: none;
        }

        .sh-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.42;
          pointer-events: none;
        }

        .sh-panel {
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

        .sh-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          animation: shShimmer 5.5s linear infinite;
          pointer-events: none;
        }

        @keyframes shShimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes shFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sh-badge {
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

        .sh-title {
          margin: 18px 0 12px;
          color: #fff;
          font-size: clamp(34px, 6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 800;
          max-width: 800px;
        }

        .sh-sub {
          max-width: 720px;
          color: rgba(255,255,255,0.68);
          line-height: 1.75;
          font-size: clamp(15px, 2vw, 18px);
          margin-bottom: 30px;
        }

        .sh-status {
          margin-top: 16px;
          color: rgba(255,255,255,0.72);
          font-size: 15px;
        }

        .sh-error {
          color: #ff7a93;
        }

        .sh-list {
          display: grid;
          gap: 18px;
          margin-top: 10px;
        }

        .sh-card {
          border-radius: 26px;
          padding: 22px;
          animation: shFadeUp 0.35s ease;
        }

        .sh-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .sh-url {
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.6;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .sh-pill {
          flex-shrink: 0;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.06);
        }

        .sh-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .sh-meta-box {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .sh-meta-label {
          color: rgba(255,255,255,0.52);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 8px;
        }

        .sh-meta-value {
          color: #fff;
          font-size: 16px;
          line-height: 1.5;
          word-break: break-word;
        }

        .sh-reasons-wrap {
          margin-top: 6px;
        }

        .sh-reasons-title {
          color: rgba(255,255,255,0.56);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 12px;
        }

        .sh-reasons {
          display: grid;
          gap: 10px;
        }

        .sh-reason {
          padding: 13px 15px;
          border-radius: 16px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
          word-break: break-word;
        }

        .sh-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 18px;
        }

        .sh-delete {
          border: none;
          border-radius: 16px;
          padding: 13px 18px;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          background: linear-gradient(135deg, #ef4444, #ec4899);
          box-shadow: 0 14px 36px rgba(239,68,68,0.22);
          transition: 0.22s ease;
          width: auto;
        }

        .sh-delete:hover {
          transform: translateY(-1px);
        }

        .sh-empty {
          border-radius: 26px;
          padding: 28px;
          color: rgba(255,255,255,0.76);
          line-height: 1.7;
        }

        @media (max-width: 760px) {
          .sh-card {
            padding: 18px;
            border-radius: 22px;
          }

          .sh-card-top {
            flex-direction: column;
            align-items: stretch;
          }

          .sh-pill {
            width: fit-content;
          }

          .sh-meta {
            grid-template-columns: 1fr;
          }

          .sh-actions {
            justify-content: stretch;
          }

          .sh-delete {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .sh-title {
            font-size: 36px;
          }

          .sh-url {
            font-size: 16px;
          }

          .sh-meta-value {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="sh-grid" />
      <div className="sh-orb" style={{ width: 340, height: 340, background: "rgba(124,58,237,0.5)", top: -80, left: -90 }} />
      <div className="sh-orb" style={{ width: 300, height: 300, background: "rgba(6,182,212,0.34)", right: -80, top: 100 }} />
      <div className="sh-orb" style={{ width: 240, height: 240, background: "rgba(34,197,94,0.18)", right: "18%", bottom: 20 }} />

      <div style={styles.container}>
        <div className="sh-badge">
          <span style={styles.dot} />
          SiteSentri History Vault
        </div>

        <h1 className="sh-title">Scan History</h1>

        <p className="sh-sub">
          Review previous trust evaluations, revisit verdicts, and manage stored scans across
          your current session mode.
        </p>

        {loading && <p className="sh-status">Loading history...</p>}
        {error && <p className="sh-status sh-error">{error}</p>}

        {!loading && history.length === 0 && !error ? (
          <div className="sh-panel sh-empty">
            No history yet. Run a URL analysis and it will appear here.
          </div>
        ) : (
          <div className="sh-list">
            {history.map((item) => {
              const verdictColor =
                item.verdict === "Safe"
                  ? "#42d77d"
                  : item.verdict === "Suspicious"
                  ? "#ffb84d"
                  : item.verdict === "Dangerous"
                  ? "#ff5b7a"
                  : "#a1a1aa";

              return (
                <div key={item.id} className="sh-panel sh-card">
                  <div className="sh-card-top">
                    <div className="sh-url">{item.url}</div>
                    <div
                      className="sh-pill"
                      style={{
                        color: verdictColor,
                        boxShadow: `0 0 18px ${verdictColor}22`,
                      }}
                    >
                      {item.verdict}
                    </div>
                  </div>

                  <div className="sh-meta">
                    <div className="sh-meta-box">
                      <div className="sh-meta-label">Trust Score</div>
                      <div className="sh-meta-value">{item.score}/100</div>
                    </div>

                    <div className="sh-meta-box">
                      <div className="sh-meta-label">Date</div>
                      <div className="sh-meta-value">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "Unknown"}
                      </div>
                    </div>
                  </div>

                  {Array.isArray(item.reasons) && item.reasons.length > 0 && (
                    <div className="sh-reasons-wrap">
                      <div className="sh-reasons-title">Reasons</div>
                      <div className="sh-reasons">
                        {item.reasons.map((reason, index) => (
                          <div key={index} className="sh-reason">
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sh-actions">
                    <button
                      className="sh-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete this search
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

export default History;