import LoginForm from "@/src/components/loginForm";

export default async function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center ">
      <div className="flex flex-col gap-2 items-center max-w-[300px]">
        <h1 className=" text-neutral-700 text-[40px] font-semibold">Welcome</h1>
        <p className=" text-neutral-700 text-[16px] ">
          Please use the login details provided by Veedoo to access your
          account.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
