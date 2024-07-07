import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import useTaskStore from "@/stores/useTaskStore";

const DeleteTaskDialog = ({ isOpen, onOpenChange }) => {
  const { selectedTask, deleteTask } = useTaskStore();

  const handleDeleteTask = () => {
    if (selectedTask) {
        deleteTask(selectedTask.id);
    }
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć zlecenie?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja jest nieodwracalna. Zlecenie <span className="text-slate-900 font-bold text-">id: {selectedTask?.id} tytuł: {selectedTask?.title}</span>  zostanie na stałe usunięty z bazy danych.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteTask()} className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90" variant={"destructive"}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskDialog;
