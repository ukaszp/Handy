import { create } from "zustand";
import api from "./api"; // Assuming this is your API setup file
import { Handyman } from "@/data/Handyman";
import AddHandyDto from "@/data/HandymanRequest";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

interface HandymanStore {
  handymen: Handyman[];
  setHandymen: (handymen: Handyman[]) => void;
  selectedHandyman: Handyman | null;
  currentHandyman: Handyman | null;
  setSelectedHandyman: (handyman: Handyman | null) => void;
  setCurrentHandyman: (userId: number) => Promise<void>;
  getHandymanById: (handymanId: number) => Promise<void>;
  registerHandyman: (handymanData: AddHandyDto) => Promise<void>;
  deleteHandyman: (handymanId: number) => Promise<void>;
  addHandymanSkills: (skillIds: number[], handymanId: number) => Promise<void>;
  getHandymanSkills: (handymanId: number) => Promise<void>;
  getAllActiveHandyman: () => Promise<void>;
  getAllHandyman: () => Promise<void>;
  searchHandymen: (
    search: string,
    pageNumber: number,
    pageSize: number
  ) => Promise<{ handymen: Handyman[]; total: number }>;
  changeStatus: (handymanId: number) => Promise<void>;

}

const useHandymanStore = create<
  HandymanStore & { handymanError: string | null }
>((set) => ({
  handymen: [],
  handymanError: null,
  selectedHandyman: null,
  currentHandyman: null,
  setHandymen: (handymen) => set({ handymen }),
  setSelectedHandyman: (handyman) => set({ selectedHandyman: handyman }),
  setCurrentHandyman: async (userId) => {
    try {
      const response = await api.get(`/Handyman/getuser/${userId}`);
      set({ currentHandyman: response.data, handymanError: null });
      console.log(response.data);
    } catch (error) {
      console.error("Error finding handyman by user ID", error);
      set({
        currentHandyman: null,
        handymanError: "Error finding handyman by user ID",
      });
    }
  },
  getHandymanById: async (handymanId) => {
    try {
      const response = await api.get(`/Handyman/${handymanId}`);
      set({ selectedHandyman: response.data, handymanError: null });
    } catch (error) {
      console.error("Error finding handyman", error);
      set({ handymanError: "Error finding handyman" });
    }
  },
  registerHandyman: async (handymanData) => {
    try {
      const response = await api.post("/handyman", handymanData);
      set((state) => ({
        handymen: [...state.handymen, response.data],
        handymanError: null,
      }));
    } catch (error) {
      console.error("Error registering handyman", error);
      set({ handymanError: "Error registering handyman" });
    }
  },

  
  deleteHandyman: async (handymanId) => {
    try {
      await api.delete(`/handymen/${handymanId}`);
      set((state) => ({
        handymen: state.handymen.filter((hm) => hm.id !== handymanId),
        handymanError: null,
      }));
    } catch (error) {
      console.error("Error deleting handyman", error);
      set({ handymanError: "Error deleting handyman" });
    }
  },
  addHandymanSkills: async (skillIds, handymanId) => {
    try {
      await api.post(`/handymen/${handymanId}/skills`, { skillIds });
      set({ handymanError: null });
    } catch (error) {
      console.error("Error adding skills to handyman", error);
      set({ handymanError: "Error adding skills to handyman" });
    }
  },
  getHandymanSkills: async (handymanId) => {
    try {
      await api.get(`/handymen/${handymanId}/skills`);
      set({ handymanError: null });
    } catch (error) {
      console.error("Error fetching handyman skills", error);
      set({ handymanError: "Error fetching handyman skills" });
    }
  },
  getAllActiveHandyman: async () => {
    try {
      const response = await api.get("/Handyman/active");
      set({ handymen: response.data, handymanError: null });
    } catch (error) {
      console.error("Błąd podczas pobierania", error);
      set({ handymanError: "Błąd podczas pobierania listy fachowców" });
    }
  },
  getAllHandyman: async () => {
    try {
      const response = await api.get("/Handyman");
      set({ handymen: response.data, handymanError: null });
    } catch (error) {
      console.error("Błąd podczas pobierania", error);
      set({ handymanError: "Błąd podczas pobierania listy fachowców" });
    }
  },
  searchHandymen: async (search: string, pageNumber: number, pageSize: number) => {
    try {
      const response = await api.get(
        `Handyman/search?search=${encodeURIComponent(
          search
        )}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (response.data && response.data.length > 0) {
        set({ handymen: response.data, handymanError: null });
        console.log(response.data);
        return { handymen: response.data.handymen, total: response.data.total };
      } else {
        set({
          handymen: [],
          handymanError: "No handymen found matching the search criteria.",
        });
        console.log("No handymen found matching the search criteria");
        return { handymen: [], total: 0 };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          set({
            handymanError: "Nie znaleziono fachowców o podanych kryteriach",
            handymen: []
          });
          toast({
            title: "Błąd!",
            description: "Nie znaleziono fachowców.",
          });
        } else {
          set({ handymanError: `An error occurred: ${error.message}` });
        }
      } else {
        console.error("Error searching handymen", error);
        set({ handymanError: `An error occurred.` });
        return { handymen: [], total: 0 };
      }
    }
  },
  changeStatus: async (handymanId: number) => {
    try {
      await api.put(`Handyman/status/${handymanId}`);
      set((state) => ({
        handymen: state.handymen.map(hm =>
          hm.id === handymanId ? { ...hm, isActive: false } : hm
        ),
        handymanError: null,
      }));
      toast({
        title: "Zmieniono status fachowca",
        description: "status zostal zmieniony.",
      });
    } catch (error) {
      console.error("Error deactivating handyman", error);
      set({ handymanError: `An error occurred.` });
      toast({
        title: "Błąd!",
        description: `Wystąpił błąd`,
      });
    }
  },
}));

export default useHandymanStore;
