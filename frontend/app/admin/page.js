// frontend/app/admin/page.js
'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  FiCode, FiBriefcase, FiGrid, FiBook,
  FiAward, FiHeart, FiMail, FiFileText,
  FiLogOut, FiHome, FiUser,
} from 'react-icons/fi';

// ── Lazy-load each panel ──────────────────────────────────────────────────
const ProjectsPage       = dynamic(() => import('@/app/admin/projects/page'),       { loading: () => <PanelLoader /> });
const ExperiencePage     = dynamic(() => import('@/app/admin/experience/page'),     { loading: () => <PanelLoader /> });
const SkillsPage         = dynamic(() => import('@/app/admin/skills/page'),         { loading: () => <PanelLoader /> });
const EducationPage      = dynamic(() => import('@/app/admin/education/page'),      { loading: () => <PanelLoader /> });
const CertificationsPage = dynamic(() => import('@/app/admin/certifications/page'), { loading: () => <PanelLoader /> });
const VolunteeringPage   = dynamic(() => import('@/app/admin/volunteering/page'),   { loading: () => <PanelLoader /> });
const MessagesPage       = dynamic(() => import('@/app/admin/messages/page'),       { loading: () => <PanelLoader /> });
const ResumePage         = dynamic(() => import('@/app/admin/resume/page'),         { loading: () => <PanelLoader /> });
const ProfilePage        = dynamic(() => import('@/app/admin/profile/page'),        { loading: () => <PanelLoader /> });

function PanelLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

function Spinner({ fullscreen = false }) {
  if (fullscreen) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin inline-block" />;
}

// ── Login screen ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin, error, loading }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const inputCls = `w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
    text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] font-inter">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animated-gradient">
            MaDycloud
          </h1>
          <p className="text-gray-500 text-sm mt-1">Admin Dashboard</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); onLogin(email.trim(), password); }} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required className={inputCls} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 mt-2 rounded-lg bg-yellow-400 text-black font-bold
              hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2">
            {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <Link href="/" className="text-yellow-400 text-sm hover:underline flex items-center justify-center gap-1">
            <FiHome size={13} /> Back to Portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Dashboard overview cards ──────────────────────────────────────────────
function DashboardOverview({ user, setActive }) {
  const [counts,  setCounts]  = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    Promise.allSettled([
      fetch(`${base}/api/projects`).then(r => r.json()),
      fetch(`${base}/api/experience`).then(r => r.json()),
      fetch(`${base}/api/skills`).then(r => r.json()),
      fetch(`${base}/api/education`).then(r => r.json()),
      fetch(`${base}/api/certifications`).then(r => r.json()),
      fetch(`${base}/api/volunteering`).then(r => r.json()),
    ]).then(results => {
      const keys = ['projects','experience','skills','education','certifications','volunteering'];
      const c = {};
      results.forEach((r, i) => {
        c[keys[i]] = r.status === 'fulfilled' ? (r.value.data?.length ?? 0) : '–';
      });
      setCounts(c);
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Projects',       key: 'projects',       icon: FiCode,      color: 'from-blue-500 to-cyan-500' },
    { label: 'Experience',     key: 'experience',     icon: FiBriefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Skills',         key: 'skills',         icon: FiGrid,      color: 'from-green-500 to-emerald-500' },
    { label: 'Education',      key: 'education',      icon: FiBook,      color: 'from-yellow-500 to-orange-500' },
    { label: 'Certifications', key: 'certifications', icon: FiAward,     color: 'from-rose-500 to-red-500' },
    { label: 'Volunteering',   key: 'volunteering',   icon: FiHeart,     color: 'from-teal-500 to-cyan-500' },
    { label: 'Messages',       key: 'messages',       icon: FiMail,      color: 'from-indigo-500 to-blue-500' },
    { label: 'Resume',         key: 'resume',         icon: FiFileText,  color: 'from-amber-500 to-yellow-500' },
    { label: 'Profile',        key: 'profile',        icon: FiUser,      color: 'from-gray-500 to-slate-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(({ label, key, icon: Icon, color }) => (
          <motion.button
            key={key}
            onClick={() => setActive(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 rounded-xl bg-white/5 border border-white/10
              hover:border-white/20 hover:bg-white/8 transition-all text-left bg-transparent"
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${color} mb-3`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-gray-400 text-xs font-medium">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading
                ? <span className="w-8 h-6 block rounded bg-white/10 animate-pulse mt-1" />
                : counts[key] ?? 0}
            </p>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-white/3 border border-white/5">
        <p className="text-xs text-gray-600">
          Portfolio updates within 60 seconds of any change. Images upload directly to Cloudinary.
        </p>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',      label: 'Dashboard',      icon: FiHome },
  { id: 'projects',       label: 'Projects',       icon: FiCode },
  { id: 'experience',     label: 'Experience',     icon: FiBriefcase },
  { id: 'skills',         label: 'Skills',         icon: FiGrid },
  { id: 'education',      label: 'Education',      icon: FiBook },
  { id: 'certifications', label: 'Certifications', icon: FiAward },
  { id: 'volunteering',   label: 'Volunteering',   icon: FiHeart },
  { id: 'messages',       label: 'Messages',       icon: FiMail },
  { id: 'resume',         label: 'Resume',         icon: FiFileText },
  { id: 'profile',        label: 'Profile',        icon: FiUser },
];

function SidebarNav({ active, setActive, onLogout, userEmail }) {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-[#161b22] border-r border-white/10 min-h-screen flex-shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-base font-extrabold text-transparent bg-clip-text
          bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animated-gradient">
          MaDycloud Admin
        </span>
        <p className="text-gray-600 text-xs mt-1 truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all w-full bg-transparent
              ${active === id
                ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20'
                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
          text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-all mb-1">
          <FiHome size={15} /> View Portfolio
        </Link>
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all w-full bg-transparent">
          <FiLogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginErr,    setLoginErr]    = useState('');
  const [signingIn,   setSigningIn]   = useState(false);
  const [active,      setActive]      = useState('dashboard');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = async (email, password) => {
    setSigningIn(true);
    setLoginErr('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged fires automatically → sets user → renders dashboard
    } catch (err) {
      const msgs = {
        'auth/invalid-credential':     'Wrong email or password.',
        'auth/user-not-found':         'No account with this email.',
        'auth/wrong-password':         'Incorrect password.',
        'auth/invalid-email':          'Invalid email address.',
        'auth/too-many-requests':      'Too many attempts. Try again later.',
        'auth/network-request-failed': 'Network error. Check connection.',
      };
      setLoginErr(msgs[err.code] || `Error: ${err.code}`);
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setActive('dashboard');
  };

  if (authLoading) return <Spinner fullscreen />;
  if (!user)       return <LoginScreen onLogin={handleLogin} error={loginErr} loading={signingIn} />;

  const panelMap = {
    dashboard:      <DashboardOverview user={user} setActive={setActive} />,
    projects:       <ProjectsPage />,
    experience:     <ExperiencePage />,
    skills:         <SkillsPage />,
    education:      <EducationPage />,
    certifications: <CertificationsPage />,
    volunteering:   <VolunteeringPage />,
    messages:       <MessagesPage />,
    resume:         <ResumePage />,
    profile:        <ProfilePage />,
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-gray-100 font-inter">
      <SidebarNav
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
        userEmail={user.email}
      />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-screen">
        {panelMap[active] ?? panelMap.dashboard}
      </main>
    </div>
  );
}