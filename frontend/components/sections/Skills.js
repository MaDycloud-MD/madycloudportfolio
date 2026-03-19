'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Programming', 'DevOps', 'Databases', 'Operating Systems', 'Tools'];

export default function Skills({ data = [] }) {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? data : data.filter(g => g.category === filter);

  return (
    <section id="skills" className="py-10 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6">Skills &amp; Technologies</h2>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition hover:scale-105
              ${filter === cat
                ? 'bg-primary text-black border-primary'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-transparent'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-10">
        {filtered.map((group, groupIdx) => (
          <motion.div
            key={group._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: groupIdx * 0.08 }}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl
              bg-white/70 dark:bg-white/10 backdrop-blur shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100
              border-b pb-2 border-gray-300 dark:border-gray-600">
              {group.title}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
              {group.items.map(({ logoUrl, label }, idx) => (
                <div key={idx}
                  className="flex flex-col items-center group hover:scale-110 transition-transform duration-200 relative">
                  <img src={logoUrl} alt={label} className="w-16 h-16 object-contain" />
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                    opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                    transition-all duration-200 bg-gray-900 text-white text-xs px-3 py-1
                    rounded shadow-md whitespace-nowrap z-10">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
