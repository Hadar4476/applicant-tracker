import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const jobDataSchema = {
  title: z.string().min(2),
  description: z.string().min(2),
  requirements: z.array(z.string()),
  advantages: z.array(z.string()).optional(),
};

export const jobsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          cursor: z.string().optional(), // For pagination
          search: z.string().optional(), // For filtering
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 10, cursor, search } = input || {};

      const jobs = await ctx.db.job.findMany({
        take: limit + 1, // Take one extra to check if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined = undefined;
      if (jobs.length > limit) {
        const nextItem = jobs.pop(); // Remove the extra item
        nextCursor = nextItem!.id;
      }

      return {
        jobs,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const job = await ctx.db.job.findUnique({
        where: { id },
        include: {
          applications: true,
        },
      });

      return job;
    }),

  create: protectedProcedure
    .input(z.object({ ...jobDataSchema }))
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.db.job.create({
        data: { ...input },
      });

      return job;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), ...jobDataSchema }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const job = await ctx.db.job.update({
        where: { id },
        data,
      });

      return job;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const job = await ctx.db.job.delete({
          where: { id: input.id },
        });

        return job;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }
    }),
});
