"use client";
import { useState } from "react";
import { resetPasswordStep } from ".";
import { validateEmail } from "@/src/utils/validators";
import { Button, Input, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import { sendResetPasswordEmail } from "@/app/actions/auth/resetPassowrd";

export default function EmailStep({
  setStep,
  email,
  setEmail,
}: {
  setStep: (step: resetPasswordStep) => void;
  email: string;
  setEmail: (email: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [fromError, setFormError] = useState<{
    email: boolean;
    emailMessage: string;
    resetPasswordError: string;
  }>({
    email: true,
    emailMessage: "sadasdadasd",
    resetPasswordError: "",
  });

  const onFromSubmit = async (e: any) => {
    console.log("onFromSubmit", email);
    e.preventDefault();
    setFormError((prev) => ({
      ...prev,
      email: false,
      emailMessage: "",
      resetPasswordError: "",
    }));

    if (!validateEmail(email)) {
      setFormError({
        email: !validateEmail(email),
        emailMessage: "Please enter a valid email",
        resetPasswordError: "",
      });
      return;
    }

    try {
      setLoading(true);
      let request = await sendResetPasswordEmail(email);

      if (request.status) {
        setStep("verification");
        toast.success(request.message);
      } else {
        setFormError({
          email: false,
          emailMessage: "",
          resetPasswordError: request.message,
        });
      }
    } catch (error: any) {
      toast.error("Something went wrong: " + error.message);
      console.error("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onFromSubmit}
      className="flex flex-col gap-2 items-center w-[325px]"
    >
      <h1 className=" text-neutral-700 text-[40px] font-semibold">
        Reset password
      </h1>
      <p className="text-[16px] text-netural-700 mb-6 ">
        Enter the email associated with your account and we will send an email
        with reset link.
      </p>
      <Input
        type="email"
        variant="bordered"
        label="Email"
        placeholder="Enter the email associated with your account"
        className="w-full  outline-primary-700 "
        isInvalid={(!validateEmail(email) || fromError.email) && email !== ""}
        errorMessage={
          fromError.email
            ? fromError.emailMessage
            : "Please enter a valid email"
        }
        value={email}
        onValueChange={(value) => {
          setFormError((prev) => ({ ...prev, email: false, emailMessage: "" }));
          setEmail(value);
        }}
        required
      />
      {fromError.resetPasswordError != "" && (
        <p className=" text-error-900 text-center py-2.5 text-[12px]">
          {fromError.resetPasswordError}
        </p>
      )}

      <Button
        type="submit"
        className="mt-2.5 w-full bg-primary-700 text-white text-[16px] font-semibold  "
      >
        {!loading && "Send"}
        {loading && <Spinner />}
      </Button>
    </form>
  );
}
