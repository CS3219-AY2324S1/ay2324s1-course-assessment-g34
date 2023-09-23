export const validatePassword = (password) => {
  const errors = [];
  
  const digitRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*-_]/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;

  const hasDigit = digitRegex.test(password);
  const hasSpecialChar = specialCharRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);
  const hasLowercase = lowercaseRegex.test(password);
  const hasMinLength = password.length >= 10;

  if (!password) {
    errors.push("Password cannot be empty.");
  }

  if (!hasDigit) {
    errors.push("Password must contain at least one digit.");
  }

  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character.");
  }

  if (!hasUppercase) {
    errors.push("Password must contain at least one uppercase character.");
  }

  if (!hasLowercase) {
    errors.push("Password must contain at least one lowercase character.");
  }

  if (!hasMinLength) {
    errors.push("Password must be at least 10 characters long.");
  }

  return errors;
};
