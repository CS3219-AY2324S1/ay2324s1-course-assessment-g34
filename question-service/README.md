# Questions Repo Service API Documentation

This API provides endpoints for managing questions related operations. Use this guide to set up the questions repo service and understand how to use the API.

## TOC

1. [Endpoints](#endpoints)
2. [Environment](#environment-env-file)
3. [Setting up service](#setting-up-service)

## Endpoints
<ins> Question repo services run on port 5000 </ins>

### Add a question
- **URL**: `/api//question-service/questions`
- **Method**: `POST`
- **Request Header**: `Authorization`: <access_token>
- **Description**: Create a new question.
- **Request Body**:
  ```json
    {
    "title": "Sample Question",
    "categories": ["Math", "Algebra"],
    "difficulty": "Medium",
    "link": "https://example.com/questions/1",
    "description": "This is the description for Sample Question.",
    }
- **Response**:
  - 200 Created on success with question details
  - 400 Error

### Get all questions
- **URL**: `/api/question-service/questions
- **Method**: `GET`
- **Description**: Get all questions sorted by title in ascending order from repo.

- **Response**:
  - All question details in json
  - 500 Error when failed to get

### Get a question by ID
- **URL**: `/api/question-service/questions/:id`
- **Method**: `GET`
- **Description**: Get question details by ID.
- **Params**: ID
- **Response**:
  - Question details in json
  - 500 Error when failed to get

### Modify a question
- **URL**: `/api/question-service/questions/:id`
- **Method**: `PATCH`
- **Request Header**: `Authorization`: <access_token>
- **Description**: Modify any question details.
- **Request Body**:
  ```json
    {
    "title": "Edited Question",
    "categories": ["Math", "Algebra", "New Category"],
    "difficulty": "Medium",
    "link": "https://example.com/questions/1",
    "description": "This is the description for Sample Question.",
    }
- **Response**:
  - Updated question details in json
  - 400 Error

### Delete a question
- **URL**: `/api/question-service/questions/:id`
- **Method**: `DELETE`
- **Request Header**: `Authorization`: <access_token>
- **Description**: Delete a question by ID.
- **Params**: ID
- **Response**:
  - Document with 'title' has been deleted..
  - 400 Error

### Get a random question given difficulty and catergories
- **URL**: `api/random?difficulty=<difficulty>&categories=<categories>`
- **Method**: `GET`
- **Description**: Get a random question given difficulty and categories as input
- **Params**: difficulty, catergories 
- **Response**:
  - Document of specified params
  - 404 "No questions found with the specified criteria"
  - 500 "Error fetching random question"

### Get questions given difficulty and catergories
- **URL**: `api/filter?difficulty=<difficulty>&categories=<categories>`
- **Method**: `GET`
- **Description**: Get questions given difficulty and/or categories as input
- **Params**: difficulty, catergories 
- **Response**:
  - Document of specified params
  - 200 "No questions found with the specified criteria"
  - 500 "Error fetching random question"

## Environment .env file
```
DATABASE_URL=unique_mongdoDB_url
```

## Setting Up Service

1. Run `npm i` to install the relevant dependencies
2. Install Postman if you need to test API
3. Install MongoDB Compass to view database
4. Install Docker and ensure this is opened, which enable us to use the 'docker' command in the terminal
5. cd question-service
6. Type `docker compose up` in the terminal to start
7. Once you see **Database Connected**, you may start interacting with the database
8. When finished, press `Control + C` in the terminal to exit, type `docker compose down` to remove the containers 