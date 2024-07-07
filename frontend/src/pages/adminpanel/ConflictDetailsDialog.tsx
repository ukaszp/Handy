import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StatusOfTask } from "@/data/StatusOfTask";
import useConflictStore from "@/stores/useConflictStore";
import { Clock, Hammer, Text, User } from "lucide-react";
import { Link } from "react-router-dom";

const ConflictDetailsDialog = ({ isOpen, onOpenChange }) => {
  const { selectedConflict } = useConflictStore();
  
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] flex flex-col">
          <div className="p-3 space-y-2 flex flex-row justify-between w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="font-bold flex items-center">Użytkownik</div>
              <Link
                className=" flex items-center"
                to={`/uzytkownik/${selectedConflict?.clientId}`}
              >
                <User className="mr-2 h-4 w-4" />
                {selectedConflict?.client.name}{" "}
                {selectedConflict?.client.lastName}
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="font-bold flex items-center">Fachowiec</div>
              <Link
                className="flex items-center"
                to={`/fachowiec/${selectedConflict?.handymanId}`}
              >
                <Hammer className="mr-2 h-4 w-4" />
                {selectedConflict?.handymen.user?.name}{" "}
                {selectedConflict?.handymen.user?.lastName}
              </Link>
            </div>
          </div>
          <div>
            <div>Opis</div>
            <div className="border-2 p-2 flex items-center">
              <Text className="mr-2 h-4 w-4" />
              {selectedConflict?.description}
            </div>
          </div>
          <div>
            <div>Status</div>
            <div className="p-2 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {StatusOfTask[selectedConflict!.offer?.status]}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConflictDetailsDialog;
