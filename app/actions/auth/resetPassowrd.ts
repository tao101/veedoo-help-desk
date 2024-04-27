"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { lucia } from "@/src/services/auth";
import { validateEmail, validatePassword } from "@/src/utils/validators";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";

export async function sendResetPasswordEmail(email: string) {
  try {
    let isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return {
        status: false,
        message: "Please enter a valid email",
      };
    }

    let existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return {
        status: false,
        message: "Sorry, we don’t recognize this email address.",
      };
    }

    let resetPasswordToken = Math.random().toString(36).substring(2, 15);

    await db
      .update(users)
      .set({
        tmpResetPasswordToken: resetPasswordToken,
      })
      .where(eq(users.id, existingUser.id));

    //send email

    const Mailjet = require("node-mailjet");

    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY ?? "",
      apiSecret: process.env.MAILJET_SECRET_KEY ?? "",
    });

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "support@veedoo.io",
            Name: "Veedoo Support",
          },
          To: [
            {
              Email:
                process.env.NODE_ENV == "production"
                  ? existingUser.email
                  : "taoufiq@veedoo.io", //existingUser.email,
              Name: existingUser.name,
            },
          ],
          TemplateID: 5918066,
          TemplateLanguage: true,
          Subject: "Veedoo Help desk: Reset Password Email",
          Variables: {
            name: existingUser.name,
            link:
              process.env.NEXT_PUBLIC_BASE_URL +
              "/forgot-passowrd/" +
              resetPasswordToken,
          },
        },
      ],
    });
    let result = await request.catch((err: any) => {
      console.log("error sending reset password email", err);
    });

    return {
      status: true,
      message: "Reset Password Email sent successfully",
    };
  } catch (error: any) {
    console.error("error in sendResetPasswordEmail", email, error.message);
    return {
      status: false,
      message: "Something went wrong",
    };
  }
}

export async function resetUserPasswordByToken(id: string, password: string) {
  try {
    let existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      return {
        status: false,
        message: "Sorry, we don’t recognize this email address.",
      };
    }

    let validPassword = validatePassword(password);

    if (!validPassword.isPasswordValid) {
      return {
        status: false,
        message: "Password is not valid",
      };
    }

    const hashedPassword = await new Argon2id().hash(password);
    await db
      .update(users)
      .set({
        hashed_password: hashedPassword,
        tmpResetPasswordToken: "",
      })
      .where(eq(users.id, id));

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      status: true,
      message: "Password reset successfully",
    };
  } catch (error: any) {
    console.error("error in resetUserPasswordByToken", id, error.message);
    return {
      status: false,
      message: "Something went wrong",
    };
  }
}
