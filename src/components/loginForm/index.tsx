"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { EyeFilledIcon } from "./eyeFilledIcon";
import { EyeSlashFilledIcon } from "./eyeSlashFilledIcon";
import { validateEmail, validatePassword } from "@/src/utils/validators";
import CloseSvg from "@/src/svgs/closeSvg";
import TickSvg from "@/src/svgs/tickSvg";
import Link from "next/link";

export default function LoginForm({
  createPassword = false,
}: {
  createPassword?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [fromError, setFormError] = useState<{
    email: boolean;
    emailMessage: string;
    password: boolean;
    passwordMessage: string;
  }>({
    email: true,
    emailMessage: "sadasdadasd",
    password: false,
    passwordMessage: "",
  });

  let isPasswordValidObj = validatePassword(password);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onFromSubmit = (e: any) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setFormError({
        ...fromError,
        email: !validateEmail(email),
        emailMessage: "Please enter a valid email",
      });
    }
  };

  return (
    <form
      onSubmit={onFromSubmit}
      className="my-[24px] w-full flex flex-col gap-2.5"
    >
      <Input
        type="email"
        variant="bordered"
        label="Email"
        placeholder="Enter your email"
        className="w-full border-red-300 "
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
      <Input
        label={createPassword ? "Create Password" : "Password"}
        variant="bordered"
        placeholder="Enter your password"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
        className="max-w-xs"
        value={password}
        onValueChange={(value) => {
          setFormError((prev) => ({
            ...prev,
            password: false,
            passwordMessage: "",
          }));
          setPassword(value);
        }}
        isInvalid={
          (!isPasswordValidObj.isPasswordValid || fromError.password) &&
          password !== ""
        }
      />
      {!isPasswordValidObj.isPasswordValid && password != "" && (
        <div>
          <div className="flex flex-row items-center gap-2">
            {!isPasswordValidObj.length ? <CloseSvg /> : <TickSvg />}
            <p
              className={`text-[12px] ${
                !isPasswordValidObj.length
                  ? " text-primary-900"
                  : " text-neutral-500"
              }`}
            >
              At least 12 characters long.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            {!isPasswordValidObj.uppercase ? <CloseSvg /> : <TickSvg />}
            <p
              className={`text-[12px] ${
                !isPasswordValidObj.uppercase
                  ? " text-primary-900"
                  : " text-neutral-500"
              }`}
            >
              Contains an uppercase letter.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            {!isPasswordValidObj.number ? <CloseSvg /> : <TickSvg />}
            <p
              className={`text-[12px] ${
                !isPasswordValidObj.number
                  ? " text-primary-900"
                  : " text-neutral-500"
              }`}
            >
              Contains a number.
            </p>
          </div>
        </div>
      )}

      {!createPassword && (
        <div className=" w-full  flex flex-col items-end flex-end">
          <Link
            className=" text-[13px] text-primary-700 active:scale-90 "
            href="/forgot-passowrd"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <Button className="mt-2.5 bg-primary-700 text-white text-[16px] font-semibold  ">
        Login
      </Button>
    </form>
  );
}
