import { AppBar, Box, Button, Container, Dialog, IconButton, MenuItem, Skeleton, Slide, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { AddBox, Close } from "@mui/icons-material";
import React, { forwardRef, useRef, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import CategoriesInput from "./CategoriesInput";
import { ADD_QUESTION_SVC_URI } from "@/config/uris";
import { validateComplexity, validateDescription, validateLink, validateTitle } from "@/utils/validation";

const Editor = dynamic(() => import("./QuestionDescriptionEditor"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height='40vh' />
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
});

const difficulties = [
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

export default function AddQuestionForm({ setQuestions }) {
  const editorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [titleError, setTitleError] = useState(null);
  const [complexityError, setComplexityError] = useState(null);
  const [linkError, setLinkError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [questionData, setQuestionData] = useState({
    title: "",
    complexity: "Easy",
    categories: [],
    link: "",
    description: ""
  });

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    resetErrors();
    setIsOpen(false);
  };

  const resetErrors = () => {
    setTitleError(null);
    setComplexityError(null);
    setLinkError(null);
    setDescriptionError(null);
  }

  const updateQuestions = (question) => {
    setQuestions((prev) => [...prev, question]);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuestionData({
      ...questionData,
      [e.target.name]: value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrors();
    
    const newQuestionData = {
      title: questionData.title,
      complexity: questionData.complexity,
      categories: categories,
      link: questionData.link,
      description: description
    }
    
    // validate question data
    const errors = [];
    const titleError = validateTitle(newQuestionData.title);
    const complexityError = validateComplexity(newQuestionData.complexity);
    const linkError = validateLink(newQuestionData.link);
    const descriptionError = validateDescription(newQuestionData.description);

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
    questions.push(newQuestionData);
    localStorage.setItem('questions', JSON.stringify(questions));
    updateQuestions(newQuestionData);
    handleClose();
    
    // try {
    //   const response = await axios.post(ADD_QUESTION_SVC_URI, newQuestionData);
      
    //   // add new question on client side
    //   updateQuestions(response.data);

    //   handleClose();
    // } catch (error) {
    //   if (error.response && error.response.status === 400) {
    //     console.error("Bad Request:", error.response.data);
    //   } else {
    //     console.error("An error occurred:", error);
    //   }
    // }
  }

  return (
    <Box sx={{ display: 'flex'}}>
      <Tooltip title="Add" arrow>
        <IconButton
          size="medium"
          onClick={handleClickOpen}
          sx={{ marginLeft: 'auto', color: (theme) => theme.palette.secondary.main }}
        >
          <AddBox fontSize="large"/>
        </IconButton>
      </Tooltip>
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
              Create a Question
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
          <form id="add_question" noValidate onSubmit={handleSubmit}>
            <Box sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  sx={{ flexGrow: 1 }}
                  size="small"
                  autoFocus
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
                  id="complexity"
                  name="complexity"
                  select
                  size="small"
                  label="Complexity"
                  defaultValue="Easy"
                  sx={{ mt: 1, width: '20ch' }}
                  error={complexityError != null}
                  helperText={complexityError}
                  onChange={(e) => handleChange(e)}
                >
                  {difficulties.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CategoriesInput onChange={setCategories}/>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <TextField
                  sx={{ width: '70ch' }}
                  size="small"
                  autoFocus
                  margin="dense"
                  id="link"
                  name="link"
                  label="Link"
                  type="text"
                  error={linkError != null}
                  helperText={linkError}
                  onChange={(e) => handleChange(e)}
                />
              </Box>   
            </Box>
            <Editor
              editorRef={editorRef}
              onChange={setDescription}
            />
            {descriptionError &&
              <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12 }}>
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
              <Button variant="contained" size="medium" color="success" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        </Container>
      </Dialog>
    </Box>
  );
}