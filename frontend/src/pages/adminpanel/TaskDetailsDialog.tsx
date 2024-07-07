import useUserStore from "@/stores/useUserStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import useTaskStore from "@/stores/useTaskStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusOfTask } from "@/data/StatusOfTask";

const TaskDetailsDialog = ({ isOpen, onOpenChange }) => {
  const { selectedTask } = useTaskStore();
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] flex flex-col">
          <div className="flex flex-col">
            {selectedTask?.photos?.length && (
              <Carousel className="w-full">
                <CarouselContent>
                  {selectedTask.photos.map((photo) => (
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
                {selectedTask?.region?.name}
              </h1>
              <h1 className="text-2xl font-bold text-center">
                {selectedTask?.title}
              </h1>
              <h2 className="text-center">{selectedTask?.description}</h2>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex w-1/2 justify-center">
                <p>Id: {selectedTask?.id}</p>
               
                </div>
                <div className="flex flex-row space-x-2 justify-center items-center">
                  <div className="items-center">
                  <p> {selectedTask?.user.name}</p>
                  <p> {selectedTask?.user.lastName}</p>
                  </div>
              </div>
              <div className="flex flex-col w-1/2"></div>
            </div>

            <div className="flex space-x-1 justify-center w-full">
              {selectedTask?.skills?.map((skill, index) => (
                <Badge className="bg-slate-500 font-normal" key={index}>
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDetailsDialog;
