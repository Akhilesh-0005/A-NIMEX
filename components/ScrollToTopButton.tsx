import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface ScrollToTopButtonProps {
  isFooterVisible?: boolean;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ isFooterVisible = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isFooterVisible ? 'bottom-20' : 'bottom-6'}`}
      aria-label="Scroll to top"
      style={{ zIndex: 1000, pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <ArrowUpIcon className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;