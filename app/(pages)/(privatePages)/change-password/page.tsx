import { validateRequest } from "@/app/actions/auth/validateRequest";
import SetNewPasswordFrom from "@/src/components/resetPasswordForm/setNewPasswordForm";
import { db } from "@/src/db";
import { testTable } from "@/src/db/schema/testTable";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const { user } = await validateRequest();
  console.log("user", user);
  if (!user) {
    redirect("/login");
  }

  let userId = user.id;

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
