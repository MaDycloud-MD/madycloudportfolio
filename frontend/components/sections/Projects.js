// frontend/components/sections/Projects.js
'use client';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function ProjectCard({ proj, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === proj._id;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md
        bg-white/70 dark:bg-white/10 backdrop-blur p-4 transition-all"
    >
      <button
        onClick={() => setOpenIndex(isOpen ? null : proj._id)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-primary hover:underline bg-transparent"
      >
        {proj.title}
        {isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="mt-5 list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {proj.details.map((d, j) => <li key={j} className="pl-2">{d}</li>)}
            </ul>

            {proj.techStack?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4">
                {proj.techStack.map((tech, k) => (
                  <div key={k} className="flex flex-col items-center text-center w-16">
                    <img src={tech.logoUrl} alt={tech.name} className="w-10 h-10 object-contain" title={tech.name} />
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{tech.name}</span>
                  </div>
                ))}
              </div>
            )}

            {(proj.links?.live || proj.links?.github || proj.links?.youtube) && (
              <div className="mt-6 flex gap-4 flex-wrap">
                {proj.links.live && (
                  <a href={proj.links.live} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full
                      bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow hover:shadow-lg transition-all">
                    <img src="/logos/live.svg" alt="Live" className="w-5 h-5" />
                    Live
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
  );
}

export default function Projects({ data = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visible = data.slice(0, 5);
  const hasMore = data.length > 5;

  return (
    <section id="projects" className="py-20 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-10">Projects</h2>
      <div className="space-y-6">
        {visible.map((proj, i) => (
          <ProjectCard key={proj._id} proj={proj} index={i} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-6 py-2.5 rounded-full border border-primary text-primary font-semibold
              hover:bg-primary hover:text-black transition-all"
          >
            See All Projects ({data.length})
          </button>
        </div>
      )}

      {/* All Projects Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#0d1117]
                border-l border-gray-200 dark:border-white/10 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between px-6 py-4
                border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] z-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Projects ({data.length})</h2>
                <button onClick={() => setDrawerOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition bg-transparent rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="px-6 py-6 space-y-6">
                {data.map((proj, i) => (
                  <ProjectCard key={proj._id} proj={proj} index={i} openIndex={openIndex} setOpenIndex={setOpenIndex} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}