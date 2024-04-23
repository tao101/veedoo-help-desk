"use server";

import { lucia } from "@/src/services/auth";
import { validateRequest } from "./validateRequest";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signoutUser() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      status: false,
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}
