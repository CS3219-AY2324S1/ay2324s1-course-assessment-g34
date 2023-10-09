const QUESTION_SVC_URL = process.env.NEXT_PUBLIC_QUESTION_SVC_URI || 'http://localhost:5000';
const MATCHING_SVC_URL = process.env.NEXT_PUBLIC_MATCHING_SVC_URI || 'http://localhost:8001'; // to be updated

// should be /api/question
const QUESTION_SVC_PREFIX = '/api';

const ADD_QUESTION = '/addQuestion';
const GET_QUESTION_BY_ID = '/getQuestion';
const UPDATE_QUESTION = '/updateQuestion';
const DELETE_QUESTION = '/deleteQuestion';
const GET_ALL_QUESTIONS = '/getAllQuestions';

export const ADD_QUESTION_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + ADD_QUESTION;
export const GET_QUESTION_BY_ID_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX
  + GET_QUESTION_BY_ID;
export const UPDATE_QUESTION_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + UPDATE_QUESTION;
export const DELETE_QUESTION_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + DELETE_QUESTION;
export const GET_ALL_QUESTIONS_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + GET_ALL_QUESTIONS;
