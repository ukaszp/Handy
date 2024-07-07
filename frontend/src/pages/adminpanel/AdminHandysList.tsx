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
import {  MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/stores/useUserStore";
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
import UserProfileDialog from "@/components/UserProfileDialog";
import {  useNavigate} from "react-router-dom";
import useHandymanStore from "@/stores/useHandymanStore";
import DeleteHandyDialog from "./DeleteHandyDialog";
import DeactiveHandyDialog from "./DeactiveHandyDialog";
import { Handyman } from "@/data/Handyman";

interface AdminTasksListProps {}

export const AdminHandysList: React.FC<AdminTasksListProps> = () => {
  const { handymen, getAllHandyman, setSelectedHandyman } = useHandymanStore();
  const {setSelectedUser} = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteHandyDialogOpen, setIsDeleteHandyDialogOpen] = useState(false);
  const [IsProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isDeactiveHandyDialogOpen, setIsDeactiveHandyDialogOpen] = useState(false);

  const navigate = useNavigate();
  

  useEffect(() => {
    getAllHandyman();
  }, [getAllHandyman]);
  const columns: ColumnDef<Handyman>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      id: "name",
      header: "Imię i Nazwisko",
      cell: ({ row }) => {
        const user = row.original.user;
        return user ? `${user.name} ${user.lastName}` : "Brak danych";
      },
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
      accessorKey: "isActive",
      header: "Aktywny",
      cell: (info) => info.getValue() ? "Tak" : "Nie",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const handyman = row.original;
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
                onClick={() => navigate(`/fachowiec/${handyman.id}`)}
              >
                Profil fachowca
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => changeHandyStatus(handyman)}
              >
                Zmień status
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-md hover:cursor-pointer bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                onClick={() => deleteHandy(handyman)}
              >
                Usuń fachowca
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  
    const deleteHandy = (handymen: Handyman) => {
      setIsDeleteHandyDialogOpen(true);
      setSelectedHandyman(handymen);
    };
    const changeHandyStatus = (handymen: Handyman) => {
      setIsDeactiveHandyDialogOpen(true);
      setSelectedHandyman(handymen);
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

  const table = useReactTable<Handyman>({
    data: handymen,
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
          placeholder="Szukaj..."
          value={
            (table.getColumn("name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
      <DeleteHandyDialog
        isOpen={isDeleteHandyDialogOpen}
        onOpenChange={setIsDeleteHandyDialogOpen}
      />
      <UserProfileDialog
        isOpen={IsProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
      <DeactiveHandyDialog
        isOpen={isDeactiveHandyDialogOpen}
        onOpenChange={setIsDeactiveHandyDialogOpen}
      />
    </div>
  );
};

export default AdminHandysList;
