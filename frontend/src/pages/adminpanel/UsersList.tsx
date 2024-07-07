import React, { useEffect, useState } from "react";
import {
  useReactTable,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/stores/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/userUtils";
import { User } from "@/data/User";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AssignRoleDialog from "@/components/AssignRoleDialog";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import UserProfileDialog from "@/components/UserProfileDialog";
import { Navigate, useNavigate, useNavigation } from "react-router-dom";

interface UsersListProps {}

export const UsersList: React.FC<UsersListProps> = () => {
  const { users, getAllUsers, setSelectedUser } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [IsProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "avatar",
      header: "",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.Avatar} />
          <AvatarFallback>{getUserInitials(row.original)}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "name",
      header: "Imię",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <div className="flex items-center">
          Nazwisko
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() ? false : true)
            }
          >
            <ArrowUpDown
              className={`ml-2 h-4 w-4 ${
                column.getIsSorted()
                  ? column.getIsSorted() === "desc"
                    ? "desc"
                    : "asc"
                  : ""
              }`}
            />
          </Button>
        </div>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex items-center">
          Email
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() ? false : true)
            }
          >
            <ArrowUpDown
              className={`ml-2 h-4 w-4 ${
                column.getIsSorted()
                  ? column.getIsSorted() === "desc"
                    ? "desc"
                    : "asc"
                  : ""
              }`}
            />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "whenJoined",
      header: "Dołączono",
      cell: (info) => {
        const dateValue = info.getValue();
        if (typeof dateValue === "string") {
          const date = new Date(dateValue);
          return isNaN(date.getTime())
            ? "Invalid date"
            : date.toLocaleDateString();
        }
        return "No date";
      },
    },
    {
      accessorKey: "roleId",
      header: "Role ID",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => openProfile(user)}
              >
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => goToProfile(user)}
              >
                Zlecenia
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => openDialog(user)}
              >
                Przypisz rolę
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-md hover:cursor-pointer bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                onClick={() => deleteUser(user)}
              >
                Usuń użytkownika
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const goToProfile = (user: User) => {
    setSelectedUser(user);
    navigate(`/uzytkownik/${user.id}`);
  };

  const openDialog = (user: User) => {
    setIsDialogOpen(true);
    setSelectedUser(user);
  };
  const deleteUser = (user: User) => {
    setIsDeleteUserDialogOpen(true);
    setSelectedUser(user);
  };
  const openProfile = (user: User) => {
    setIsProfileDialogOpen(true);
    setSelectedUser(user);
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const table = useReactTable<User>({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full m-5">
      <div className="flex items-center justify-center py-4">
        <Input
          placeholder="Filtruj po nazwisku..."
          value={
            (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn("lastName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssignRoleDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <DeleteUserDialog
        isOpen={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
      />
      <UserProfileDialog
        isOpen={IsProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
    </div>
  );
};

export default UsersList;
