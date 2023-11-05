
// export const MATCHING_SVC_URL = process.env.NEXT_PUBLIC_MATCHING_SVC_URI || 'http://localhost:8001';
// const QUESTION_SVC_URL = process.env.NEXT_PUBLIC_QUESTION_SVC_URI || 'http://localhost:5000';
// const USER_SVC_URL = process.env.NEXT_PUBLIC_USER_SVC_URI || 'http://localhost:8000';


const GATEWAY_BASE_URL = 'http://34.87.4.219:3001/';

const QUESTION_SVC_PREFIX = '/api/question-service';

const ADD_QUESTION = '/questions';
const GET_QUESTION_BY_ID = '/questions';
const UPDATE_QUESTION = '/questions';
const DELETE_QUESTION = '/questions';
const GET_ALL_QUESTIONS = '/questions';

const USER_SVC_PREFIX = '/api/user-service';
const TOKEN_SVC_PREFIX = '/api/user-service/token';

const REGISTER = '/api/user-service/register';
const LOGIN = '/api/user-service/login';
const REFRESH_TOKEN = '/refresh';
const VERIFY_TOKEN = '/verify';

export const ADD_QUESTION_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX + ADD_QUESTION;
export const GET_QUESTION_BY_ID_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX
  + GET_QUESTION_BY_ID;
export const UPDATE_QUESTION_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX + UPDATE_QUESTION;
export const DELETE_QUESTION_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX + DELETE_QUESTION;
export const GET_ALL_QUESTIONS_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX + GET_ALL_QUESTIONS;

export const REGISTER_SVC_URI = GATEWAY_BASE_URL + REGISTER;
export const LOGIN_SVC_URI = GATEWAY_BASE_URL + LOGIN;
export const REFRESH_TOKEN_SVC_URI = GATEWAY_BASE_URL + TOKEN_SVC_PREFIX + REFRESH_TOKEN;
export const VERIFY_TOKEN_SVC_URI = GATEWAY_BASE_URL + TOKEN_SVC_PREFIX + VERIFY_TOKEN;
export const USER_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX;

export const MATCHING_SVC_URI = GATEWAY_BASE_URL;
