"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-white/10 !bg-slate-950 !text-white !shadow-[0_12px_40px_rgba(2,6,23,0.5)]",
          title: "!text-white",
          description: "!text-slate-300",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-white/6 !text-slate-200",
        },
      }}
      {...props}
    />
  );
}
