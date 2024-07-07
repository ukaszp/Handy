import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useRoleStore from "@/stores/useRoleStore";
import useUserStore from "@/stores/useUserStore";
import { useEffect } from "react";
import Select from "react-select";

const AssignRoleDialog = ({ isOpen, onOpenChange }) => {
  const { selectedUser, assignRoleToUser } = useUserStore();
  const { setSelectedRole, getAllRoles, roles, selectedRole } = useRoleStore();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  const rolesOptions = roles.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  interface OptionType {
    label: string;
    value: number;
  }

  const handleChange = (selectedOption: OptionType | null) => {
    const role = roles.find((r) => r.id === selectedOption?.value);
    if (role) {
      setSelectedRole(role);
    }
  };

  const handleAssignRole = (roleId: number) => {
    if (selectedUser) {
      assignRoleToUser(selectedUser.id, roleId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Przypisz rolę</DialogTitle>
          <DialogDescription>
            Przypisywanie roli użytkownikowi. Każdy użytkownik może mieć tylko
            jedną rolę.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Wybierz rolę dla: {selectedUser?.name} {selectedUser?.lastName}
            </Label>
            <Select
              options={rolesOptions}
              placeholder="Wybierz role..."
              onChange={handleChange}
              value={rolesOptions.find(
                (option) => option.value === selectedRole?.id
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
            onClick={() => {
              if (selectedRole?.id !== undefined) {
                handleAssignRole(selectedRole.id);
              } else {
                console.error("Selected role is undefined.");
              }
            }}
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoleDialog;
