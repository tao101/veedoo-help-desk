"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { lucia } from "@/src/services/auth";
import { createPasswordByIdSchema } from "@/src/utils/validators";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";

export async function createPasswordById(signinUser: object) {
  try {
    let args = createPasswordByIdSchema.safeParse(signinUser);

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

    let { email, password, id } = args.data;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return {
        status: false,
        message: "Sorry, we don’t recognize this email address.",
      };
    }

    if (existingUser.id != id) {
      return {
        status: false,
        message:
          "Sorry, the link you used is not valid for this email address .",
      };
    }

    const hashedPassword = await new Argon2id().hash(password);
    await db
      .update(users)
      .set({
        hashed_password: hashedPassword,
      })
      .where(eq(users.id, existingUser.id));

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return {
      status: true,
      message: "Password created successfully",
    };
  } catch (error: any) {
    console.error("error in signupUser ", error);
    return {
      status: false,
      message: error.message ?? "error in signupUser",
    };
  }
}
