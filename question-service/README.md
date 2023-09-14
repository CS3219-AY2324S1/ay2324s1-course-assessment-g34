# Questions Repo Service API Documentation

This API provides endpoints for managing questions related operations. Use this guide to set up the questions repo service and understand how to use the API.

## TOC

1. [Endpoints](#endpoints)
2. [Environment](#environment-env-file)
3. [Setting up service](#setting-up-service)

## Endpoints
<ins> Question repo services run on port 5000 </ins>

### Add a question
- **URL**: `/api/addQuestion`
- **Method**: `POST`
- **Description**: Create a new question.
- **Request Body**:
  ```json
    {
    "title": "Sample Question",
    "categories": ["Math", "Algebra"],
    "complexity": "Medium",
    "link": "https://example.com/questions/1",
    "description": "This is the description for Sample Question.",
    }
- **Response**:
  - 200 Created on success with question details
  - 400 Error

### Get all questions
- **URL**: `/api/getAllQuestions`
- **Method**: `GET`
- **Description**: Get all questions from repo.

- **Response**:
  - All question details in json
  - 500 Error when failed to get

### Get a question by ID
- **URL**: `/api/getQuestion/:id`
- **Method**: `GET`
- **Description**: Get question details by ID.
- **Params**: ID
- **Response**:
  - Question details in json
  - 500 Error when failed to get

### Modify a question
- **URL**: `/api/updateQuestion/:id`
- **Method**: `PATCH`
- **Description**: Modify any question details.
- **Request Body**:
  ```json
    {
    "title": "Edited Question",
    "categories": ["Math", "Algebra", "New Category"],
    "complexity": "Medium",
    "link": "https://example.com/questions/1",
    "description": "This is the description for Sample Question.",
    }
- **Response**:
  - Updated question details in json
  - 400 Error

### Delete a question
- **URL**: `/api/deleteQuestion/:id`
- **Method**: `DELETE`
- **Description**: Delete a question by ID.
- **Params**: ID
- **Response**:
  - Document with 'title' has been deleted..
  - 400 Error


## Environemnt .env file
```
DATABASE_URL =unique_mongdoDB_url
```

## Setting Up Service

1. Run `npm i` to install the relevant dependencies
2. Install Postman if you need to test API
3. Install MongoDB Compass to view database
4. cd backend
5. `npm start` 
6. Once you see **Server Started at 3000 Database Connected**, you may start interacting with the database