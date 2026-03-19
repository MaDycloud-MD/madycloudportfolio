'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FiUpload, FiX } from 'react-icons/fi';

/**
 * Props:
 *   onUpload(url, publicId)  — called after successful upload
 *   accept                   — e.g. "image/*" or "application/pdf"
 *   folder                   — Cloudinary folder e.g. "portfolio/logos"
 *   preview                  — current image URL (shows thumbnail)
 *   label                    — button label
 */
export default function ImageUploader({
  onUpload,
  accept = 'image/*',
  folder = 'portfolio',
  preview = null,
  label = 'Upload Image',
}) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const { getToken } = useAuth();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      // 1. Get signed credentials from our Express backend
      const token = await getToken();
      const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/sign`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ folder }),
      });
      if (!sigRes.ok) throw new Error('Failed to get upload signature');
      const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

      // 2. Upload directly to Cloudinary (bypasses our server — fast & free tier friendly)
      const form = new FormData();
      form.append('file',      file);
      form.append('signature', signature);
      form.append('timestamp', String(timestamp));
      form.append('api_key',   apiKey);
      form.append('folder',    folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: 'POST', body: form }
      );
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
      const data = await uploadRes.json();

      onUpload(data.secure_url, data.public_id);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Preview thumbnail */}
      {preview && (
        <div className="relative w-20 h-20">
          <img src={preview} alt="Preview"
            className="w-full h-full object-contain rounded border border-white/10 bg-white/5 p-1" />
        </div>
      )}

      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
        cursor-pointer transition-all
        ${uploading
          ? 'border-white/10 text-gray-500 cursor-not-allowed opacity-60'
          : 'border-white/20 text-gray-300 hover:border-primary hover:text-primary'}`}
      >
        <FiUpload size={14} />
        {uploading ? 'Uploading…' : label}
        <input type="file" accept={accept} onChange={handleFile}
          disabled={uploading} className="hidden" />
      </label>

      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <FiX size={12} /> {error}
        </p>
      )}
    </div>
  );
}
