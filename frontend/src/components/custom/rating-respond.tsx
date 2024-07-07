import { useState } from 'react';
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Input } from "../ui/input";
import useRatingStore from '@/stores/useRatingStore';
import useRatingRespondStore from '@/stores/useRatingRespondStore';
import useHandymanStore from '@/stores/useHandymanStore';

const RatingRespond = () => {
  const [responseContent, setResponseContent] = useState<string>("");
  const { addRatingRespond } = useRatingRespondStore();
  const {selectedRating} = useRatingStore();


  const handleResponseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseContent(event.target.value);
  };

  const handleSubmitResponse = async () => {
    if (selectedRating ) {
      await addRatingRespond(responseContent, selectedRating.id);
      setResponseContent(""); 
      console.log("ok");
    }
  };

  return (
    <div className="flex max-h-2 space-x-2">
      <Input
        className="resize-none"
        placeholder="Napisz odpowiedź..."
        value={responseContent}
        onChange={handleResponseChange}
      />
      <Button
        asChild
        variant="outline"
        className="bg-teal-600 text-white"
        onClick={handleSubmitResponse}
      >
        <div className="flex flex-row hover:cursor-pointer">
          <Send className="mr-2 h-4 w-4" />
          Wyślij
        </div>
      </Button>
    </div>
  );
};

export default RatingRespond;
