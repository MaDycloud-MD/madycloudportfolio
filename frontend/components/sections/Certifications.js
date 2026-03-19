'use client';
import { motion } from 'framer-motion';

export default function Certifications({ data = [] }) {
  return (
    <section id="certifications" className="py-20 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-10">Certifications and Courses</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {data.map((cert, i) => (
          <motion.a
            key={cert._id}
            href={cert.url} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center text-center p-6 border border-gray-200
              dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition
              bg-white/80 dark:bg-white/10 backdrop-blur max-w-sm w-full"
          >
            <img src={cert.logoUrl} alt={cert.name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-4" />
            <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug">
              {cert.name}
              {cert.inProgress && (
                <span className="ml-2 text-xs text-yellow-500 font-semibold">(In Progress)</span>
              )}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
