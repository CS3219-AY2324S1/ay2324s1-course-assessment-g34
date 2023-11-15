[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# PeerPrep (CS3219, AY23/24 S1)

## Background

PeerPrep is a novel and groundbreaking solution that aims to bring about a paradigm shift in technical interview preparation. Achieving a coveted position in the technology sector in the current competitive job market frequently necessitates the mastery of complex technical interviews. Nevertheless, Preparing for these interviews can induce apprehension and seclusion. In response to this difficulty, we introduce PeerPrep. This interactive digital environment facilitates the gathering of students, enabling them to engage in collaborative training of whiteboard-style interview inquiries with their fellow students.


## Purpose

PeerPrep aims to enable individuals aspiring to excel in technical interviews by providing a collaborative and encouraging environment conducive to preparation. Our platform fulfils several fundamental goals:

### Effective Learning through Matchmaking

PeerPrep matches users with peers with similar categories and difficulty levels, which guarantees that individuals will have the opportunity to participate in fruitful practice sessions with companions who possess similar objectives, thereby establishing an optimal learning environment.

### Collaborative Learning

Users can participate in live joint coding sessions via PeerPrep, which emulates the format of whiteboard interviews frequently encountered in technology job evaluations. 

### Facilitate Communications

PeerPrep provides more than a mere practice platform; it cultivates a dynamic community comprising technology aficionados and individuals seeking employment. It promotes exchanging information, networking, and emotional support among its members.


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

Create a `.env` file in the root of the project with the following contents:

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


## Accessing the Deployed Version

You can access the deployed version of the project at this url: [https://peerpreparing.com/](https://peerpreparing.com/)
