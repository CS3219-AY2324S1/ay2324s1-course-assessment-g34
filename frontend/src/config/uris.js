const QUESTION_SVC_URL = process.env.NEXT_PUBLIC_QUESTION_SVC_URI || 'http://localhost:5000';
const USER_SVC_URL = process.env.NEXT_PUBLIC_USER_SVC_URI || 'http://localhost:8000';

// TODO: standardise to follow REST API URI naming conventions
// should be /api/question
const QUESTION_SVC_PREFIX = '/api';

const ADD_QUESTION = '/addQuestion';
const GET_QUESTION_BY_ID = '/getQuestion';
const UPDATE_QUESTION = '/updateQuestion';
const DELETE_QUESTION = '/deleteQuestion';
const GET_ALL_QUESTIONS = '/getAllQuestions';

const USER_SVC_PREFIX = '/api/users';
const TOKEN_SVC_PREFIX = '/api/token';

const REGISTER = '/api/register';
const LOGIN = '/api/login';
const REFRESH_TOKEN = '/refresh';
const VERIFY_TOKEN = '/verify';

export const ADD_QUESTION_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + ADD_QUESTION;
export const GET_QUESTION_BY_ID_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX
  + GET_QUESTION_BY_ID;
export const UPDATE_QUESTION_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + UPDATE_QUESTION;
export const DELETE_QUESTION_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + DELETE_QUESTION;
export const GET_ALL_QUESTIONS_SVC_URI = QUESTION_SVC_URL + QUESTION_SVC_PREFIX + GET_ALL_QUESTIONS;

export const REGISTER_SVC_URI = USER_SVC_URL + REGISTER;
export const LOGIN_SVC_URI = USER_SVC_URL + LOGIN;
export const REFRESH_TOKEN_SVC_URI = USER_SVC_URL + TOKEN_SVC_PREFIX + REFRESH_TOKEN;
export const VERIFY_TOKEN_SVC_URI = USER_SVC_URL + TOKEN_SVC_PREFIX + VERIFY_TOKEN;
export const USER_SVC_URI = USER_SVC_URL + USER_SVC_PREFIX;
