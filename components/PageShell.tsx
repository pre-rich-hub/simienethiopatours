import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children, lightHeader = true }: { children: ReactNode; lightHeader?: boolean }) {
  return <><Header light={lightHeader} /><main id="main-content">{children}</main><Footer /></>;
}
