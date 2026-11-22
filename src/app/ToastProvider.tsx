"use client";

import { Toaster } from "@/components/ui/toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return <Toaster>{children}</Toaster>;
}
