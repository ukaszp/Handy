import { create } from 'zustand';
import api from './api'; 
import { StatusOfTask } from "@/data/StatusOfTask";
import { Task } from "@/data/Task";
import { TaskRequest } from '@/data/TaskRequest';
import { toast } from '@/components/ui/use-toast';



interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  getTaskById: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  createTask: (taskData: TaskRequest) => Promise<void>;
  getAllActiveTasks: () => Promise<void>;
  getAllTasks: () => Promise<void>;
  getUserTasks: (clientId: number) => Promise<void>;
  changeTaskStatus: (taskId: number, status: StatusOfTask) => Promise<void>;
  changeTaskDescription: (taskId: number, description: string) => Promise<void>;
  finishTaskHandyman: (taskId: number) => Promise<void>; 
  finishTaskUser: (taskId: number) => Promise<void>;
}


const useTaskStore = create<TaskStore & { taskError: string | null }>((set) => ({
    tasks: [],
    taskError: null, 
    setTasks: (tasks) => set({ tasks }),
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
    getTaskById: async (taskId) => {
      try {
        const response = await api.get(`/tasks/${taskId}`);
        set({ selectedTask: response.data, taskError: null }); 
      } catch (error) {
        console.error('Nie znaleziono zlecenia', error);
        set({ taskError: 'Nie znaleziono zlecenia' }); 
      }
    },
    deleteTask: async (taskId) => {
      try {
        await api.delete(`/Task/${taskId}`);
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          taskError: null, 
        }));
        toast({
          title: "Usunięto zlecenie.",
          description: "Zlecenie zostało pomyślnie usunięte."
        });
      } catch (error) {
        console.error('Błąd podczas usuwania zlecenia', error);
        set({ taskError: 'Błąd podczas usuwania zlecenia' });
      }
    },
    createTask: async (taskData) => {
      try {
        const response = await api.post('/Task', taskData);
        set((state) => ({ tasks: [...state.tasks, response.data], taskError: null })); 
        toast({
          title: "Dodano zlecenie.",
          description: "Twoje zlecenie zostało pomyślnie dodane."
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "Błąd!",
            description: error.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Błąd",
            description: "Wystąpił nieznany bląd",
          });
        }
      }
    },
    getAllActiveTasks: async () => {
      try {
        const response = await api.get('/task/active');
        set({ tasks: response.data, taskError: null }); 
      } catch (error) {
        console.error('Błąd podczas pobierania aktywnych zleceń', error);
        set({ taskError: 'Błąd podczas pobierania aktywnych zleceń' }); 
      }
    },
    getAllTasks: async () => {
      try {
        const response = await api.get('/task/all');
        set({ tasks: response.data, taskError: null }); 
      } catch (error) {
        console.error('Błąd podczas pobierania aktywnych zleceń', error);
        set({ taskError: 'Błąd podczas pobierania aktywnych zleceń' }); 
      }
    },
    changeTaskStatus: async (taskId, status) => {
      try {
        await api.put(`/tasks/${taskId}/status`, { status });
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
          taskError: null,
        }));
      } catch (error) {
        console.error('Błąd podczas zmiany statusu zlecenia', error);
        set({ taskError: 'Błąd podczas zmiany statusu zlecenia' }); 
      }
    },
    changeTaskDescription: async (taskId, description) => {
      try {
        await api.put(`/tasks/${taskId}/description`, { description });
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, description } : task)),
          taskError: null, 
        }));
      } catch (error) {
        console.error('Błąd podczas aktualizacji opisu zlecenia', error);
        set({ taskError: 'Błąd podczas aktualizacji opisu zlecenia' }); 
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
          set({ tasks: response.data, taskError: null }); 
          return response.data;
        }
      } catch (error) {
        console.error('Error fetching tasks', error);
        set({ taskError: 'Error fetching tasks' });
      }
    },
    finishTaskHandyman: async (taskId) => {
      try {
        await api.put(`task/finishHandy/${taskId}`);
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? {
              ...task, 
              finishedHandyman: true
            } : task
          ),
          taskError: null
        }));
        toast({
          title: "Task Completed",
          description: "The task has been marked as completed by the handyman."
        });
      } catch (error) {
        console.error('Error completing the task', error);
        set({ taskError: 'Error completing the task' });
      }
    },
    
    finishTaskUser: async (taskId) => {
      try {
        await api.put(`task/finishUser/${taskId}`);
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? {
              ...task, 
              finishedHandyman: false
            } : task
          ),
          taskError: null
        }));
        toast({
          title: "Zakończono",
          description: "Zlecenie zostalo ustawione jako zakończone"
        });
      } catch (error) {
        console.error('Error completing the task', error);
        set({ taskError: 'Error completing the task' });
      }
    }
    
  }));
  
  export default useTaskStore;
  