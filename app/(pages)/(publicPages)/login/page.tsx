import { validateRequest } from "@/app/actions/auth/validateRequest";
import LoginForm from "@/src/components/loginForm";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center ">
      <div className="flex flex-col gap-2 items-center w-[300px]">
        <h1 className=" text-neutral-700 text-[40px] font-semibold">Welcome</h1>

        <LoginForm />
      </div>
    </main>
  );
}
