import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Container, Skeleton, Typography } from "@mui/material";
import QuestionTable from "@/components/QuestionPage/QuestionTable";
import AddQuestionForm from "@/components/QuestionPage/AddQuestionForm";
import axios from "axios";
import { GET_ALL_QUESTIONS_SVC_URI } from "@/config/uris";

export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllQuestions = async () => {
    try {
      const response = await axios.get(GET_ALL_QUESTIONS_SVC_URI);
      setQuestions(response.data);
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while retrieving the questions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const getQuestionsFromLocalStorage = () => {
    const storedQuestions = localStorage.getItem('questions');

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      localStorage.setItem('questions', JSON.stringify([]));
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getQuestionsFromLocalStorage();
    // getAllQuestions();
  }, []);

  return (
    <>
      <Layout>
        <Container
          maxWidth="xl"
          sx={{ height: '100vh', my: 2}}
        >
          <Typography
            variant="h5"
            noWrap
            component="h5"
            color="primary"
            sx={{
              marginTop: 0,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '30px'
            }}
          >
            Questions
          </Typography>
          <AddQuestionForm setQuestions={setQuestions} />
          {error &&
            <Typography color="error" sx={{ textAlign: 'center' }} variant="h6">
              {error}
            </Typography>
          }
          {isLoading
            ? <Skeleton variant="rectangular" height='50vh' />
            : <QuestionTable questions={questions} setQuestions={setQuestions} />}
        </Container>
      </Layout>
    </>
  );
}