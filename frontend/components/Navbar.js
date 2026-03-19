'use client';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import SwipeThemeToggle from '@/components/SwipeThemeToggle';

const navLinks = [
  { name: 'Home',           id: 'home' },
  { name: 'Experience',     id: 'experience' },
  { name: 'Projects',       id: 'projects' },
  { name: 'Skills',         id: 'skills' },
  { name: 'Education',      id: 'education' },
  { name: 'Certifications', id: 'certifications' },
  { name: 'Contact',        id: 'contact' },
];

export default function Navbar() {
  const [visible,     setVisible]     = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen,      setIsOpen]      = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastScrollY || y < 80);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3
      flex items-center justify-between
      bg-white/20 dark:bg-dark/20 backdrop-blur-md
      border-b border-white/10 dark:border-white/5
      transition-all duration-500
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 blur-2xl opacity-10 -z-10" />

      {/* Brand */}
      <button
        onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="bg-transparent cursor-pointer hover:scale-105 transition-transform"
      >
        <span className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
          bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500
          drop-shadow-[0_1px_12px_rgba(168,85,247,0.45)] animated-gradient">
          MaDycloud
        </span>
      </button>

      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300 ml-auto">
        {navLinks.map(link => (
          <li key={link.name}>
            <button onClick={() => scrollTo(link.id)}
              className="bg-transparent hover:text-primary transition">
              {link.name}
            </button>
          </li>
        ))}
        <li>
          <ResumeButton />
        </li>
        <li><SwipeThemeToggle /></li>
      </ul>

      {/* Mobile */}
      <div className="md:hidden flex items-center gap-3">
        <SwipeThemeToggle />
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl text-primary focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-3 px-6 py-4
          bg-white/95 dark:bg-dark/90 rounded-xl shadow-lg md:hidden backdrop-blur-md">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {navLinks.map(link => (
              <li key={link.name}>
                <button onClick={() => scrollTo(link.id)}
                  className="hover:text-primary bg-transparent text-left">
                  {link.name}
                </button>
              </li>
            ))}
            <li><ResumeButton /></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

// Fetches resume URL dynamically from the API
function ResumeButton() {
  const [url, setUrl] = useState('/MDShoaib_s_Resume.pdf'); // fallback

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume`)
      .then(r => r.json())
      .then(d => { if (d.success) setUrl(d.data.url); })
      .catch(() => {});
  }, []);

  return (
    <a href={url} target="_blank" rel="noreferrer"
      className="bg-primary text-black px-3 py-1 rounded hover:bg-yellow-400 font-semibold transition">
      Resume
    </a>
  );
}
