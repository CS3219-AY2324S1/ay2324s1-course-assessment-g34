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
const EXECUTION_SVC_PREFIX = '/api/code-execution-service';
const EXECUTE = '/execute';

// Uncomment for prod
// const GATEWAY_BASE_URL = 'https://api.peerpreparing.com';
// export const VIDEO_SVC_PORT = 443;
// export const VIDEO_SVC_HOST = 'api.peerpreparing.com';
// export const VIDEO_SVC_SECURE = true;
// export const COLLAB_SVC_WS_URI = GATEWAY_BASE_URL.replace(/^https?/, 'wss');

// Uncomment for dev
const GATEWAY_BASE_URL = 'http://localhost:3001';
export const VIDEO_SVC_PORT = 3001;
export const VIDEO_SVC_HOST = 'localhost';
export const VIDEO_SVC_SECURE = false;
export const COLLAB_SVC_WS_URI = GATEWAY_BASE_URL.replace(/^https?/, 'ws');


export const REGISTER_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX + REGISTER;
export const LOGIN_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX + LOGIN;

export const REFRESH_TOKEN_SVC_URI = GATEWAY_BASE_URL + TOKEN_SVC_PREFIX + REFRESH_TOKEN;
export const VERIFY_TOKEN_SVC_URI = GATEWAY_BASE_URL + TOKEN_SVC_PREFIX + VERIFY_TOKEN;

export const USER_SVC_URI = GATEWAY_BASE_URL + USER_SVC_PREFIX + USER_RESOURCE;

export const QUESTION_SVC_URI = GATEWAY_BASE_URL + QUESTION_SVC_PREFIX + QUESTION_RESOURCE;

export const MATCHING_SVC_URI = GATEWAY_BASE_URL;

export const COLLAB_SVC_IO_URI = GATEWAY_BASE_URL;

export const VIDEO_SVC_URI = GATEWAY_BASE_URL;

export const EXECUTE_CODE_SVC_URI = GATEWAY_BASE_URL + EXECUTION_SVC_PREFIX + EXECUTE;
