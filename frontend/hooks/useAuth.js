'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser]       = useState(null);
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

  // Returns the current Firebase ID token (refreshed automatically)
  const getToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  const isAdmin = !loading && !!user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return { user, loading, isAdmin, login, logout, getToken };
}
