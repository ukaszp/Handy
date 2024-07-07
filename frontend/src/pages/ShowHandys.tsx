import React, { useEffect, useState } from "react";
import Container from "@/components/custom/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useHandymanStore from "@/stores/useHandymanStore";
import { getUserInitials } from "@/utils/userUtils";
import { ChevronLeft, ChevronRight, MapPin, Search, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@/stores/useUserStore";
import { User } from "@/data/User";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ShowHandys = () => {
  const location = useLocation();
  const initialSearchTerm = location.state?.searchvalue || ""; // Retrieve the search term from state
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { setSelectedUser } = useUserStore();

  const { searchHandymen, handymen = [] } = useHandymanStore();
  const navigate = useNavigate();

  useEffect(() => {
    searchHandymen(searchTerm, currentPage, pageSize).then((data) => {
      setTotalPages(Math.ceil(data.total / pageSize));
    });
  }, [searchTerm, currentPage, pageSize]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    searchHandymen(searchTerm, 1, pageSize).then((data) => {
      setTotalPages(Math.ceil(data.total / pageSize));
    });
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
      <Container>
        <div className="justify-center items-center flex space-x-2 border-b-2">
          <input
            type="text"
            placeholder="Wyszukaj fachowca..."
            value={searchTerm}
            onChange={handleSearchChange}
            className=" h-10 my-4 px-2 py-1 border-2 rounded-md border-teal-600"
          />
          <Button
            variant="outline"
            className="bg-teal-600 text-white h-10 px-6"
            onClick={handleSearchClick}
          >
            <Search className="mr-2 h-4 w-4" />
            Szukaj
          </Button>
        </div>
        <div className="py-10">
          {!handymen || handymen.length === 0 ? (
            <div className="flex justify-center items-center">
              <p className="text-3xl text-slate-600">
                Nie znaleziono{" "}
                <span className="text-teal-600 font-bold">fachowców</span>.
              </p>
            </div>
          ) : (
            handymen.map((handy) => (
              <div key={handy.id} className="mb-4">
                <div className="flex border rounded-md">
                  <div className="w-full max-w-xs m-5">
                    <Avatar className="w-[15rem] h-[15rem] cursor-pointer" onClick={()=>navigate(`/fachowiec/${handy.id}`)}>
                      <AvatarImage src={handy.user?.Avatar} />
                      <AvatarFallback>
                        {getUserInitials(handy.user)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="p-3 space-y-2 flex flex-col justify-between w-full">
                    <div className="space-y-1 w-full">
                      <h1 className="text-xs text-slate-500 font-bold flex">
                        <MapPin className="mr-1 h-4 w-4" />
                        {handy.region?.name}
                      </h1>
                      <h1 className="text-2xl font-bold text-center cursor-pointer" onClick={()=>navigate(`/fachowiec/${handy.id}`)}>
                        {handy.user?.name} {handy.user?.lastName}
                      </h1>
                      <h2 className="text-center">{handy.description}</h2>
                    </div>
                    <div className="py-10 flex justify-center w-full">
                      <Button
                        variant="outline"
                        className="bg-teal-600 text-white"
                        onClick={() => redirectToChat(handy.user)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Wyślij wiadomość
                      </Button>
                    </div>

                    <div className="flex space-x-1 justify-center w-full">
                      {handy.skills?.map((skill, index) => (
                        <Badge className="bg-slate-500 font-normal" key={index}>
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between my-10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                        className={`${currentPage === 1 ? 'hidden' : ''}`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                          isActive={currentPage === 1}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">{currentPage}</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                        className={`${currentPage === totalPages ? 'hidden' : ''}`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1);
                          }}
                          isActive={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
};

export default ShowHandys;
