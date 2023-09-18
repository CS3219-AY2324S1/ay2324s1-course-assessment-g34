import { Close } from "@mui/icons-material";
import { AppBar, Box, Button, Container, Dialog, IconButton, InputLabel, Skeleton, Slide, TextField, Toolbar, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React, { forwardRef, useRef, useState } from "react";
import ComplexitySelector from "./ComplexitySelector";
import CategoriesInput from "./CategoriesInput";
import SolidButton from "../SolidButton";
import { validateComplexity, validateDescription, validateLink, validateTitle } from "@/utils/validation";

const Editor = dynamic(() => import("./QuestionDescriptionEditor"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="40 vh" />
})

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
});

const defaultQuestionData = {
  title: "",
  complexity: "Easy",
  categories: [],
  link: "",
  description: ""
}

export default function QuestionForm({ question = defaultQuestionData, isOpen, onClose, label, id, onSubmit, generalError }) {
  const editorRef = useRef(null);
  const [titleError, setTitleError] = useState(null);
  const [complexityError, setComplexityError] = useState(null);
  const [linkError, setLinkError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [categories, setCategories] = useState(question.categories);
  const [description, setDescription] = useState(question.description);
  const [questionData, setQuestionData] = useState({
    title: question.title,
    complexity: question.complexity,
    categories: question.categories,
    link: question.link,
    description: question.description
  });

  const handleClose = () => {
    resetErrors();
    onClose();
  };

  const resetErrors = () => {
    setTitleError(null);
    setComplexityError(null);
    setLinkError(null);
    setDescriptionError(null);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuestionData({
      ...questionData,
      [e.target.name]: value
    });
  }

  const validateQuestionData = (question) => {
    const { title, complexity, link, description } = question;
    const errors = [];

    const titleError = validateTitle(title);
    const complexityError = validateComplexity(complexity);
    const linkError = validateLink(link);
    const descriptionError = validateDescription(description);

    if (titleError) {
      errors.push(titleError);
      setTitleError(titleError);
    }

    if (complexityError) {
      errors.push(complexityError);
      setComplexityError(complexityError);
    }

    if (linkError) {
      errors.push(linkError);
      setLinkError(linkError);
    }

    if (descriptionError) {
      errors.push(descriptionError);
      setDescriptionError(descriptionError);
    }

    return errors.length == 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    const newQuestionData = {
      title: questionData.title.trim(),
      complexity: questionData.complexity.trim(),
      categories: categories,
      link: questionData.link.trim(),
      description: description.trim()
    }

    if (!validateQuestionData(newQuestionData)) {
      return;
    }

    onSubmit(newQuestionData);

    if (generalError == null) {
      handleClose();
    } 
  }

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
              <ComplexitySelector
                required
                value={questionData.complexity}
                size="small"
                sx={{ mt: 1, width: '20ch' }}
                error={complexityError != null}
                helperText={complexityError}
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
          <InputLabel shrink htmlFor="description-editor" required sx={ descriptionError && { color: (theme) => theme.palette.error.main } }>
            Description
          </InputLabel>
          <Editor
            id="description-editor"
            data={description}
            editorRef={editorRef}
            onChange={setDescription}
          />
          {descriptionError &&
            <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12, ml: 2 }}>
              {descriptionError}
            </Typography>
          }
          {generalError &&
            <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12, ml: 2 }}>
              {generalError}
            </Typography>
          }
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