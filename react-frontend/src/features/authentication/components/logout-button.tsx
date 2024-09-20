import { Button, ButtonProps } from "@/components/ui/button";
import { useAuthLogged } from "../auth-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOutIcon } from "lucide-react";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export default function LogoutButton({ ...props }: ButtonProps) {
  const { logout } = useAuthLogged();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={logout} {...props}>
          <LogOutIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Logout</span>
        </Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Logout</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
