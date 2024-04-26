import { validateRequest } from "@/app/actions/auth/validateRequest";
import CreatePasswordForm from "@/src/components/createPasswordForm";
import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function CreateAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }

  let id = params.id;

  let contactUser = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!contactUser) {
    notFound();
  }

  let { email, hashed_password } = contactUser;
  let hasPassword = hashed_password && hashed_password != "";

  if (hasPassword) {
    redirect("/login");
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center ">
      <div className="flex flex-col gap-2 items-center w-[300px]">
        <h1 className=" text-neutral-700 text-[40px] font-semibold">Welcome</h1>
        <p className="text-[16px] text-netural-700 ">
          This is your first time logging in. Please create a password to
          continue.
        </p>
        <CreatePasswordForm userId={id} userEmail={email} />
      </div>
    </main>
  );
}
