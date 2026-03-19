'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiAuth, apiFetch } from '@/lib/api';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Generic hook for admin CRUD operations against a given API endpoint.
 * Usage: const crud = useAdminCRUD('/api/projects')
 */
export function useAdminCRUD(endpoint) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const { getToken } = useAuth();

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
    const token = await getToken();
    const res   = await apiAuth(endpoint, token, { method: 'POST', body: JSON.stringify(body) });
    await refresh();
    return res;
  };

  const update = async (id, body) => {
    const token = await getToken();
    const res   = await apiAuth(`${endpoint}/${id}`, token, { method: 'PUT', body: JSON.stringify(body) });
    await refresh();
    return res;
  };

  const remove = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    const token = await getToken();
    await apiAuth(`${endpoint}/${id}`, token, { method: 'DELETE' });
    await refresh();
  };

  return { items, loading, error, refresh, create, update, remove };
}

/**
 * Generic DataTable for admin list pages.
 * Props:
 *   columns   — [{ key, label, render? }]
 *   rows      — array of data objects
 *   onEdit    — (row) => void
 *   onDelete  — (id) => void
 *   loading   — bool
 */
export function DataTable({ columns, rows, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        No entries yet. Click <strong className="text-primary">Add New</strong> to get started.
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
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {rows.map((row, i) => (
              <motion.tr key={row._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-300 max-w-xs truncate">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(row)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition bg-transparent">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(row._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition bg-transparent">
                      <FiTrash2 size={14} />
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

/**
 * Slide-over modal for add/edit forms
 */
export function AdminModal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#161b22] border-l border-white/10
              z-50 overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button onClick={onClose}
                className="text-gray-400 hover:text-white transition text-xl leading-none bg-transparent">✕</button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Page header used on every admin list page
 */
export function AdminPageHeader({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <button onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black
          text-sm font-semibold hover:bg-yellow-300 transition bg-transparent">
        <FiPlus size={16} />
        Add New
      </button>
    </div>
  );
}

/**
 * Shared form field components
 */
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
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition`;

export const textareaCls = `${inputCls} resize-y min-h-[100px]`;
