'use client';
import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Get token directly from Firebase auth — avoids stale hook token
async function getFirebaseToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function apiAuth(path, options = {}) {
  const token = await getFirebaseToken();
  const base  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res   = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function useAdminCRUD(endpoint) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(endpoint);
      setItems(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (body) => {
    const res = await apiAuth(endpoint, { method: 'POST', body: JSON.stringify(body) });
    await refresh();
    return res;
  };

  const update = async (id, body) => {
    const res = await apiAuth(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    await refresh();
    return res;
  };

  const remove = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await apiAuth(`${endpoint}/${id}`, { method: 'DELETE' });
    await refresh();
  };

  return { items, loading, error, refresh, create, update, remove };
}

// ── DataTable ─────────────────────────────────────────────────────────────
export function DataTable({ columns, rows, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="text-center py-16 text-gray-600 text-sm border border-white/5 rounded-xl bg-white/3">
        No entries yet. Click <strong className="text-yellow-400">+ Add New</strong> to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {columns.map(col => (
              <th key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {rows.map((row, i) => (
              <motion.tr key={row._id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-300 max-w-xs truncate">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(row)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition bg-transparent">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => onDelete(row._id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition bg-transparent">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

// ── Slide-over modal ──────────────────────────────────────────────────────
export function AdminModal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#161b22]
              border-l border-white/10 z-50 overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <button onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-white transition bg-transparent rounded-lg hover:bg-white/10">
                <FiX size={16} />
              </button>
            </div>
            <div className="px-6 py-6 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Page header with visible + Add New button ─────────────────────────────
export function AdminPageHeader({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
          bg-yellow-400 text-black text-sm font-bold
          hover:bg-yellow-300 active:scale-95 transition-all"
      >
        <FiPlus size={16} />
        Add New
      </button>
    </div>
  );
}

// ── Shared form field ─────────────────────────────────────────────────────
export function Field({ label, error, children }) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>}
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export const inputCls = `w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5
  text-sm text-gray-100 placeholder-gray-600
  focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/40 transition`;

export const textareaCls = `${inputCls} resize-y min-h-[100px]`;