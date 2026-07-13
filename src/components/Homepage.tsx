import { MessageSquareWarning, Bot, Lightbulb, Shield, ArrowRight, AlertTriangle, Lock, Eye, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Page = 'home' | 'analyzer' | 'chatbot' | 'tips';

interface HomepageProps {
  onNavigate: (page: Page) => void;
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);

    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

export default function Homepage({ onNavigate }: HomepageProps) {
  const features = [

    {
      icon: MessageSquareWarning,
      title: 'Scam Analyzer',
      description: 'Paste any suspicious message and instantly identify if it\'s a scam, the type of fraud, and what red flags to look for.',
      action: 'Analyze a Message',
      page: 'analyzer' as Page,
    },
    {
      icon: Bot,
      title: 'Fraud Assistant Chatbot',
      description: 'Talk to our AI assistant for personalized guidance on suspicious calls, messages, or situations you encounter.',
      action: 'Talk to Assistant',
      page: 'chatbot' as Page,
    },
    {
      icon: Lightbulb,
      title: 'Safety Tips',
      description: 'Learn how to protect yourself with essential cyber safety tips and recognize common fraud patterns.',
      action: 'View Safety Tips',
      page: 'tips' as Page,
    },
    {
  icon: Shield,
  title: 'URL Detector',
  description:
    'Analyze suspicious website links and detect phishing URLs instantly using AI.',
  action: 'Analyze URL',
  page: 'url' as Page,
},
  ];

  const scamTypes = [
    { icon: Phone, title: 'Digital Arrest Scams', desc: 'Fake police/CBI calls demanding money' },
    { icon: Lock, title: 'KYC Verification Scams', desc: 'Fake bank requests for OTP/details' },
    { icon: AlertTriangle, title: 'Refund Scams', desc: 'Fake refund offers asking for payment' },
    { icon: Eye, title: 'Courier/Customs Scams', desc: 'Fake parcel release fees' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-teal-600" />
              <span className="text-teal-700 text-sm font-medium">AI-Powered Public Safety Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Detect Scams. Stay Safe.
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              FraudShield AI helps you identify suspicious messages, understand fraud patterns, and get instant guidance to protect yourself from digital scams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button onClick={() => onNavigate('analyzer')} className="btn-primary flex items-center gap-2 text-lg">
                <MessageSquareWarning className="w-5 h-5" />
                Analyze a Message
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => onNavigate('chatbot')} className="btn-secondary flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5" />
                Talk to Fraud Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Fraud Detection Tools
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Three powerful modules designed to keep you safe from digital fraud
            </p>
          </div>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group cursor-pointer"
                onClick={() => onNavigate(feature.page)}
              >
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-teal-600" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <button className="flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all duration-300">
                  {feature.action}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Common Scam Categories We Detect
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our AI is trained to identify multiple types of fraud attempts
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {scamTypes.map((scam, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-slate-100 transition-colors duration-200"
              >
                <scam.icon className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{scam.title}</h3>
                <p className="text-slate-500 text-sm">{scam.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-teal-100 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Protected from Digital Fraud
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Don't let scammers fool you. Use FraudShield AI to analyze suspicious messages and get instant guidance on protecting yourself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('analyzer')} className="bg-white text-teal-700 font-semibold py-3 px-6 rounded-lg hover:bg-teal-50 transition-colors">
              Start Analyzing Messages
            </button>
            <button onClick={() => onNavigate('tips')} className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-800 transition-colors">
              Learn Safety Tips
            </button>
          </div>
        </div>
      </section>

      {/* Trust Statistics Section */}
      <TrustStatistics />
    </div>
  );
}

function TrustStatistics() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const stats = [
    { value: '25,000+', label: 'Messages Analyzed' },
    { value: '98%', label: 'Detection Accuracy' },
    { value: '10,000+', label: 'Users Protected' },
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-b from-sky-50 via-white to-white"
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Helping people identify scams and stay protected every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-8 overflow-hidden"

              style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))' }}
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-cyan-500/10" />

              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6"
                >
                  <span className="text-emerald-600 text-2xl font-bold">✔️</span>
                </div>

                <p className="text-slate-900 font-extrabold text-4xl mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  {stat.label}
                </p>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-all duration-300"
              />

              <div
                className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-sky-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* hover animation handled by card container */}

            </div>

          ))}
        </div>
      </div>
    </section>
  );
}

