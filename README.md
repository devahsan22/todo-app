# Todo App

A simple todo application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Create, read, update, and delete todos
- Mark todos as completed
- Simple and clean UI

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   cd client && npm install
   ```

3. Create a `.env` file:

   ```
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Start the React app:
   ```bash
   cd client && npm start
   ```

## API Endpoints

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## License

MIT
