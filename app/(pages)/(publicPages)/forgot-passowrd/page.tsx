import { validateRequest } from "@/app/actions/auth/validateRequest";
import LoginForm from "@/src/components/loginForm";
import ResetPasswordForm from "@/src/components/resetPasswordForm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ForgotPassword() {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center ">
      <ResetPasswordForm />
      <Link
        href="/"
        className="mt-10 text-[14px] font-semibold text-primary-700 capitalize "
      >
        Close
      </Link>
    </main>
  );
}
