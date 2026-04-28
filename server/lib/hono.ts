import { Hono } from "@hono/hono";
import type { HonoVariables } from "@repo/types";

export const createRouter = () => new Hono<{ Variables: HonoVariables }>();
