import type { InferSelectModel } from "drizzle-orm";
import { advocates } from "../db/schema";

export type Advocate = InferSelectModel<typeof advocates>; 