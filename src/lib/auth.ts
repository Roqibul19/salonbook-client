import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ObjectId } from "mongodb";
import { client, db } from "./mongodb";

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {},

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false, // users can never set their own role
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false, // users can never unblock themselves
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  hooks: {
    // password rules on the server: one uppercase + one lowercase letter
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = String(ctx.body?.password ?? "");
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must contain at least one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },

  databaseHooks: {
    session: {
      create: {
        // blocked users cannot sign in (email or Google)
        before: async (session) => {
          const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(session.userId) });

          if (user?.isBlocked) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked. Please contact the salon.",
            });
          }
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }),
      },
    }),
    nextCookies(), // must be the last plugin
  ],
});
