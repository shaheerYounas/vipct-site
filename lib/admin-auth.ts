import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/supabase";

export async function requireStaff() {
  const staff = await getStaffUser();
  if (staff.mode === "anonymous") redirect("/admin/login");
  return staff;
}
