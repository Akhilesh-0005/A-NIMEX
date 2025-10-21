import React, { forwardRef } from 'react';

const Footer = forwardRef<HTMLElement>((props, ref) => {
  return (
    <footer ref={ref} className="w-full bg-gray-800/50 py-5 border-t border-gray-700/50">
      <div className="container mx-auto text-center text-gray-400 text-sm">
        <p>
          Made with <span className="text-red-500" role="img" aria-label="red heart">❤️</span> by Akhilesh Kumar
          <span className="mx-2 text-gray-600">|</span>
          &copy; 2025 All rights reserved.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
