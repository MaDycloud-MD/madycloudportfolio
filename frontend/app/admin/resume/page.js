'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiAuth, apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import { FiFileText, FiUpload, FiTrash2, FiDownload, FiExternalLink } from 'react-icons/fi';

export default function AdminResume() {
  const [resume,    setResume]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [msg,       setMsg]       = useState({ type: '', text: '' });
  const { getToken } = useAuth();

  const fetchResume = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/resume');
      setResume(data.data);
    } catch {
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResume(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMsg({ type: 'error', text: 'Only PDF files are allowed.' });
      return;
    }

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      const token = await getToken();

      // 1. Get signed upload credentials
      const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/sign`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ folder: 'portfolio/resume', resourceType: 'raw' }),
      });
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const form = new FormData();
      form.append('file',      file);
      form.append('signature', signature);
      form.append('timestamp', String(timestamp));
      form.append('api_key',   apiKey);
      form.append('folder',    folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        { method: 'POST', body: form }
      );
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
      const data = await uploadRes.json();

      // 3. Save URL to our DB (this also deletes the old resume)
      await apiAuth('/api/resume', token, {
        method: 'POST',
        body:   JSON.stringify({
          cloudinaryPublicId: data.public_id,
          url:                data.secure_url,
          filename:           file.name,
        }),
      });

      setMsg({ type: 'success', text: 'Resume uploaded successfully!' });
      await fetchResume();
    } catch (err) {
      setMsg({ type: 'error', text: `${err.message || 'Upload failed'}` });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete the current resume? This will remove it from Cloudinary too.')) return;
    setDeleting(true);
    try {
      const token = await getToken();
      await apiAuth('/api/resume', token, { method: 'DELETE' });
      setResume(null);
      setMsg({ type: 'success', text: 'Resume deleted.' });
    } catch (err) {
      setMsg({ type: 'error', text: `${err.message}` });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Resume Management</h1>

      {/* Current resume card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-white/10 bg-white/5 mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Current Resume
        </h2>

        {loading ? (
          <div className="h-16 rounded-lg bg-white/10 animate-pulse" />
        ) : resume ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <FiFileText size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{resume.filename}</p>
                <p className="text-xs text-gray-500 mt-0.5">Hosted on Cloudinary CDN</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={resume.url} target="_blank" rel="noreferrer"
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                title="Preview">
                <FiExternalLink size={16} />
              </a>
              <a href={resume.url} download
                className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition"
                title="Download">
                <FiDownload size={16} />
              </a>
              <button onClick={handleDelete} disabled={deleting}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition bg-transparent disabled:opacity-50"
                title="Delete">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No resume uploaded yet.</p>
        )}
      </motion.div>

      {/* Upload new */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl border border-white/10 bg-white/5"
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {resume ? 'Replace Resume' : 'Upload Resume'}
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          PDF only. Uploading a new resume will automatically delete the previous one.
          The download button on your portfolio will instantly point to the new file.
        </p>

        <label className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium
          cursor-pointer transition-all
          ${uploading
            ? 'border-white/10 text-gray-500 cursor-not-allowed opacity-60'
            : 'border-primary/40 text-primary hover:bg-primary/10'}`}
        >
          <FiUpload size={15} />
          {uploading ? 'Uploading…' : 'Choose PDF File'}
          <input type="file" accept="application/pdf" onChange={handleUpload}
            disabled={uploading} className="hidden" />
        </label>

        {msg.text && (
          <p className={`mt-3 text-sm ${msg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {msg.text}
          </p>
        )}
      </motion.div>

      {/* How it works */}
    </div>
  );
}
