'use client';
import { motion } from 'framer-motion';
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

export default function Volunteering({ data = [] }) {
  const { ref, style } = useScrollFadeIn();

  return (
    <section id="volunteering" className="py-16 scroll-mt-20" ref={ref} style={style}>
      <h2 className="text-3xl font-bold mb-6">Volunteering</h2>
      <div className="space-y-6">
        {data.map((role, i) => (
          <motion.div key={role._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-5 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-primary">{role.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{role.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
