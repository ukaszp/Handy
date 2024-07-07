import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useConflictStore from "@/stores/useConflictStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { StatusOfTask } from "@/data/StatusOfTask";
import { Link } from "react-router-dom";
import { Conflict } from "@/data/Conflict";
import ConflictDetailsDialog from "./ConflictDetailsDialog";
import DeleteConflictDialog from "./DeleteConflictDialog";

const AdminConflicts = () => {
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { conflicts, getOpenConflicts, setSelectedConflict } =
    useConflictStore();

  useEffect(() => {
    getOpenConflicts();
  }, [getOpenConflicts]);

  const openDialog = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setIsConflictDialogOpen(true);
  };

  const openDeleteDialog = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="m-10 space-y-2">
      <div className="flex flex-col items-center space-y-2 ">
        
        <ScrollArea className="rounded-md border p-4 w-4/5 h-[50rem]">
          
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="flex mx-5 items-center justify-center border-b py-2"
            >
              <div className="flex flex-row space-x-14 items-center">
                <div>{conflict.id}</div>
                <div>
                  {conflict.description
                    ? conflict.description.length > 10
                      ? `${conflict.description.substring(0, 20)}...`
                      : conflict.description
                    : "No description"}
                </div>
                <Link to={`/uzytkownik/${conflict.client.id}`}>
                  {conflict.client.name} {conflict.client.lastName}
                </Link>
                <Link to={`/fachowiec/${conflict.handymanId}`}>
                  {conflict.handymen.user?.name}{" "}
                  {conflict.handymen.user?.lastName}
                </Link>
                <div>{StatusOfTask[conflict.status]}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => openDialog(conflict)}
                      className="hover:cursor-pointer"
                    >
                      Szczegóły
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(conflict)}
                      className="rounded-md hover:cursor-pointer bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                    >
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <ConflictDetailsDialog
        isOpen={isConflictDialogOpen}
        onOpenChange={setIsConflictDialogOpen}
      />
       <DeleteConflictDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      /> 
    </div>
  );
};

export default AdminConflicts;
