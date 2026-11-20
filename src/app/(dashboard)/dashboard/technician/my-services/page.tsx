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

type ServiceStatus = "Pending" | "Approved" | "Rejected";

type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  status: ServiceStatus;
  isAvailable: boolean;
  thumbnail: string;
};

const categories = [
  "Smartphone",
  "Laptop & PC",
  "TV",
  "AC",
  "Refrigerator",
  "Washing Machine",
  "Other",
];

const initialServices: Service[] = [
  {
    id: "svc-1",
    name: "MacBook Performance Servicing",
    category: "Laptop & PC",
    price: 45,
    description: "Professional repair and diagnostic service.",
    status: "Approved",
    isAvailable: true,
    thumbnail: "/images/service-thumb-macbook.jpg",
  },
  {
    id: "svc-2",
    name: "Samsung AC Installation & Servicing",
    category: "AC",
    price: 52,
    description: "AC installation, cleaning, and performance servicing.",
    status: "Approved",
    isAvailable: true,
    thumbnail: "/images/service-thumb-tv.jpg",
  },
  {
    id: "svc-3",
    name: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    price: 58,
    description: "Cooling system diagnosis and refrigerator repair.",
    status: "Rejected",
    isAvailable: true,
    thumbnail: "/images/hero-repair.jpg",
  },
];

const statusStyles: Record<ServiceStatus, string> = {
  Pending: "bg-[#fef6e7] text-[#c27803]",
  Approved: "bg-[#e8f6f2] text-[#176b63]",
  Rejected: "bg-[#fdf2f2] text-[#b91c1c]",
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  function toggleAvailability(id: string, isAvailable: boolean) {
    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === id ? { ...service, isAvailable } : service
      )
    );
  }

  function openEditDialog(service: Service) {
    setEditingService(service);
    setEditTitle(service.name);
    setEditCategory(service.category);
    setEditPrice(String(service.price));
    setEditDescription(service.description);
    setIsEditOpen(true);
  }

  function handleSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingService) return;

    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === editingService.id
          ? {
              ...service,
              name: editTitle.trim(),
              category: editCategory,
              price: Number(editPrice),
              description: editDescription.trim(),
              status: "Pending",
            }
          : service
      )
    );
    setIsEditOpen(false);
  }

  function openDeleteDialog(service: Service) {
    setDeletingService(service);
    setIsDeleteOpen(true);
  }

  function confirmDelete() {
    if (!deletingService) return;

    setServices((currentServices) =>
      currentServices.filter((service) => service.id !== deletingService.id)
    );
    setIsDeleteOpen(false);
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
                  key={service.id}
                  className="border-slate-100 hover:bg-slate-50/60"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={service.thumbnail}
                          alt={service.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {service.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-slate-600">
                    {service.category}
                  </TableCell>

                  <TableCell className="py-4 font-semibold text-slate-900">
                    ${service.price}
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        statusStyles[service.status]
                      )}
                    >
                      {service.status}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <Switch
                      checked={service.isAvailable}
                      onCheckedChange={(checked) =>
                        toggleAvailability(service.id, checked)
                      }
                      aria-label={`Toggle availability for ${service.name}`}
                      className="data-checked:bg-[#176b63]"
                    />
                  </TableCell>

                  <TableCell className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditDialog(service)}
                        aria-label={`Edit ${service.name}`}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(service)}
                        aria-label={`Delete ${service.name}`}
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
                    onChange={(event) =>
                      setEditDescription(event.target.value)
                    }
                    required
                    className="min-h-[100px] resize-none rounded-lg border-slate-300 bg-white text-sm shadow-xs"
                  />
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-[#fdf6e8] px-3.5 py-3 text-xs text-[#b45309]">
                  <Clock className="mt-0.5 size-4 shrink-0" />
                  <p>Editing this service will return it to Pending approval.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  Cancel
                </DialogClose>
                <Button
                  type="submit"
                  className="h-10 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
                >
                  Save &amp; Resubmit
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
                  {`This will permanently remove “${deletingService.name}” from your services.`}
                </DialogDescription>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
                  Cancel
                </DialogClose>
                <Button
                  onClick={confirmDelete}
                  className="h-10 rounded-lg border border-[#f6c9c9] bg-[#fdf2f2] px-5 text-sm font-semibold text-[#b91c1c] shadow-xs hover:bg-[#fbe7e7] hover:text-[#991b1b]"
                >
                  Delete Service
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
