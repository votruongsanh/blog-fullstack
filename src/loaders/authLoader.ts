import { isAuthenticated } from "@/utils/authUtils";
import { redirect } from "react-router-dom";

export async function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect("/login");
  }
  return null;
}
