"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginState = {
  error: string;
};

export async function adminLogin(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      };
    }

    throw error;
  }

  return { error: "" };
}

export async function adminLogout() {
  await signOut({ redirectTo: "/admin/login" });
}
