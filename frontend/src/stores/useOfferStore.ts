import { create } from 'zustand';
import api from './api'; // Assumed API utility based on your TaskStore
import { toast } from '@/components/ui/use-toast';
import { Offer } from '@/data/Offer';
import CreateOfferDto from '@/data/CreateOfferDto';
import { OfferStatus } from '@/data/OfferStatus';


interface OfferStore {
  offers: Offer[];
  setOffers: (offers: Offer[]) => void;
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer | null) => void;
  getOfferById: (offerId: number) => Promise<void>;
  deleteOffer: (offerId: number) => Promise<void>;
  createOffer: (offerData: CreateOfferDto) => Promise<void>;
  changeOfferStatus: (offerId: number, status: OfferStatus) => Promise<void>;
  getOffersByTaskId: (taskId: number) => Promise<void>;
  getOffersByHandymenId: (handymenId: number) => Promise<void>;
  acceptOffer: (taskId: number) => Promise<void>;
}

const useOfferStore = create<OfferStore & { offerError: string | null }>((set) => ({
  offers: [],
  offerError: null,
  setOffers: (offers) => set({ offers }),
  selectedOffer: null,
  setSelectedOffer: (offer) => set({ selectedOffer: offer }),
  getOfferById: async (offerId) => {
    try {
      const response = await api.get(`/Offer/${offerId}`);
      set({ selectedOffer: response.data, offerError: null });
    } catch (error) {
      console.error('Offer not found', error);
      set({ offerError: 'Offer not found' });
    }
  },
  deleteOffer: async (offerId) => {
    try {
      await api.delete(`/Offer/${offerId}`);
      set((state) => ({
        offers: state.offers.filter((offer) => offer.id !== offerId),
        offerError: null,
      }));
    } catch (error) {
      console.error('Error deleting offer', error);
      set({ offerError: 'Error deleting offer' });
    }
  },
  createOffer: async (offerData) => {
    try {
      const response = await api.post(`/Offer`, offerData);
      set((state) => ({ offers: [...state.offers, response.data], offerError: null }));
      toast({
        title: "Offer added.",
        description: "Your offer was successfully added."
      });
    } catch (error) {
      console.error('Error creating offer', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "There was an error creating the offer."
      });
    }
  },
  changeOfferStatus: async (offerId, status) => {
    try {
      await api.put(`/Offer/${offerId}/status`, { status });
      set((state) => ({
        offers: state.offers.map((offer) => offer.id === offerId ? { ...offer, status } : offer),
        offerError: null,
      }));
    } catch (error) {
      console.error('Error changing offer status', error);
      set({ offerError: 'Error changing offer status' });
    }
  },
  getOffersByTaskId: async (taskId) => {
    try {
      const response = await api.get(`/Offer/getbytaskid/${taskId}`);
      set({ offers: response.data, offerError: null });
    } catch (error) {
      console.error('Offer not found', error);
      set({ offerError: 'Offer not found' });
    }
  },
  getOffersByHandymenId: async (handymenId) => {
    try {
      const response = await api.get(`/Offer/getbyhandymenid/${handymenId}`);
      set({ offers: response.data, offerError: null });
    } catch (error) {
      console.error('Offer not found', error);
      set({ offerError: 'Offer not found' });
    }
  },
  acceptOffer: async (offerId) => {
    try {
      await api.put(`/Offer/accept/${offerId}`, { status });
      toast({
        title: "Zaakceptowano ofertę",
        description: "Oferta została zaakceptowana"
      });
    } catch (error) {
      console.error('Error changing offer status', error);
      set({ offerError: 'Error changing offer status' });
    }
  },
}));

export default useOfferStore;
