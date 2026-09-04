"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateAlert } from "@/hooks/useAlerts";
import type { BookResult } from "@/types/book";
import type { AlertSite } from "@/types/alert";
import { Bell, Loader2 } from "lucide-react";

const alertSchema = z.object({
  targetPrice: z.number().min(1, "Target price must be at least 1"),
});

type AlertFormValues = z.infer<typeof alertSchema>;

interface CreateAlertDialogProps {
  book: BookResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAlertDialog({ book, open, onOpenChange }: CreateAlertDialogProps) {
  const { mutateAsync: createAlert, isPending } = useCreateAlert();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      targetPrice: Math.max(1, Math.floor(book.price * 0.9)), // Default to 10% off
    },
  });

  const onSubmit = async (data: AlertFormValues) => {
    try {
      await createAlert({
        title: book.title,
        link: book.link,
        site: book.site as AlertSite,
        targetPrice: data.targetPrice,
      });
      onOpenChange(false);
      form.reset();
    } catch {
      // Error handled by hook toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            Create Price Alert
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h4 className="font-medium text-sm line-clamp-2 mb-4" style={{ color: "var(--color-text-primary)" }}>
            {book.title}
          </h4>
          
          <div className="flex justify-between items-center mb-6 p-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-muted)" }}>
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Current Price</span>
            <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>৳ {book.price.toLocaleString()}</span>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="targetPrice" className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                Target Price (৳)
              </label>
              <input
                id="targetPrice"
                type="number"
                {...form.register("targetPrice", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-opacity-50 transition-shadow outline-none"
                style={{
                  backgroundColor: "var(--color-bg-muted)",
                  borderColor: form.formState.errors.targetPrice ? "var(--color-danger)" : "var(--color-border)",
                  color: "var(--color-text-primary)",
                  boxShadow: "0 0 0 0 transparent" // Reset default browser shadow
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
              {form.formState.errors.targetPrice && (
                <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                  {form.formState.errors.targetPrice.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Alert
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
