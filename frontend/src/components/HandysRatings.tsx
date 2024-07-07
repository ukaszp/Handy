import useHandymanStore from "@/stores/useHandymanStore";
import useRatingStore from "@/stores/useRatingStore";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import { Rating } from "@mui/material";
import RatingRespond from "./custom/rating-respond";
import { Hammer } from "lucide-react";
import { Link } from "react-router-dom";

const HandysRatings = () => {
  const { selectedHandyman, currentHandyman } = useHandymanStore();
  const { ratings, getHandymanRatings } = useRatingStore();

  useEffect(() => {
    if (selectedHandyman?.id !== undefined && selectedHandyman?.id !== null) {
      const numericId = Number(selectedHandyman?.id);
      if (!isNaN(numericId)) {
        getHandymanRatings(numericId);
      }
    }
  }, [selectedHandyman?.id, getHandymanRatings]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return "Invalid date";
  };

  return (
    <div>
      <div className="flex space-x-20 text-basic justify-center">
        <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
          Opinie
        </div>
        {currentHandyman?.id === selectedHandyman?.id && (
          <>
            <Link
              to={`/fachowiec/${selectedHandyman?.id}/mojespory`}
              className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600"
            >
              Spory
            </Link>
            <Link
              to={`/fachowiec/${selectedHandyman?.id}/mojeoferty`}
              className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600"
            >
              Oferty
            </Link>
          </>
        )}
      </div>
      <div className="my-6 mx-[12rem] py-2 flex justify-center">
        {ratings && ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating.id} className="justify-center flex flex-col">
              <div className="w-[40rem] justify-center items-center m-2 space-y-3 border-b-2 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 w-1/3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={rating?.user?.Avatar} />
                      <AvatarFallback>
                        {getUserInitials(rating?.user)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {rating.user.name} {rating.user.lastName}
                    </div>
                  </div>
                  <div className="w-1/3 flex justify-center">
                    <p className="text-slate-500 text-sm">
                      {formatDate(rating.creationDate)}
                    </p>
                  </div>
                </div>
                <div>
                  <Rating name="read-only" value={rating.rate} readOnly />
                </div>
                <div className="text-lg">{rating.reviewContent}</div>
              </div>
            </div>
          ))
        ) : (
          <p>Brak ocen.</p>
        )}
      </div>
    </div>
  );
};

export default HandysRatings;
