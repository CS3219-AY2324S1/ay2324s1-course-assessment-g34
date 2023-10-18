[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# PeerPrep (CS3219, AY23/24 S1)

## Background

Add description here

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Cloning the Project](#cloning-the-project)
  - [Docker Installation](#docker-installation)
  - [Configuring the `.env` File](#configuring-the-env-file)
  - [Running the Project](#running-the-project)
- [Setting Up Microservices for Development](#setting-up-microservices-for-development)
  - [Frontend](#frontend)
  - [User Service](#user-service)
  - [Question Service](#question-service)
  - [Matching Service](#matching-service)
  - [Collaboration Service](#collaboration-service)
- [Accessing the Deployed Version](#accessing-the-deployed-version)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

## Getting Started

### Cloning the Project

To clone the project, use the following command:

```bash
git clone git@github.com:CS3219-AY2324S1/ay2324s1-course-assessment-g34.git
```

### Docker Installation

Ensure you have Docker installed on your system. If not, you can download and install it from [here](https://docs.docker.com/get-docker/).

### Configuring the `.env` File

Create a `.env`file in the root of the project with the following contents:

```env
DATABASE_NAME=user-service
DATABASE_HOST=postgres-db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432
DJANGO_DEBUG=True
SECRET_KEY=YYxpC02owm1B/E3MQV87rw==
DJANGO_SECRET_KEY=YYxpC02owm1B/E3MQV87rw==
```

- The SECRET_KEY should be a base64-encoded key, which you can generate from [this website](https://generate.plus/en/base64).

### Running the Project

You can run the project by entering the root of the project directory and executing the following command:

```bash
docker-compose up
```

To stop the containers, use:
```bash
docker-compose down
```

- Docker does not support Next.js hot reloading. To see changes made in the code, stop the services and run `docker-compose up --build` again.

### Running Migrations

Migrations need to be performed **only the first time the containers are run**. After the containers are running, open another shell and enter the `user-service` shell with the following commands:

```bash
docker-compose exec user-service sh
```

Then, run the following commands to make and apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Accessing the Frontend

You can access the frontend of the project by opening a web browser and navigating to http://localhost:3000.

## Setting Up Microservices for Development

### Frontend

#### Setting Up
To set up the frontend for development, navigate into the `frontend` directory and run the following command to install the dependencies:

```bash
cd frontend
npm install
```

#### Running the Frontend

After installing the dependencies, you can run the frontend by executing the following command in the `frontend` directory:

```bash
npm run dev
```

### User Service

### Question Service

### Matching Service

### Collaboration Service

## Accessing the Deployed Version

To be updated: Include information about where users can access the deployed version of the application, such as a URL or endpoint.