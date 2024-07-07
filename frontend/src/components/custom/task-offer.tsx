import useOfferStore from "@/stores/useOfferStore";
import useTaskStore from "@/stores/useTaskStore";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import { Check, Clock, DollarSign, Send, Text, User } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "@/stores/useUserStore";
import { Offer } from "@/data/Offer";
import AcceptOfferDialog from "../AcceptOfferDialog";
import { StatusOfTask } from "@/data/StatusOfTask";
import { OfferStatus } from "@/data/OfferStatus";

const TaskOffers = () => {
  const { selectedTask } = useTaskStore();
  const { getOffersByTaskId, offers, setSelectedOffer } = useOfferStore();
  const navigate = useNavigate();
  const { setSelectedUser } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedTask?.id !== undefined && selectedTask?.id !== null) {
      const numericId = Number(selectedTask?.id);
      if (!isNaN(numericId)) {
        getOffersByTaskId(numericId);
      }
    }
  }, [selectedTask?.id, getOffersByTaskId]);

  const openDialog = (offer: Offer) => {
    setIsDialogOpen(true);
    setSelectedOffer(offer);
  };

  const redirectToChat = (user: User | undefined) => {
    if (user) {
      navigate(`/chat`);
      setSelectedUser(user);
    } else {
      console.log("User not found");
    }
  };

  return (
    <div>
      {selectedTask && (
        <>
          {offers
            .filter(
              (offer) =>
                selectedTask.status === StatusOfTask.Otwarte ||
                (selectedTask.status !== StatusOfTask.Otwarte &&
                  offer.status === OfferStatus.Zaakceptowana)
            )
            .map((offer) => (
              <div
                className="flex space-x-10 py-5 items-center border-b-2"
                key={offer.id}
              >
                <Avatar
                  onClick={() => navigate(`/fachowiec/${offer.handyman.id}`)}
                  className="cursor-pointer"
                >
                  <AvatarImage src={offer.handyman.user?.Avatar} />
                  <AvatarFallback>
                    {getUserInitials(offer.handyman.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div
                    onClick={() => navigate(`/fachowiec/${offer.handyman.id}`)}
                    className="cursor-pointer flex space-x-1 items-center text-slate-500"
                  >
                    <User className="text-green-900 h-4" />{" "}
                    {offer.handyman.user?.name} {offer.handyman.user?.lastName}
                  </div>
                  <div className="flex space-x-1 items-center">
                    <Text className="text-green-900 h-4" /> {offer.comment}
                  </div>
                  <div className="flex space-x-1 items-center">
                    <Clock className="text-green-900 h-4" />{" "}
                    {offer.estimatedTime}
                  </div>
                  <div className="flex space-x-1 items-center">
                    <DollarSign className="text-green-900 h-4" /> {offer.price}
                    zł
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-slate-900"
                  onClick={() => redirectToChat(offer.handyman.user)}
                >
                  <Send className="mr-2 h-4 w-4 text-teal-600" />
                  Wyślij wiadomość
                </Button>
                {offer.status !== OfferStatus.Zaakceptowana && (
                  <Button
                    variant="outline"
                    className="text-slate-900"
                    onClick={() => openDialog(offer)}
                  >
                    <Check className="mr-2 h-4 w-4 text-teal-600" />
                    Przyjmij ofertę
                  </Button>
                )}

                <Link
                  to={`/fachowiec/${offer.handyman.id}`}
                  className="flex items-center"
                >
                  <User className="mr-2 h-4 w-4 text-teal-600" />
                  Zobacz profil
                </Link>
              </div>
            ))}
        </>
      )}

      <AcceptOfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default TaskOffers;
