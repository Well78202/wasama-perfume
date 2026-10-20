
import { LogOut } from "lucide-react";
import { adminLogout } from "./actions";

export default function LogoutButton() {
  return (
    <form action={adminLogout}>
      <button
        type="submit"
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
      >
        <LogOut size={17} />
        تسجيل الخروج
      </button>
    </form>
  );
}
