import { toast } from "sonner";

export const successToast = (msg) =>
  toast.success(msg, {
    style: {
      background: "#d1fae5",
      color: "#065f46",
    },
  });

export const errorToast = (msg) =>
  toast.error(msg, {
    style: {
      background: "#fee2e2",
      color: "#991b1b",
    },
  });
