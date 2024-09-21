import { useMedia } from "react-use";

export default function useMobile() {
  const isMobile = useMedia("(max-width: 640px)", false);
  return isMobile;
}
