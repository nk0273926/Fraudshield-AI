import { useState } from 'react';
import { MessageSquareWarning, AlertTriangle, Shield, ArrowRight, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { Upload, QrCode } from "lucide-react";
import QrScanner from "qr-scanner";
interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  confidence: number;
  fraudType: string;
  redFlags: string[];
  suggestedActions: string[];
  aiExplanation: string;
}

const sampleMessages = [
  {
    label: 'Digital Arrest Scam',
    message: 'This is CBI officer Rajesh Kumar. Your Aadhaar has been linked to money laundering activities. Join the video call immediately with your Aadhaar card and bank details, or legal action will be taken within 2 hours. Do not disconnect.',
  },
  {
    label: 'KYC Scam',
    message: 'Dear Customer, your bank account will be blocked in 24 hours due to incomplete KYC. Click here to update your KYC immediately: bank-kyc-update.xyz. Enter your Aadhaar, PAN, and OTP to verify. Ignore this message at your own risk.',
  },
  {
    label: 'Refund Scam',
    message: 'Congratulations! You have been selected for a refund of Rs. 5,000 from your recent online order. To claim your refund, share your UPI ID and OTP. Offer valid for 30 minutes only!',
  },
  {
    label: 'Courier/Customs Scam',
    message: 'Your international parcel is held at customs. Clear your shipment by paying Rs. 2,500 customs duty immediately. Click the link to pay: customsclearance.xyz. Failure to pay will result in parcel destruction.',
  },
];

const fraudPatterns = {
  digitalArrest: {
    keywords: ['cbi', 'police', 'arrest', 'legal action', 'money laundering', 'video call', 'investigation', 'officer', 'court', 'warrant'],
    redFlags: [
      'Claims to be from government agency (CBI/Police/Court)',
      'Threatens legal action or arrest',
      'Demands immediate video call',
      'Asks for Aadhaar or identity documents',
      'Creates extreme urgency and fear',
    ],
    actions: [
      'Do not engage with the caller',
      'Never share Aadhaar, PAN, or bank details over call',
      'Government agencies never conduct investigations via video call',
      'Verify by calling the official helpline',
      'Report on cybercrime.gov.in',
    ],
  },
  kycScam: {
    keywords: ['kyc', 'account blocked', 'bank', 'aadhaar', 'pan', 'otp', 'verify', 'update', 'suspended'],
    redFlags: [
      'Claims your account will be blocked',
      'Asks to click a suspicious link',
      'Demands Aadhaar, PAN, or OTP',
      'Creates urgency with time limits',
      'URL is not the official bank website',
    ],
    actions: [
      'Do not click any links in the message',
      'Never share OTP with anyone',
      'Visit your bank\'s official website or branch',
      'Call the bank\'s official customer care number',
      'Block the sender and report as spam',
    ],
  },
  refundScam: {
    keywords: ['refund', 'win', 'reward', 'otp', 'upi', 'selected', 'claim', 'offer', 'prize'],
    redFlags: [
      'Unsolicited refund or prize notification',
      'Asks for UPI or bank details',
      'Demands OTP for verification',
      'Creates fake urgency with time limits',
      'Too good to be true offers',
    ],
    actions: [
      'Never share UPI ID or OTP for receiving refunds',
      'Verify the order directly on the shopping platform',
      'Legitimate refunds do not require OTP or payment',
      'Do not click any links in the message',
      'Report as spam and block the sender',
    ],
  },
  courierScam: {
    keywords: ['customs', 'courier', 'parcel', 'shipment', 'clearance', 'duty', 'fee', 'delivery', 'international'],
    redFlags: [
      'Claims customs duty is pending',
      'Asks to pay via suspicious link',
      'Threatens parcel destruction',
      'Creates urgency for immediate payment',
      'Asks for personal information',
    ],
    actions: [
      'Do not make any payment without verifying',
      'Contact the courier company\'s official number',
      'Customs duties are collected officially, not via random links',
      'Check if you\'re actually expecting an international parcel',
      'Report on cybercrime.gov.in',
    ],
  },
  jobScam: {
    keywords: ['job', 'work from home', 'part-time', 'data entry', 'salary', 'apply', 'hiring', 'position', 'telegram', 'whatsapp'],
    redFlags: [
      'Unsolicited job offer via WhatsApp/Telegram',
      'Work from home with high salary for simple tasks',
      'Asks to pay registration or training fee',
      'Requires personal details before interview',
      'No official company website or email domain',
    ],
    actions: [
      'Research the company on official job portals',
      'Legitimate jobs do not ask for upfront payment',
      'Never share personal details without verifying',
      'Check company reviews and website authenticity',
      'Report fake job postings on the platform',
    ],
  },
};

const infoWords = ['otp', 'password', 'pin', 'cvv', 'aadhaar', 'pan', 'bank account', 'card', 'account number'];

const analyzeMessage = (message: string): AnalysisResult => {
  const lowerMessage = message.toLowerCase();

  let detectedType = 'Unknown Suspicious Message';

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

  let riskScore = 0;

  const matchedFlags: string[] = [];
  const explanationParts: string[] = [];

  const urgencyWords = ['immediately', 'urgent', 'within', 'hours', 'minutes', 'now', 'quickly', 'asap', 'today'];
  const hasUrgency = urgencyWords.some(word => lowerMessage.includes(word));
  if (hasUrgency) {
    riskScore += 20;
    explanationParts.push("creates urgency to pressure the victim");
  }
  const threatWords = ['arrest', 'legal action', 'blocked', 'suspended', 'terminate', 'destroy', 'consequences'];
  const hasThreats = threatWords.some(word => lowerMessage.includes(word));
  if (hasThreats) {
    riskScore += 25;
    explanationParts.push("contains threatening language");
  }
  // Dynamic keyword scoring
  const keywordScores: Record<string, number> = {
    otp: 20,
    password: 20,
    pin: 20,
    cvv: 25,
    aadhaar: 15,
    pan: 15,
    bank: 10,
    account: 10,
    upi: 10,
    kyc: 15,
    verify: 10,
    update: 10,
    login: 15,
    reward: 10,
    refund: 15,
    prize: 15,
    lottery: 20,
    gift: 10,
    arrest: 25,
    police: 20,
    cbi: 25,
    legal: 15,
    video: 15,
    whatsapp: 5,
    telegram: 10,
    remote: 20,
    anydesk: 30,
    teamviewer: 30,
    apk: 30,
    install: 15,
    click: 15,
    link: 15,
    payment: 15,
    transaction: 15,
    wallet: 10,
    crypto: 15,
    investment: 15,
    loan: 10
  };
  const asksSensitiveInfo = infoWords.some(word => lowerMessage.includes(word));
  if (asksSensitiveInfo) {
    riskScore += 25;
    explanationParts.push("asks for sensitive information");
  }
  const hasSuspiciousLink = lowerMessage.includes('click') || lowerMessage.includes('http') || lowerMessage.includes('.xyz') || lowerMessage.includes('link');
  // Increase score according to every keyword found
  Object.entries(keywordScores).forEach(([keyword, value]) => {
    if (lowerMessage.includes(keyword)) {
      riskScore += value;

      matchedFlags.push(
        `Suspicious keyword detected: "${keyword}"`
      );
      explanationParts.push(`contains "${keyword}"`);
    }
  });
  if (hasSuspiciousLink) {
    riskScore += 20;
    explanationParts.push("contains suspicious links");
  }
  let maxMatches = 0;
  const patterns = Object.entries(fraudPatterns);

  for (const [type, pattern] of patterns) {
    const matches = pattern.keywords.filter(kw => lowerMessage.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      if (type === 'digitalArrest') detectedType = 'Digital Arrest Scam';
      else if (type === 'kycScam') detectedType = 'Fake KYC / Bank Verification Scam';
      else if (type === 'refundScam') detectedType = 'Refund / Prize Scam';
      else if (type === 'courierScam') detectedType = 'Courier / Customs Scam';
      else if (type === 'jobScam') detectedType = 'Fake Job / Work-from-Home Scam';

      pattern.redFlags.forEach(flag => {
        if (!matchedFlags.includes(flag)) matchedFlags.push(flag);
      });
    }
  }

  if (maxMatches === 0 && (hasUrgency || hasThreats || asksSensitiveInfo || hasSuspiciousLink)) {
    detectedType = 'Unknown Suspicious Message';
    if (hasUrgency) matchedFlags.push('Creates artificial urgency');
    if (hasThreats) matchedFlags.push('Uses fear-based language or threats');
    if (asksSensitiveInfo) matchedFlags.push('Requests personal or financial information');
    if (hasSuspiciousLink) matchedFlags.push('Contains suspicious links');
  }

  if (matchedFlags.length === 0 && message.length > 20) {
    matchedFlags.push('Message appears suspicious. Review carefully before taking any action.');
  }
  // Risk Score Limit
  if (riskScore > 100) riskScore = 100;

  // Decide Risk Level
  if (riskScore >= 75) {
    riskLevel = "High";
  }
  else if (riskScore >= 40) {
    riskLevel = "Medium";
  }
  else {
    riskLevel = "Low";
  }

  // AI Confidence
  const confidence = Math.min(riskScore + 10, 99);
  let suggestedActions: string[] = [];
  let aiExplanation = "";
  if (detectedType === 'Digital Arrest Scam') {
    suggestedActions = fraudPatterns.digitalArrest.actions;
  } else if (detectedType === 'Fake KYC / Bank Verification Scam') {
    suggestedActions = fraudPatterns.kycScam.actions;
  } else if (detectedType === 'Refund / Prize Scam') {
    suggestedActions = fraudPatterns.refundScam.actions;
  } else if (detectedType === 'Courier / Customs Scam') {
    suggestedActions = fraudPatterns.courierScam.actions;
  } else if (detectedType === 'Fake Job / Work-from-Home Scam') {
    suggestedActions = fraudPatterns.jobScam.actions;
  } else {
    suggestedActions = [
      'Do not click any links in the message',
      'Do not share personal or financial information',
      'Verify the claim through official channels',
      'When in doubt, do not respond',
      'Report suspicious activity on cybercrime.gov.in',
    ];
  }
  const uniqueReasons = [...new Set(explanationParts)];

  if (uniqueReasons.length > 0) {
    aiExplanation =
      `This message is classified as ${riskLevel} Risk because it ` +
      uniqueReasons.join(", ") +
      ". Always verify through official sources before taking any action.";
  }
  else {
    aiExplanation =
      "No major scam indicators were detected.";
  }

  return {
    riskLevel,
    riskScore,
    confidence,
    fraudType: detectedType,
    redFlags: matchedFlags.slice(0, 5),
    suggestedActions,
    aiExplanation,
  };
};

export default function ScamAnalyzer() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [qrResult, setQrResult] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [qrType, setQrType] = useState("");

  const checkVirusTotal = async (url: string) => {
    try {
      const apiKey = import.meta.env.VITE_VIRUSTOTAL_API_KEY;

      const encodedUrl = btoa(url).replace(/=/g, "");

      const response = await fetch(
        `https://www.virustotal.com/api/v3/urls/${encodedUrl}`,
        {
          headers: {
            "x-apikey": apiKey,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysisResult = analyzeMessage(message);
    if (message.startsWith("upi://")) {

      analysisResult.riskLevel = "Medium";

      analysisResult.fraudType = "UPI Payment QR";

      analysisResult.redFlags.unshift(
        "QR requests direct UPI payment."
      );

      if (
        message.includes("am=")
      ) {

        analysisResult.redFlags.unshift(
          "Payment amount is pre-filled."
        );

        analysisResult.riskLevel = "High";
      }

    }
    const isURL = /^https?:\/\//i.test(message);

    if (isURL) {
      const vt = await checkVirusTotal(message);

      if (vt) {
        const stats =
          vt.data.attributes.last_analysis_stats;

        if (
          stats.malicious > 0 ||
          stats.suspicious > 0
        ) {
          analysisResult.riskLevel = "High";

          analysisResult.fraudType =
            "Malicious Website";

          analysisResult.redFlags.unshift(
            `VirusTotal detected ${stats.malicious} security vendors reporting this URL as malicious.`
          );
        } else {
          analysisResult.redFlags.unshift(
            "VirusTotal did not detect known malware."
          );
        }
      }
    }
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleCopyReport = () => {
    if (!result) return;

    const report = `
FRAUDSHIELD AI - SCAM ANALYSIS REPORT
=====================================

Risk Level: ${result.riskLevel}
Fraud Type: ${result.fraudType}

RED FLAGS IDENTIFIED:
${result.redFlags.map((flag, i) => `${i + 1}. ${flag}`).join('\n')}

RECOMMENDED ACTIONS:
${result.suggestedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

---
Generated by FraudShield AI - Stay Safe from Digital Fraud
Report to cybercrime.gov.in if you have been targeted
    `.trim();

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQRUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setQrLoading(true);
    setQrError("");
    setQrResult("");

    setQrImage(file);
    setQrPreview(URL.createObjectURL(file));

    try {
      const result = await QrScanner.scanImage(file);
      setQrResult(result);
      setMessage(result);

      if (result.startsWith("http://") || result.startsWith("https://")) {
        setQrType("Website URL");
      }
      else if (result.startsWith("upi://")) {
        setQrType("UPI Payment QR");
      }
      else {
        setQrType("Text QR");
      }

    } catch {
      setQrError("No QR code detected in this image.");
    }

    setQrLoading(false);
  };
  const handleClear = () => {
    setMessage('');
    setResult(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-700 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-xl mb-6">
            <MessageSquareWarning className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Scam Message Analyzer</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Paste any suspicious message you received, and our AI will analyze it for potential fraud indicators, risk level, and recommended actions.
          </p>
        </div>

        {/* Sample Messages */}
        <div className="mb-8">
          <label className="text-sm text-slate-600 mb-3 block">Try with sample scam messages:</label>
          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((sample, index) => (
              <button
                key={index}
                onClick={() => setMessage(sample.message)}
                className="px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors duration-200"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="card mb-8">
          <label className="block text-slate-900 font-medium mb-3">Paste the suspicious message below:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste the message you received via SMS, WhatsApp, email, or any other platform..."
            className="input-field h-48 resize-none"
          />
          <div className="mt-6 border-2 border-dashed border-slate-300 rounded-xl p-6">

            <div className="flex items-center gap-2 mb-3">

              <QrCode className="w-6 h-6 text-teal-600" />

              <h3 className="font-semibold">
                Upload QR Code
              </h3>

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleQRUpload}
            />

            {qrLoading && (
              <p className="mt-3 text-teal-600">
                Reading QR Code...
              </p>
            )}

            {qrPreview && (
              <img
                src={qrPreview}
                className="w-44 mt-4 rounded-lg border"
              />
            )}

            {qrResult && (
              <>
                <p className="text-sm text-teal-700 font-semibold mb-2">
                  Detected Type : {qrType}
                </p>
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <b>Decoded QR:</b>
                  <br />
                  {qrResult}
                </div>
              </>
            )}

            {qrError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">
                {qrError}
              </div>
            )}

          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-slate-500 text-sm">{message.length} characters</span>
            <div className="flex gap-3">
              {message && (
                <button
                  onClick={handleClear}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={!message.trim() || isAnalyzing}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Analyze Message
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Risk Level Banner */}
            <div className={`rounded-xl border p-6 ${getRiskColor(result.riskLevel)}`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">
                      {result.riskLevel} Risk
                    </p>

                    <p className="mt-1 text-sm">
                      Risk Score : {result.riskScore}/100
                    </p>

                    <p className="text-sm">
                      AI Confidence : {result.confidence}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium opacity-80">Detected Fraud Type</p>
                  <p className="text-lg font-semibold">{result.fraudType}</p>
                </div>
              </div>
            </div>

            {/* Red Flags */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Red Flags Identified
              </h3>
              <ul className="space-y-3">
                {result.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">{index + 1}</span>
                    </div>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
<div className="card">
  <h3 className="text-lg font-semibold text-slate-900 mb-4">
    🤖 AI Explanation
  </h3>

  <p className="text-slate-700 leading-7">
    {result.aiExplanation}
  </p>
</div>
            {/* Suggested Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Suggested Next Actions
              </h3>
              <ul className="space-y-3">
                {result.suggestedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                    </div>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={handleCopyReport} className="btn-secondary flex items-center gap-2">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Report
                  </>
                )}
              </button>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Report on Cybercrime Portal
              </a>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-slate-900 font-semibold mb-2">How This Works</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our AI analyzes the message content for common fraud patterns, urgency indicators, suspicious requests, and threat language. The analysis is based on patterns from reported scam messages. Always verify claims through official channels and never share personal information with unknown contacts.
          </p>
        </div>
      </div>
    </div>
  );
}
function setQrImage(file: File) {
  throw new Error('Function not implemented.');
}

