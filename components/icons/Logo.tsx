import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 205 40"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="A-NIMEX Logo"
  >
    <text 
      y="32" 
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
      fontSize="38" 
      fontWeight="800"
      letterSpacing="2"
      fill="#FFFFFF"
    >
      <tspan fill="#ef4444">A</tspan>
      -NIME
      <tspan fill="#ef4444">X</tspan>
    </text>
  </svg>
);
