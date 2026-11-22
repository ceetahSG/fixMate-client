"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

type UpdateProfileFormProps = {
  initialName?: string;
  initialEmail?: string;
  initialRole?: string;
  initialPhone?: string;
  initialArea?: string;
  initialBio?: string;
  initialImage?: string | null;
};

function getInitials(name?: string | null) {
  if (!name) return "FA";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UpdateProfileForm({
  initialName = "Farhana Ahmed",
  initialEmail = "farhana@example.com",
  initialRole = "Customer",
  initialPhone = "",
  initialArea = "Dhanmondi, Dhaka",
  initialBio = "I value reliable service and clear communication.",
  initialImage = null,
}: UpdateProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [area, setArea] = useState(initialArea);
  const [bio, setBio] = useState(initialBio);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      email,
      role: initialRole,
      phone,
      area,
      bio,
      hasNewPhoto: !!previewUrl && previewUrl !== initialImage,
    });
    toast.add({
      title: "Profile updated",
      description: "Your profile changes are ready to use across FixMate.",
      type: "success",
    });
  };

  const handleCancel = () => {
    setName(initialName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setArea(initialArea);
    setBio(initialBio);
    setPreviewUrl(initialImage);
    toast.add({
      title: "Changes discarded",
      description: "Your profile form was restored to its previous values.",
      type: "info",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Update Profile
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Keep your personal details current across FixMate.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        {/* Profile Photo Row */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
          {/* Avatar */}
          <div
            className={cn(
              "relative flex size-20 shrink-0 items-center justify-center rounded-full text-xl font-bold shadow-xs",
              previewUrl
                ? "bg-slate-100"
                : "bg-[#e0eeec] text-[#176b63]"
            )}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile photo"
                fill
                sizes="80px"
                className="rounded-full object-cover"
              />
            ) : (
              <span className="select-none text-lg">
                {getInitials(name)}
              </span>
            )}
          </div>

          {/* Photo info + Upload button */}
          <div className="flex flex-col gap-2.5">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Profile photo
              </p>
              <p className="text-xs text-slate-400">JPG or PNG, up to 3MB.</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload profile photo"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 gap-2 self-start border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Upload className="size-3.5 stroke-[2]" />
              Upload
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Form Fields */}
        <div className="p-6">
          {/* Row 1: Full Name + Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-xs font-semibold text-slate-700"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="h-10 rounded-lg border-slate-200 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-10 rounded-lg border-slate-200 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
              />
            </div>
          </div>

          {/* Row 2: Role (read-only) + Phone */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="role"
                className="text-xs font-semibold text-slate-700"
              >
                Role
              </Label>
              <Input
                id="role"
                type="text"
                value={initialRole}
                readOnly
                disabled
                className="h-10 cursor-not-allowed rounded-lg border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold text-slate-700"
              >
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX XXXXXX"
                className="h-10 rounded-lg border-slate-200 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
              />
            </div>
          </div>

          {/* Row 3: Area (half-width) */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="area"
                className="text-xs font-semibold text-slate-700"
              >
                Area
              </Label>
              <Input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Your area / city"
                className="h-10 rounded-lg border-slate-200 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
              />
            </div>
          </div>

          {/* Row 4: Bio (full-width) */}
          <div className="mt-5 space-y-1.5">
            <Label
              htmlFor="bio"
              className="text-xs font-semibold text-slate-700"
            >
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself..."
              rows={4}
              className="min-h-28 resize-y rounded-lg border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 rounded-lg border-slate-200 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-lg bg-[#176b63] px-5 text-xs font-semibold text-white shadow-none hover:bg-[#125851] sm:text-sm"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
