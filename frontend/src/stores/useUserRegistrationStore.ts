import { create } from 'zustand';
import axios from 'axios';

interface UserData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmpassword: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  registrationError: string | null;
  register: (userData: UserData) => Promise<void>;
}

const useUserRegistrationStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  registrationError: null,
  register: async (userData: UserData) => {
    try {
      const response = await axios.post('https://localhost:7000/api/UserClient/register', userData);
      if (response.status === 200) {
        set({ isAuthenticated: true, registrationError: null });
      } else {
        set({ isAuthenticated: false, registrationError: response.data.error || 'Wystąpił błąd podczas rejestracji.' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      set({ isAuthenticated: false, registrationError: 'Wystąpił błąd podczas rejestracji.' });
    }
  },
}));


export default useUserRegistrationStore;
