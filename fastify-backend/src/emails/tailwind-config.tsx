import "react";

import { Tailwind } from "@react-email/components";

import { ReactNode } from "react";

export default function TailwindConfig({ children }: { children: ReactNode }) {
  return <Tailwind>{children}</Tailwind>;
}
