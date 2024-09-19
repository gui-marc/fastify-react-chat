import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[100] bg-background text-foreground grid place-items-center">
      <LoaderIcon className="animate-spin h-5 w-5" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
