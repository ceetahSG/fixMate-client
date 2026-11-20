"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { addService } from "@/lib/actions/api/services";
import { TServiceData } from "@/types";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "TV",
  "AC",
  "Washing Machine",
  "Other",
];

const serviceModes = ["Home Visit", "In-Store", "Remote"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function AddServicePage() {
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("Home Visit");
  const [serviceArea, setServiceArea] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const technicianName = session?.user?.name || "Farhana Ahmed";
  const technicianEmail = session?.user?.email || "farhana@example.com";

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setImageError("Please choose a PNG or JPG image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setPrice("");
    setDescription("");
    setDuration("");
    setMode("Home Visit");
    setServiceArea("");
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    setFormError("");
    setIsAvailable(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!category) {
      setFormError("Please select a category before saving.");
      return;
    }

    if (!imageFile) {
      setFormError("Please select a service image.");
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);

      const uploadResponse = await fetch("/api/upload/imgbb", {
        method: "POST",
        body: uploadData,
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.message || "Image upload failed.");
      }

      const serviceData = {
        title: title.trim(),
        category,
        basePrice: Number(price),
        description: description.trim(),
        estimatedDuration: duration.trim(),
        serviceMode: mode,
        serviceArea: serviceArea.trim(),
        serviceImage: uploadResult.url,
        image: uploadResult.url,
        technicianName: technicianName,
        technicianEmail: technicianEmail,
        status: "Pending",
        approvalStatus: "Pending",
        isAvailable,
        createdAt: new Date().toISOString(),
      };

      console.log("Service data to be sent:", serviceData);
      const res = await addService(serviceData as TServiceData);
      if (res.insertedId) {
        console.log("Service added successfully!");
        resetForm();
      } else {
        throw new Error(res.message || "Could not save the service.");
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save the service.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Add a New Repair Service
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Describe your service clearly. New listings begin in Pending approval.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-[890px] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8"
      >
        {/* Step 1: Service details */}
        <section>
          <div className="flex items-start gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eef4f1] text-[10px] font-semibold text-[#176b63]">
              01
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">
                Service details
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Core information customers will see.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="service-title"
                className="text-[13px] font-semibold text-slate-900"
              >
                Service Title
              </Label>
              <Input
                id="service-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Smartphone screen replacement"
                required
                className="h-10 rounded-lg border-slate-300 bg-white text-sm shadow-xs placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value ?? "")}
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
                    {categories.map((option) => (
                      <SelectItem key={option} value={option} className="py-2">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="base-price"
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Base Price (USD)
                </Label>
                <Input
                  id="base-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="0.00"
                  required
                  className="h-10 rounded-lg border-slate-300 bg-white text-sm shadow-xs placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[13px] font-semibold text-slate-900"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain what this service covers..."
                required
                className="min-h-[140px] resize-none rounded-lg border-slate-300 bg-white text-sm shadow-xs placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Estimated Duration
                </Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="e.g. 1-2 hours"
                  className="h-10 rounded-lg border-slate-300 bg-white text-sm shadow-xs placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Service Mode
                </Label>
                <Select
                  value={mode}
                  onValueChange={(value) => setMode(value ?? "Home Visit")}
                >
                  <SelectTrigger
                    aria-label="Service mode"
                    className="h-10 w-full rounded-lg border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    alignItemWithTrigger={false}
                    className="rounded-lg border border-slate-200"
                  >
                    {serviceModes.map((option) => (
                      <SelectItem key={option} value={option} className="py-2">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="service-area"
                className="text-[13px] font-semibold text-slate-900"
              >
                Service Area
              </Label>
              <Input
                id="service-area"
                value={serviceArea}
                onChange={(event) => setServiceArea(event.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="h-10 rounded-lg border-slate-300 bg-white text-sm shadow-xs placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <Label
                  htmlFor="is-available"
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Available
                </Label>
                <p className="mt-0.5 text-xs text-slate-500">
                  Let customers know this service is currently available.
                </p>
              </div>
              <Switch
                id="is-available"
                checked={isAvailable}
                onCheckedChange={(checked) => setIsAvailable(checked)}
              />
            </div>
          </div>
        </section>

        {/* Step 2: Service image */}
        <section className="mt-8 border-t border-slate-100 pt-8">
          <div className="flex items-start gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eef4f1] text-[10px] font-semibold text-[#176b63]">
              02
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">
                Service image
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Use a clear image related to the repair.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="service-image"
              className="flex min-h-[185px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-8 text-center transition-colors hover:border-[#176b63]/40 hover:bg-[#f8fbfa] focus-within:ring-2 focus-within:ring-[#176b63]/30 focus-within:outline-none"
            >
              <input
                ref={fileInputRef}
                id="service-image"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                className="sr-only"
              />

              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Selected service"
                    width={320}
                    height={128}
                    unoptimized
                    className="max-h-28 w-auto rounded-lg object-contain"
                  />
                  <p className="mt-3 max-w-full truncate text-xs font-medium text-slate-600">
                    {imageFile?.name}
                  </p>
                  <span className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-xs">
                    Change File
                  </span>
                </>
              ) : (
                <>
                  <ImagePlus className="size-6 text-[#176b63]" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Upload service image
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    PNG or JPG, up to 5MB
                  </p>
                  <span className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-xs">
                    Choose File
                  </span>
                </>
              )}
            </label>

            {imageError ? (
              <p className="mt-2 text-xs text-[#b91c1c]" role="alert">
                {imageError}
              </p>
            ) : null}
          </div>
        </section>

        {/* Step 3: Technician */}
        <section className="mt-8 border-t border-slate-100 pt-8">
          <div className="flex items-start gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eef4f1] text-[10px] font-semibold text-[#176b63]">
              03
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">
                Technician
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Connected to your FixMate account.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="technician-name"
                className="text-[13px] font-semibold text-slate-900"
              >
                Technician Name
              </Label>
              <Input
                id="technician-name"
                value={technicianName}
                disabled
                className="h-10 rounded-lg border-slate-200 bg-[#f8f9f8] text-sm text-slate-500 disabled:opacity-100"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="technician-email"
                className="text-[13px] font-semibold text-slate-900"
              >
                Email
              </Label>
              <Input
                id="technician-email"
                value={technicianEmail}
                disabled
                className="h-10 rounded-lg border-slate-200 bg-[#f8f9f8] text-sm text-slate-500 disabled:opacity-100"
              />
            </div>
          </div>

          {formError ? (
            <p className="mt-4 text-xs text-[#b91c1c]" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="mt-5 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="h-10 rounded-lg border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
            >
              Save Service
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
