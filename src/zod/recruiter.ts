import { z } from "zod";


// Define a Zod schema for validating the input
export const updateRecruitmentSchema = z.object({
  jobDescription: z.string().optional(),
  jobProfile: z.string().optional(),
  lastDate: z.string().optional(),
  numberOfPositions: z.string().optional(),
  jobLocation: z.string().optional(),
  rubricsJobProfile: z.array(z.string()).optional(),
  seniorityLevel: z.string().optional(),
  feedback: z.string().optional(),
  candidateName: z.array(z.string()).optional(),
});