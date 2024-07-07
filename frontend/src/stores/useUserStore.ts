import { create } from 'zustand';
import api from './api';
import { toast } from '@/components/ui/use-toast';
import { User } from "@/data/User"; 
import { UpdateUserDto } from '@/data/UpdateUserDto';

interface UserStore {
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  getAllUsers: () => Promise<void>;
  getUserById: (userId: number) => Promise<void>;
  updateUser: (userId: number, userData: UpdateUserDto) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  assignRoleToUser: (roleId: number, userId: number) => Promise<void>;
}

const useUserStore = create<UserStore & { userError: string | null }>((set) => ({
  users: [],
  userError: null,
  setUsers: (users) => set({ users }),
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  getAllUsers: async () => {
    try {
      const response = await api.get('/account/all');
      set({ users: response.data, userError: null });
    } catch (error) {
      console.error('Error fetching users', error);
      set({ userError: 'Error fetching users' });
    }
  },
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/account/${userId}`);
      set({ selectedUser: response.data, userError: null });
    } catch (error) {
      console.error('User not found', error);
      set({ userError: 'User not found' });
    }
  },
  getUserTasks: async (clientId) => {
    try {
      const response = await api.get(`/UserClient/${clientId}/tasks`);
      if (!response.data || response.data.length === 0) {
        toast({
          title: "No tasks found.",
          description: "No tasks were found for this client."
        });
      } else {
        
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching tasks', error);
      set({ userError: 'Error fetching tasks' });
    }
  },
  updateUser: async (userId, userData) => {
    try {
      await api.put(`/account/${userId}`, userData);
      set((state) => ({
        users: state.users.map((user) => user.id === userId ? { ...user, ...userData } : user),
        userError: null,
      }));
      toast({
        title: "User updated.",
        description: "The user has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating user', error);
      set({ userError: 'Error updating user' });
    }
  },
  deleteUser: async (userId) => {
    try {
      await api.delete(`/account/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        userError: null,
      }));
      toast({
        title: "Usunięto użytkownika.",
        description: "Użytkownik zostal pomyślnie usunięty."
      });
    } catch (error) {
      console.error('Error deleting user', error);
      set({ userError: 'Error deleting user' });
    }
  },
  assignRoleToUser: async (roleId: number , userId: number) => {
    try {
      await api.put(`/account/assignrole/${roleId}/${userId}`);
      set((state) => ({
        users: state.users.map((user) => 
          user.id === userId ? { ...user, roleId: roleId } : user
        ),
        userError: null, 
      }));
      toast({
        title: "Przypisano rolę.",
        description: "Role została przypisana użytkownikowi."
      });
    } catch (error) {
      console.error('Error assigning role', error);
      set({ userError: 'Error assigning role' });
    }
  },
}));

export default useUserStore;
