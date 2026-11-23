"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addBooking } from "@/lib/actions/api/services";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

type RequestRepairDialogProps = {
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
};

const fieldClassName =
  "h-11 rounded-md border-slate-300 bg-[#fafafa] px-3 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-[#176b63]/20";

const labelClassName = "text-sm font-semibold text-slate-900";

export default function RequestRepairDialog({
  serviceId,
  serviceTitle,
  serviceImage,
  category,
  basePrice,
  technicianName,
  technicianEmail,
}: RequestRepairDialogProps) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const customerEmail =
        session?.user?.email ?? String(formData.get("email") ?? "").trim();

      await addBooking({
        serviceId,
        serviceTitle,
        serviceImage,
        category,
        basePrice,
        technicianName,
        technicianEmail,
        customerName:
          session?.user?.name ?? String(formData.get("fullName") ?? "").trim(),
        customerEmail,
        customerPhone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        preferredDate: String(formData.get("preferredDate") ?? ""),
        problemDescription: String(
          formData.get("problemDescription") ?? "",
        ).trim(),
        status: "requested",
        finalAmount: basePrice,
        paymentStatus: "unpaid",
      });

      form.reset();
      setIsOpen(false);
      toast.add({
        title: "Repair request submitted",
        description: "The technician will review your booking shortly.",
        type: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not submit the booking.";
      setSubmitError(message);
      toast.add({ title: "Booking failed", description: message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className="mt-6 h-11 w-full rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
          />
        }
      >
        Request Repair
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[600px] gap-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl ring-0 sm:max-w-[600px]"
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <DialogTitle className="text-base leading-snug font-medium text-slate-900 sm:text-[17px]">
            Request {serviceTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter your contact details and describe the problem to request this
            repair service.
          </DialogDescription>
          <DialogClose className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-x-5 gap-y-5 px-6 py-6 sm:grid-cols-2">
            {submitError ? (
              <p
                className="rounded-lg border border-[#f6c9c9] bg-[#fdf2f2] px-4 py-3 text-sm text-[#b91c1c] sm:col-span-2"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="request-full-name" className={labelClassName}>
                Full Name
              </Label>
              <Input
                id="request-full-name"
                name="fullName"
                required
                autoComplete="name"
                value={session?.user?.name ?? ""}
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-email" className={labelClassName}>
                Email
              </Label>
              <Input
                id="request-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={session?.user?.email ?? ""}
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-phone" className={labelClassName}>
                Phone Number
              </Label>
              <Input
                id="request-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+880 1XXX XXXXXX"
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-date" className={labelClassName}>
                Preferred Date
              </Label>
              <Input
                id="request-date"
                name="preferredDate"
                type="date"
                required
                className={`${fieldClassName} [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60`}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="request-address" className={labelClassName}>
                Address
              </Label>
              <Input
                id="request-address"
                name="address"
                required
                autoComplete="street-address"
                placeholder="House, road, area, city"
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="request-problem" className={labelClassName}>
                Problem Description
              </Label>
              <Textarea
                id="request-problem"
                name="problemDescription"
                required
                rows={4}
                placeholder="Describe what is happening with your device..."
                className="min-h-[116px] resize-none rounded-md border-slate-300 bg-[#fafafa] px-3 py-3 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-[#176b63]/20"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-50"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-md bg-[#176b63] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
