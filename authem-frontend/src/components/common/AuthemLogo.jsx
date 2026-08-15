import React from 'react';

export const AuthemLogo = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 select-none cursor-pointer ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square"
      >
        <path d="M50 5 L90 25 V75 L50 95 L10 75 V25 Z" fill="#0F172A" />
        <path d="M32 70 L50 28 L68 70 H56 L50 54 L44 70 H32 Z" fill="#FFFFFF" />
        <path d="M42 50 L50 38 L78 22 L58 48 L48 42 L42 50 Z" fill="#00805D" />
      </svg>

      {showText && (
        <span className="font-extrabold tracking-tighter text-2xl text-slate-900 uppercase">
          AUTH<span className="text-[#00805D]">EM</span>
        </span>
      )}
    </div>
  );
};