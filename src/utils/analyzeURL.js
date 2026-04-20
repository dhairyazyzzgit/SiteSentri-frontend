const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] =
          1 +
          Math.min(
            matrix[i - 1][j],     // delete
            matrix[i][j - 1],     // insert
            matrix[i - 1][j - 1]  // replace
          );
      }
    }
  }

  return matrix[a.length][b.length];
};
export const analyzeURL = (url) => {
  let score = 100;
  let reasons = [];

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    // -------------------------
    // 1. HTTPS
    // -------------------------
    if (parsed.protocol !== "https:") {
      score -= 20;
      reasons.push("No HTTPS encryption");
    }

    // -------------------------
    // 2. Domain structure
    // -------------------------
    const parts = hostname.split(".");

    if (parts.length > 3) {
      score -= 15;
      reasons.push("Too many subdomains");
    }

    // -------------------------
    // 3. Brand impersonation
    // -------------------------
    const brands = ["amazon", "google", "paypal", "facebook", "apple"];

const domainName = hostname.split(".")[0];

brands.forEach((brand) => {
  const distance = levenshtein(domainName, brand);

  // EXACT legit domains
  const legitDomains = [
    `${brand}.com`,
    `${brand}.in`,
  ];

  if (legitDomains.includes(hostname)) return;

  // 🚨 VERY IMPORTANT: detect typosquatting
  if (distance === 1 || distance === 2) {
    score -= 50;
    reasons.push(`Domain mimics '${brand}' (possible typo attack)`);
  }

  // contains brand but not legit
  if (hostname.includes(brand) && !legitDomains.includes(hostname)) {
    score -= 30;
    reasons.push(`Possible impersonation of ${brand}`);
  }
});

    // -------------------------
    // 4. Hyphens (phishing indicator)
    // -------------------------
    if (hostname.includes("-")) {
      score -= 15;
      reasons.push("Hyphenated domain (common in phishing)");
    }

    // -------------------------
    // 5. Random string detection
    // -------------------------
    if (/[a-z0-9]{12,}/.test(hostname)) {
      score -= 20;
      reasons.push("Random-looking domain");
    }

    // -------------------------
    // 6. Suspicious words
    // -------------------------
    const words = ["login", "verify", "secure", "update", "account"];

    words.forEach((w) => {
      if (url.includes(w)) {
        score -= 10;
        reasons.push(`Contains '${w}'`);
      }
    });

    // -------------------------
    // 7. URL length
    // -------------------------
    if (url.length > 100) {
      score -= 10;
      reasons.push("Very long URL");
    }

    // -------------------------
    // 8. IP address instead of domain
    // -------------------------
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      score -= 30;
      reasons.push("Uses IP address instead of domain");
    }

    // -------------------------
    // 9. @ symbol trick
    // -------------------------
    if (url.includes("@")) {
      score -= 25;
      reasons.push("Contains '@' (redirect trick)");
    }

  } catch {
    return {
      score: 0,
      verdict: "Invalid URL",
      reasons: ["Invalid format"],
    };
  }

  // -------------------------
  // Final Verdict
  // -------------------------
  let verdict = "Safe";
  if (score < 70) verdict = "Suspicious";
  if (score < 40) verdict = "Dangerous";

  return {
    score: Math.max(score, 0),
    verdict,
    reasons,
  };
};