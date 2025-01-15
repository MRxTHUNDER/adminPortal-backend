import { z } from "zod";

export const editInterviewSchema = z.object({
    organization: z
    .array(
      z
        .string()
        .max(100, "Each organization name must not exceed 100 characters")
    )
    .optional(),
  jobProfile: z
    .string()
    .max(100, "Job profile cannot exceed 100 characters")
    .optional(),
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in the format DD/MM/YYYY")
    .optional(),
  timeSlots: z.string().optional(),
  pricingPlans: z.string().optional(),
  meetLink: z.string().url("Invalid meet link URL").optional(),
  feedbackReport: z.string().optional(),
  resume: z.string().optional(),
  isVerified: z.boolean().optional(),
});
