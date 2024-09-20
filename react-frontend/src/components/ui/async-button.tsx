import { LoaderIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface AsyncButtonProps extends ButtonProps {
  isLoading: boolean;
}

export function AsyncButton({
  isLoading,
  children,
  className,
  disabled,
  ...props
}: AsyncButtonProps) {
  return (
    <Button
      className={cn("relative", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <LoaderIcon className="animate-spin w-4 h-4" />
        </span>
      )}

      {isLoading && <span className="sr-only">Loading...</span>}

      <span
        className={cn(
          "transition-opacity inline-flex items-center justify-center gap-2",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        aria-hidden={isLoading}
      >
        {children}
      </span>
    </Button>
  );
}
