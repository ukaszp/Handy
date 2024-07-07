import { Link } from "react-router-dom";
import joinusbg from "../assets/joinusbg.jpg";
import { Button } from "./ui/button";

const JoinUsUnauthorized = () => {
  return (
        <div className=" min-h-[38rem]">
        <div 
        className="flex flex-col items-center mx-[-19.4rem] p-20" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.205), rgba(255, 255, 255, 0.226)), url(${joinusbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
        >
          <div className="mx-[20rem] bg-white bg-opacity-95 border-teal-600 border-2 rounded-lg p-10 space-y-1 text-lg font-semibold text-slate-600">
            <h1 className="text-4xl font-bold text-teal-600 p-2">Jak do nas dołączyć?</h1>
            <h2>1. Załóż konto</h2>
            <h2>
            2. Kliknij "Zostań fachowcem w górnej części strony"
            </h2>
            <h2>
            3. Uzupełnij ankietę i przeglądaj dostępne zlecenia
            </h2>
            
            <div className="flex justify-center py-5">
            <Button asChild className="uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border p-3">
              <Link to="/register">Załóż konto</Link>
            </Button>
            </div>
          </div>
          
          
        </div>
        </div>
  )
}

export default JoinUsUnauthorized