"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { signupUserSchema } from "@/src/utils/validators";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { lucia } from "@/src/services/auth";
import { redirect } from "next/navigation";
import CreatePasswordPage from "@/app/(pages)/(privatePages)/create-passowrd/page";
import { DEFAULT_ACCOUNT_PASSWORD } from "@/src/utils/consts";

export async function signinUserAction(signinUser: object) {
  try {
    let args = signupUserSchema.safeParse(signinUser);

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

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    console.log("existingUser", existingUser);

    if (!existingUser) {
      return {
        status: false,
        message: "Sorry, we don’t recognize this email address.",
      };
    }
    if (existingUser.hashed_password && existingUser.hashed_password != "") {
      const validPassword = await new Argon2id().verify(
        existingUser.hashed_password,
        password
      );

      if (!validPassword) {
        return {
          status: false,
          message: "Incorrect username or password",
        };
      }
    } else {
      if (password != DEFAULT_ACCOUNT_PASSWORD) {
        return {
          status: false,
          message:
            "Incorrect Default Password for this account.Please contact Veedoo to get the password.",
          createPassword: true,
        };
      }
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return {
      status: true,
      message: "User signed in",
      createPassword:
        !existingUser.hashed_password || existingUser.hashed_password == "",
    };
  } catch (error: any) {
    console.error("error in signupUser ", error);
    return {
      status: false,
      message: error.message ?? "error in signupUser",
    };
  }
}
