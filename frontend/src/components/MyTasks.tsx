import { StatusOfTask } from "@/data/StatusOfTask";
import useTaskStore from "@/stores/useTaskStore";
import useUserAuthStore from "@/stores/useUserAuthStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BookmarkCheck, Flag, MoreHorizontal, Star } from "lucide-react";
import DeleteTaskDialog from "./deleteTaskDialog";
import { Task } from "@/data/Task";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import TaskOffers from "./custom/task-offer";
import FinishTaskDialog from "./FinishTaskDialog";
import RatingDialog from "./RatingDialog";
import OpenConflictDialog from "./OpenConflictDialog";

const MyTasks = () => {
  const user = useUserAuthStore((state) => state.user);
  const { tasks, getUserTasks, setSelectedTask } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFinishTaskDialogOpen, setIsFinishTaskDialogOpen] = useState(false);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id !== undefined && user?.id !== null) {
      const numericId = Number(user?.id);
      if (!isNaN(numericId)) {
        getUserTasks(numericId);
      }
    }
  }, [user?.id, getUserTasks]);

  const openDialog = (task: Task) => {
    setIsDialogOpen(true);
    setSelectedTask(task);
  };

  const openFinishTaskDialog = (task: Task) => {
    setIsFinishTaskDialogOpen(true);
    setSelectedTask(task);
  };

  const openConflictDialog = (task: Task) => {
    setIsConflictDialogOpen(true);
    setSelectedTask(task);
  };

  const openRatingDialog = (task: Task) => {
    setIsRatingDialogOpen(true);
    setSelectedTask(task);
  };

  return (
    <div className="space-x-20 text-basic justify-center">
      <div className="flex space-x-20 text-basic justify-center">
        <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
          Moje Zlecenia
        </div>
        <Link
          className="px-10 border-b-2 p-3 rounded-sm hover:border-slate-600"
          to="spory"
        >
          Spory
        </Link>
      </div>
      <div className="justify-center items-center p-10 mt-5 h-[23rem] rounded-md">
        <Accordion type="single" collapsible className="w-full">
          {tasks.map((task) => (
            <AccordionItem
              value={task.title}
              key={task.id}
              className="justify-center items-center space-x-20 space-y-1 w-full"
            >
              <AccordionTrigger
                className="justify-right"
                onClick={() => setSelectedTask(task)}
              >
                <div className="w-20">{task.title}</div>
                <div className="w-20">
                  {task.description!.length > 25
                    ? `${task.description!.substring(0, 20)}...`
                    : task.description ?? "Brak opisu"}
                </div>

                <div className="w-20">
                  {task.finishedClient === true &&
                  task.finishedHandyman === false ? (
                    <div>Oczekiwanie</div>
                  ) : (
                    <div>{StatusOfTask[task.status]}</div>
                  )}
                </div>
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
                {task.status === StatusOfTask["W Toku"] && (
                  <>
                    {task.finishedClient === false && (
                      <>
                        <Button
                          className="text-slate-900"
                          variant="outline"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            event.stopPropagation();
                            openConflictDialog(task);
                          }}
                        >
                          <Flag className="mr-2 h-4 w-4 text-red-700" />
                          Utwórz spór
                        </Button>
                        <Button
                          className="text-slate-900"
                          variant="outline"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            event.stopPropagation();
                            openFinishTaskDialog(task);
                          }}
                        >
                          <BookmarkCheck className="mr-2 h-4 w-4 text-teal-600" />
                          Zakończ zlecenie
                        </Button>
                      </>
                    )}
                  </>
                )}
                {task.status !== StatusOfTask.Otwarte && (
                  <>
                    <Button
                      className="text-slate-900"
                      variant="outline"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                        openRatingDialog(task);
                      }}
                    >
                      <Star className="mr-2 h-4 w-4 text-teal-600" />
                      Wystaw opinię
                    </Button>
                  </>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <TaskOffers />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <DeleteTaskDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <FinishTaskDialog
        isOpen={isFinishTaskDialogOpen}
        onOpenChange={setIsFinishTaskDialogOpen}
      />
      <RatingDialog
        isOpen={isRatingDialogOpen}
        onOpenChange={setIsRatingDialogOpen}
      />
      <OpenConflictDialog
        isOpen={isConflictDialogOpen}
        onOpenChange={setIsConflictDialogOpen}
      />
    </div>
  );
};

export default MyTasks;
