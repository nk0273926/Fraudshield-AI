import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Shield } from 'lucide-react';


interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
}

const quickSuggestions = [
  'Digital Arrest Scam',
  'KYC Scam',
  'Refund Scam',
  'Fake Job Scam',
  'Courier Scam',
];

const scamResponses: Record<string, string[]> = {
  'digital arrest scam': [
    `This is a Digital Arrest Scam - Do Not Panic!

Why it's suspicious:
- No legitimate government agency (CBI, Police, Courts) calls individuals demanding payments over the phone
- Real agencies never conduct investigations via video calls
- They never ask for Aadhaar, bank details, or money under threat
- The caller creates extreme urgency and fear to prevent you from thinking clearly

Immediate Steps:
1. Do NOT join the video call or share any details
2. Hang up immediately - do not engage
3. Note down the number and report it
4. If you've already shared information, call your bank's helpline immediately
5. Report on cybercrime.gov.in or call 155260

Remember: Government agencies send official notices through proper channels, not threatening phone calls.`
  ],
  'kyc scam': [
    `This is a Fake KYC Verification Scam!

Why it's suspicious:
- Banks never ask customers to update KYC via WhatsApp or suspicious links
- Legitimate KYC updates happen at bank branches or official apps
- Sharing OTP, Aadhaar, or PAN on unknown links can lead to identity theft
- The message creates urgency by threatening account closure

What to do:
1. Do NOT click any links in the message
2. Never share OTP with anyone - banks never ask for OTP
3. Visit your bank's official website (type the URL yourself) or branch
4. Call your bank's official customer care number (not any number from the message)
5. Block the sender and report as spam

Report to: cybercrime.gov.in or call 155260`
  ],
  'refund scam': [
    `This is a Refund/Prize Scam!

Why it's suspicious:
- Unsolicited "rewards" or refunds are almost always scams
- Legitimate companies don't ask for OTP or payment to give refunds
- UPI details + OTP = instant money theft
- The offer is "too good to be true" and time-limited to rush you

What to do:
1. Never share UPI ID, OTP, or bank details for "rewards"
2. Check your actual order history on the official shopping app/site
3. Real refunds are processed to the original payment method automatically
4. Do not click any links - they're likely phishing attempts
5. Block and report the sender

Remember: If you haven't ordered anything, you can't have a refund coming.`
  ],
  'fake job scam': [
    `This is a Fake Job/Work-from-Home Scam!

Why it's suspicious:
- Real companies don't recruit via random WhatsApp/Telegram messages
- "Earn Rs.30,000/month from home" with minimal work is unrealistic
- Requests for registration fees, training fees, or document uploads
- No verification process or official company email domain

What to do:
1. Do not pay any registration or training fees
2. Legitimate jobs have proper application processes on official sites
3. Research the company - check if the website and contact are genuine
4. Never share Aadhaar, PAN, or bank details without verification
5. Report the posting on the platform it appeared

Red Flags: @gmail.com company emails, Telegram contact, upfront payment requests`
  ],
  'courier scam': [
    `This is a Courier/Customs Scam!

Why it's suspicious:
- Customs duties are collected officially, not via random links
- You would know if you're expecting an international parcel
- The message threatens parcel destruction to create urgency
- Links lead to fake payment pages designed to steal card details

What to do:
1. Stop - think if you're actually expecting a parcel
2. Contact the courier company directly from their OFFICIAL website
3. Never pay via links in messages - use official portals
4. If you haven't ordered internationally, this is definitely a scam
5. Report on cybercrime.gov.in

Genuine Customs: Indian Customs sends notices via post, not threatening SMS.`
  ],
  'money laundering': [
    `This is a Digital Arrest/Fake Investigation Scam!

Why it's suspicious:
- No real government agency calls about money laundering and asks for payment
- Aadhaar being "linked to crimes" is a common scare tactic
- Video call investigations are NOT real - CBI/Police don't operate this way
- They create fear and urgency to prevent you from thinking or verifying

What to do:
1. Do NOT join any video call
2. Do NOT share Aadhaar, PAN, bank statements, or any documents
3. Disconnect the call - do not engage
4. Government agencies send legal notices through proper channels (post/in-person)
5. Report immediately on cybercrime.gov.in or call 155260

Remember: Real investigations don't happen over phone calls.`
  ],
  'kyc verification': [
    `This is a Fake KYC Verification Scam!

Why it's suspicious:
- Banks never ask for KYC updates via phone calls or unverified links
- OTP should NEVER be shared - it's for YOUR transactions only
- "Account will be blocked" is a fear tactic to rush you
- Legitimate KYC is done at branches, ATMs, or official bank apps

What to do:
1. Do NOT share OTP under any circumstances
2. Hang up and call your bank's official customer care number
3. Visit the nearest branch if you're unsure
4. Never click links from SMS/WhatsApp claiming to be from banks
5. Report the number and message on cybercrime.gov.in

Rule: OTP = YOUR secret. Share it with NO ONE.`
  ],
  'cbi': [
    `This is a Digital Arrest Scam - CBI Impersonation!

Why it's suspicious:
- Real CBI officers DO NOT call individuals threatening arrest
- CBI doesn't conduct investigations via video calls or WhatsApp
- No government agency demands money to "clear your name"
- They're impersonating authority to create fear

What to do:
1. Disconnect immediately - do NOT engage or argue
2. Do NOT share Aadhaar, bank details, or join video calls
3. Real legal notices come via registered post
4. If genuinely concerned, visit your local police station to verify
5. Report on cybercrime.gov.in or call 155260

Facts: Government agencies follow legal procedures, not threatening phone calls demanding money.`
  ],
  'aadhaar': [
    `Alert: This is likely a Scam Involving Aadhaar Misuse Claims!

Why it's suspicious:
- No legitimate authority calls about "Aadhaar misuse" and demands action
- Creating fear about identity document misuse is a common tactic
- They want you to panic and share MORE personal information
- Real Aadhaar issues are communicated through UIDAI officially

What to do:
1. Do NOT share more information to "verify" or "clear" your record
2. If concerned, check your Aadhaar status on uidai.gov.in (official site)
3. Lock your Aadhaar via UIDAI if you're worried about misuse
4. Real authorities don't demand payments over phone
5. Report the call on cybercrime.gov.in

Remember: Government agencies don't cold-call citizens about Aadhaar misuse.`
  ],
};

const defaultResponses = [
  `I understand you may have encountered a suspicious situation. Let me help you analyze this.

General Safety Rules:
- Never share OTP, Aadhaar, PAN, or bank details with unknown callers
- Don't click suspicious links from unknown sources
- Government agencies don't demand money over phone calls
- When in doubt, verify through official channels
- "Urgent" and "immediate" are red flags for scams

Could you tell me more about:
- What exactly happened or what message you received?
- Were you asked to share any information or make a payment?
- Were there threats about legal action or account blocking?

Please describe your situation in detail, and I'll help you understand if it's a scam and what steps to take.`,
];

const greetingMessage = `Hello! I'm your FraudShield AI Assistant. I'm here to help you identify potential fraud and guide you on staying safe.

You can ask me about:
- Suspicious messages or calls you received
- Whether something sounds like a scam
- What to do if you've been targeted
- How to report fraud

Quick topics to get started:
- Digital Arrest Scams
- KYC/Account Block Scams
- Refund/Prize Scams
- Fake Job Offers
- Courier/Customs Scams

How can I help you today?`;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'bot', content: greetingMessage }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, responses] of Object.entries(scamResponses)) {
      if (lowerMessage.includes(key)) {
        return responses[0];
      }
    }

    if (lowerMessage.includes('call') && (lowerMessage.includes('police') || lowerMessage.includes('cbi') || lowerMessage.includes('arrest'))) {
      return scamResponses['digital arrest scam'][0];
    }
    if (lowerMessage.includes('otp') || lowerMessage.includes('aadhaar')) {
      return scamResponses['aadhaar'][0];
    }
    if (lowerMessage.includes('kyc') || lowerMessage.includes('account blocked') || lowerMessage.includes('bank')) {
      return scamResponses['kyc scam'][0];
    }
    if (lowerMessage.includes('job') || lowerMessage.includes('work from home') || lowerMessage.includes('part-time')) {
      return scamResponses['fake job scam'][0];
    }
    if (lowerMessage.includes('refund') || lowerMessage.includes('reward') || lowerMessage.includes('prize')) {
      return scamResponses['refund scam'][0];
    }
    if (lowerMessage.includes('courier') || lowerMessage.includes('parcel') || lowerMessage.includes('customs')) {
      return scamResponses['courier scam'][0];
    }

    return defaultResponses[0];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: userMessage
    }]);

    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = findBestResponse(userMessage);

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'bot',
      content: response
    }]);

    setIsTyping(false);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    const userInput = `Tell me about ${suggestion}`;
    setInput(userInput);
    handleSend();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-xl mb-4">
            <Bot className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Fraud Assistant</h1>
          <p className="text-slate-600">Ask anything about suspicious messages, calls, or online fraud</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ maxHeight: '60vh' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-teal-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-base mt-2 first:mt-0">{line.slice(2, -2)}</p>;
                      }
                      if (line.startsWith('- ')) {
                        return <p key={i} className="ml-2">- {line.slice(2)}</p>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <p key={i} className="ml-2">{line}</p>;
                      }
                      return <p key={i}>{line || '\n'}</p>;
                    })}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-teal-600" />
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Quick topics:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="text-xs px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-200 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe the suspicious message or call you received..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <Shield className="w-8 h-8 text-teal-600 flex-shrink-0" />
          <div>
            <p className="text-slate-900 font-medium">Get personalized fraud guidance</p>
            <p className="text-slate-500 text-sm">Describe the suspicious message, call, or situation you encountered. Our AI will analyze and provide safety recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
