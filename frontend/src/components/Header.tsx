import Container from "./custom/container";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Button } from "./ui/button";
import { Hammer, Plus, ShieldCheck } from "lucide-react";
import { User } from "lucide-react";
import useUserAuthStore from "@/stores/useUserAuthStore";
import { APPLICATION_ROLES } from "@/config";
import ProfileAvatar from "./ProfileAvatar";

const Header = () => {
  const user = useUserAuthStore((state) => state.user);
  const userRole = useUserAuthStore((state) => state.user?.roleId);
 
  return (
    <header className="sm:flex sm:justify-between py-3 px-4 border-b">
      <Container>
        <div className="relative px-3 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className=" flex items-center">
            <Link to="/" className="ml-4 lg:ml-0 flex items-center gap-3">
              <img src={logo} alt="" className="max-h-16" />
              <h1 className="text-3xl font-bold inline-block text-teal-600">
                Handy
              </h1>
            </Link>
          </div>
          <div className="flex gap-3">
          {userRole !== APPLICATION_ROLES.HANDYMAN && (
            <Button
              asChild
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
            >
              <Link to="/joinus">
                <Hammer className="mr-2 h-4 w-4" />
                Zostań fachowcem 
              </Link>
            </Button>
          )}
            
            {user ? (
              userRole === APPLICATION_ROLES.ADMIN ? (
                <div className="space-x-5">
                <Button
                  asChild
                  className="bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
                >
                  <Link to="/admin">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    ADMIN PANEL
                  </Link>
                </Button>
                <ProfileAvatar/>
                </div>
              ):(
                <div className="flex gap-6">
                <Button
                  asChild
                  className="bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
                >
                  <Link to="/nowezlecenie">
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj zlecenie
                  </Link>
                </Button>
                
                <ProfileAvatar/>

              </div>
              )
            ) : (
              <Button
                asChild
                className="bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
              >
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Zaloguj się
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
