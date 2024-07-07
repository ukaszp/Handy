import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useConflictStore from "@/stores/useConflictStore";

const DeleteConflictDialog = ({ isOpen, onOpenChange }) => {
  const { selectedConflict, deleteConflict } = useConflictStore();

  const handleDeleteConflict = () => {
    if (selectedConflict) {
        deleteConflict(selectedConflict.id);
    }
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć konflikt?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja jest nieodwracalna. Konflikt <span className="text-slate-900 font-bold text-">id: {selectedConflict?.id} </span>  zostanie na stałe usunięty z bazy danych.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteConflict()} className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90" variant={"destructive"}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConflictDialog;
