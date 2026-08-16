import React, { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export default function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative ${className}`}
        style={{ 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
