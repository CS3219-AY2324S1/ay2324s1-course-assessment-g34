# User Service API Documentation

Welcome to the User Service API documentation. This API provides endpoints for managing user-related operations. You can use this guide to understand how to use the API and how to set up the backend service.

## Table of Contents

1. [Endpoints](#endpoints)
2. [User Authentication and Authorization](#user-authentication-and-authorization)
3. [Running the Backend Service](#running-the-backend-service)
4. [Environment Variables and .env File](#environment-variables-and-env-file)


## User Authentication and Authorization
To access certain endpoints, users need to be authenticated and authorized. The User Service uses JWT (JSON Web Tokens) for user authentication. To authenticate, include a valid JWT token in the request headers.

Header: Authorization: Bearer <access_token>
Replace <access_token> with a valid access token obtained by logging in using the /api/login endpoint. Access tokens contain information about the user's name and roles.

## Endpoints

### Note that the user service runs on port 8000.

### Register User

- **URL**: `/api/register/`
- **Method**: `POST`
- **Description**: Create a new user.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "pwd",
    (Optional)"displayed_name": "name"
  }
- **Response**:
  - 201 Created on success with user details
  - 400 Bad Request on failure

### Login User
- **URL**: `/api/login/`
- **Method**: `POST`
- **Description**: Login as a user.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "pwd"
  }
- **Response**:
  - 200 on success with access_token and refresh_token attached
  - 401 on failure


### Obtain new access token with refresh token
- **URL**: `/api/token/refresh/`
- **Method**: `POST`
- **Description**: Obtain new access token.
- **Request Body**:
  ```json
  {
    "refresh": "213245tygdfs...token...."
  }
- **Response**:
  - new access token on success


### Verify the validity of a token
- **URL**: `/api/token/verify/`
- **Method**: `POST`
- **Description**: Verify a token.
- **Request Body**:
  ```json
  {
    "token": "213245tygdfs...token...."
  }
- **Response**:
  - 200 on valid token
  - 401 if invalid or expired


### Get User by ID 

- **URL**: `/api/users/<str:username>`
- **Method**: `GET`
- **Description**: Retrieve user information by username.
- **Request Body**:
- **Response**:
  - 200 OK on success with user details.
  - 404 Not Found if the user does not exist.

### Get all user

- **URL**: `/api/users/`
- **Method**: `GET`
- **Description**: Retrieve all user information.
- **Request Body**:
- **Response**:
  - 200 OK on success.


### Update User

- **URL**: `/api/users/<int:user_id>`
- **Method**: `PUT`
- **Description**: Update user information.
- **Request Header**: `Authorization`: `Bearer ` + <access_token>
- **Request Body**:
  ```json
  {
    "displayed_name": "new_john_doe",
  }
- **Response**:
  - 202 Updated on success with updated user details.


### Delete User 

- **URL**: `/api/users/<int:user_id>`
- **Method**: `DELETE`
- **Description**: Delete a user.
- **Request Header**: `Authorization`: `Bearer ` + <access_token>
- **Request Body**:
- **Response**:
  - 204 No Content on success.
  - 404 Not Found if the user does not exist.


## Running the Backend Service

To run the User Service backend locally, follow these steps:

1. Install Docker: Docker Installation Guide

2. Clone this repository.

3. Change directory to the project folder:
   cd .../user_service

4. Build and start the Docker containers:
   docker-compose up

5. Now run the command `docker-compose exec user_service sh` to enter the shell, and run `python manage.py makemigrations` followed by `python manage.py migrate` for making migrations. 

5. The backend service should now be running. You can access it at http://localhost:8000.

6. To create a superuser with admin access, run `docker-compose exec user_service sh`, folllowed by `python manage.py createsuperuser`, and followed by `python manage.py create_admin_user {username of the superuser}`

6. To stop the service, use Ctrl+C in the terminal where docker-compose is running, or run:
   docker-compose down

That's it! You've successfully set up and run the User Service backend.

For more detailed information and customization options, refer to the project's documentation and codebase.

## Environment Variables and .env File

The User Service backend relies on environment variables for configuration. These environment variables are typically stored in a .env file at the root of the project. It is essential to maintain the .env file to provide configuration details such as database connection settings, API keys, and other sensitive information.

Ensure that the .env file contains the necessary environment variables for your project to run correctly. Here is an example of a .env file:

```
DJANGO_SECRET_KEY=django-insecure-6&0xj1vstd4^_sgd#9vbn42bs4em$glhvkm5ba&8-(f8c$aa++
DJANGO_DEBUG=True
DATABASE_NAME=user_service
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=postgres_db
DATABASE_PORT=5432
SECRET_KEY=django-insecure-6&0xj1vstd4^_sgd#9vbn42bs4em$glhvkm5ba&8-(f8c$aa++
```

The .env file allows you to configure your application without hardcoding sensitive information directly into your codebase. Keep the .env file secure and avoid committing it to version control systems to protect sensitive data.