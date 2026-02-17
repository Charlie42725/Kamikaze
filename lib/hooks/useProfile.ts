import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Convenience hook that returns only the profile and loading state.
 * The profile data comes from the AuthProvider which fetches it
 * from the profiles table after authentication.
 */
export function useProfile() {
  const { profile, loading } = useAuth();
  return { profile, loading };
}
