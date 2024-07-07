import useOfferStore from "@/stores/useOfferStore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { OfferStatus } from "@/data/OfferStatus";
import { toast } from "./ui/use-toast";

const DeleteOfferDialog = ({ isOpen, onOpenChange }) => {
  const { selectedOffer, deleteOffer} = useOfferStore();

  const handleDeleteOffer = () => {
    if (selectedOffer && selectedOffer.status !== OfferStatus.Zaakceptowana) { 
        deleteOffer(selectedOffer.id);
    }
    else if(selectedOffer && selectedOffer.status === OfferStatus.Zaakceptowana)
      {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie można usunąć zaakceptowanej oferty. skontaktuj się z obsługą kienta",
        })
      }
    else
    {
      {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie znaleziono oferty.",
        })
      }
    }
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć ofertę?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja jest nieodwracalna
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteOffer()} className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90" variant={"destructive"}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteOfferDialog;
