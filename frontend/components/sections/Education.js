'use client';
import { motion } from 'framer-motion';
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

export default function Education({ data = [] }) {
  const { ref, style } = useScrollFadeIn();

  return (
    <section id="education" className="py-12 scroll-mt-20" ref={ref} style={style}>
      <h2 className="text-3xl font-bold mb-6">Education</h2>
      <div className="space-y-6">
        {data.map((item, i) => (
          <motion.div key={item._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-5 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-primary">{item.degree}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{item.institution}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.score} • {item.year}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
