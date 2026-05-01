import { createDefine } from "fresh";
import type { User } from "./lib/types.ts";

export interface State {
  user: User | null;
}

export const define = createDefine<State>();
