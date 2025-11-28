import React from 'react';

export const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'h-8 w-8', text: 'text-lg' },
    md: { icon: 'h-10 w-10', text: 'text-xl' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <svg
          className={`${currentSize.icon} text-primary`}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cloud */}
          <path
            d="M40 34.5A9 9 0 0 0 31 26c-.2 0-.4 0-.6.02A12 12 0 1 0 12 37h28z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Photo frame */}
          <rect
            x="14"
            y="22"
            width="12"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.4"
            fill="none"
          />
          {/* Mountain in frame */}
          <path
            d="M14 29l3-3 2 2 3-4 4 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Accent dot */}
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent"></div>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.text} font-bold text-foreground tracking-tight`}>
            Ryloze
          </span>
          <span className="text-xs text-muted-foreground font-medium">Converter</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
