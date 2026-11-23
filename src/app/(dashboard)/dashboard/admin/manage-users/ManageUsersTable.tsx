"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { updateUsers } from "@/lib/actions/api/services";
import { toast } from "@/components/ui/toast";

const roles = ["Customer", "Technician", "Admin"] as const;

type Role = (typeof roles)[number];
type RoleFilter = Role | "All";

export type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  isCurrent?: boolean;
};

const roleStyles: Record<Role, string> = {
  Customer: "border-[#d6e4ff] bg-[#eef4ff] text-[#2563eb]",
  Technician: "border-[#fae3b8] bg-[#fef6e7] text-[#c27803]",
  Admin: "border-[#e4d7ff] bg-[#f3edff] text-[#7c3aed]",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type ManageUsersTableProps = {
  usersData: UserRow[];
};

export default function ManageUsersTable({
  usersData,
}: ManageUsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>(usersData);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserRow | null>(null);
  const [draftRole, setDraftRole] = useState<Role>("Customer");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [actionError, setActionError] = useState("");

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);
      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, query, roleFilter]);

  function openRoleDialog(user: UserRow) {
    setActiveUser(user);
    setDraftRole(user.role);
    setIsRoleDialogOpen(true);
  }

  async function handleConfirmRoleChange() {
    if (!activeUser || isUpdatingRole) return;

    setActionError("");
    setIsUpdatingRole(true);

    try {
      await updateUsers(activeUser._id, { role: draftRole });
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === activeUser._id
            ? { ...user, role: draftRole }
            : user,
        ),
      );
      setIsRoleDialogOpen(false);
      setActiveUser(null);
      toast.add({
        title: "User role updated",
        description: `${activeUser.name} is now a ${draftRole}.`,
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update the user role.";
      setActionError(
        message,
      );
      toast.add({ title: "Role update failed", description: message, type: "error" });
    } finally {
      setIsUpdatingRole(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search accounts and manage platform roles responsibly.
        </p>
      </div>

      {actionError ? (
        <p
          className="rounded-lg border border-[#f6c9c9] bg-[#fdf2f2] px-4 py-3 text-sm text-[#b91c1c]"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email"
              aria-label="Search users by name or email"
              className="h-10 rounded-lg border-slate-300 bg-white pl-9 text-sm shadow-xs placeholder:text-slate-400"
            />
          </div>

          <Select
            value={roleFilter}
            onValueChange={(value) =>
              setRoleFilter((value ?? "All") as RoleFilter)
            }
          >
            <SelectTrigger
              aria-label="Filter by role"
              className="h-10 w-full rounded-lg border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-xs sm:w-[120px]"
            >
              <SelectValue>
                {(value) => (value === "All" ? "All Roles" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              align="start"
              alignItemWithTrigger={false}
              className="rounded-lg border border-slate-200"
            >
              <SelectItem value="All" className="py-2">
                All Roles
              </SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="py-2">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
              <TableHead className="h-11 pl-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                User
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Email
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Role
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Joined
              </TableHead>
              <TableHead className="h-11 pr-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-slate-100 hover:bg-slate-50/60"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e6f2ef] text-xs font-semibold text-[#176b63]">
                        {getInitials(user.name)}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-slate-600">
                    {user.email}
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        roleStyles[user.role],
                      )}
                    >
                      {user.role}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-slate-600">
                    {user.createdAt}
                  </TableCell>

                  <TableCell className="py-4 pr-6">
                    {user.isCurrent ? (
                      <span className="text-xs text-slate-400">
                        Current account
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => openRoleDialog(user)}
                        className="h-9 rounded-lg border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-50"
                      >
                        Manage Role
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-slate-500"
                >
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[460px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl ring-0 sm:max-w-[460px]"
        >
          {activeUser ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Change user role?
                </DialogTitle>
                <DialogClose className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  <X className="size-4.5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>

              <div className="space-y-4 px-6 py-5">
                <DialogDescription className="text-sm leading-6 text-slate-600">
                  Choose a new role for{" "}
                  <span className="font-semibold text-slate-900">
                    {activeUser.name}
                  </span>
                  . Their dashboard access will change immediately.
                </DialogDescription>

                <div className="space-y-2">
                  <Label
                    htmlFor="new-role"
                    className="text-sm font-semibold text-slate-900"
                  >
                    New role
                  </Label>
                  <Select
                    value={draftRole}
                    onValueChange={(value) => {
                      if (value) setDraftRole(value as Role);
                    }}
                  >
                    <SelectTrigger
                      id="new-role"
                      className="h-11 w-full rounded-lg border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-xs"
                    >
                      <SelectValue>
                        {(value) => (value as Role | null) ?? "Select role"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      alignItemWithTrigger={false}
                      className="rounded-lg border border-slate-200"
                    >
                      {roles.map((role) => (
                        <SelectItem key={role} value={role} className="py-2">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  Cancel
                </DialogClose>
                <Button
                  onClick={handleConfirmRoleChange}
                  disabled={isUpdatingRole}
                  className="h-10 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
                >
                  {isUpdatingRole ? "Updating..." : "Confirm Change"}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
