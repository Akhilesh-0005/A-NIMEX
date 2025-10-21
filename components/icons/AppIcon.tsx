import React from 'react';

export const AppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <rect width="100" height="100" rx="20" ry="20" fill="black"/>
    <g stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="10" width="80" height="80" rx="8.72" ry="8.72" />
        <line x1="30" y1="10" x2="30" y2="90" />
        <line x1="70" y1="10" x2="70" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <line x1="10" y1="30" x2="30" y2="30" />
        <line x1="10" y1="70" x2="30" y2="70" />
        <line x1="70" y1="70" x2="90" y2="70" />
        <line x1="70" y1="30" x2="90" y2="30" />
    </g>
  </svg>
);