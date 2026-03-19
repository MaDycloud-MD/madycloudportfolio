'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Contact() {
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) { setStatus('success'); reset(); }
      else setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700
    rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100
    focus:outline-none focus:ring-2 focus:ring-primary transition`;

  return (
    <section id="contact" className="py-20 scroll-mt-20">
      <h2 className="text-3xl font-bold mb-6">Contact</h2>

      <div className="bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700
        rounded-xl p-6 shadow-md max-w-6xl space-y-6">

        <p className="text-gray-700 dark:text-gray-300">
          Have an opportunity, project, collaboration idea, or just want to connect?
        </p>

        {/* Social links */}
        <div className="flex items-center justify-center gap-6 text-xs flex-wrap">
          {[
            { href: 'https://www.linkedin.com/in/myselfmd',     src: '/logos/linkedin.svg',   label: 'LinkedIn'  },
            { href: 'https://www.instagram.com/myself.md',      src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg', label: 'Instagram' },
            { href: 'https://t.me/myselfmd07',                  src: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',       label: 'Telegram'  },
            { href: 'mailto:md.shoaib.i.makandar@gmail.com',    src: '/logos/gmail.svg',       label: 'Mail'      },
          ].map(({ href, src, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="flex flex-col items-center hover:scale-110 transition-transform duration-300">
              <img src={src} alt={label} className="w-7 h-7" />
              <span className="mt-1.5">{label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200 text-sm">
          <FaMapMarkerAlt className="text-primary" />
          <span><strong>Location:</strong> Belagavi, Karnataka, India.</span>
        </div>

        {/* Contact form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Send a Message</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input {...register('name', { required: 'Name is required' })}
                placeholder="Your Name" className={inputCls} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                placeholder="Your Email" type="email" className={inputCls} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <input {...register('subject')}
            placeholder="Subject (optional)" className={inputCls} />

          <div>
            <textarea {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Min 10 characters' } })}
              placeholder="Your message..." rows={5} className={inputCls} />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-full bg-primary text-black font-semibold
              hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Sending…' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-sm">✅ Message sent! I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm">❌ Something went wrong. Please try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
