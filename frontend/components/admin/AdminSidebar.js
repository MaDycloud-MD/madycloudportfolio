'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  FiGrid, FiBriefcase, FiCode, FiBook,
  FiAward, FiHeart, FiMail, FiFileText, FiLogOut,
} from 'react-icons/fi';

const links = [
  { href: '/admin',               label: 'Dashboard',      icon: FiGrid },
  { href: '/admin/projects',      label: 'Projects',       icon: FiCode },
  { href: '/admin/experience',    label: 'Experience',     icon: FiBriefcase },
  { href: '/admin/skills',        label: 'Skills',         icon: FiGrid },
  { href: '/admin/education',     label: 'Education',      icon: FiBook },
  { href: '/admin/certifications',label: 'Certifications', icon: FiAward },
  { href: '/admin/volunteering',  label: 'Volunteering',   icon: FiHeart },
  { href: '/admin/messages',      label: 'Messages',       icon: FiMail },
  { href: '/admin/resume',        label: 'Resume',         icon: FiFileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 hidden md:flex flex-col bg-[#161b22] border-r border-white/10 min-h-screen">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-lg font-extrabold text-transparent bg-clip-text
          bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animated-gradient">
          MaDycloud Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${active
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
            text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all w-full bg-transparent">
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
