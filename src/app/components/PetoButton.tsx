import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export default function PetoButton() {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate('/peto')}
      className="absolute bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#059669] to-[#047857] shadow-xl flex items-center justify-center z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{ boxShadow: '0 10px 30px rgba(5, 150, 105, 0.4)' }}
    >
      <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
    </motion.button>
  );
}
