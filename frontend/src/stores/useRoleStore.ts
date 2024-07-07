import { Role } from "@/data/Role";
import { create } from "zustand";
import api from "./api";

interface RoleStore {
    roles: Role[];
    selectedRole: Role | null; 
    isLoading: boolean;
    getAllRoles: () => void;
    setSelectedRole: (role: Role | null) => void;
}

const useRoleStore = create<RoleStore>((set) => ({
    roles: [],
    selectedRole: null,
    isLoading: false,

    getAllRoles: async () => {
        set({ isLoading: true });

        try {
            const response = await api.get('/role');
            const roles = response.data;
            set({ roles });
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setSelectedRole: (role) => {
        set({ selectedRole: role });
    }
}));

export default useRoleStore;
