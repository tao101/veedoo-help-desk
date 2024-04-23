export function validatePassword(password: string) {
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
  //check if email is valid and return the result
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
