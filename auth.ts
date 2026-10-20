
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("ADMIN LOGIN: START");

        // Validate credentials
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          console.log("ADMIN LOGIN: INVALID INPUT");
          return null;
        }

        const email = parsed.data.email.trim().toLowerCase();

        // Find admin
        const admin = await prisma.admin.findUnique({
          where: {
            email,
          },
        });

        if (!admin) {
          console.log("ADMIN LOGIN: ADMIN NOT FOUND");
          return null;
        }

        // Verify password
        const validPassword = await compare(
          parsed.data.password,
          admin.passwordHash
        );

        if (!validPassword) {
          console.log("ADMIN LOGIN: INVALID PASSWORD");
          return null;
        }

        console.log("ADMIN LOGIN SUCCESS");

        return {
          id: admin.id,
          email: admin.email,
          name: "Wasama Admin",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.adminId ?? "");
      }

      return session;
    },
  },
});
