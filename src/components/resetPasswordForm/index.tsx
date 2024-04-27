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
import EmailStep from "./emailStep";
import VerificationStep from "./verificationStep";

export type resetPasswordStep = "email" | "verification";

export default function ResetPasswordForm({}: {}) {
  const [step, setStep] = useState<resetPasswordStep>("email");
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col gap-2 items-center w-[325px]">
      {step === "email" && (
        <EmailStep email={email} setEmail={setEmail} setStep={setStep} />
      )}
      {step === "verification" && <VerificationStep email={email} />}
    </div>
  );
}
