import * as z from "zod";
import {
  AiResponseSchema,
  DeduplicationSchema,
} from "../../types/aiResponse.js";

export const getSchema = {
  name: "feedback",
  strict: true,
  schema: z.toJSONSchema(AiResponseSchema),
};

export const deduplicationSchema = {
  name: "deduplication",
  strict: true,
  schema: z.toJSONSchema(DeduplicationSchema),
};
