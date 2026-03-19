'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiAuth } from '@/lib/api';
import { FiCode, FiBriefcase, FiGrid, FiBook, FiAward, FiHeart, FiMail } from 'react-icons/fi';
import Link from 'next/link';

const sections = [
  { label: 'Projects',       key: 'projects',       href: '/admin/projects',       icon: FiCode,      color: 'from-blue-500 to-cyan-500' },
  { label: 'Experience',     key: 'experience',     href: '/admin/experience',     icon: FiBriefcase, color: 'from-purple-500 to-pink-500' },
  { label: 'Skills',         key: 'skills',         href: '/admin/skills',         icon: FiGrid,      color: 'from-green-500 to-emerald-500' },
  { label: 'Education',      key: 'education',      href: '/admin/education',      icon: FiBook,      color: 'from-yellow-500 to-orange-500' },
  { label: 'Certifications', key: 'certifications', href: '/admin/certifications', icon: FiAward,     color: 'from-rose-500 to-red-500' },
  { label: 'Volunteering',   key: 'volunteering',   href: '/admin/volunteering',   icon: FiHeart,     color: 'from-teal-500 to-cyan-500' },
  { label: 'Messages',       key: 'messages',       href: '/admin/messages',       icon: FiMail,      color: 'from-indigo-500 to-blue-500' },
];

export default function AdminDashboard() {
  const { getToken, user } = useAuth();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const token = await getToken();
        const base  = process.env.NEXT_PUBLIC_API_URL;

        const results = await Promise.allSettled([
          fetch(`${base}/api/projects`).then(r=>r.json()),
          fetch(`${base}/api/experience`).then(r=>r.json()),
          fetch(`${base}/api/skills`).then(r=>r.json()),
          fetch(`${base}/api/education`).then(r=>r.json()),
          fetch(`${base}/api/certifications`).then(r=>r.json()),
          fetch(`${base}/api/volunteering`).then(r=>r.json()),
          apiAuth('/api/contact', token),
        ]);

        const keys = ['projects','experience','skills','education','certifications','volunteering','messages'];
        const counts = {};
        results.forEach((r, i) => {
          counts[keys[i]] = r.status === 'fulfilled' ? (r.value.data?.length ?? 0) : '–';
        });
        setCounts(counts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back 👋</h1>
        <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map(({ label, key, href, icon: Icon, color }) => (
          <Link key={key} href={href}
            className="group p-5 rounded-xl bg-white/5 border border-white/10
              hover:border-white/20 hover:bg-white/8 transition-all duration-200">
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${color} mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-gray-400 text-xs font-medium">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? <span className="w-6 h-6 block rounded bg-white/10 animate-pulse" /> : counts[key] ?? 0}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-sm font-semibold text-gray-300 mb-2">Quick tip</h2>
        <p className="text-xs text-gray-500">
          Changes you make here will appear on the live portfolio within 60 seconds (ISR revalidation).
          Upload logos and images via the form — they go straight to Cloudinary.
        </p>
      </div>
    </div>
  );
}
