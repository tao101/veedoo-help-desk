import { validateRequest } from "@/app/actions/auth/validateRequest";
import CreatePasswordForm from "@/src/components/createPasswordForm";
import SetNewPasswordFrom from "@/src/components/resetPasswordForm/setNewPasswordForm";
import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function createNewPassword({
  params,
}: {
  params: { token: string };
}) {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }

  let token = params.token;

  let userToResetPassword = await db.query.users.findFirst({
    where: eq(users.tmpResetPasswordToken, token),
  });

  if (!userToResetPassword) {
    notFound();
  }

  let userId = userToResetPassword.id;

  return (
    <main className="flex-1 flex flex-col items-center justify-center ">
      <div className="flex flex-col gap-2 items-center w-[300px]">
        <h1 className=" text-neutral-700 text-[40px] font-semibold">
          New password
        </h1>
        <p className="text-[16px] text-netural-700 ">
          Your new password must be different from your previuos used passwords.
        </p>
        <SetNewPasswordFrom userId={userId} />
      </div>
    </main>
  );
}
