import { toast } from "@/components/ui/toast";

export function adminToast(type: "success" | "error", message: string) {
  toast.add({
    type,
    title: message,
  });
}
