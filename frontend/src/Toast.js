import { toast } from "sonner";

export const successToast = (msg) =>
  toast.success(msg, {
    className: "toast-success",
  });

export const errorToast = (msg) =>
  toast.error(msg, {
    className: "toast-error",
  });
