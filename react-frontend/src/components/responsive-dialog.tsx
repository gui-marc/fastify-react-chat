import useMobile from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  DialogContentProps,
  DialogDescriptionProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "@radix-ui/react-dialog";
import { forwardRef } from "react";

export function ResponsiveDialog({ ...props }: DialogProps) {
  const isMobile = useMobile();
  return !isMobile ? <Dialog {...props} /> : <Drawer {...props} />;
}

export function ResponsiveDialogHeader({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useMobile();
  return !isMobile ? <DialogHeader {...props} /> : <DrawerHeader {...props} />;
}

export const ResponsiveDialogTrigger = forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>((props, ref) => {
  const isMobile = useMobile();
  return !isMobile ? (
    <DialogTrigger {...props} ref={ref} />
  ) : (
    <DrawerTrigger {...props} ref={ref} />
  );
});
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

export function ResponsiveDialogTitle(props: DialogTitleProps) {
  const isMobile = useMobile();
  return !isMobile ? <DialogTitle {...props} /> : <DrawerTitle {...props} />;
}

export function ResponsiveDialogDescription(props: DialogDescriptionProps) {
  const isMobile = useMobile();

  return !isMobile ? (
    <DialogDescription {...props} />
  ) : (
    <DrawerDescription {...props} />
  );
}

export function ResponsiveDialogContent(props: DialogContentProps) {
  const isMobile = useMobile();
  return !isMobile ? (
    <DialogContent {...props} />
  ) : (
    <DrawerContent {...props} />
  );
}
