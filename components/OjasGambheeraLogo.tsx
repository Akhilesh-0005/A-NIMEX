import React from 'react';

const OjasGambheeraLogo: React.FC = () => {
  return (
    <div className="relative inline-block py-2" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
      {/* Text Content */}
      <h2 
        className="relative text-3xl sm:text-4xl font-black tracking-wide"
        style={{ transform: 'skewX(-10deg)' }}
      >
        <span className="text-white">OJAS</span>
        {' '}
        <span 
          className="text-red-500"
        >
          GAMBHEERA
        </span>
      </h2>
    </div>
  );
};

export default OjasGambheeraLogo;