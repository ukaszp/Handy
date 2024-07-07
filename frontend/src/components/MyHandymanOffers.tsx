import useHandymanStore from "@/stores/useHandymanStore";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import { Clock, DollarSign, User, Text, CornerDownRight, MoreHorizontal, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useOfferStore from "@/stores/useOfferStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Offer } from "@/data/Offer";
import DeleteOfferDialog from "./DeleteOfferDialog";
import useUserStore from "@/stores/useUserStore";
import { OfferStatus } from "@/data/OfferStatus";

const MyHandymanOffers = () => {
  const { selectedHandyman, currentHandyman } = useHandymanStore();
  const { offers, getOffersByHandymenId, setSelectedOffer } = useOfferStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { setSelectedUser } = useUserStore();

  useEffect(() => {
    if (currentHandyman?.id !== undefined && currentHandyman?.id !== null) {
      const numericId = Number(currentHandyman?.id);
      if (!isNaN(numericId)) {
        getOffersByHandymenId(numericId);
      }
    }
  }, [currentHandyman?.id, getOffersByHandymenId]);

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
      <div className="flex space-x-20 text-basic justify-center">
        <Link
          to={`/fachowiec/${selectedHandyman?.id}`}
          className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600"
        >
          Opinie
        </Link>
        {currentHandyman?.id === selectedHandyman?.id && (
          <>
            <Link
              to={`/fachowiec/${selectedHandyman?.id}/mojespory`}
              className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600"
            >
              Spory
            </Link>
            <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
              Oferty
            </div>
          </>
        )}
      </div>
      <div className="my-6 mx-[12rem] py-2 flex justify-center items-center flex-col">
        {offers.map((offer) => (
          <div className="flex space-x-10 py-5" key={offer.id}>
            <Avatar>
              <AvatarImage src={offer.handyman.user?.Avatar} />
              <AvatarFallback>
                {getUserInitials(offer.handyman.user)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex space-x-1 items-center text-slate-500">
                <User className="text-green-900 h-4" />{" "}
                {offer.handyman.user?.name} {offer.handyman.user?.lastName}
              </div>
              <div className="flex space-x-1 items-center">
                <Text className="text-green-900 h-4" /> {offer.comment}
              </div>
              <div className="flex space-x-1 items-center">
                <Clock className="text-green-900 h-4" /> {offer.estimatedTime}
              </div>
              <div className="flex space-x-1 items-center">
                <DollarSign className="text-green-900 h-4" /> {offer.price}
              </div>
            </div>
            <div className="flex flex-col">
              <div>odnośnie zlecenia:</div>
              <div className="flex">
                <CornerDownRight className="h-4" />
                {offer.task.title} {offer.task.description}
              </div>
              <div className="flex flex-col mt-2">
                <div>Status:</div>
                {OfferStatus[offer.status]}
              </div>
            </div>
            <div>
            <Button
                  variant="outline"
                  className="text-slate-900"
                  onClick={() => redirectToChat(offer.task.user)}
                >
                  <Send className="mr-2 h-4 w-4 text-teal-600" />
                  Wiadomość do klienta
                </Button>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-right" asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-md hover:cursor-pointer bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                    onClick={() => openDialog(offer)}
                  >
                    Usuń ofertę
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <DeleteOfferDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default MyHandymanOffers;
