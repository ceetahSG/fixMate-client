"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Pencil, Plus, Trash2, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { getMyServices } from "@/lib/actions/api/data";
import { TServiceData } from "@/types";
import { deleteService, updateService } from "@/lib/actions/api/services";
import { toast } from "@/components/ui/toast";

type ServiceStatus = "Pending" | "Approved" | "Rejected";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "TV",
  "AC",
  "Refrigerator",
  "Washing Machine",
  "Other",
];

const { data: session } = await authClient.getSession();
const initialServices = await getMyServices(session?.user?.email || "");
console.log("Initial services fetched:", initialServices);

const statusStyles: Record<ServiceStatus, string> = {
  Pending: "bg-[#fef6e7] text-[#c27803]",
  Approved: "bg-[#e8f6f2] text-[#176b63]",
  Rejected: "bg-[#fdf2f2] text-[#b91c1c]",
};

export default function MyServicesPage() {
  const [services, setServices] = useState<TServiceData[]>(initialServices);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<TServiceData | null>(
    null,
  );
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<TServiceData | null>(
    null,
  );
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function toggleAvailability(id: string, isAvailable: boolean) {
    if (!id) return;
    setActionError("");

    setServices((currentServices) =>
      currentServices.map((service) =>
        service._id === id ? { ...service, isAvailable } : service,
      ),
    );

    try {
      await updateService(id, { isAvailable });
      toast.add({
        title: "Availability updated",
        description: isAvailable
          ? "Service is now available."
          : "Service is now unavailable.",
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update availability.";
      setServices((currentServices) =>
        currentServices.map((service) =>
          service._id === id
            ? { ...service, isAvailable: !isAvailable }
            : service,
        ),
      );
      setActionError(message);
      toast.add({
        title: "Availability update failed",
        description: message,
        type: "error",
      });
    }
  }

  function openEditDialog(service: TServiceData) {
    setEditingService(service);
    setEditTitle(service.title);
    setEditCategory(service.category);
    setEditPrice(String(service.basePrice));
    setEditDescription(service.description);
    setIsEditOpen(true);
  }

  async function handleSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingService?._id) {
      setActionError("This service is missing an ID.");
      return;
    }

    setActionError("");
    setIsSaving(true);

    try {
      await updateService(editingService._id, {
        title: editTitle.trim(),
        category: editCategory,
        basePrice: Number(editPrice),
        description: editDescription.trim(),
        approvalStatus: "Pending",
      });

      setServices((currentServices) =>
        currentServices.map((service) =>
          service._id === editingService._id
            ? {
                ...service,
                title: editTitle.trim(),
                category: editCategory,
                basePrice: Number(editPrice),
                description: editDescription.trim(),
                approvalStatus: "Pending",
              }
            : service,
        ),
      );
      setIsEditOpen(false);
      toast.add({
        title: "Service updated",
        description: "Your service changes were saved for review.",
        type: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update the service.";
      setActionError(
        message,
      );
      toast.add({ title: "Service update failed", description: message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  function openDeleteDialog(service: TServiceData) {
    setDeletingService(service);
    setIsDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deletingService?._id) {
      setActionError("This service is missing an ID.");
      return;
    }

    setActionError("");
    setIsSaving(true);

    try {
      await deleteService(deletingService._id);
      setServices((currentServices) =>
        currentServices.filter(
          (service) => service._id !== deletingService._id,
        ),
      );
      setIsDeleteOpen(false);
      toast.add({
        title: "Service deleted",
        description: "The service has been removed from your listings.",
        type: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete the service.";
      setActionError(
        message,
      );
      toast.add({ title: "Service deletion failed", description: message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            My Services
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage listing details, availability, and approval status.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
        >
          <Plus className="size-4" />
          Add Service
        </Link>
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
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
              <TableHead className="h-11 pl-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Service
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Category
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Price
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Approval
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Availability
              </TableHead>
              <TableHead className="h-11 pr-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.length > 0 ? (
              services.map((service) => (
                <TableRow
                  key={service._id}
                  className="border-slate-100 hover:bg-slate-50/60"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {service.title}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-slate-600">
                    {service.category}
                  </TableCell>

                  <TableCell className="py-4 font-semibold text-slate-900">
                    ${service.basePrice}
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        statusStyles[service.approvalStatus],
                      )}
                    >
                      {service.approvalStatus}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <Switch
                      checked={service.isAvailable}
                      onCheckedChange={(checked) =>
                        toggleAvailability(service._id || "", checked)
                      }
                      aria-label={`Toggle availability for ${service.title}`}
                      className="data-checked:bg-[#176b63]"
                    />
                  </TableCell>

                  <TableCell className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditDialog(service)}
                        aria-label={`Edit ${service.title}`}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(service)}
                        aria-label={`Delete ${service.title}`}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-[#b91c1c] shadow-xs transition-colors hover:bg-[#fdf2f2] focus-visible:ring-2 focus-visible:ring-[#b91c1c]/30 focus-visible:outline-none"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-slate-500"
                >
                  You have not added any services yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit service dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[560px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl ring-0 sm:max-w-[560px]"
        >
          {editingService ? (
            <form onSubmit={handleSaveEdit}>
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Edit service
                </DialogTitle>
                <DialogClose className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  <X className="size-4.5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
                <DialogDescription className="sr-only">
                  Update the details of the selected service.
                </DialogDescription>
              </div>

              <div className="space-y-5 px-6 py-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-service-title"
                    className="text-[13px] font-semibold text-slate-900"
                  >
                    Service Title
                  </Label>
                  <Input
                    id="edit-service-title"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    required
                    className="h-10 rounded-lg border-slate-300 bg-white text-sm shadow-xs"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[13px] font-semibold text-slate-900">
                      Category
                    </Label>
                    <Select
                      value={editCategory}
                      onValueChange={(value) => setEditCategory(value ?? "")}
                    >
                      <SelectTrigger
                        aria-label="Service category"
                        className="h-10 w-full rounded-lg border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-xs"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent
                        align="start"
                        alignItemWithTrigger={false}
                        className="rounded-lg border border-slate-200"
                      >
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="py-2"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-service-price"
                      className="text-[13px] font-semibold text-slate-900"
                    >
                      Price
                    </Label>
                    <Input
                      id="edit-service-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editPrice}
                      onChange={(event) => setEditPrice(event.target.value)}
                      required
                      className="h-10 rounded-lg border-slate-300 bg-white text-sm shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-service-description"
                    className="text-[13px] font-semibold text-slate-900"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="edit-service-description"
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    required
                    className="min-h-[100px] resize-none rounded-lg border-slate-300 bg-white text-sm shadow-xs"
                  />
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-[#fdf6e8] px-3.5 py-3 text-xs text-[#b45309]">
                  <Clock className="mt-0.5 size-4 shrink-0" />
                  <p>
                    Editing this service will return it to Pending approval.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  Cancel
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
                >
                  {isSaving ? "Saving..." : "Save & Resubmit"}
                </Button>
              </div>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete service dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[466px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl ring-0 sm:max-w-[466px]"
        >
          {deletingService ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Delete service?
                </DialogTitle>
                <DialogClose className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  <X className="size-4.5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>

              <div className="px-6 py-5">
                <DialogDescription className="text-sm leading-6 text-slate-600">
                  {`This will permanently remove “${deletingService.title}” from your services.`}
                </DialogDescription>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  Cancel
                </DialogClose>
                <Button
                  onClick={confirmDelete}
                  disabled={isSaving}
                  className="h-10 rounded-lg border border-[#f6c9c9] bg-[#fdf2f2] px-5 text-sm font-semibold text-[#b91c1c] shadow-xs hover:bg-[#fbe7e7] hover:text-[#991b1b]"
                >
                  {isSaving ? "Deleting..." : "Delete Service"}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
