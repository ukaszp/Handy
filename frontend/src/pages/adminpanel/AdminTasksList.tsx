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
import useTaskStore from "@/stores/useTaskStore";
import { Task } from "@/data/Task";
import DeleteTaskDialog from "@/components/deleteTaskDialog";
import TaskDetailsDialog from "./TaskDetailsDialog";

interface AdminTasksListProps {}

export const AdminTasksList: React.FC<AdminTasksListProps> = () => {
  const { tasks, getAllTasks, setSelectedTask } = useTaskStore();
  const {setSelectedUser} = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  const [IsProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [IsTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);

  const navigate = useNavigate();
  

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "title",
      header: "Tytuł",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "description",
      header: "Opis",
      cell: (info) => {
        const description = info.getValue() as string; 
        return description && description.length > 15
          ? `${description.substring(0, 15)}...`
          : description;
      },
    },
    {
      accessorKey: "region",
      header: "Region",
      cell: ({ row }) =>
        row.original.region ? row.original.region.name : "Region nieznany",
    },
    {
      accessorKey: "creationDate",
      header: "Utworzono",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        switch (row.original.status) {
          case 0:
            return "Otwarte";
          case 1:
            return "W Toku";
          case 2:
            return "Zamknięte";
          default:
            return "Nieznany status";
        }
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;
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
                onClick={() => taskDetails(task)}
              >
                Szczegóły
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => openProfile(task.user)}
              >
                Użytkownik
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => goToProfile(task.user)}
              >
                Profil użytkownika
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-md hover:cursor-pointer bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                onClick={() => deleteTask(task)}
              >
                Usuń zlecenie
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
    const taskDetails = (task: Task) => {
        setSelectedTask(task);
        setIsTaskDetailsDialogOpen(true);
      };

  //   const openDialog = (user: User) => {
  //     setIsDialogOpen(true);
  //     setSelectedUser(user);
  //   };
    const deleteTask = (task: Task) => {
      setIsDeleteTaskDialogOpen(true);
      setSelectedTask(task);
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

  const table = useReactTable<Task>({
    data: tasks,
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
          placeholder="Filtruj po Tytule..."
          value={
            (table.getColumn("title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
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
      <DeleteTaskDialog
        isOpen={isDeleteTaskDialogOpen}
        onOpenChange={setIsDeleteTaskDialogOpen}
      />
      <UserProfileDialog
        isOpen={IsProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
      <TaskDetailsDialog
        isOpen={IsTaskDetailsDialogOpen}
        onOpenChange={setIsTaskDetailsDialogOpen}
      />
    </div>
  );
};

export default AdminTasksList;
