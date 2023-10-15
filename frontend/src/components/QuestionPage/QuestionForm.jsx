import { Close } from '@mui/icons-material';
import {
  AppBar, Box, Button, Container, Dialog, IconButton, InputLabel, Skeleton, Slide, TextField,
  Toolbar, Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import React, {
  forwardRef, useEffect, useRef, useState,
} from 'react';
import {
  validateComplexity, validateDescription, validateLink, validateTitle,
} from '@/utils/validation';
import { PropTypes } from 'prop-types';
import DifficultySelector from './DifficultySelector';
import CategoriesInput from './CategoriesInput';
import SolidButton from '../SolidButton';

const Editor = dynamic(() => import('./QuestionDescriptionEditor'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="40vh" />,
});

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const defaultQuestion = {
  _id: '',
  title: '',
  description: '',
  categories: [],
  link: '',
  difficulty: 'Easy',
};

export default function QuestionForm({
  question = defaultQuestion, isOpen, onClose, label, id, onSubmit, generalError = null,
}) {
  const editorRef = useRef(null);
  const [titleError, setTitleError] = useState(null);
  const [difficultyError, setDifficultyError] = useState(null);
  const [linkError, setLinkError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [categories, setCategories] = useState(question.categories);
  const [description, setDescription] = useState(question.description);
  const [questionData, setQuestionData] = useState({
    _id: question._id,
    title: question.title,
    difficulty: question.difficulty,
    categories: question.categories,
    link: question.link,
    description: question.description,
  });

  const resetFields = () => {
    setQuestionData({
      _id: '',
      title: '',
      description: '',
      categories: [],
      link: '',
      difficulty: 'Easy',
    });
    setCategories([]);
    setDescription('');
  };

  const resetErrors = () => {
    setTitleError(null);
    setDifficultyError(null);
    setLinkError(null);
    setDescriptionError(null);
  };

  const handleClose = () => {
    resetErrors();
    onClose();
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setQuestionData({
      ...questionData,
      [e.target.name]: value,
    });
  };

  const validateQuestionData = (q) => {
    const {
      title, difficulty, link, description: desc,
    } = q;
    const errors = [];

    const titleValidationError = validateTitle(title);
    const difficultyValidationError = validateComplexity(difficulty);
    const linkValidationError = validateLink(link);
    const descriptionValidationError = validateDescription(desc);

    if (titleValidationError) {
      errors.push(titleValidationError);
      setTitleError(titleValidationError);
    }

    if (difficultyValidationError) {
      errors.push(difficultyValidationError);
      setDifficultyError(difficultyValidationError);
    }

    if (linkValidationError) {
      errors.push(linkValidationError);
      setLinkError(linkValidationError);
    }

    if (descriptionValidationError) {
      errors.push(descriptionValidationError);
      setDescriptionError(descriptionValidationError);
    }

    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    const newQuestionData = {
      title: questionData.title.trim(),
      difficulty: questionData.difficulty.trim(),
      categories,
      link: questionData.link.trim(),
      description: description.trim(),
    };

    if (!validateQuestionData(newQuestionData)) {
      return;
    }

    onSubmit(newQuestionData);

    if (generalError == null) {
      const isAddQuestion = question === defaultQuestion;
      if (isAddQuestion) {
        resetFields();
      }
      handleClose();
    }
  };

  useEffect(() => {
    setQuestionData(question);
    setDescription(question.description);
    setCategories(question.categories);
  }, [question]);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {label}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ my: 1 }}>
        <form id={id} noValidate onSubmit={handleSubmit}>
          <Box sx={{ my: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                required
                sx={{ flexGrow: 1 }}
                size="small"
                autoFocus
                value={questionData.title}
                margin="dense"
                id="title"
                name="title"
                label="Title"
                type="text"
                error={titleError != null}
                helperText={titleError}
                onChange={(e) => handleChange(e)}
              />
              <DifficultySelector
                required
                value={questionData.difficulty}
                size="small"
                sx={{ mt: 1, width: '20ch' }}
                error={difficultyError != null}
                helperText={difficultyError}
                onChange={(e) => handleChange(e)}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <CategoriesInput value={categories} onChange={setCategories} />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <TextField
                sx={{ width: '70ch' }}
                required
                size="small"
                autoFocus
                margin="dense"
                id="link"
                name="link"
                label="Link"
                value={questionData.link}
                type="text"
                error={linkError != null}
                helperText={linkError}
                onChange={(e) => handleChange(e)}
              />
            </Box>
          </Box>
          <InputLabel shrink htmlFor="description-editor" required sx={descriptionError && { color: (theme) => theme.palette.error.main }}>
            Description
          </InputLabel>
          <Editor
            id="description-editor"
            description={description}
            editorRef={editorRef}
            onChange={setDescription}
          />
          {descriptionError
            && (
            <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12, ml: 2 }}>
              {descriptionError}
            </Typography>
            )}
          {generalError
            && (
            <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12, ml: 2 }}>
              {generalError}
            </Typography>
            )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
            <Button
              variant="outlined"
              size="medium"
              sx={{ mr: 2, textTransform: 'none' }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <SolidButton
              variant="contained"
              size="medium"
              color="success"
              type="submit"
              sx={{ textTransform: 'none' }}
            >
              Submit
            </SolidButton>
          </Box>
        </form>
      </Container>
    </Dialog>
  );
}

QuestionForm.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    link: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  generalError: PropTypes.string,
};
