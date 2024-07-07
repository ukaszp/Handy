import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import useHandymanStore from "@/stores/useHandymanStore";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Container from "./custom/container";
import { Link, MapPin, Send, Text } from "lucide-react";
import { Button } from "./ui/button";
import useUserStore from "@/stores/useUserStore";
import { User } from "@/data/User";
import HandysRatings from "./HandysRatings";
import MyHandymanOffers from "./MyHandymanOffers";
import useUserAuthStore from "@/stores/useUserAuthStore";
import MyHandymanConflicts from "./MyHandymanConflicts";

const HandyProfile = () => {
  const { getHandymanById, selectedHandyman } = useHandymanStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedUser } = useUserStore();
  const user = useUserAuthStore((state) => state.user);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        getHandymanById(numericId);
      }
    }
    console.log({user});
    console.log({selectedHandyman});
  }, [id, getHandymanById]);

  const redirectToChat = (user: User | undefined) => {
    if (user) {
      navigate(`/chat`);
      setSelectedUser(user);
    } else {
      console.log("User not found");
    }
  };

  return (
    <Container>
      <div className="flex m-10 justify-center items-center space-x-14 text-slate-600">
        <Avatar className="w-[15rem] h-[15rem]">
          <AvatarImage src={selectedHandyman?.user?.Avatar} />
          <AvatarFallback>
            {getUserInitials(selectedHandyman?.user)}
          </AvatarFallback>
        </Avatar>
        <div className="mx-5 space-y-2">
          <h1 className="text-2xl flex items-center justify-top space-x-2">
            <p className="uppercase">
              {selectedHandyman?.user?.name} {selectedHandyman?.user?.lastName}
            </p>
          </h1>
          <h1 className="text-2xl flex items-center justify-left text-md space-x-2">
            <Text className="text-green-900 mr-2 h-4 w-4" />
            <p className=" text-lg">{selectedHandyman?.description}</p>
          </h1>
          <h1 className="text-2xl flex items-center justify-left text-md space-x-2">
            <Link className="text-green-900 mr-2 h-4 w-4" />
            <p className="text-lg">{selectedHandyman?.portfolioURL}</p>
          </h1>
          <h1 className="text-2xl flex items-center justify-left text-md space-x-2">
            <MapPin className="text-green-900 mr-2 h-4 w-4" />
            <p className="text-lg">{selectedHandyman?.region?.name}</p>
          </h1>
        </div>
        {selectedHandyman?.user?.id !== user?.id && (
          <Button
            className="text-slate-500"
            variant="outline"
            onClick={() => redirectToChat(selectedHandyman?.user)}
          >
            <Send className="mr-2 h-4 w-4 text-teal-600" />
            Wiadomość
          </Button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<HandysRatings />} />
        <Route path="/mojeoferty" element={<MyHandymanOffers />} />
        <Route path="/mojespory" element={<MyHandymanConflicts />} />
      </Routes>
    </Container>
  );
};

export default HandyProfile;
