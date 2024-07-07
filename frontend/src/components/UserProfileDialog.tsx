import useUserStore from "@/stores/useUserStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/utils/userUtils";

const UserProfileDialog = ({ isOpen, onOpenChange }) => {
  const { selectedUser } = useUserStore();
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] flex">
          <Avatar>
            <AvatarImage src={selectedUser?.Avatar} />
            <AvatarFallback>{getUserInitials(selectedUser)}</AvatarFallback>
          </Avatar>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.name} {selectedUser?.lastName}
            </DialogTitle>
            <DialogDescription className="flex space-x-10">
              <div>
                <div>ID: {selectedUser?.id}</div>
                <div>e-mail: {selectedUser?.email}</div>
              </div>
              <div>
                <div>Rola: {selectedUser?.roleId}</div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileDialog;
