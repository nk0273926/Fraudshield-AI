import { useState } from 'react';
import { Lightbulb, AlertTriangle, Shield, Phone, Lock, Eye, HeartPulse, ChevronDown, ChevronUp, CheckCircle, ExternalLink } from 'lucide-react';

interface Tip {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium';
}

const safetyTips: Tip[] = [
  {
    icon: Lock,
    title: 'Never Share OTP',
    description: 'Your OTP (One-Time Password) is for YOUR use only. Banks, government agencies, and legitimate companies will NEVER ask for your OTP over phone, SMS, or email. Sharing your OTP gives fraudsters access to your accounts.',
    importance: 'critical',
  },
  {
    icon: Shield,
    title: 'Government Agencies Don\'t Call for Money',
    description: 'Real government agencies (CBI, Police, Courts, Income Tax) NEVER call individuals demanding payment, fines, or "clearance fees". They communicate through official letters and notices, not threatening phone calls.',
    importance: 'critical',
  },
  {
    icon: Eye,
    title: 'Verify From Official Sources',
    description: 'Always verify claims by visiting official websites or calling official helpline numbers (not the number provided by the caller). Type URLs yourself instead of clicking links in messages.',
    importance: 'high',
  },
  {
    icon: AlertTriangle,
    title: 'Don\'t Click Suspicious Links',
    description: 'Links in unexpected SMS, WhatsApp, or email messages often lead to fake websites designed to steal your credentials. Look for misspelled URLs, unusual domains, and shortened links.',
    importance: 'high',
  },
  {
    icon: HeartPulse,
    title: 'Don\'t Panic Under Pressure',
    description: 'Scammers create urgency and fear to make you act without thinking. Phrases like "immediate action," "within 2 hours," "account will be blocked" are red flags. Stop, breathe, and verify.',
    importance: 'high',
  },
  {
    icon: Phone,
    title: 'Hang Up and Call Back Officially',
    description: 'If someone claims to be from your bank or a government agency, politely hang up and call the official number from their website or back of your card. Fraudsters can stay on the line, so use a different phone if possible.',
    importance: 'medium',
  },
];

const warningSigns = [
  { sign: 'Calls claiming your Aadhaar is linked to criminal activities', type: 'digital-arrest' },
  { sign: 'Messages demanding KYC update with suspicious links', type: 'kyc' },
  { sign: 'Unsolicited job offers via WhatsApp/Telegram with high pay', type: 'job-scam' },
  { sign: 'Refund or prize notifications asking for OTP/payment', type: 'refund' },
  { sign: 'Customs/courier fee demands for parcels you didn\'t order', type: 'courier' },
  { sign: 'Calls threatening legal action unless you pay immediately', type: 'digital-arrest' },
  { sign: 'Anyone asking for Aadhaar, PAN, or bank details over call', type: 'general' },
  { sign: 'Requests to install apps via links (AnyDesk, TeamViewer)', type: 'remote-access' },
];

const emergencyContacts = [
  { name: 'Cybercrime Portal', number: 'cybercrime.gov.in', action: 'Report all online frauds' },
  { name: 'Cyber Crime Helpline', number: '155260', action: 'Toll-free, 24x7' },
  { name: 'National Helpline', number: '112', action: 'Emergency services' },
  { name: 'Bank Customer Care', number: 'Check back of your card', action: 'Call officially for bank issues' },
];

const faqItems = [
  {
    question: 'What is a "Digital Arrest" scam?',
    answer: 'Digital Arrest scams involve fraudsters posing as police, CBI, or other government officials calling victims to claim their identity has been linked to criminal activities. They demand the victim join a video call, share documents, or transfer money to "clear" their name. Real government agencies never operate this way.',
  },
  {
    question: 'Can banks really block my account for incomplete KYC?',
    answer: 'Banks may update KYC requirements, but they always communicate through official channels - your registered email, SMS from official bank numbers, or in-person at branches. They never ask you to click random links or share OTP for KYC updates.',
  },
  {
    question: 'What should I do if I already shared sensitive information?',
    answer: 'Act immediately: 1) Call your bank to freeze/deactivate affected cards, 2) Change passwords for all affected accounts, 3) Report the fraud on cybercrime.gov.in, 4) Lock your Aadhaar via UIDAI if shared, 5) Monitor accounts for unauthorized transactions.',
  },
  {
    question: 'How do I know if a gov website is real?',
    answer: 'Official government websites end with ".gov.in" or ".nic.in". Fake sites use variations like "govin.com" or "gov.co.in". Always type the URL yourself and look for the padlock icon in the browser address bar.',
  },
];

export default function SafetyTips() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-amber-200 bg-amber-50';
      default: return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-amber-500 text-white';
      default: return 'bg-yellow-500 text-slate-900';
    }
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-xl mb-6">
            <Lightbulb className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Safety Tips & Awareness</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Learn how to recognize and protect yourself from common fraud attempts. These essential tips can help keep you and your family safe.
          </p>
        </div>

        {/* Emergency Contact Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-slate-900">If You've Been Targeted</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-slate-900 font-medium">{contact.name}</p>
                <p className="text-teal-600 font-bold text-lg">{contact.number}</p>
                <p className="text-slate-500 text-sm">{contact.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Rules */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-teal-600" />
            Essential Safety Rules
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className={`card ${getImportanceColor(tip.importance)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{tip.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getImportanceBadge(tip.importance)}`}>
                        {tip.importance === 'critical' ? 'CRITICAL' : tip.importance === 'high' ? 'IMPORTANT' : 'REMEMBER'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning Signs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Red Flags to Watch Out For
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {warningSigns.map((warning, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 ${index !== warningSigns.length - 1 ? 'border-b border-slate-200' : ''}`}
              >
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></div>
                <span className="text-slate-700">{warning.sign}</span>
              </div>
            ))}
          </div>
        </section>

        {/* What To Do Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            What To Do If Targeted
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Stop', desc: 'Don\'t respond, pay, or share information' },
              { title: 'Block', desc: 'Block the sender/caller immediately' },
              { title: 'Report', desc: 'File complaint on cybercrime.gov.in' },
              { title: 'Alert', desc: 'Inform family and friends about the scam' },
            ].map((action, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
                <p className="text-slate-500 text-sm">{action.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-900 font-medium pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-teal-700 rounded-2xl p-8 text-center">
          <Shield className="w-12 h-12 text-teal-100 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Stay Vigilant, Stay Safe</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Fraud attempts are getting more sophisticated. When in doubt, use our Scam Analyzer to check suspicious messages or talk to our Fraud Assistant for guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-teal-700 font-semibold py-3 px-6 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Report on Cybercrime Portal
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
