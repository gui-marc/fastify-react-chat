import useMountTransition from "@/hooks/use-mount-transition";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export default function FadeIn({
  children,
  className,
  duration = 300,
}: FadeInProps) {
  const hasTransitionedIn = useMountTransition(true, duration);
  return (
    <div
      className={cn(
        "transition-all duration-500 transform",
        {
          "opacity-0 translate-y-1": !hasTransitionedIn,
          "opacity-100 translate-y-0": hasTransitionedIn,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
