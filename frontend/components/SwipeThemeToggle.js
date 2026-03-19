'use client';
import { useState } from 'react';
import { FiSun } from 'react-icons/fi';
import { HiMoon } from 'react-icons/hi';
import { useTheme } from '@/components/ThemeProvider';

export default function SwipeThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX]         = useState(0);

  const handleTouchStart = (e) => { setStartX(e.touches[0].clientX); setIsDragging(true); };
  const handleTouchMove  = (e) => {
    if (!isDragging) return;
    if (Math.abs(e.touches[0].clientX - startX) > 24) { toggleTheme(); setIsDragging(false); }
  };
  const handleTouchEnd = () => setIsDragging(false);
  const handleClick    = () => { if (!isDragging) toggleTheme(); };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      role="switch"
      aria-checked={dark}
      tabIndex={0}
      title="Toggle theme"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className={`relative w-14 h-8 px-1 rounded-full cursor-pointer flex items-center
        transition-all duration-300 overflow-hidden
        ${dark ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-300'}`}
    >
      <div className={`absolute w-6 h-6 rounded-full shadow-md flex items-center justify-center
        transition-transform duration-500 bg-white
        ${dark ? 'translate-x-6 rotate-[360deg]' : 'translate-x-0 rotate-0'}`}
      >
        {dark
          ? <HiMoon className="text-indigo-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.7)]" />
          : <FiSun  className="text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
        }
      </div>
    </div>
  );
}
