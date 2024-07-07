import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import useOfferStore from "@/stores/useOfferStore";

const AcceptOfferDialog = ({ isOpen, onOpenChange }) => {
  const { selectedOffer, acceptOffer } = useOfferStore();


  const handleAccept = () => {
    if (selectedOffer) {
        acceptOffer(selectedOffer.id);
    }
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz przyjąć ofertę?</AlertDialogTitle>
          <AlertDialogDescription>
            Akceptując ofertę, godzisz się na warunki zaproponowane przez fachowca. Upewnij się, że oferta Ci odpowiada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleAccept()} className="bg-green-800 text-slate-50 dark:text-slate-50">Akceptuj</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptOfferDialog;
