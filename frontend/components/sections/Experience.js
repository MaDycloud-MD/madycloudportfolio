'use client';
import { motion } from 'framer-motion';
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

export default function Experience({ data = [] }) {
  const { ref, style } = useScrollFadeIn();

  return (
    <section id="experience" className="py-12 scroll-mt-24" ref={ref} style={style}>
      <h2 className="text-3xl font-bold mb-6">Experience</h2>
      <div className="grid gap-6">
        {data.map((exp, idx) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-1 text-primary">
              {exp.role} – {exp.company}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</p>
            <ul className="list-disc pl-3 mt-2 space-y-1 text-gray-700 dark:text-gray-200">
              {exp.points.map((point, i) => (
                <li key={i} className="pl-2">{point}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
