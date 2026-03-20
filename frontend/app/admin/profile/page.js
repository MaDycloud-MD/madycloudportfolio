// frontend/app/admin/profile/page.js
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiX, FiTrash2, FiUser } from 'react-icons/fi';
import { Field, inputCls } from '@/components/admin/adminUtils';
import ImageUploader from '@/components/admin/ImageUploader';
import { apiFetch } from '@/lib/api';
import { auth } from '@/lib/firebase';

async function apiAuthReq(path, options = {}) {
  const token = await auth.currentUser?.getIdToken();
  const base  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res   = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// All supported social links
const LINK_FIELDS = [
  { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/...' },
  { key: 'github',    label: 'GitHub',    placeholder: 'https://github.com/...' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'telegram',  label: 'Telegram',  placeholder: 'https://t.me/...' },
  { key: 'email',     label: 'Email',     placeholder: 'you@example.com' },
  { key: 'leetcode',  label: 'LeetCode',  placeholder: 'https://leetcode.com/u/...' },
  { key: 'twitter',   label: 'Twitter/X', placeholder: 'https://x.com/...' },
  { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@...' },
  { key: 'website',   label: 'Website',   placeholder: 'https://yoursite.com' },
];

export default function AdminProfile() {
  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState({ type: '', text: '' });
  const [taglines,  setTaglines]  = useState([]);
  const [newTag,    setNewTag]    = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    apiFetch('/api/profile').then(d => {
      setProfile(d.data);
      setTaglines(d.data.taglines || []);
      reset({
        name:     d.data.name,
        bio:      d.data.bio,
        location: d.data.location,
        ...Object.fromEntries(
          Object.entries(d.data.links || {}).map(([k, v]) => [`links.${k}`, v])
        ),
      });
    }).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const links = {};
      LINK_FIELDS.forEach(({ key }) => {
        links[key] = data[`links.${key}`] || '';
      });
      await apiAuthReq('/api/profile', {
        method: 'PUT',
        body:   JSON.stringify({ name: data.name, bio: data.bio, location: data.location, taglines, links }),
      });
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: `${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (url, publicId) => {
    try {
      const d = await apiAuthReq('/api/profile/photo', {
        method: 'PUT',
        body:   JSON.stringify({ photoUrl: url, photoPublicId: publicId }),
      });
      setProfile(d.data);
      setMsg({ type: 'success', text: 'Photo updated!' });
    } catch (err) {
      setMsg({ type: 'error', text: `${err.message}` });
    }
  };

  const handlePhotoDelete = async () => {
    if (!confirm('Remove profile photo?')) return;
    try {
      await apiAuthReq('/api/profile/photo', { method: 'DELETE' });
      setProfile(p => ({ ...p, photoUrl: '', photoPublicId: '' }));
      setMsg({ type: 'success', text: 'Photo removed.' });
    } catch (err) {
      setMsg({ type: 'error', text: `${err.message}` });
    }
  };

  const addTagline = () => {
    const t = newTag.trim();
    if (t && !taglines.includes(t)) { setTaglines([...taglines, t]); setNewTag(''); }
  };

  const removeTagline = (i) => setTaglines(taglines.filter((_, idx) => idx !== i));

  if (loading) return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </div>

      {msg.text && (
        <p className={`text-sm px-4 py-2 rounded-lg ${msg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {msg.text}
        </p>
      )}

      {/* ── Photo section ────────────────────────────────────── */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="text-sm font-semibold text-gray-300">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
            {profile?.photoUrl
              ? <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              : <FiUser size={32} className="text-gray-600" />
            }
          </div>
          <div className="space-y-2">
            <ImageUploader
              folder="portfolio/profile"
              label="Upload New Photo"
              accept="image/*"
              onUpload={handlePhotoUpload}
            />
            {profile?.photoUrl && (
              <button onClick={handlePhotoDelete}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition bg-transparent">
                <FiTrash2 size={12} /> Remove photo
              </button>
            )}
            <p className="text-xs text-gray-600">Recommended: square image, at least 400×400px</p>
          </div>
        </div>
      </div>

      {/* ── Main form ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic info */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300">Basic Info</h2>

          <Field label="Full Name" error={errors.name?.message}>
            <input {...register('name', { required: 'Required' })}
              placeholder="Mohammed Shoaib. Makandar" className={inputCls} />
          </Field>

          <Field label="Bio / Description">
            <textarea {...register('bio')} rows={3}
              placeholder="I'm a DevOps and Cloud Engineer..."
              className={`${inputCls} resize-y`} />
          </Field>

          <Field label="Location">
            <input {...register('location')} placeholder="Belagavi, Karnataka, India." className={inputCls} />
          </Field>
        </div>

        {/* Taglines for TypeAnimation */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300">Typewriter Taglines</h2>
          <p className="text-xs text-gray-600">These cycle in the Hero section typewriter animation.</p>
          <div className="flex flex-wrap gap-2">
            {taglines.map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs">
                {t}
                <button type="button" onClick={() => removeTagline(i)}
                  className="hover:text-red-400 transition bg-transparent">
                  <FiX size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newTag} onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTagline())}
              placeholder="e.g. DevOps Engineer" className={`${inputCls} flex-1`} />
            <button type="button" onClick={addTagline}
              className="px-3 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition">
              <FiPlus size={16} />
            </button>
          </div>
        </div>

        {/* Social links */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300">Social Links</h2>
          <p className="text-xs text-gray-600">Leave blank to hide. Add new platforms anytime — just update here.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {LINK_FIELDS.map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <input {...register(`links.${key}`)} placeholder={placeholder} className={inputCls} />
              </Field>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold
            hover:bg-yellow-300 transition disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}