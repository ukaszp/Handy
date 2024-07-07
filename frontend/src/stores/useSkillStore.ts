import { create } from 'zustand';
import api from './api'; 
import { Skill } from "@/data/Skill";



interface SkillStore {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  selectedSkill: Skill | null;
  setSelectedSkill: (skill: Skill | null) => void;
  getSkillById: (skillId: number) => Promise<void>;
  getSkills: () => void;
  deleteSkill: (skillId: number) => Promise<void>;
  createSkill: (skill: string) => Promise<void>;
}


const useSkillStore = create<SkillStore & { skillError: string | null }>((set) => ({
    skills: [],
    skillError: null, 
    setSkills: (skills) => set({ skills }),
    selectedSkill: null,
    setSelectedSkill: (skill) => set({ selectedSkill: skill }),
    getSkillById: async (skillId) => {
      try {
        const response = await api.get(`/skill/${skillId}`);
        set({ selectedSkill: response.data, skillError: null }); 
      } catch (error) {
        console.error('Nie znaleziono zlecenia', error);
        set({ skillError: 'Nie znaleziono zlecenia' }); 
      }
    },
    getSkills: async () => {
        try {
          const response = await api.get('/skill');
          const skills = response.data;
          set({ skills });
        } catch (error) {
          console.error('no data', error);
        }
      },
    deleteSkill: async (skillId) => {
      try {
        await api.delete(`/skill/${skillId}`);
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== skillId),
          skillError: null, 
        }));
      } catch (error) {
        console.error('Błąd podczas usuwania zlecenia', error);
        set({ skillError: 'Błąd podczas usuwania zlecenia' });
      }
    },
    createSkill: async (skillName: string) => {
      try {
        const payload = JSON.stringify(skillName); 
        const response = await api.post('/skill', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        set((state) => ({
          skills: [...state.skills, response.data],
          skillError: null
        }));
      } catch (error) {
        console.error('Error creating skill', error);
        set({ skillError: 'Error creating skill' });
      }
    },
    
    
  }));
  
  export default useSkillStore;
  