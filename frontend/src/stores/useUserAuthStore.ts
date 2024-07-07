import { useEffect } from 'react'; 
import { User } from '@/data/User';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useUserAuthStore = create<AuthStore>((set) => ({
  
  user: null, 
  token: null,
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    set({ user: null, token: null });
  },
}));

export function useRehydrateAuth() {
  const login = useUserAuthStore((state) => state.login);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      login(JSON.parse(user), token);
    }
  }, [login]);
}

export default useUserAuthStore;
