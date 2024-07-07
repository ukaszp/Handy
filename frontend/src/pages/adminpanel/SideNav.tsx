import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useUserAuthStore from "@/stores/useUserAuthStore";
import { getUserInitials } from "@/utils/userUtils";
import { ClipboardList, Flag, Hammer, Lightbulb, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const SideNav = () => {
  const user = useUserAuthStore((state) => state.user);

  return (
    <div >
      <div className="flex items-center space-x-4 m-10 justify-center ">
        <Avatar className="rounded-full border-2 border-slate-300">
          <AvatarImage src={user?.Avatar} />
          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
        </Avatar>
        <p className="text-xl font-semibold">
          {user?.name} {user?.lastName}
        </p>
        <Shield className="mr-2 h-6 w-6 mx-2 text-teal-600" />
      </div>
      <Separator className=""/>
      <div className="my-5">
        <Link to="/admin/">
          <Button className="w-full p-6 bg-transparent text-black text-lg space-x-5 justify-start pl-16 hover:bg-slate-300">
            <Users className="text-teal-600" />
            <p>Użytkownicy</p>
          </Button>
        </Link>
        <Link to="listazlecen">
          <Button className="w-full p-6 bg-transparent text-black text-lg space-x-5 justify-start pl-16 hover:bg-slate-300">
            <ClipboardList  className="text-teal-600" />
            <p>Zlecenia</p>
          </Button>
        </Link>
        <Link to="fachowcy">
          <Button className="w-full p-6 bg-transparent text-black text-lg space-x-5 justify-start pl-16 hover:bg-slate-300">
            <Hammer  className="text-teal-600" />
            <p>Fachowcy</p>
          </Button>
        </Link>
        <Link to="umiejetnosci">
          <Button className="w-full p-6 bg-transparent text-black text-lg space-x-5 justify-start pl-16 hover:bg-slate-300">
            <Lightbulb className="text-teal-600" />
            <p>Umiejętności</p>
          </Button>
        </Link>
        <Link to="konflikty">
          <Button className="w-full p-6 bg-transparent text-black text-lg space-x-5 justify-start pl-16 hover:bg-slate-300">
            <Flag className="text-teal-600" />
            <p>Konflikty</p>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
