"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ServiceStatus = "Pending" | "Approved" | "Rejected";
type TabValue = "pending" | "all" | "approved" | "rejected";

type Service = {
  id: string;
  name: string;
  technician: string;
  category: string;
  price: number;
  status: ServiceStatus;
  thumbnail: string;
};

const initialServices: Service[] = [
  {
    id: "svc-1",
    name: "MacBook Performance Servicing",
    technician: "Nabila Islam",
    category: "Laptop & PC",
    price: 45,
    status: "Pending",
    thumbnail: "/images/service-thumb-macbook.jpg",
  },
  {
    id: "svc-2",
    name: "Samsung AC Installation & Servicing",
    technician: "Tariq Hasan",
    category: "AC",
    price: 52,
    status: "Pending",
    thumbnail: "/images/service-thumb-tv.jpg",
  },
  {
    id: "svc-3",
    name: "iPhone Screen Replacement",
    technician: "Nabila Islam",
    category: "Smartphone",
    price: 65,
    status: "Approved",
    thumbnail: "/images/service-thumb-iphone.jpg",
  },
  {
    id: "svc-4",
    name: "Smart TV Display Repair",
    technician: "Tariq Hasan",
    category: "TV",
    price: 82,
    status: "Rejected",
    thumbnail: "/images/service-thumb-tv.jpg",
  },
];

const statusStyles: Record<ServiceStatus, string> = {
  Pending: "border-[#fae3b8] bg-[#fef6e7] text-[#c27803]",
  Approved: "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]",
  Rejected: "border-[#f6c9c9] bg-[#fdf2f2] text-[#b91c1c]",
};

type ServiceTableProps = {
  services: Service[];
  emptyMessage: string;
  onApprove: (id: string) => void;
  onReject: (service: Service) => void;
};

function ServiceTable({
  services,
  emptyMessage,
  onApprove,
  onReject,
}: ServiceTableProps) {
  return (
    <Table className="min-w-[960px]">
      <TableHeader>
        <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
          <TableHead className="h-11 pl-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Service
          </TableHead>
          <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Technician
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
              <TableCell className="py-5 pl-6">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={service.thumbnail}
                      alt={service.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <span className="font-semibold text-slate-900">
                    {service.name}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-5 text-slate-600">
                {service.technician}
              </TableCell>

              <TableCell className="py-5 text-slate-600">
                {service.category}
              </TableCell>

              <TableCell className="py-5 text-slate-600">
                ${service.price}
              </TableCell>

              <TableCell className="py-5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    statusStyles[service.status]
                  )}
                >
                  {service.status}
                </span>
              </TableCell>

              <TableCell className="py-5 pr-6">
                {service.status === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onReject(service)}
                      className="h-9 rounded-lg border-[#f6c9c9] bg-[#fdf2f2] px-4 text-sm font-semibold text-[#b91c1c] shadow-xs hover:bg-[#fbe7e7] hover:text-[#991b1b]"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => onApprove(service.id)}
                      className="h-9 rounded-lg bg-[#176b63] px-4 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
                    >
                      Approve
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Reviewed</span>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={6}
              className="py-12 text-center text-sm text-slate-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function ServiceApprovalPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [activeTab, setActiveTab] = useState<TabValue>("pending");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);

  const counts = useMemo(
    () => ({
      pending: services.filter((service) => service.status === "Pending").length,
      approved: services.filter((service) => service.status === "Approved")
        .length,
      rejected: services.filter((service) => service.status === "Rejected")
        .length,
    }),
    [services]
  );

  function getServices(status: ServiceStatus) {
    return services.filter((service) => service.status === status);
  }

  function approveService(id: string) {
    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === id ? { ...service, status: "Approved" } : service
      )
    );
  }

  function openRejectDialog(service: Service) {
    setActiveService(service);
    setIsRejectDialogOpen(true);
  }

  function confirmRejectService() {
    if (!activeService) return;

    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === activeService.id
          ? { ...service, status: "Rejected" }
          : service
      )
    );
    setIsRejectDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Service Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review technician submissions before they appear publicly.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
        >
          <div className="border-b border-slate-200 px-6">
            <TabsList
              variant="line"
              className="h-auto w-full justify-start gap-7 rounded-none p-0"
            >
              <TabsTrigger
                value="pending"
                className="h-auto flex-none rounded-none px-0 pt-5 pb-4 text-sm font-semibold text-slate-500 after:bottom-0 after:h-0.5 after:bg-[#176b63] hover:text-slate-800 data-active:text-[#176b63]"
              >
                Pending
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e6f2ef] px-1.5 text-xs font-semibold text-[#176b63]">
                  {counts.pending}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="all"
                className="h-auto flex-none rounded-none px-0 pt-5 pb-4 text-sm font-semibold text-slate-500 after:bottom-0 after:h-0.5 after:bg-[#176b63] hover:text-slate-800 data-active:text-[#176b63]"
              >
                All
              </TabsTrigger>

              <TabsTrigger
                value="approved"
                className="h-auto flex-none rounded-none px-0 pt-5 pb-4 text-sm font-semibold text-slate-500 after:bottom-0 after:h-0.5 after:bg-[#176b63] hover:text-slate-800 data-active:text-[#176b63]"
              >
                Approved
              </TabsTrigger>

              <TabsTrigger
                value="rejected"
                className="h-auto flex-none rounded-none px-0 pt-5 pb-4 text-sm font-semibold text-slate-500 after:bottom-0 after:h-0.5 after:bg-[#176b63] hover:text-slate-800 data-active:text-[#176b63]"
              >
                Rejected
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pending" className="mt-0">
            <ServiceTable
              services={getServices("Pending")}
              emptyMessage="No services are waiting for approval."
              onApprove={approveService}
              onReject={openRejectDialog}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <ServiceTable
              services={services}
              emptyMessage="No services have been submitted yet."
              onApprove={approveService}
              onReject={openRejectDialog}
            />
          </TabsContent>

          <TabsContent value="approved" className="mt-0">
            <ServiceTable
              services={getServices("Approved")}
              emptyMessage="No services have been approved yet."
              onApprove={approveService}
              onReject={openRejectDialog}
            />
          </TabsContent>

          <TabsContent value="rejected" className="mt-0">
            <ServiceTable
              services={getServices("Rejected")}
              emptyMessage="No services have been rejected."
              onApprove={approveService}
              onReject={openRejectDialog}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[460px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl ring-0 sm:max-w-[460px]"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Reject service?
            </DialogTitle>
            <DialogClose className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
              <X className="size-4.5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div className="px-6 py-5">
            <DialogDescription className="text-sm leading-6 text-slate-600">
              This service will not appear publicly. The technician can edit and
              resubmit it.
            </DialogDescription>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
            <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
              Cancel
            </DialogClose>
            <Button
              onClick={confirmRejectService}
              className="h-10 rounded-lg border border-[#f6c9c9] bg-[#fdf2f2] px-5 text-sm font-semibold text-[#b91c1c] shadow-xs hover:bg-[#fbe7e7] hover:text-[#991b1b]"
            >
              Reject Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
