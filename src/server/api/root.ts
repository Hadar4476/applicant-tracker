import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/auth";
import { jobsRouter } from "./routers/jobs";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  jobs: jobsRouter,
});

export type AppRouter = typeof appRouter;
