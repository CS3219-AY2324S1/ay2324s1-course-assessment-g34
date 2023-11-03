export const stringToColor = (string) => {
  let hash = 0;

  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
};

export const stringToAvatar = (string) => {
  if (!string) {
    return null;
  }

  const alphanumericRegex = /^[0-9a-zA-Z]+/;
  const match = string.match(alphanumericRegex);

  // Use the first two characters as initials by default
  let initials = string.substr(0, 2).toUpperCase();

  // If there is a match with a single alphanumeric character, use that as the initial
  if (match && match[0].length === 1) {
    initials = match[0].toUpperCase();
  }

  return initials;
};
