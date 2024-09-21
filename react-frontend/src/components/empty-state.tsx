import { cn } from "@/lib/utils";
import { FrownIcon, LucideIcon } from "lucide-react";

export function EmptyState({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center border py-20 px-4 rounded-xl border-dashed animate-in",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EmptyStateIcon({ Icon = FrownIcon }: { Icon?: LucideIcon }) {
  return <Icon className="w-[3rem] h-[3rem] mb-4" size={48} />;
}

export function EmptyStateTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold max-w-[550px] text-balance mb-1",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function EmptyStateDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm max-w-[450px] text-balance", className)}>
      {children}
    </p>
  );
}
