import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export const useAdmin = () => {
  const { user, profile, loading } = useAuth();

  const isAdmin = useMemo(() => {
    if (!profile) return false;
    return profile.role === 'admin' || profile.role === 'super_admin';
  }, [profile]);

  const isSuperAdmin = useMemo(() => {
    if (!profile) return false;
    return profile.role === 'super_admin';
  }, [profile]);

  return {
    user,
    profile,
    loading,
    isAdmin,
    isSuperAdmin,
    isAuthenticated: !!user,
  };
};