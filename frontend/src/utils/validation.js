/**
 * Validates a title input.
 *
 * @param {string} title - The title to be validated.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
export const validateTitle = (title) => {
  let errorMessage = null;

  if (!title || title.length === 0) {
    errorMessage = 'Title cannot be empty.';
  }

  return errorMessage;
};

/**
 * Validates a difficulty input.
 *
 * @param {string} difficulty - The difficulty to be validated.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
export const validateComplexity = (difficulty) => {
  let errorMessage = null;

  if (!difficulty || difficulty.length === 0) {
    errorMessage = 'Difficulty cannot be empty.';
  } else if (difficulty !== 'Easy' && difficulty !== 'Medium' && difficulty !== 'Hard') {
    errorMessage = 'Difficulty must be Easy, Medium or Hard.';
  }

  return errorMessage;
};

/**
 * Validates a link input.
 *
 * @param {string} link - The link to be validated.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
export const validateLink = (link) => {
  let errorMessage = null;

  if (!link || link.length === 0) {
    errorMessage = 'Link cannot be empty.';
  }

  return errorMessage;
};

/**
 * Validates a description input.
 *
 * @param {string} description - The description to be validated.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
export const validateDescription = (description) => {
  let errorMessage = null;

  if (!description || description.length === 0) {
    errorMessage = 'Description cannot be empty.';
  }

  return errorMessage;
};

/**
 * Validates a password input.
 *
 * @param {string} password - The password to be validated.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
export const validatePassword = (password) => {
  let errorMessage = null;

  const whitespaceRegex = /\s/;
  const digitRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*-_]/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;

  const hasNoWhitespace = !whitespaceRegex.test(password);
  const hasDigit = digitRegex.test(password);
  const hasSpecialChar = specialCharRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);
  const hasLowercase = lowercaseRegex.test(password);
  const hasMinLength = password.length >= 10;

  if (!password) {
    errorMessage = 'Password cannot be empty.';
  } else if (!hasNoWhitespace) {
    errorMessage = 'Password cannot contain whitespace.';
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

/**
 * Validates a username input.
 *
 * @param {string} username - The username to be validated.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
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

/**
 * Validates a confirmed password input by comparing it with the original password.
 *
 * @param {string} confirmPassword - The confirmed password to be validated.
 * @param {string} password - The original password for comparison.
 * @returns {string|null} An error message if validation fails, or null if validation passes.
 */
export const validateConfirmPassword = (confirmPassword, password) => {
  let errorMessage = null;

  if (!confirmPassword) {
    errorMessage = 'Confirm password cannot be empty.';
  } else if (confirmPassword !== password) {
    errorMessage = 'Confirmed password does not match.';
  }

  return errorMessage;
};
