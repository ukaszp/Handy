import { User } from "@/data/User";
import useTaskStore from "@/stores/useTaskStore";
import useUserStore from "@/stores/useUserStore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { MapPin, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import useUserAuthStore from "@/stores/useUserAuthStore";
import OfferDialog from "./custom/offer-dialog";
import { Task } from "@/data/Task";
import { Badge } from "./ui/badge";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import { APPLICATION_ROLES } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteTaskDialog from "./deleteTaskDialog";
import { StatusOfTask } from "@/data/StatusOfTask";

const UserProfile = () => {
  const { setSelectedUser, selectedUser, getUserById } = useUserStore();
  const { tasks, getUserTasks, setSelectedTask } = useTaskStore();
  const { id } = useParams();
  const user = useUserAuthStore((state) => state.user);
  const navigate = useNavigate();
  const userRole = useUserAuthStore((state) => state.user?.roleId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const redirectToChat = (user: User | undefined) => {
    if (user) {
      navigate(`/chat`);
      setSelectedUser(user);
    } else {
      console.log("User not found");
    }
  };

  useEffect(() => {
    if (id !== undefined && id !== null) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        getUserById(numericId);
        getUserTasks(numericId);
        console.log(selectedUser);
      }
    }
  }, [id, getUserTasks, getUserById, selectedUser?.id]);

  const openDialog = (task: Task) => {
    setIsDialogOpen(true);
    setSelectedTask(task);
  };

  return (
    <div className="m-20 flex flex-col items-center">
      <div className="flex m-10">
        <Avatar className="w-[15rem] h-[15rem]">
          <AvatarImage src={selectedUser?.Avatar} />
          <AvatarFallback>{getUserInitials(selectedUser)}</AvatarFallback>
        </Avatar>
        <div className="mx-5">
          <h1 className="m-10 text-2xl">
            {selectedUser?.name} {selectedUser?.lastName}
          </h1>
          
        </div>
        <Button
                  variant="outline"
                  className="text-slate-900 mt-10"
                  onClick={() => redirectToChat(selectedUser)}
                >
                  <Send className="mr-2 h-4 w-4 text-teal-600" />
                  Wyślij wiadomość
                </Button>
      </div>

      <div className="m-5">
       <h1 className="text-xl">Zlecenia użytkownika</h1> 
      </div>

      <ScrollArea className=" h-[35rem] w-[70rem] rounded-md border p-4">
        <div className="flex flex-col">
          {tasks
            .filter(
              (task) =>
                userRole === APPLICATION_ROLES.ADMIN ||
                task.status === StatusOfTask.Otwarte
            )
            .map((task) => (
              <div key={task.id} className="mb-4">
                <div className="flex border rounded-md">
                  <div className="w-full max-w-xs">
                    {task.photos?.length && (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {task.photos.map((photo) => (
                            <CarouselItem key={photo.id}>
                              <div className="p-1">
                                <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <img
                                      src={photo.url}
                                      alt=""
                                      className="max-w-full h-auto"
                                    />
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    )}
                  </div>
                  <div className="p-3 space-y-2 flex flex-col justify-between w-full">
                    <div className="space-y-1 w-full">
                      <h1 className="text-xs text-slate-500 font-bold flex">
                        <MapPin className="mr-1 h-4 w-4" />
                        Warszawa
                      </h1>
                      <div className=" text-right">
                        {userRole == APPLICATION_ROLES.ADMIN ? (
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
                                onClick={() => openDialog(task)}
                              >
                                Usuń zlecenie
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <></>
                        )}
                      </div>
                      <h1 className="text-2xl font-bold text-center">
                        {task.title}
                      </h1>
                      <h2 className="text-center">{task.description}</h2>
                    </div>
                    <div className="space-x-2 py-10 flex justify-center w-full">
                      {task.user !== user ? (
                        <div>
                          <Button
                            asChild
                            variant="outline"
                            className="bg-teal-600 text-white"
                            onClick={() => {
                              setSelectedUser(task.user);
                              navigate(`/chat`);
                            }}
                          >
                            <div className="flex flex-row hover:cursor-pointer">
                              <Send className="mr-2 h-4 w-4" />
                              Wyślij wiadomość
                            </div>
                          </Button>
                          <button onClick={() => handleTaskClick(task)}>
                            <OfferDialog />
                          </button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="flex space-x-1 justify-center w-full">
                      {task.skills?.map((skill, index) => (
                        <Badge className="bg-slate-500 font-normal" key={index}>
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {user?.roleId === APPLICATION_ROLES.ADMIN && (
        <DeleteTaskDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};

export default UserProfile;
