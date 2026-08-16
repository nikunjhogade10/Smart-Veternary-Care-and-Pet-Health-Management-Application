import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Send, Paperclip, Camera } from 'lucide-react';
import { apiFetch } from '../../lib/api';

export default function ChatConsultation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vetName, setVetName] = useState('Dr. Pardesi');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'doctor',
      text: 'Hello! How can I help you today?',
      time: '10:00 AM',
    },
    {
      sender: 'user',
      text: 'Hi Doctor, my dog has been feeling lethargic for the past two days.',
      time: '10:02 AM',
    },
    {
      sender: 'doctor',
      text: 'I understand. Can you tell me more about his appetite and water intake?',
      time: '10:03 AM',
    },
    {
      sender: 'user',
      text: "He's eating less than usual, but drinking water normally.",
      time: '10:05 AM',
    },
    {
      sender: 'doctor',
      text: "I see. Has there been any change in his daily routine or environment recently?",
      time: '10:06 AM',
    },
  ]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const res = await apiFetch(`/vets/${id}`);
      const data = await res.json();
      if (!cancelled && res.ok && data.name) {
        setVetName(data.name);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  };

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-4 rounded-b-[30px] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-lg" style={{ fontWeight: 700 }}>
                {vetName}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 bg-[#059669] rounded-full"></div>
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%]`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#059669] text-white rounded-br-sm'
                      : 'bg-white text-[#111827] rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className={`text-xs text-[#6B7280] mt-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex-shrink-0 safe-area-bottom">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
              <Paperclip className="w-5 h-5 text-[#6B7280]" />
            </button>
            <button className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
              <Camera className="w-5 h-5 text-[#6B7280]" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-[#F3F4F6] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 bg-[#059669] rounded-full flex items-center justify-center hover:bg-[#047857] transition-colors shadow-lg"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
