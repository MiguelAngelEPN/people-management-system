// utils/notification.ts
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export type NotificationIcon = "success" | "error" | "warning" | "info" | "question";

interface NotifyOptions {
  icon?: NotificationIcon;   // icono: success, error, warning, etc
  message: string;           // texto del mensaje
  duration?: number;         // tiempo en ms (por defecto 2000)
}

export function showToast({ icon = "info", message, duration = 2000 }: NotifyOptions) {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });
}


export const confirmAlert = async (
  question: string,
  icon: "warning" | "info" | "error" | "question" = "warning",
  confirmText: string = "Sí"
): Promise<boolean> => {
  const result = await Swal.fire({
    title: question,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    heightAuto: false,
  });

  return result.isConfirmed;
};