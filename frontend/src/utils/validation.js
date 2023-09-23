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
