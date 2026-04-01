'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const adminEmailsRaw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
const adminEmails = adminEmailsRaw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  
  const getToken = async () => auth.currentUser ? auth.currentUser.getIdToken() : null;

  const isAdmin = !loading && !!user && adminEmails.includes(user.email?.toLowerCase() ?? '');

  return { user, loading, isAdmin, login, logout, getToken };
}