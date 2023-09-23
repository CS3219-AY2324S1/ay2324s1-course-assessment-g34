# Frontend Service Documentation

Welcome to the Frontend Service Docker setup guide. This guide provides instructions on how to set up and run the frontend service using Docker containers.

## Running the Frontend Service

To run the frontend locally, follow these steps:

1. Install Docker: https://docs.docker.com/get-docker/

2. Clone this repository

3. Navigate to the root of the project

4. Build and start the Docker containers:
```
docker-compose up
```

5. The frontend service should now be running. You can access it at http://localhost:3000

## Stopping the Service

To stop the service, use Ctrl+C in the terminal where Docker is running, or run:
```
docker-compose down
```
