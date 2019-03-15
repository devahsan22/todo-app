# Todo App

A full-stack todo application built with React, Node.js, Express, and MongoDB. This application allows users to manage their tasks with features like authentication, CRUD operations, filtering, and real-time updates.

## Features

### Backend Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **RESTful API**: Complete CRUD operations for todos
- **Data Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Helmet.js for security headers, CORS configuration
- **Database**: MongoDB with Mongoose ODM
- **Statistics**: Todo statistics and analytics

### Frontend Features

- **Modern UI**: Clean and responsive design with Tailwind CSS
- **User Authentication**: Login and registration forms
- **Todo Management**: Create, read, update, and delete todos
- **Filtering & Search**: Filter by status, priority, category, and search functionality
- **Real-time Updates**: Immediate UI updates on data changes
- **Form Validation**: Client-side form validation with react-hook-form
- **Toast Notifications**: User feedback with react-hot-toast

## Tech Stack

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **helmet**: Security middleware
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logger
- **compression**: Response compression

### Frontend

- **React**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Hook Form**: Form handling and validation
- **React Hot Toast**: Toast notifications
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **date-fns**: Date utility library

## Project Structure

```
todo-app/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── todos/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Todo.js
├── routes/
│   ├── auth.js
│   └── todos.js
├── server.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=your-secret-key
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the development servers**

   ```bash
   # Start backend server
   npm run dev

   # In another terminal, start frontend
   cd client
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Todos

- `GET /api/todos` - Get all todos (with filtering and pagination)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a specific todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `POST /api/todos/:id/notes` - Add a note to a todo
- `GET /api/todos/stats/overview` - Get todo statistics

## Database Models

### User Model

- username (unique)
- email (unique)
- password (hashed)
- firstName, lastName
- avatar
- preferences (theme, notifications)
- isActive, lastLogin
- timestamps

### Todo Model

- title, description
- completed, completedAt
- priority (low, medium, high, urgent)
- dueDate, category
- tags array
- user (reference)
- parentTodo, subtodos (for nested todos)
- attachments, notes
- timeEstimate, timeSpent
- isArchived
- timestamps

## Features in Detail

### Authentication System

- Secure password hashing with bcrypt
- JWT token-based authentication
- Token expiration and refresh
- User profile management
- Password change functionality

### Todo Management

- Full CRUD operations
- Priority levels and categories
- Due dates and reminders
- Tags for organization
- Nested todos (parent-child relationships)
- File attachments
- Notes and comments
- Time tracking

### Advanced Features

- Real-time filtering and search
- Pagination for large datasets
- Statistics and analytics
- Bulk operations
- Export functionality
- Mobile-responsive design

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run build` - Build frontend for production

### Code Quality

- ESLint configuration
- Prettier formatting
- Consistent code style
- Error handling best practices
- Security considerations

## Deployment

### Backend Deployment

1. Set up environment variables
2. Configure MongoDB connection
3. Set up JWT secret
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure proxy settings for API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- React team for the amazing framework
- Express.js for the web framework
- MongoDB for the database
- Tailwind CSS for the styling framework
- All the open-source contributors
