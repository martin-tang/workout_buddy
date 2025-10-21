# Workout Buddy

## Overview

This is a standalone full-stack application that combines an Express.js backend with a React frontend (originally a separate workout app client). It allows users to generate workout plans using OpenAI's API, and (optionally) authenticate, save, and manage their workout history with a MongoDB database.

## Features

*   **Workout Generation**: Generate personalized workout plans based on muscle groups using OpenAI.
*   **User Authentication**: Register and log in users.
*   **Workout Management (with MongoDB)**: Save, view, update, and delete generated workout plans.
*   **Responsive UI**: A modern and user-friendly interface for an optimal experience.


## Scripts

*   `npm start`: Starts the Express server.
*   `npm run server`: Starts the Express server with `nodemon` for development (auto-restarts on file changes).
*   `npm run client`: Runs the client app in development mode with `vite`.
*   `npm run client-build`: Builds the client app for production.
*   `npm run full-build`: Builds the client application for production.
*   `npm run client-install`: Installs client-side dependencies.
*   `npm run server-install`: Installs server-side dependencies.


# To set up locally run scripts 6, 7, 5, 2 and the following .env file. Note* you do not need Mongo to run the app.

OPENAI_API_KEY=YOUR_OPENAI_API_KEY

PORT=3000

MONGO_URI=mongodb://YOUR_MONGO_URI



