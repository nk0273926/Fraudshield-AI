import { useState } from "react";

export default function UrlDetector() {
  const [url, setUrl] = useState("");

  const [result, setResult] = useState<{
    score: number;
    status: string;
    reasons: string[];
  } | null>(null);

  const analyzeURL = () => {
    let score = 5;
    let reasons: string[] = [];

    if (!url) return;

    if (!url.startsWith("https://")) {
      score += 20;
      reasons.push("Website is not using HTTPS.");
    }
    // HTTP instead of HTTPS
if (url.startsWith("http://")) {
  score += 35;
  reasons.push("Website is using insecure HTTP connection.");
}
// IP Address Detection
const ipRegex = /https?:\/\/(\d{1,3}\.){3}\d{1,3}/;

if (ipRegex.test(url)) {
  score += 40;
  reasons.push("Uses IP address instead of domain.");
}
// Too many hyphens
const hyphenCount = (url.match(/-/g) || []).length;

if (hyphenCount >= 3) {
  score += 20;
  reasons.push("Too many hyphens detected.");
}
// @ symbol
if (url.includes("@")) {
  score += 35;
  reasons.push("Contains @ symbol.");
}

    const keywords = [
"login",
"signin",
"verify",
"secure",
"bank",
"otp",
"gift",
"reward",
"refund",
"update",
"wallet",
"upi",
"kyc",
"confirm",
"payment",
"amazon",
"netflix",
"paypal",
"account",
"free",
"win",
"claim",
"prize"
];
const trustedDomains = [
  "google.com",
  "github.com",
  "microsoft.com",
  "apple.com",
  "openai.com",
  "chatgpt.com",
  "wikipedia.org",
  "youtube.com",
  "amazon.in",
  "amazon.com"
];
let hostname = "";
try {
  hostname = new URL(url).hostname;

  trustedDomains.forEach((domain) => {
    if (
      hostname === domain ||
      hostname.endsWith("." + domain)
    ) {
      score -= 25;
      reasons.push("Trusted domain detected.");
    }
    
  });


} catch {
  score += 50;
  reasons.push("Invalid URL format.");
}

const suspiciousBrandNames = [
  "google",
  "paypal",
  "amazon",
  "microsoft",
  "apple",
  "bank",
  "upi"
];

suspiciousBrandNames.forEach((brand) => {
  if (
    hostname.includes(brand) &&
    hostname !== `${brand}.com` &&
    !hostname.endsWith(`.${brand}.com`)
  ) {
    score += 30;
    reasons.push(`Possible brand impersonation: "${brand}"`);
  }
});


    keywords.forEach((word) => {
      if (url.toLowerCase().includes(word)) {
        score += 10;
        reasons.push(`Contains suspicious keyword "${word}"`);
      }
    });

   const lowerUrl = url.toLowerCase();

if (
  lowerUrl.includes("bit.ly") ||
  lowerUrl.includes("tinyurl") ||
  lowerUrl.includes("t.co")
) {
  score += 25;
  reasons.push("Shortened URL detected.");
}
    
    if(score<0) score=0;
if(score>100) score=100;


    let status = "Safe";

    if (score >= 60) status = "Dangerous";
    else if (score >= 30) status = "Suspicious";

if(reasons.length===0){
    reasons.push("No suspicious indicators found.");
}
    setResult({
      score,
      status,
      reasons
    });
  };

 return (
  <div className="min-h-screen bg-slate-50 py-12 px-6">

    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8">

        <h1 className="text-4xl font-extrabold text-white">
          🔗 URL Detector
        </h1>

        <p className="text-teal-100 mt-2 text-lg">
          Analyze suspicious links and detect phishing websites instantly.
        </p>

      </div>

      <div className="p-8">

        <input
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 outline-none text-lg transition"
        />

        <button
          onClick={analyzeURL}
          className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition duration-300"
        >
          Analyze URL
        </button>

        {result && (

          <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-slate-800">
                {result.status}
              </h2>

              <span className={`px-4 py-2 rounded-full text-white font-semibold ${
                result.status==="Dangerous"
                ? "bg-red-500"
                : result.status==="Suspicious"
                ? "bg-yellow-500"
                : "bg-green-500"
              }`}>

                {result.score}% Risk

              </span>

            </div>

            <div className="mt-5">

              <div className="w-full bg-slate-200 rounded-full h-4">

                <div
                  className={`h-4 rounded-full ${
                    result.status==="Dangerous"
                    ? "bg-red-500"
                    : result.status==="Suspicious"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                  }`}
                  style={{width:`${result.score}%`}}
                />

              </div>

            </div>

            <div className="mt-6">

              <h3 className="font-bold text-lg text-slate-700 mb-3">
                Reasons
              </h3>

              <ul className="space-y-3">

                {result.reasons.map((r,index)=>(
                  <li
                    key={index}
                    className="bg-white border border-slate-200 rounded-lg p-3"
                  >
                    ⚠️ {r}
                  </li>
                ))}

              </ul>

            </div>

          </div>

        )}

      </div>

    </div>

  </div>
);
}