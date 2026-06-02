'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/slices/authSlice';
import Swal from 'sweetalert2';

export default function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    
    // We expect the backend to pass basic user info via URL or we fetch it later
    // For now, let's assume the backend provides token & role
    if (token) {
      // In a real app, we would now fetch /api/v1/user to get full details
      // But for the redirect flow, we'll store the token and fetch user info
      fetch('http://localhost:8000/api/v1/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          dispatch(setCredentials({ user: data.data, token }));
          Swal.fire({
            icon: 'success',
            title: 'Welcome back!',
            text: `Signed in as ${data.data.name}`,
            background: '#0f172a',
            color: '#fff',
            timer: 2000,
            showConfirmButton: false
          });
          router.replace(data.data.role === 'customer' ? '/account' : '/dashboard');
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: 'We couldn\'t verify your social login.',
          background: '#0f172a',
          color: '#fff',
        });
      });
    }
  }, [searchParams, dispatch, router]);

  return null; // This component doesn't render anything
}
