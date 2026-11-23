import { createContext, useContext } from "react";
import type { Role } from "@/lib/gt-data";
import type { ViewId } from "@/lib/gt-actions";

export type Mode = "demo" | "guide";
export type AppCtx = {
  role: Role; view: ViewId; mode: Mode;
  go: (role: Role, view: ViewId) => void;
  setMode: (m: Mode) => void;
  openFiche: (id: string) => void;
};
export const App = createContext<AppCtx | null>(null);
export const useApp = () => { const v = useContext(App); if (!v) throw new Error("no app"); return v; };
