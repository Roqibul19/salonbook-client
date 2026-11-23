import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

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
