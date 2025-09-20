# AI Chat Application

A full-stack React application with authentication, real-time chat interface, and notification system. Built with React, Redux Toolkit, Express.js, and MongoDB.

## Features

- **Authentication System**: Sign-in and sign-up with username/password
- **Real-time Chat Interface**: Pixel-perfect UI matching the reference design
- **Redux State Management**: Comprehensive state management with Redux Toolkit
- **Notification System**: Real-time notifications with badge counter
- **Credits System**: User credit tracking and display
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Integration**: Persistent data storage with MongoDB

## Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router DOM
- Axios for API calls
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/           # Sign In, Sign Up, Chat pages
│   │   ├── store/           # Redux store and slices
│   │   └── App.js
│   └── package.json
├── backend/                 # Express API server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── server.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-chat-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/aichat
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=development
PORT=5000
```

## Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the Backend Server**
```bash
cd backend
npm run dev
```
The API will run on http://localhost:5000

3. **Start the Frontend Development Server**
```bash
cd frontend
npm start
```
The application will open on http://localhost:3000

### Production Build

1. **Build the Frontend**
```bash
cd frontend
npm run build
```

2. **Serve the Application**
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PATCH /api/users/credits` - Update user credits (protected)

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `PATCH /api/notifications/:id/read` - Mark notification as read (protected)
- `PATCH /api/notifications/mark-all-read` - Mark all notifications as read (protected)

## Features Overview

### Authentication Flow
- Secure registration with username validation
- Login with JWT token generation
- Protected routes with automatic token verification
- Persistent login sessions

### Chat Interface
- Left panel with conversation list
- Main chat area with message history
- Real-time message sending and receiving
- Welcome screen with suggested prompts
- Message timestamps and user avatars

### Notification System
- Notification badge with unread count
- Expandable notification panel
- Welcome notifications for new users
- Feature update notifications
- Mark as read functionality

### Credits System
- Credit counter display in header
- Real-time credit updates
- Starting balance of 1,250 credits for new users

## Deployment

### Option 1: Vercel + MongoDB Atlas

1. **Deploy Frontend to Vercel**
```bash
cd frontend
npm run build
# Deploy to Vercel
```

2. **Deploy Backend to Vercel/Railway/Heroku**
- Set environment variables
- Connect to MongoDB Atlas

### Option 2: Docker Deployment

1. **Create Dockerfile for Backend**
2. **Create Dockerfile for Frontend**
3. **Use Docker Compose** for orchestration

### Option 3: Traditional VPS

1. **Set up NGINX** as reverse proxy
2. **Use PM2** for process management
3. **Configure SSL** with Let's Encrypt

## Testing

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React, Express.js, and MongoDB