import { create } from "zustand";
import api from "./api";
import { toast } from "@/components/ui/use-toast";

interface RatingRespond {
  id: number;
  content: string;
}

interface RatingRespondStore {
  responds: RatingRespond[];
  setResponds: (responds: RatingRespond[]) => void;
  addRatingRespond: (respondContent: string, ratingId: number) => Promise<void>;
  getRatingRespond: (ratingRespondId: number) => Promise<void>;
  editRatingRespond: (respondId: number, content: string) => Promise<void>;
  removeRatingRespond: (respondId: number) => Promise<void>;
}

const useRatingRespondStore = create<RatingRespondStore & { respondError: string | null }>(
  (set) => ({
    responds: [],
    respondError: null,
    setResponds: (responds) => set({ responds }),

    addRatingRespond: async (respondContent: string, ratingId: number) => {
      try {
        await api.post(`/RatingRespond`, { content: respondContent, ratingId });
        toast({
          title: "Odpowiedź dodana",
          description: "Twoja odpowiedź została pomyślnie dodana.",
        });
      } catch (error) {
        console.error("Error adding respond", error);
        set({ respondError: "Błąd dodawania odpowiedzi" });
        toast({
          variant: "destructive",
          title: "Błąd!",
          description: "Nie udało się dodać odpowiedzi.",
        });
      }
    },

    getRatingRespond: async (ratingRespondId) => {
      try {
        const response = await api.get(`/api/RatingRespond/${ratingRespondId}`);
        set({ responds: [response.data], respondError: null });
      } catch (error) {
        console.error("Error fetching respond", error);
        set({ respondError: "Odpowiedź nie znaleziona" });
        toast({
          variant: "destructive",
          title: "Błąd!",
          description: "Odpowiedź nie znaleziona.",
        });
      }
    },

    editRatingRespond: async (respondId, content) => {
      try {
        await api.put(`/api/RatingRespond/${respondId}`, { content });
        toast({
          title: "Odpowiedź zaktualizowana",
          description: "Twoja odpowiedź została pomyślnie zaktualizowana.",
        });
        // Optionally refetch or update local state
      } catch (error) {
        console.error("Error editing respond", error);
        set({ respondError: "Odpowiedź nie znaleziona" });
        toast({
          variant: "destructive",
          title: "Błąd!",
          description: "Nie udało się zaktualizować odpowiedzi.",
        });
      }
    },

    removeRatingRespond: async (respondId) => {
      try {
        await api.delete(`/api/RatingRespond/${respondId}`);
        set((state) => ({
          responds: state.responds.filter(respond => respond.id !== respondId),
          respondError: null,
        }));
        toast({
          title: "Odpowiedź usunięta",
          description: "Odpowiedź została pomyślnie usunięta.",
        });
      } catch (error) {
        console.error("Error removing respond", error);
        set({ respondError: "Odpowiedź nie znaleziona" });
        toast({
          variant: "destructive",
          title: "Błąd!",
          description: "Nie udało się usunąć odpowiedzi.",
        });
      }
    },
  })
);

export default useRatingRespondStore;
