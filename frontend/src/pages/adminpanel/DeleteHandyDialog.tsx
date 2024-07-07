import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useHandymanStore from "@/stores/useHandymanStore";

const DeleteHandyDialog = ({ isOpen, onOpenChange }) => {
  const { selectedHandyman, deleteHandyman } = useHandymanStore();

  const handleDeleteUser = () => {
    if (selectedHandyman) {
        deleteHandyman(selectedHandyman.id);
    }
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć użytkownika?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja jest nieodwracalna. Użytkownik <span className="text-slate-900 font-bold text-">{selectedHandyman?.user?.name} {selectedHandyman?.user?.lastName}</span>  zostanie na stałe usunięty z bazy danych.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteUser()} className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90" variant={"destructive"}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteHandyDialog;
