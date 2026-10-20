
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "تسجيل دخول الإدارة | وسامة برفيوم",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
