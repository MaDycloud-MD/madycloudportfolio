'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiAuth } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiRefreshCw } from 'react-icons/fi';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const { getToken, user } = useAuth();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data  = await apiAuth('/api/contact', token);
      setMessages(data.data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if(user){ fetchMessages(); }}, [user]);

  const markRead = async (id) => {
    try {
      const token = await getToken();
      await apiAuth(`/api/contact/${id}/read`, token, { method: 'PUT' });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) { console.error(err); }
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      const token = await getToken();
      await apiAuth(`/api/contact/${id}`, token, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) { console.error(err); }
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead(msg._id);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-primary mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        <button onClick={fetchMessages}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition bg-transparent">
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-sm">
          No messages yet. Your contact form submissions will appear here.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
          {/* Message list */}
          <div className="overflow-y-auto space-y-2 pr-1">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => handleSelect(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all
                    ${selected?._id === msg._id
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-white/10 bg-white/5 hover:bg-white/8'}
                    ${!msg.read ? 'border-l-2 border-l-primary' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {msg.read
                        ? <FiMail size={14} className="text-gray-400 flex-shrink-0 opacity-40" />
                        : <FiMail     size={14} className="text-primary flex-shrink-0" />
                      }
                      <span className={`text-sm truncate ${msg.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{msg.subject || msg.email}</p>
                  <p className="text-xs text-gray-600 mt-1 truncate">{msg.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Message detail */}
          <div className="border border-white/10 rounded-xl bg-white/5 overflow-y-auto">
            {selected ? (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`}
                      className="text-sm text-primary hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => deleteMsg(selected._id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition bg-transparent">
                    <FiTrash2 size={16} />
                  </button>
                </div>

                {selected.subject && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Subject</p>
                    <p className="text-sm text-gray-300 mt-0.5">{selected.subject}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Message</p>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-lg border border-white/10">
                    {selected.message}
                  </p>
                </div>

                <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-white/10">
                  <p>Received: {new Date(selected.createdAt).toLocaleString()}</p>
                  {selected.ipAddress && <p>IP: {selected.ipAddress}</p>}
                </div>

                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                  className="inline-block px-4 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-yellow-300 transition">
                  Reply via Email
                </a>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                Select a message to read
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}