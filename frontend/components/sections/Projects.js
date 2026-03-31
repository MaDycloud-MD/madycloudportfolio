'use client';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects({ data = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="projects" className="py-20 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-10">Projects</h2>
      <div className="space-y-6">
        {data.map((proj, i) => (
          <motion.div
            key={proj._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md
              bg-white/70 dark:bg-white/10 backdrop-blur p-4 transition-all"
          >
            {/* Toggle header */}
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center text-left text-lg font-semibold text-primary hover:underline bg-transparent"
            >
              {proj.title}
              {openIndex === i ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Bullet details */}
                  <ul className="mt-5 list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {proj.details.map((d, j) => (
                      <li key={j} className="pl-2">{d}</li>
                    ))}
                  </ul>

                  {/* Tech stack logos */}
                  {proj.techStack?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-4">
                      {proj.techStack.map((tech, k) => (
                        <div key={k} className="flex flex-col items-center text-center w-16">
                          <img src={tech.logoUrl} alt={tech.name}
                            className="w-10 h-10 object-contain" title={tech.name} />
                          <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action links */}
                  {(proj.links?.live || proj.links?.github || proj.links?.youtube) && (
                    <div className="mt-6 flex gap-4 flex-wrap">
                      {proj.links.live && (
                        <a href={proj.links.live} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full
                            bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow hover:shadow-lg transition-all">
                          <img src="/logos/live.svg" alt="Live" className="w-5 h-5" />
                          Live Demo
                        </a>
                      )}
                      {proj.links.youtube && (
                        <a href={proj.links.youtube} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full
                            bg-red-400 text-white font-medium shadow hover:shadow-lg hover:bg-red-700 transition-all">
                          <img src="/logos/youtube3.svg" alt="YouTube" className="w-5 h-5" />
                          Watch on YouTube
                        </a>
                      )}
                      {proj.links.github && (
                        <a href={proj.links.github} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full
                            bg-gray-900 text-white font-medium shadow hover:shadow-lg hover:bg-gray-800 transition-all">
                          <img src="/logos/github2.svg" alt="GitHub" className="w-5 h-5" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
