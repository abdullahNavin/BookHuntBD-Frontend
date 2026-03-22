"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import type { PriceAlert, AlertPayload } from "@/types/alert";

export function useAlerts() {
  return useQuery<PriceAlert[]>({
    queryKey: ["alerts"],
    queryFn: () => api.get<PriceAlert[]>("/alerts").then((r) => r.data),
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alert: AlertPayload) => api.post("/alerts", alert),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Price alert created");
    },
    onError: () => toast.error("Failed to create alert. Try again."),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/alerts/${id}`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["alerts"] });
      const prev = qc.getQueryData<PriceAlert[]>(["alerts"]);
      qc.setQueryData<PriceAlert[]>(
        ["alerts"],
        (old) => old?.filter((a) => a.id !== id) ?? []
      );
      return { prev };
    },
    onSuccess: () => toast.success("Alert deleted"),
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["alerts"], ctx?.prev);
      toast.error("Failed to delete alert");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
