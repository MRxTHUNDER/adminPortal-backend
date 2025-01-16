import { z } from "zod";

export const updateSlotSchema = z.object({
    date: z
    .string()
    .optional(),
  time: z.string().optional(),
  meetLink: z.string().url("Invalid URL format.").optional(),
  feedback: z.string().optional(),
  isVerified: z.boolean().optional(),
  candidateName: z.string().optional(),
});
