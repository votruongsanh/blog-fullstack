import { isAuthenticated } from "@/utils/authUtils";
import { redirect } from "react-router-dom";

export const protectedLoader = async ({ request }: { request: Request }) => {
  console.log("Protected loader");
  console.log("Is authenticated", isAuthenticated());
  if (!isAuthenticated()) {
    const redirectUrl = new URL(request.url);
    const currentPath = redirectUrl.pathname + redirectUrl.search;
    throw redirect(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }
  return null;
};

export const authLoader = async () => {
  if (isAuthenticated()) {
    throw redirect("/home");
  }
  return null;
};
