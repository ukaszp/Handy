import useTaskStore from "@/stores/useTaskStore";
import useRatingStore from "@/stores/useRatingStore";
import Rating from "@mui/material/Rating";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

const RatingDialog = ({ isOpen, onOpenChange }) => {
  const { selectedTask } = useTaskStore();
  const { addRating } = useRatingStore();
  const [rateValue, setRateValue] = useState<number | null>(2); 
  const [textareaValue, setTextareaValue] = useState("");      


  const handleAddRating = async () => {
    console.log(selectedTask);

    if (selectedTask?.acceptedOfferId && rateValue !== null) {
      console.log("2");
      const ratingRequest = {
        offerId: selectedTask.acceptedOfferId,
        reviewContent: textareaValue,
        rate: rateValue,
      };
      await addRating(ratingRequest); 
      onOpenChange(false);   
      console.log(ratingRequest);         
      console.log(selectedTask.acceptedOfferId);         

    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj opinię</DialogTitle>
          <DialogDescription>
            Dodaj opinię o pracy fachowca. Zostanie ona wyswietlona w profilu fachowca.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 justify-center items-center">
          <Rating
            name="rating"
            value={rateValue}
            size="large"
            onChange={(event, newValue) => setRateValue(newValue)}
          />
          <div className="w-full space-y-2">
            <p className="text-slate-600 text-md">komentarz</p>
            <Textarea
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="items-center justify-center">
          <Button onClick={handleAddRating} className="text-slate-900" variant="outline">
            Dodaj opinię
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
