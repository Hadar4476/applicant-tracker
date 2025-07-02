import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const applicationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        status: z.string().default("PENDING"),
        resumeUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {} = input;
    }),
});
