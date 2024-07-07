import Container from "@/components/custom/container";
import useTaskStore from "@/stores/useTaskStore";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MapPin, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import OfferDialog from "@/components/custom/offer-dialog";
import { Task } from "@/data/Task";
import { User } from "@/data/User";
import useUserStore from "@/stores/useUserStore";
import useUserAuthStore from "@/stores/useUserAuthStore";

const TasksList = () => {
  const { getAllActiveTasks, tasks, setSelectedTask } = useTaskStore();
  const navigate = useNavigate();
  const { setSelectedUser } = useUserStore();
  const userauth = useUserAuthStore((state) => state.user);


  useEffect(() => {
    getAllActiveTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const redirectToChat = (user: User | undefined) => {
    if (user) {
      navigate(`/chat/${user.id}`);
      setSelectedUser(user);
    } else {
      console.log("User not found");
    }
  };

  return (
    <div>
      <Container>
        <div className="py-10">
          {tasks.map((task) => (
            <div key={task.clientId} className="mb-4">
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
                      {task.region?.name}
                    </h1>
                    <h1 className="text-2xl font-bold text-center">
                      {task.title}
                    </h1>
                    <h2 className="text-center">{task.description}</h2>
                  </div>
                  <div className="space-x-2 py-10 flex justify-center w-full">
                    <Button
                      asChild
                      variant="outline"
                      className="bg-teal-600 text-white"
                      onClick={() => redirectToChat(task.user)}
                    >
                      <div
                       className="flex flex-row hover:cursor-pointer"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Wyślij wiadomość
                      </div>
                    </Button>
                    <button onClick={() => handleTaskClick(task)}>
                      <OfferDialog />
                    </button>
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
      </Container>
    </div>
  );
};

export default TasksList;
