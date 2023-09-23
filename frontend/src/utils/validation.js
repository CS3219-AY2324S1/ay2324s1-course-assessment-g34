// title: required, cannot be empty
// categories: not required, can be empty
// complexity: must be "Easy", "Medium", or "Hard", required, cant be empty
// link: required, cannot be empty
// description: required, cannot be empty

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
}