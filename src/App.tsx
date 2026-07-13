import { useState } from 'react';
import { Shield, MessageSquareWarning, Bot, Lightbulb, Menu, X, ArrowRight } from 'lucide-react';
import Homepage from './components/Homepage';
import ScamAnalyzer from './components/ScamAnalyzer';
import Chatbot from './components/Chatbot';
import SafetyTips from './components/SafetyTips';
import CyberSecurityCallout from './components/CyberSecurityCallout';
import EmergencyLocationCard from "./components/EmergencyLocationCard";
import UrlDetector from "./components/UrlDetector";

type Page =
  | 'home'
  | 'analyzer'
  | 'chatbot'
  | 'tips'
  | 'url';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: Shield },
    { id: 'analyzer' as Page, label: 'Scam Analyzer', icon: MessageSquareWarning },
    { id: 'chatbot' as Page, label: 'Fraud Assistant', icon: Bot },
    {id: 'url' as Page,label: 'URL Detector',icon: Shield,},
    { id: 'tips' as Page, label: 'Safety Tips', icon: Lightbulb },

  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={setCurrentPage} />;
      case 'analyzer':
        return <ScamAnalyzer />;
      case 'chatbot':
        return <Chatbot />;
      case 'tips':
        return <SafetyTips />;
        case 'url':
  return <UrlDetector />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Left: Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => setCurrentPage('home')}
            >
              <Shield className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">FraudShield AI</span>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right: Analyze button (Desktop) */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-end">
              <button
                onClick={() => setCurrentPage('analyzer')}
                className="btn-primary flex items-center gap-2"
              >
                Analyze a Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-auto p-2 text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur border-t border-slate-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

            {/* Logo Section */}
            <div className="w-full lg:w-1/4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-6 h-6 text-teal-400" />
                <span className="font-semibold text-white text-lg">
                  FraudShield AI
                </span>
              </div>

              <p className="text-slate-400 text-sm leading-6">
                AI-powered public safety platform helping users detect scams,
                analyze suspicious messages, and stay protected from digital fraud.
              </p>
            </div>

            {/* Cyber Security Callout */}
            <div className="w-full lg:w-[340px] flex justify-center">
              <CyberSecurityCallout />
            </div>

            {/* Emergency Location Card */}
            <div className="w-full lg:w-[340px] flex justify-center lg:justify-start lg:-ml-6">
              <EmergencyLocationCard />
            </div>

          </div>
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center">
              AI-powered digital public safety assistant. Detect scams. Stay safe.
            </p>
            <p className="text-slate-500 text-sm">
              Hackathon Prototype 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
