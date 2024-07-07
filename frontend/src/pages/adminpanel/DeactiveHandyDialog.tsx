
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useHandymanStore from "@/stores/useHandymanStore";

const DeactiveHandyDialog = ({ isOpen, onOpenChange }) => {
  const { selectedHandyman, changeStatus} = useHandymanStore();

  const handleDeactiveHandy = () => {
    if(selectedHandyman !== null)
    changeStatus(selectedHandyman.id)

  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz zmienić status fachowca?</AlertDialogTitle>
          <AlertDialogDescription>
            Aktualny status fachowca to: <span className="font-bold">{selectedHandyman?.isActive ? "aktywny" : "nieaktywny"}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeactiveHandy()} className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90" variant={"destructive"}>Zmień status</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeactiveHandyDialog;
