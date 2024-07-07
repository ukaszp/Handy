import {create} from 'zustand';
import api from './api';
import { Photo } from '@/data/Photo';

interface PhotoStore {
    photos: Photo[];
    addPhoto: (photo: Photo) => void;
    deletePhoto: (photoId: number) => Promise<void>;
    uploadPhoto: (file: File) => Promise<Photo>;
    setPhotos: (photos: Photo[]) => void;
    photoError: string | null;
  }
  
const usePhotoStore = create<PhotoStore>((set, get) => ({
  photos: [],
  photoError: null,
  addPhoto: (photo) => {
    const { photos } = get();
    set({ photos: [...photos, photo] });
  },
  setPhotos: (photos) => {
    set({ photos });
  },
  deletePhoto: async (photoId) => {
    try {
      const response = await api.delete(`/photos/${photoId}`);
  
      if (response.status === 200 || response.status === 204) { 
        const { photos } = get();
        set({ photos: photos.filter((p) => p.id !== photoId), photoError: null });
      } else {
        set({ photoError: 'Error deleting photo' });
      }
    } catch (error) {
      console.error('Delete photo failed', error);
      set({ photoError: 'Delete photo failed' });
    }
  },
  
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file); 
  
    try {
      const response = await api.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      
      const uploadedPhoto = response.data;
      return uploadedPhoto; 
    } catch (error) {
      console.error('Upload photo failed', error);
      set({ photoError: 'Upload photo failed' });
      throw error; 
    }
  },
  
}));

export default usePhotoStore;
