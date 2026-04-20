import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { saveUserHistoryItem } from "../services/historyService";
import { saveLocalHistoryItem } from "../services/localHistory";

const CYBER_FACTS = [
  "Phishing sites often create false urgency so users act before thinking.",
  "A padlock does not guarantee safety — many malicious pages also use HTTPS.",
  "Typosquatting domains mimic real brands with tiny spelling changes like amazion or paypa1.",
  "Fake websites commonly use words like secure, verify, update, account, or login to build false trust.",
  "Attackers often embed trusted names inside longer domains, such as brand-name.secure-check.xyz.",
  "Many scam domains are newly registered and only stay live for a short period.",
  "Some fraudulent pages look visually polished because social engineering relies on trust, not poor design.",
  "A single clean signal means little — strong detection comes from combining multiple signals together.",
  "Compromised legitimate sites can also host malicious pages, which is why URL structure matters.",
  "Brand impersonation is one of the most common phishing patterns in cyber fraud campaigns.",
  "Known-malicious reputation feeds can catch threats that look clean to the naked eye.",
  "Phishing attacks often imitate payment, banking, delivery, or account-recovery workflows.",
];

const getAiVerdict = (result) => {
  if (!result) return "";

  const reasons = Array.isArray(result.reasons) ? result.reasons : [];
  const joined = reasons.join(" ").toLowerCase();

  if (result.verdict === "Safe") {
    return "This URL appears clean right now, with no major high-risk signals detected by the current checks.";
  }

  if (joined.includes("google safe browsing")) {
    return "This URL was flagged by a trusted reputation source, so it should be treated as highly unsafe.";
  }

  if (joined.includes("urlscan")) {
    return "Scan evidence points to malicious or deceptive behavior, which makes this URL unsafe to trust.";
  }

  if (
    joined.includes("mimics") ||
    joined.includes("impersonation") ||
    joined.includes("trusted domain")
  ) {
    return "This URL shows strong signs of brand imitation, which is a common phishing tactic.";
  }

  if (joined.includes("risky top-level domain") || joined.includes("phishing-style")) {
    return "This URL combines suspicious structure with phishing-style wording, which raises its risk significantly.";
  }

  if (result.verdict === "Suspicious") {
    return "This URL is not conclusively malicious, but several trust signals are weak enough to justify caution.";
  }

  if (result.verdict === "Dangerous") {
    return "Multiple strong risk indicators align here, making this URL unsafe to trust.";
  }

  return "The trust score reflects a combination of structural, reputation, and scan-based risk signals.";
};

const Analyze = () => {
  const { user, isGuest } = useAuthContext();

  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [factIndex, setFactIndex] = useState(0);
  const [showFact, setShowFact] = useState(true);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    if (!loading) return;

    const factTimer = setInterval(() => {
      setShowFact(false);

      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % CYBER_FACTS.length);
        setShowFact(true);
      }, 260);
    }, 5200);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 45) return prev + 3;
        if (prev < 70) return prev + 2;
        if (prev < 86) return prev + 1;
        if (prev < 94) return prev + 0.5;
        return prev;
      });
    }, 850);

    return () => {
      clearInterval(factTimer);
      clearInterval(progressTimer);
    };
  }, [loading]);

  const verdictColor = useMemo(() => {
    if (!result) return "#ffffff";
    if (result.verdict === "Safe") return "#42d77d";
    if (result.verdict === "Suspicious") return "#ffb84d";
    if (result.verdict === "Dangerous") return "#ff5b7a";
    return "#a1a1aa";
  }, [result]);

  const resultGradient = useMemo(() => {
    if (!result) return "linear-gradient(135deg, #7c3aed, #06b6d4)";
    if (result.verdict === "Safe") return "linear-gradient(135deg, #22c55e, #06b6d4)";
    if (result.verdict === "Suspicious") return "linear-gradient(135deg, #f59e0b, #fb7185)";
    if (result.verdict === "Dangerous") return "linear-gradient(135deg, #ef4444, #7c3aed)";
    return "linear-gradient(135deg, #52525b, #71717a)";
  }, [result]);

  const aiVerdict = useMemo(() => getAiVerdict(result), [result]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setSaveMessage("");
    setFactIndex(Math.floor(Math.random() * CYBER_FACTS.length));
    setShowFact(true);
    setProgress(6);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      setProgress(100);
      setResult(data);

      const historyItem = {
        url: data.url,
        score: data.score,
        verdict: data.verdict,
        reasons: data.reasons,
        createdAt: Date.now(),
      };

      if (user) {
        try {
          await saveUserHistoryItem({
            uid: user.uid,
            email: user.email,
            ...historyItem,
          });
          setSaveMessage("Saved to your account history");
        } catch (historyError) {
          console.error("Firestore save failed:", historyError);
          setSaveMessage(`Cloud save failed: ${historyError.message}`);
        }
      } else if (isGuest) {
        saveLocalHistoryItem(historyItem);
        setSaveMessage("Saved to guest history");
      }
    } catch (error) {
      console.error("Analyze failed:", error);
      setProgress(100);
      setResult({
        score: 0,
        verdict: "Error",
        reasons: ["Backend not reachable"],
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(6);
      }, 800);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }

        .sa-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(circle at center, black 48%, transparent 100%);
          pointer-events: none;
        }

        .sa-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.42;
          pointer-events: none;
        }

        .sa-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
          backdrop-filter: blur(18px);
          box-shadow:
            0 20px 70px rgba(0,0,0,0.42),
            inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .sa-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          animation: saShimmer 5.5s linear infinite;
          pointer-events: none;
        }

        @keyframes saShimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes saFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes saPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes saRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes saBarMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes saScan {
          0% { transform: translateY(-20%); opacity: 0.1; }
          40% { opacity: 0.7; }
          100% { transform: translateY(120%); opacity: 0.08; }
        }

        @keyframes saFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sa-badge {
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

        .sa-title {
          margin: 18px 0 12px;
          color: #fff;
          font-size: clamp(38px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -0.05em;
          font-weight: 800;
          max-width: 900px;
        }

        .sa-sub {
          max-width: 720px;
          color: rgba(255,255,255,0.68);
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.75;
          margin: 0;
        }

        .sa-input {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.055);
          color: #fff;
          border-radius: 22px;
          outline: none;
          padding: 21px 20px 21px 58px;
          font-size: 16px;
          transition: 0.25s ease;
        }

        .sa-input::placeholder {
          color: rgba(255,255,255,0.42);
        }

        .sa-input:focus {
          border-color: rgba(124,58,237,0.7);
          box-shadow:
            0 0 0 4px rgba(124,58,237,0.12),
            0 0 28px rgba(6,182,212,0.14);
          background: rgba(255,255,255,0.075);
        }

        .sa-btn {
          border: none;
          border-radius: 20px;
          padding: 18px 28px;
          min-width: 190px;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: 0.25s ease;
          background: linear-gradient(135deg, #7c3aed, #06b6d4, #22c55e);
          background-size: 200% 200%;
          animation: saBarMove 5s linear infinite;
          box-shadow: 0 18px 44px rgba(7, 182, 212, 0.22);
        }

        .sa-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 52px rgba(124,58,237,0.28);
        }

        .sa-btn:disabled {
          opacity: 0.78;
          cursor: not-allowed;
          transform: none;
        }

        .sa-loading-shell {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          padding: 28px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04)),
            radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 34%),
            radial-gradient(circle at top right, rgba(6,182,212,0.16), transparent 28%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
          animation: saFadeUp 0.35s ease;
        }

        .sa-loading-shell::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 120px;
          top: -30px;
          background: linear-gradient(180deg, rgba(255,255,255,0.16), transparent);
          animation: saScan 3.4s linear infinite;
          pointer-events: none;
        }

        .sa-loader-wrap {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .sa-loader-core {
          width: 76px;
          height: 76px;
          position: relative;
          flex-shrink: 0;
        }

        .sa-loader-ring,
        .sa-loader-ring2,
        .sa-loader-ring3 {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
        }

        .sa-loader-ring {
          border-top-color: #7c3aed;
          border-right-color: #06b6d4;
          animation: saRotate 1.7s linear infinite;
        }

        .sa-loader-ring2 {
          inset: 8px;
          border-bottom-color: #22c55e;
          border-left-color: #fb7185;
          animation: saRotate 1.3s linear infinite reverse;
        }

        .sa-loader-ring3 {
          inset: 18px;
          border-top-color: #f59e0b;
          border-right-color: #60a5fa;
          animation: saRotate 0.95s linear infinite;
        }

        .sa-loader-dot {
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #8b5cf6 55%, transparent 75%);
          animation: saPulse 1.2s ease-in-out infinite;
        }

        .sa-progress-track {
          width: 100%;
          height: 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .sa-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #7c3aed, #06b6d4, #22c55e, #f59e0b, #ec4899);
          background-size: 200% 200%;
          animation: saBarMove 2.6s linear infinite;
          transition: width 0.85s ease;
          box-shadow: 0 0 26px rgba(6,182,212,0.3);
        }

        .sa-fact-box {
          margin-top: 26px;
          border-radius: 24px;
          padding: 22px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .sa-fact-label {
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 12px;
        }

        .sa-fact-text {
          color: #fff;
          font-size: clamp(18px, 2vw, 24px);
          line-height: 1.6;
          font-weight: 600;
          letter-spacing: -0.02em;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .sa-fact-text.hidden {
          opacity: 0;
          transform: translateY(8px);
        }

        .sa-fact-text.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-checks-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .sa-chip {
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .sa-result-card {
          border-radius: 32px;
          padding: 28px;
          animation: saFadeUp 0.4s ease;
        }

        .sa-result-layout {
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 28px;
          align-items: start;
        }

        .sa-score-shell {
          width: 168px;
          height: 168px;
          border-radius: 50%;
          padding: 2px;
          animation: saFloat 4s ease-in-out infinite;
        }

        .sa-score-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(5,8,22,0.94);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .sa-mini {
          color: rgba(255,255,255,0.52);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .sa-reason {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.82);
          line-height: 1.6;
        }

        .sa-save-msg {
          margin-top: 16px;
          color: rgba(255,255,255,0.72);
          font-size: 14px;
        }

        @media (max-width: 920px) {
          .sa-result-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .sa-title {
            font-size: 42px;
          }

          .sa-loading-shell,
          .sa-result-card,
          .sa-panel {
            border-radius: 24px;
          }

          .sa-btn {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>

      <div className="sa-grid" />
      <div className="sa-orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.55)", top: -90, left: -90 }} />
      <div className="sa-orb" style={{ width: 320, height: 320, background: "rgba(6,182,212,0.36)", right: -90, top: 130 }} />
      <div className="sa-orb" style={{ width: 240, height: 240, background: "rgba(34,197,94,0.18)", right: "22%", bottom: 40 }} />

      <div style={styles.container}>
        <div className="sa-badge">
          <span style={styles.dot} />
          Main Analysis Workstation
        </div>

        <h1 className="sa-title">
          Precision Trust Analysis
          <br />
          For Modern Web Risk.
        </h1>

        <p className="sa-sub">
          Run a high-signal URL trust check through SiteSentri’s layered detection stack —
          combining phishing-pattern analysis, reputation intelligence, domain-age signals,
          and scan-based evidence into one refined verdict.
        </p>

        <div className="sa-panel" style={styles.workstation}>
          <div style={styles.inputWrap}>
            <div style={styles.inputIcon}>⌘</div>

            <input
              className="sa-input"
              type="text"
              placeholder="Paste any website URL to inspect spoofing, phishing, and fraud risk"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAnalyze();
              }}
            />
          </div>

          <button className="sa-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Running Full Analysis..." : "Analyze URL"}
          </button>
        </div>

        {saveMessage && <p className="sa-save-msg">{saveMessage}</p>}

        {loading && (
          <div style={{ marginTop: 32 }}>
            <div className="sa-loading-shell">
              <div className="sa-loader-wrap">
                <div className="sa-loader-core">
                  <div className="sa-loader-ring" />
                  <div className="sa-loader-ring2" />
                  <div className="sa-loader-ring3" />
                  <div className="sa-loader-dot" />
                </div>

                <div style={{ flex: 1, minWidth: 260 }}>
                  <div className="sa-badge" style={{ marginBottom: 12 }}>
                    <span style={{ ...styles.dot, background: "#06b6d4" }} />
                    Live Cyber Fraud Evaluation
                  </div>

                  <h2 style={styles.loadingTitle}>Inspecting trust signals across the stack</h2>
                  <p style={styles.loadingSub}>
                    We’re actively checking structure, reputation, brand impersonation risk,
                    and deeper scan evidence before the final verdict is returned.
                  </p>
                </div>

                <div style={styles.percent}>{Math.round(progress)}%</div>
              </div>

              <div style={{ marginTop: 20 }} className="sa-progress-track">
                <div className="sa-progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="sa-fact-box">
                <div className="sa-fact-label">Cyber Insight — Read While We Analyze</div>
                <div className={`sa-fact-text ${showFact ? "visible" : "hidden"}`}>
                  {CYBER_FACTS[factIndex]}
                </div>
              </div>

              <div className="sa-checks-row">
                <div className="sa-chip">Heuristic pattern checks</div>
                <div className="sa-chip">Reputation intelligence</div>
                <div className="sa-chip">Threat scan evidence</div>
                <div className="sa-chip">Domain trust signals</div>
              </div>
            </div>
          </div>
        )}

        {!loading && result && (
          <div className="sa-panel sa-result-card" style={{ marginTop: 32 }}>
            <div className="sa-result-layout">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="sa-score-shell" style={{ background: resultGradient }}>
                  <div className="sa-score-inner">
                    <div className="sa-mini">Trust Score</div>
                    <div style={styles.score}>{result.score}</div>
                    <div style={{ ...styles.verdict, color: verdictColor }}>{result.verdict}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="sa-badge" style={{ marginBottom: 14 }}>
                  <span style={{ ...styles.dot, background: verdictColor }} />
                  Final Evaluation
                </div>

                <h2 style={styles.resultTitle}>
                  {result.verdict === "Safe" && "This URL currently appears trustworthy."}
                  {result.verdict === "Suspicious" && "This URL has notable trust concerns."}
                  {result.verdict === "Dangerous" && "This URL appears highly unsafe to trust."}
                  {result.verdict === "Error" && "The trust analysis could not complete correctly."}
                </h2>

                <p style={styles.resultUrl}>{result.url || url}</p>

                <div style={styles.aiBox}>
                  <div style={styles.aiLabel}>AI Verdict</div>
                  <div style={styles.aiText}>{aiVerdict}</div>
                </div>

                <div style={styles.reasonGrid}>
                  {result.reasons?.map((reason, index) => (
                    <div key={index} className="sa-reason">
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
    padding: "38px 18px 84px",
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
  workstation: {
    borderRadius: 28,
    padding: 16,
    marginTop: 28,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 14,
    alignItems: "center",
  },
  inputWrap: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 22,
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.5)",
    zIndex: 2,
  },
  loadingTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "clamp(26px, 3.6vw, 40px)",
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
  },
  loadingSub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.7,
    maxWidth: 700,
  },
  percent: {
    color: "#fff",
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: "-0.04em",
  },
  score: {
    color: "#fff",
    fontSize: 54,
    lineHeight: 1,
    fontWeight: 800,
    marginTop: 8,
    letterSpacing: "-0.05em",
  },
  verdict: {
    marginTop: 10,
    fontWeight: 700,
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  resultTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "clamp(28px, 4vw, 40px)",
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
  },
  resultUrl: {
    marginTop: 14,
    color: "rgba(255,255,255,0.62)",
    wordBreak: "break-word",
  },
  aiBox: {
    marginTop: 22,
    borderRadius: 22,
    padding: 18,
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  aiLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    marginBottom: 10,
  },
  aiText: {
    color: "#fff",
    lineHeight: 1.7,
    fontSize: 16,
    fontWeight: 600,
  },
  reasonGrid: {
    marginTop: 22,
    display: "grid",
    gap: 12,
  },
};

export default Analyze;