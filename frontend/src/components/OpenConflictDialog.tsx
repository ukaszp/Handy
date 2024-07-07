import useTaskStore from "@/stores/useTaskStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import useConflictStore from "@/stores/useConflictStore";
import useUserAuthStore from "@/stores/useUserAuthStore";

const OpenConflictDialog = ({ isOpen, onOpenChange }) => {
    const [textareaValue, setTextareaValue] = useState("");      
    const { selectedTask } = useTaskStore();
    const {openConflict} = useConflictStore();
    const user = useUserAuthStore((state) => state.user);

    const handleOpenConflict = async () => {
        if (!user) {
            console.error("No user data available.");
            return;
        }
    
        if (selectedTask?.acceptedOffer?.id) {
            const conflictRequest = {
                clientId: user.id,
                handymanId: selectedTask.acceptedOffer.handymanId,
                offerId: selectedTask.acceptedOffer.id,
                description: textareaValue,
            };
            await openConflict(conflictRequest); 
            onOpenChange(false);       
            console.log({conflictRequest});
            console.log({selectedTask});
        }
    };
  return (
    <div>
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj opinię</DialogTitle>
          <DialogDescription>
            Otwierasz konflikt z fachowcem.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 justify-center items-center">
          <div className="w-full space-y-2">
            <p className="text-slate-600 text-md">Opisz na czym polega problem. Nasza moderacja się tym zajmie.</p>
            <Textarea
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="items-center justify-center">
          <Button onClick={handleOpenConflict} className="text-slate-900" variant="outline">
            Utwórz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default OpenConflictDialog