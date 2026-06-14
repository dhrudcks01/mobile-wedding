type ToastTone = "success" | "error";

type ToastProps = {
  message: string;
  tone?: ToastTone;
};

const toneClasses: Record<ToastTone, string> = {
  success:
    "border-[var(--color-line)] bg-stone-950 text-white shadow-[0_18px_50px_rgba(44,32,24,0.24)]",
  error:
    "border-red-100 bg-red-50 text-red-700 shadow-[0_18px_50px_rgba(127,29,29,0.12)]",
};

export function Toast({ message, tone = "success" }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[390px] -translate-x-1/2 rounded-full border px-5 py-3 text-center text-sm font-medium ${toneClasses[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
