"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { EyeFilledIcon } from "../loginForm/eyeFilledIcon";
import { EyeSlashFilledIcon } from "../loginForm/eyeSlashFilledIcon";
import { validateEmail, validatePassword } from "@/src/utils/validators";
import CloseSvg from "@/src/svgs/closeSvg";
import TickSvg from "@/src/svgs/tickSvg";
import Link from "next/link";
import toast from "react-hot-toast";
import { signinUserAction } from "@/app/actions/auth/signinUser";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { createPasswordById } from "@/app/actions/auth/createPasswordById";

export default function CreatePasswordForm({ userId }: { userId: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [fromError, setFormError] = useState<{
    email: boolean;
    emailMessage: string;
    password: boolean;
    passwordMessage: string;
    loginError: string;
  }>({
    email: true,
    emailMessage: "sadasdadasd",
    password: false,
    passwordMessage: "",
    loginError: "",
  });

  let isPasswordValidObj = validatePassword(password);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onFromSubmit = async (e: any) => {
    console.log("onFromSubmit", email, password);
    e.preventDefault();
    setFormError((prev) => ({ ...prev, email: false, loginError: "" }));

    if (!validateEmail(email) || !isPasswordValidObj.isPasswordValid) {
      console.log("onFromSubmit", {
        email: !validateEmail(email),
        emailMessage: "Please enter a valid email",
        password: !isPasswordValidObj.isPasswordValid,
        passwordMessage: "Password is not valid",
      });

      setFormError({
        email: !validateEmail(email),
        emailMessage: "Please enter a valid email",
        password: !isPasswordValidObj.isPasswordValid,
        passwordMessage: "Password is not valid",
        loginError: "",
      });

      return;
    }

    try {
      console.log("test");
      let data = {
        id: userId,
        email,
        password,
      };
      let request = await createPasswordById(data);
      let { status, message } = request;
      console.log("request ", request);
      if (!status) {
        toast.error(message);
        console.error(message);
        setFormError((prev) => ({
          ...prev,
          email: false,
          loginError: message,
        }));

        return;
      } else {
        toast.success("Login successfull");
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Something went wrong: " + error.message);
      console.error("error", error.message);
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
        label={"Create Password"}
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

      {fromError.loginError != "" && (
        <p className=" text-error-900 text-center py-2.5 text-[12px]">
          {fromError.loginError}
        </p>
      )}

      <Button
        type="submit"
        className="mt-2.5 bg-primary-700 text-white text-[16px] font-semibold  "
      >
        Login
      </Button>
    </form>
  );
}
