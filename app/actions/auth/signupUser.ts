"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { lucia } from "@/src/services/auth";
import { USER_ID_LENGTH } from "@/src/utils/consts";
import { signupUserSchema } from "@/src/utils/validators";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupUserAction(signupUser: object) {
  try {
    let args = signupUserSchema.safeParse(signupUser);

    if (!args.success) {
      let errorMessages: string[] = [];

      args.error.issues.map((issue) => {
        errorMessages.push(
          `Error in ${issue.path.join(".")} : ${issue.message}`
        );
      });

      return {
        status: false,
        message: errorMessages.join(", "),
      };
    }

    let { email, password } = args.data;

    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(USER_ID_LENGTH);

    await db.insert(users).values({
      id: userId,
      hashed_password: hashedPassword,
      email: email,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch (error: any) {
    console.error("error in signupUser ", error);
    return {
      status: false,
      message: error.message ?? "error in signupUser",
    };
  }
} // Path: app/actions/auth/loginUser.ts
