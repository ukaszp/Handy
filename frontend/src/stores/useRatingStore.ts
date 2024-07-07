import { create } from "zustand";
import api from "./api";
import { toast } from "@/components/ui/use-toast";
import { Rating } from "@/data/Rating";
import { RatingRequest } from "@/data/RatingRequest";

interface RatingStore {
  ratings: Rating[];
  selectedRating: Rating | null;
  setRatings: (ratings: Rating[]) => void;
  setSelectedRating: (rating: Rating | null) => void; 
  addRating: (ratingData: RatingRequest) => Promise<void>;
  getRating: (ratingId: number) => Promise<void>;
  deleteRating: (ratingId: number) => Promise<void>;
  getRatingResponds: (ratingId: number) => Promise<void>;

  getHandymanRatings: (handymanId: number) => Promise<void>;
}

const useRatingStore = create<RatingStore & { ratingError: string | null }>(
  (set) => ({
    ratings: [],
    selectedRating: null,
    ratingError: null,
    setRatings: (ratings) => set({ ratings }),
    setSelectedRating: (rating) => set({ selectedRating: rating }),  
    

    addRating: async (ratingData) => {
      try {
        const response = await api.post(`/Rating`, ratingData);
        set((state) => ({
          ratings: [...state.ratings, response.data],
          ratingError: null,
        }));
        toast({
          title: "Dodano opinię",
          description: "Twoja opinia została dodana.",
        });
      } catch (error) {
        console.error("Error adding rating", error);
        set({ ratingError: "Error adding rating" });
        toast({
          variant: "destructive",
          title: "Błąd!",
          description: "Nie udało się dodać opinii.",
        });
      }
    },

    getRating: async (ratingId) => {
      try {
        const response = await api.get(`/api/Rating/${ratingId}`);
        set({ ratings: [response.data], ratingError: null });
      } catch (error) {
        console.error("Error fetching rating", error);
        set({ ratingError: "Rating not found" });
      }
    },

    deleteRating: async (ratingId) => {
      try {
        await api.delete(`/api/Rating/${ratingId}`);
        set((state) => ({
          ratings: state.ratings.filter(
            (rating) => rating.offerId !== ratingId
          ),
          ratingError: null,
        }));
        toast({
          title: "Rating Deleted",
          description: "The rating has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting rating", error);
        set({ ratingError: "Rating not found" });
      }
    },

    getRatingResponds: async (ratingId) => {
      try {
        const response = await api.get(`/api/Rating/${ratingId}/responds`);
        if (!response.data || response.data.length === 0) {
          toast({
            title: "No Responds Found",
            description: "No responds found for this rating.",
          });
        } else {
          set({ ratings: response.data, ratingError: null });
        }
      } catch (error) {
        console.error("Error fetching rating responds", error);
        set({ ratingError: "No responds found" });
      }
    },
    getHandymanRatings: async (handymanId) => {
      try {
        const response = await api.get(`/Handyman/${handymanId}/ratings`);
        set({ ratings: response.data, ratingError: null });
      } catch (error) {
        console.error("Error fetching handyman ratings", error);
        set({
          ratings: undefined,
          ratingError: "Error fetching handyman ratings",
        });
      }
    },
  })
);

export default useRatingStore;
