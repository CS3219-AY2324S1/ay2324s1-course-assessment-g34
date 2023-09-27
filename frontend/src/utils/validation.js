export const validateTitle = (title) => {
  let errorMessage = null;

  if (!title || title.length === 0) {
    errorMessage = 'Title cannot be empty.';
  }

  return errorMessage;
};

export const validateComplexity = (complexity) => {
  let errorMessage = null;

  if (!complexity || complexity.length === 0) {
    errorMessage = 'Complexity cannot be empty.';
  } else if (complexity !== 'Easy' && complexity !== 'Medium' && complexity !== 'Hard') {
    errorMessage = 'Complexity must be Easy, Medium or Hard.';
  }

  return errorMessage;
};

export const validateLink = (link) => {
  let errorMessage = null;

  if (!link || link.length === 0) {
    errorMessage = 'Link cannot be empty.';
  }

  return errorMessage;
};

export const validateDescription = (description) => {
  let errorMessage = null;

  if (!description || description.length === 0) {
    errorMessage = 'Description cannot be empty.';
  }

  return errorMessage;
};

export const validatePassword = (password) => {
  let errorMessage = null;

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
    errorMessage = 'Password cannot be empty.';
  } else if (!hasDigit) {
    errorMessage = 'Password must contain at least one digit.';
  } else if (!hasSpecialChar) {
    errorMessage = 'Password must contain at least one special character.';
  } else if (!hasUppercase) {
    errorMessage = 'Password must contain at least one uppercase character.';
  } else if (!hasLowercase) {
    errorMessage = 'Password must contain at least one lowercase character.';
  } else if (!hasMinLength) {
    errorMessage = 'Password must be at least 10 characters long.';
  }

  return errorMessage;
};

export const validateUsername = (username) => {
  let errorMessage = null;

  const containsWhiteSpaces = /\s/.test(username);

  if (!username) {
    errorMessage = 'Username cannot be empty.';
  } else if (containsWhiteSpaces) {
    errorMessage = 'Username must not contain white spaces.';
  }

  return errorMessage;
};

export const validateConfirmPassword = (confirmPassword, password) => {
  let errorMessage = null;

  if (!confirmPassword) {
    errorMessage = 'Confirm password cannot be empty.';
  } else if (confirmPassword !== password) {
    errorMessage = 'Confirmed password does not match.';
  }

  return errorMessage;
};
