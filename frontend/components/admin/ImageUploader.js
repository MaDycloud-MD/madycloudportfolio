'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ImageUploader({
  onUpload,
  accept = 'image/*,.svg',
  folder = 'portfolio',
  preview = null,
  label = 'Upload Image',
}) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      // Get token directly from Firebase — no hook needed, avoids stale token
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      const token = await user.getIdToken();

      // 1. Get signed credentials — pass filename so backend detects SVG
      const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/sign`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ folder, filename: file.name }),
      });

      if (!sigRes.ok) {
        const errData = await sigRes.json().catch(() => ({}));
        throw new Error(errData.error || `Signature request failed (${sigRes.status})`);
      }

      const { signature, timestamp, cloudName, apiKey, resourceType } = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const form = new FormData();
      form.append('file',      file);
      form.append('signature', signature);
      form.append('timestamp', String(timestamp));
      form.append('api_key',   apiKey);
      form.append('folder',    folder);

      // SVGs use /raw/upload, everything else uses /auto/upload
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: form });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Cloudinary upload failed');
      }

      const data = await uploadRes.json();
      // For SVGs (raw), secure_url is the direct URL
      onUpload(data.secure_url, data.public_id);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {preview && (
        <div className="w-16 h-16 rounded border border-white/10 bg-white/5 p-1 flex items-center justify-center">
          <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium
        cursor-pointer transition-all select-none
        ${uploading
          ? 'border-white/10 text-gray-600 cursor-not-allowed'
          : 'border-white/20 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-400'}`}
      >
        <FiUpload size={12} />
        {uploading ? 'Uploading…' : label}
        <input type="file" accept={accept} onChange={handleFile}
          disabled={uploading} className="hidden" />
      </label>

      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded">
          <FiX size={11} /> {error}
        </p>
      )}
    </div>
  );
}