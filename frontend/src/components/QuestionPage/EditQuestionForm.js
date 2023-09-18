import { Close } from "@mui/icons-material";
import { AppBar, Box, Button, Container, Dialog, FormControlLabel, IconButton, InputLabel, MenuItem, Skeleton, Slide, TextField, Toolbar, Typography } from "@mui/material";
import React, { forwardRef, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CategoriesInput from "./CategoriesInput";
import axios from "axios";
import { UPDATE_QUESTION_SVC_URI } from "@/config/uris";
import { validateComplexity, validateDescription, validateLink, validateTitle } from "@/utils/validation";
import SolidButton from "../SolidButton";


const Editor = dynamic(() => import("./QuestionDescriptionEditor"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height='40vh' />
})

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const complexities = [
  {
    value: 'Easy',
    label: 'Easy'
  },
  {
    value: 'Medium',
    label: 'Medium'
  },
  {
    value: 'Hard',
    label: 'Hard'
  }
];

export default function EditQuestionForm({ setQuestions, question, index, isOpen, onClose }) {
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

  const updateEditedQuestions = (index, question) => {
    setQuestions((prevState) => {
      const updatedQuestions = [...prevState];
      updatedQuestions[index] = question;
      return updatedQuestions;
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrors();

    const updatedQuestionData = {
      title: questionData.title.trim(),
      complexity: questionData.complexity.trim(),
      categories: categories,
      link: questionData.link.trim(),
      description: description.trim()
    }
  
    const errors = [];
    const titleError = validateTitle(updatedQuestionData.title);
    const complexityError = validateComplexity(updatedQuestionData.complexity);
    const linkError = validateLink(updatedQuestionData.link);
    const descriptionError = validateDescription(updatedQuestionData.description);

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

    if (errors.length > 0) {
      return;
    }

    // local storage
    const questions = JSON.parse(localStorage.getItem('questions'));
    questions[index] = updatedQuestionData;
    localStorage.setItem('questions', JSON.stringify(questions));
    updateEditedQuestions(index, updatedQuestionData);
    handleClose();

    // try {
    //   // change index to proper id from database
    //   const response = await axios.patch(`${UPDATE_QUESTION_SVC_URI}/${index}`, updatedQuestionData);

    //   // update state in client
    //   updateEditedQuestions(index, updatedQuestionData);
    //   handleClose();
    // } catch (error) {
    //   if (error.respone && error.response.status === 400) {
    //     console.error("Bad Request: ", error.response.data);
    //   } else {
    //     console.error("An error occurred: ", error);
    //   }
    // }
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
          <Typography
            sx={{ flex: 1 }}
            variant="h6"
            component="div"
          >
            Edit a Question
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
        <form id="edit_question" noValidate onSubmit={handleSubmit}>
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
              <TextField
                required
                id="complexity"
                name="complexity"
                select
                value={questionData.complexity}
                size="small"
                label="Complexity"
                defaultValue="Easy"
                sx={{ mt: 1, width: '20ch' }}
                error={complexityError != null}
                helperText={complexityError}
                onChange={(e) => handleChange(e)}
              >
                {complexities.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <CategoriesInput onChange={setCategories} value={categories}/>
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