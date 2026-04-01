// frontend/components/sections/Hero.js
'use client';
import { useState, useEffect } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    // Fetch profile
    fetch(`${base}/api/profile`)
      .then(r => r.json())
      .then(d => { if (d.success) setProfile(d.data); })
      .catch(() => {});
    // Fetch resume URL
    fetch(`${base}/api/resume`)
      .then(r => r.json())
      .then(d => { if (d.success) setResumeUrl(d.data.url); })
      .catch(() => {});
  }, []);

  // Build TypeAnimation sequence from profile taglines (empty if none)
  const sequence = profile?.taglines?.length
    ? profile.taglines.flatMap(t => [t, 2000])
    : [];

  const links = profile?.links || {};
  const socialLinks = [
    { key: 'linkedin',  src: '/logos/linkedin.svg',  alt: 'LinkedIn' },
    { key: 'github',    src: '/logos/github2.svg',   alt: 'GitHub' },
    { key: 'leetcode',  src: '/logos/leetcode.svg',  alt: 'LeetCode' },
    { key: 'twitter',   src: '/logos/twitter.svg',   alt: 'Twitter' },
    { key: 'youtube',   src: '/logos/youtube3.svg',  alt: 'YouTube' },
    { key: 'mail',      src: '/logos/gmail.svg',       alt: 'Mail'  },
    { key: 'instagram', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',  alt: 'YouTube' },
    { key: 'telegram',  src: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',        alt: 'Telegram'  },
  ].filter(s => links[s.key]);

  return (
    <section id="home"
      className="relative overflow-visible pt-32 sm:pt-36 md:pt-40 pb-16
        flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8">

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center md:text-left relative z-10 flex-1"
      >
        {profile?.name && (
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500
            drop-shadow-[0_1px_12px_rgba(168,85,247,0.45)] animated-gradient">
            {profile.name}
          </h1>
        )}

        <div className="mt-2 text-2xl font-semibold text-gray-800 dark:text-gray-200 h-10">
          {sequence.length > 0 && (
            <TypeAnimation sequence={sequence} wrapper="span" speed={50} repeat={Infinity} />
          )}
        </div>

        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
          {profile?.bio}{' '}
          {profile?.techStack && (
            <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
              {profile.techStack}
            </span>
          )}
        </p>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="mt-6 flex gap-5 justify-center md:justify-start">
            {socialLinks.map(({ key, src, alt }) => (
              <a key={key} href={links[key]} target="_blank" rel="noreferrer"
                className="hover:scale-110 transition-transform duration-300">
                <img src={src} alt={alt} className="w-7 h-7" />
              </a>
            ))}
          </div>
        )}

        {resumeUrl && (
          <a href={resumeUrl} target="_blank" rel="noreferrer"
            className="inline-block mt-6 px-6 py-2 rounded-full bg-primary text-black font-semibold hover:bg-yellow-400 transition">
            Download Resume
          </a>
        )}

        <div className="mt-8 flex justify-center md:justify-start">
          <a href="#contact"
            className="group flex items-center gap-2 text-sm font-medium text-primary hover:underline hover:scale-105 transition">
            Hire Me <FaArrowDown className="group-hover:translate-y-1 transition-transform duration-300" />
          </a>
        </div>
      </motion.div>

      {/* Avatar — pushed further right on desktop */}
      {profile?.photoUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="relative w-44 h-44 sm:w-52 sm:h-52 z-10 flex-shrink-0 md:mr-8 "
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-yellow-300 blur-xl opacity-30 animate-pulse" />
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="relative z-10 w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl "
          />
        </motion.div>
      )}
    </section>
  );
}