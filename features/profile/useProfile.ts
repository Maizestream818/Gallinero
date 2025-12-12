import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export function useProfile() {
  const { githubId, token } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(
          `http://10.147.18.126:3000/api/perfil/${githubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProfile(res.data);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [githubId]);

  return { profile, loading };
}
