import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import HandyImage from "../assets/handyman2.jpg";
import HandyImage2 from "../assets/handyman1.jpg";
import Container from "../components/custom/container";
import FAQComponent from "../components/FAQComponent";
import { Plus } from 'lucide-react';

import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  return (
    <div>
      <Container>
        <div className="flex align-items-center  pt-16 space-x-5">
          <div className="m-10 space-y-1 mt-28 py-20">
            <h1 className="text-4xl font-bold text-teal-600">
              Znajdź eksperta na każdy remont
            </h1>
            <h2 className="text-xl font-bold text-slate-700">
              Profesjonalna pomoc na wyciągnięcie ręki!
            </h2>
            <div className="flex w-full max-w-md items-center space-x-2 py-2">
              <Input placeholder="Malowanie" value={search} onChange={(e) => setSearch(e.target.value)}/>
              <Button
                type="submit"
                className="uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
                onClick = {() => navigate('/fachowcy/', {state: {searchvalue: search}})}
              >
                Szukaj
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500 to-teal-700 transform origin-top-left -skew-y-6 rounded-md mt-7"></div>
            <div className="relative z-10 p-4 max-w-xl sm:max-w-sm md:max-w-lg lg:max-w-xl ">
              <img
                className="w-full h-auto rounded-lg"
                src={HandyImage}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className=" mx-[-19.4rem] bg-teal-600">
        <div className=" flex my-14 p-10 m-0 items-center space-x-5 mx-[20rem]"> {/*  */}
            <div className="relative z-10 p-4 max-w-sm">
              <img
                className="w-full h-auto rounded-lg"
                src={HandyImage2}
                alt=""
              />
            </div>
            <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-100 ">
            Potrzebujesz szybkiej i fachowej pomocy w remoncie czy naprawie?
            </h1>
            <h2 className="text-xl text-slate-100">
            Wypełnij poniższy formularz, a my znajdziemy dla Ciebie najlepszego specjalistę w Twojej okolicy.
            </h2>
            <h2 className="text-xl text-slate-100">
            
            Jedno konto, wiele możliwości.
            Zarejestruj się już teraz i skorzystaj z preferencyjnych cen oraz wyjątkowych doświadczeń związanych z zleceniami remontowymi i naprawczymi.
            </h2>
            <div className="flex justify-center py-4">
            <Button asChild variant="outline" className="border-teal-600 text-teal-600 hover:border-slate-500 border-2 hover:text-teal-500 uppercase text-md">
              <Link to="/nowezlecenie"><Plus className="mr-2 h-4 w-4"/>Dodaj zlecenie</Link>
            </Button>
            </div>
            </div>
        </div>
        </div>
            <FAQComponent/>
      </Container>
    <Footer/>
    </div>
  );
};

export default LandingPage;
