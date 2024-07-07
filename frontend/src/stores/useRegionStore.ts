import {create} from 'zustand';
import api from './api'; // Make sure this points to your axios instance
import { Region } from '@/data/Region';

interface RegionStore {
    regions: Region[];
    selectedRegion: Region | null;
    setRegions: (regions: Region[]) => void;
    setSelectedRegion: (region: Region | null) => void;
    addRegion: (regionName: string) => Promise<void>;
    getRegions: () => Promise<void>;
    getRegionById: (id: number) => Promise<void>;
    updateRegion: (id: number, newName: string) => Promise<void>;
    deleteRegion: (id: number) => Promise<void>;
    regionError: string | null;
  }

const useRegionStore = create<RegionStore>((set) => ({
  regions: [],
  selectedRegion: null,
  regionError: null,
  setRegions: (regions) => {
    set({ regions });
  },
  setSelectedRegion: (region) => {
    set({ selectedRegion: region }); 
  },
  addRegion: async (regionName) => {
    try {
      const response = await api.post('/Regions', { name: regionName });
      set((state) => ({ regions: [...state.regions, response.data] }));
    } catch (error) {
      console.error('Add region failed', error);
      set({ regionError: 'Add region failed' });
    }
  },
  getRegions: async () => {
    try {
      const response = await api.get('/Regions');
      set({ regions: response.data });
    } catch (error) {
      console.error('Get regions failed', error);
      set({ regionError: 'Get regions failed' });
    }
  },
  getRegionById: async (id) => {
    try {
      const response = await api.get(`/Regions/${id}`);

    } catch (error) {
      console.error('Get region by id failed', error);
      set({ regionError: 'Get region by id failed' });
    }
  },
  updateRegion: async (id, newName) => {
    try {
      await api.put(`/Regions/${id}`, { name: newName });
      set((state) => ({
        regions: state.regions.map((region) => region.id === id ? { ...region, name: newName } : region),
      }));
    } catch (error) {
      console.error('Update region failed', error);
      set({ regionError: 'Update region failed' });
    }
  },
  deleteRegion: async (id) => {
    try {
      await api.delete(`/Regions/${id}`);
      set((state) => ({
        regions: state.regions.filter((region) => region.id !== id),
      }));
    } catch (error) {
      console.error('Delete region failed', error);
      set({ regionError: 'Delete region failed' });
    }
  },
}));

export default useRegionStore;
