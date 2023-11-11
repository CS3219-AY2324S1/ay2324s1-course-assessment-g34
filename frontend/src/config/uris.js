export const COLLAB_SVC_URI = process.env.NEXT_PUBLIC_COLLAB_SVC_URI || 'ws://localhost:8080';
export const VIDEO_SVC_PORT = process.env.NEXT_PUBLIC_VIDEO_SVC_PORT || 3002;
export const VIDEO_SVC_HOST = process.env.NEXT_PUBLIC_VIDEO_SVC_HOST || 'localhost';
export const VIDEO_SVC_URI =
  process.env.NEXT_PUBLIC_VIDEO_SVC_URI || `http://${VIDEO_SVC_HOST}:${VIDEO_SVC_PORT}`;

const GATEWAY_BASE_URL = 'http://localhost:3001';

// User Service
const USER_SVC_PREFIX = '/api/user-service';
const USER_RESOURCE = '/users';
const TOKEN_RESOURCE = '/token';
const TOKEN_SVC_PREFIX = USER_SVC_PREFIX + TOKEN_RESOURCE;

const REGISTER = '/register';
const LOGIN = '/login';
const REFRESH_TOKEN = '/refresh';
const VERIFY_TOKEN = '/verify';

// Question Service
const QUESTION_SVC_PREFIX = '/api/question-service';
const QUESTION_RESOURCE = '/questions';

// Code Execution Service
const EXECUTION_SVC_PREFIX = '/api/code-execution-service';
const EXECUTE = '/execute';

export const REGISTER_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX + REGISTER;
export const LOGIN_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX + LOGIN;

export const REFRESH_TOKEN_SVC_URI = GATEWAY_BASE_URL + TOKEN_SVC_PREFIX + REFRESH_TOKEN;
export const VERIFY_TOKEN_SVC_URI = GATEWAY_BASE_URL + TOKEN_SVC_PREFIX + VERIFY_TOKEN;

export const USER_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX + USER_RESOURCE;

export const QUESTION_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX + QUESTION_RESOURCE;

export const MATCHING_SVC_URI = GATEWAY_BASE_URL;

export const EXECUTE_CODE_SVC_URI = GATEWAY_BASE_URL + EXECUTION_SVC_PREFIX + EXECUTE;
