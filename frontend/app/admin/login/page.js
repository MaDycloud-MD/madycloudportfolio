// Login is now handled in /admin/page.js directly.
// Redirect anyone who lands here.
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin'); }, [router]);
  return null;
}