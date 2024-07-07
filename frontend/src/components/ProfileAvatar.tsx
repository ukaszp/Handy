import { getUserInitials } from "@/utils/userUtils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useUserAuthStore from "@/stores/useUserAuthStore";
import { ChevronDown, ChevronUp, Hammer, LogOut, User } from "lucide-react";
import { toast } from "./ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { APPLICATION_ROLES } from "@/config";
import useHandymanStore from "@/stores/useHandymanStore";

const ProfileAvatar = () => {
  const user = useUserAuthStore((state) => state.user);
  const logout = useUserAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const userRole = useUserAuthStore((state) => state.user?.roleId);
  const {  currentHandyman } = useHandymanStore();

  
  if (!user) {
    return null;
  }

  const onLogout = () => {
    logout();
    toast({
      title: "Wylogowano",
      description: "Zostałeś wylogowany ze swojego konta.",
    });
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className="flex items-center cursor-pointer group"
        >
          <Avatar>
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ChevronDown className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to={`/mojprofil/`} className="flex">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        {userRole === APPLICATION_ROLES.HANDYMAN && (
           <DropdownMenuItem>
           <button onClick={()=>navigate(`/fachowiec/${currentHandyman?.id}`)} className="flex">
             <Hammer className="mr-2 h-4 w-4" />
             <span>Profil fachowca</span>
           </button>
         </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <button onClick={onLogout} className="flex">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Wyloguj się</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileAvatar;
