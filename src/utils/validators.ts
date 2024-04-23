import { z } from "zod";

export function validatePassword(password: string) {
  password = password.trim();
  //check if string is at least 12 characters long and has at least one uppercase letter and at least one number and return which of the requirements are not met
  return {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    isPasswordValid:
      password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password),
  };
}

export function validateEmail(email: string) {
  email = email.trim();
  //check if email is valid and return the result
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const signupUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .trim()
    .refine(
      (password) => {
        const { isPasswordValid } = validatePassword(password);
        return isPasswordValid;
      },
      {
        message:
          "Password must be at least 12 characters long and contain at least one uppercase letter and one number",
      }
    ), // validatePassword(password).isPasswordValid),
});
