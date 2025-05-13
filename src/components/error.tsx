import React from "react";
import { AlertCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorVariant = "danger" | "warning" | "info";

interface ErrorProps {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  className?: string;
  onClose?: () => void;
}

export function Error({
  title,
  message,
  variant = "danger",
  className,
  onClose,
}: ErrorProps) {
  const variantStyles = {
    danger:
      "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    warning:
      "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    info: "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  };

  const IconComponent =
    variant === "danger" ? XCircle : variant === "warning" ? AlertCircle : Info;

  return (
    <div
      className={cn(
        "p-4 border rounded-md flex items-start gap-3",
        variantStyles[variant],
        className,
      )}
    >
      <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0">
          <XCircle className="h-4 w-4 opacity-70 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}
