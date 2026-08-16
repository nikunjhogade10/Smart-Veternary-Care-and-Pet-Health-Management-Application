import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import { apiFetch } from '../../lib/api';

export default function Peto() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: 'user' | 'peto'; isEmergency?: boolean }>
  >([
    {
      text: "Hi — I'm Peto. Describe what's going on with your pet and I'll help you think it through. (Always see a vet for emergencies.)",
      sender: 'peto',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await apiFetch('/peto/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, pet_name: 'your pet', pet_type: 'pet' }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, sender: 'peto', isEmergency: data.is_emergency }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please make sure the backend is running! 🔌", sender: 'peto' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white"><ArrowLeft className="w-6 h-6" /></button>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-2xl">🐾</span>
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg">Peto</h1>
          <p className="text-white/80 text-xs">AI Pet Health Assistant</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAFB]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'peto' && (
              <div className="w-8 h-8 bg-[#059669] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-sm">🐾</span>
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
              msg.sender === 'user' ? 'bg-[#059669] text-white rounded-br-sm' :
              msg.isEmergency ? 'bg-red-100 text-red-800 rounded-bl-sm border border-red-300' :
              'bg-white text-[#111827] rounded-bl-sm shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-[#059669] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-sm">🐾</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-500">Peto is thinking... 🐾</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 bg-white border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your pet's symptoms..."
            className="flex-1 px-4 py-3 bg-[#F3F4F6] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}
            className="w-12 h-12 bg-[#059669] rounded-full flex items-center justify-center hover:bg-[#047857] transition-colors disabled:opacity-50">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Peto is AI-powered. Always consult a vet for serious issues.</p>
      </div>
    </div>
  );
}
