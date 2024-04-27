"use client";

import { sendResetPasswordEmail } from "@/app/actions/auth/resetPassowrd";
import { Button, Spinner } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function VerificationStep({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  const onResendEmail = async () => {
    try {
      setLoading(true);
      let request = await sendResetPasswordEmail(email);

      if (request.status) {
        toast.success(request.message);
      } else {
        toast.error(request.message);
      }
    } catch (error: any) {
      toast.error("Something went wrong: " + error.message);
      console.error("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center w-[365px]">
      <h1 className=" text-neutral-700 text-[40px] font-semibold">
        Check your email
      </h1>
      <p className="text-[16px] text-netural-700 ">
        We have sent an email password recover instructions to your email
        address. In case you did not receive an email please click on “Send
        again”.
      </p>
      <Button
        onClick={onResendEmail}
        className="mt-10 w-full bg-primary-700 text-white text-[16px] font-semibold  "
      >
        {!loading && "Send again"}
        {loading && <Spinner />}
      </Button>
    </div>
  );
}
