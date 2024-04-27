"use client";

import CloseSvg from "@/src/svgs/closeSvg";
import TickSvg from "@/src/svgs/tickSvg";
import { validatePassword } from "@/src/utils/validators";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../loginForm/eyeSlashFilledIcon";
import { EyeFilledIcon } from "../loginForm/eyeFilledIcon";
import toast from "react-hot-toast";
import { resetUserPasswordByToken } from "@/app/actions/auth/resetPassowrd";
import { useRouter } from "next/navigation";

export default function SetNewPasswordFrom({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [formError, setFormError] = useState<{
    password: boolean;
    passwordMessage: string;
    confirmPassword: boolean;
    confirmPasswordMessage: string;
    resetPasswordError: string;
  }>({
    password: true,
    passwordMessage: "sadasdadasd",
    confirmPassword: true,
    confirmPasswordMessage: "sadasdadasd",
    resetPasswordError: "",
  });

  let isPasswordValidObj = validatePassword(password);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const onFromSubmit = async (e: any) => {
    //console.log("onFromSubmit", password, confirmPassword);
    e.preventDefault();

    try {
      setLoading(true);
      let resetPassword = await resetUserPasswordByToken(userId, password);
      if (resetPassword.status) {
        toast.success(resetPassword.message);
        router.push("/");
      } else {
        toast.error(resetPassword.message);
        console.log("error", resetPassword.message);
      }
    } catch (error: any) {
      toast.error("Something went wrong: " + error.message);
      console.error("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onFromSubmit} className="w-full mt-6 flex flex-col gap-2.5">
      <Input
        label={"New Password"}
        variant="bordered"
        placeholder="Enter your new password"
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
        onValueChange={(value: any) => {
          setFormError((prev) => ({
            ...prev,
            password: false,
            passwordMessage: "",
          }));
          setPassword(value);
        }}
        isInvalid={
          (!isPasswordValidObj.isPasswordValid || formError.password) &&
          password !== ""
        }
      />
      {!isPasswordValidObj.isPasswordValid && password != "" && (
        <div>
          <div className="flex flex-row items-center  gap-2">
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
      <Input
        label={"Confirm Password"}
        variant="bordered"
        placeholder="Confirm your password"
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
        value={confirmPassword}
        onValueChange={(value: any) => {
          setFormError((prev) => ({
            ...prev,
            confirmPassword: false,
            confirmPasswordMessage: "",
          }));
          setConfirmPassword(value);
        }}
        isInvalid={
          (password != confirmPassword || formError.confirmPassword) &&
          confirmPassword !== ""
        }
        errorMessage="Passwords do not match."
      />

      {formError.resetPasswordError != "" && (
        <p className=" text-error-900 text-center py-2.5 text-[12px]">
          {formError.resetPasswordError}
        </p>
      )}

      <Button
        type="submit"
        className="mt-2.5 bg-primary-700 text-white text-[16px] font-semibold  "
      >
        {!loading && "Save"}
        {loading && <Spinner />}
      </Button>
    </form>
  );
}
