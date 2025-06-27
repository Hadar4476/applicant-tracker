import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";

interface CreateContextOptions {
  session: Awaited<ReturnType<typeof getUserFromToken>>;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  // Get token from Authorization header or cookie
  let token: string | undefined;

  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");

      if (key && value) {
        acc[key] = value;
      }

      return acc;
    }, {} as Record<string, string>);
    token = cookies["auth-token"];
  }

  const session = token ? await getUserFromToken(token) : null;

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
