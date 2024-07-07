import { create } from 'zustand';
import api from './api';
import { StatusOfTask } from "@/data/StatusOfTask";
import { toast } from '@/components/ui/use-toast';
import { Conflict } from '@/data/Conflict';
import { ConflictRequest } from '@/data/ConflictRequest';

interface ConflictStore {
  conflicts: Conflict[];
  selectedConflict: Conflict | null;
  setSelectedConflict: (conflict: Conflict | null) => void;
  openConflict: (conflictData: ConflictRequest) => Promise<void>;
  changeConflictStatus: (conflictId: number, status: StatusOfTask) => Promise<void>;
  deleteConflict: (conflictId: number) => Promise<void>;
  getOpenConflicts: () => Promise<void>;
  getHandymenConflicts: (handymenId: number) => Promise<void>;
  getUserConflicts: (userId: number) => Promise<void>;
}

const useConflictStore = create<ConflictStore>((set, get) => ({
  conflicts: [],
  selectedConflict: null,

  setSelectedConflict: (conflict) => set({ selectedConflict: conflict }),

  getOpenConflicts: async () => {
    try {
      const response = await api.get('Conflict/open');
      set({ conflicts: response.data });
     
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nie udało się pobrać konfliktów",
        description: "Wystąpił błąd podczas pobierania konfliktów."
      });
    }
  },

  getHandymenConflicts: async (handymenId) => {
    try {
      const response = await api.get(`Conflict/handymenconflicts/${handymenId}`);
      set({ conflicts: response.data });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nie udało się pobrać konfliktów",
        description: "Wystąpił błąd podczas pobierania konfliktów."
      });
    }
  },

  getUserConflicts: async (userId) => {
    try {
      const response = await api.get(`Conflict/userconflicts/${userId}`);
      set({ conflicts: response.data });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nie udało się pobrać konfliktów",
        description: "Wystąpił błąd podczas pobierania konfliktów."
      });
    }
  },

  openConflict: async (conflictData) => {
    try {
      const response = await api.post('/Conflict', conflictData);
      set((state) => ({ conflicts: [...state.conflicts, response.data], selectedConflict: response.data }));
      toast({
        title: "Konflikt otwarty",
        description: "Konflikt został pomyślnie otwarty."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nie udało się otworzyć konfliktu",
        description: "Wystąpił błąd podczas otwierania konfliktu."
      });
    }
  },

  changeConflictStatus: async (conflictId, status) => {
    try {
      await api.put(`/Conflict/${conflictId}/status`, { status });
      set((state) => ({
        conflicts: state.conflicts.map((conflict) =>
          conflict.id === conflictId ? { ...conflict, status } : conflict
        ),
        selectedConflict: state.selectedConflict && state.selectedConflict.id === conflictId
          ? { ...state.selectedConflict, status } : state.selectedConflict
      }));
      toast({
        title: "Status konfliktu zaktualizowany",
        description: `Status konfliktu zaktualizowany na ${status}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nie udało się zaktualizować statusu",
        description: "Wystąpił błąd podczas aktualizacji statusu."
      });
    }
  },

  deleteConflict: async (conflictId) => {
    try {
      await api.delete(`/Conflict/${conflictId}`);
      set((state) => ({
        conflicts: state.conflicts.filter((conflict) => conflict.id !== conflictId),
        selectedConflict: state.selectedConflict && state.selectedConflict.id === conflictId ? null : state.selectedConflict
      }));
      toast({
        title: "Konflikt usunięty",
        description: "Konflikt został pomyślnie usunięty."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nie udało się usunąć konfliktu",
        description: "Wystąpił błąd podczas usuwania konfliktu."
      });
    }
  },

}));

export default useConflictStore;
