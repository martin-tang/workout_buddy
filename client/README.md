# Workout Planner App

A comprehensive workout planning application with user authentication, personalized workout generation, and workout history tracking.

## Features

### 🏋️ Workout Generation
- **Interactive Muscle Group Selection**: Visual muscle group selection with anatomical diagrams
- **AI-Powered Workout Plans**: Personalized workout recommendations using OpenAI
- **Fitness Level Adaptation**: Workouts adapted to beginner, intermediate, or advanced levels
- **Goal-Based Customization**: Workouts tailored to specific fitness goals

### 👤 User Authentication
- **Secure Registration**: Complete user registration with profile setup
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Encrypted password storage with bcrypt
- **Rate Limiting**: Protection against brute force attacks

### 📊 Workout Management
- **Workout History**: Save and track all generated workouts
- **Progress Tracking**: Mark workouts as completed with timestamps
- **Workout Details**: View detailed workout plans with notes and ratings
- **Filtering**: Filter workouts by completion status

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark theme with green accents
- **Smooth Animations**: Polished user interactions
- **Modal Windows**: Clean authentication and dashboard interfaces

## Tech Stack

### Frontend
- **React 19**: Modern React with hooks and context
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: NoSQL database with ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **OpenAI API**: AI-powered workout generation

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd Website/express
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/workout_app
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   LOCAL_API_KEY=your-openai-api-key-here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   RECIPIENT_EMAIL=recipient@example.com
   ```

4. **Start MongoDB**:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd Website/workout_app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

### Getting Started

1. **Access the app**: Open your browser to `http://localhost:5173`
2. **Sign up**: Create a new account or login with existing credentials
3. **Select muscle groups**: Click on the anatomical diagrams to select target muscles
4. **Generate workout**: Click "Generate Workout Plan" to create a personalized routine
5. **Track progress**: View your workout history and mark workouts as completed

### User Authentication

#### Registration
- Choose a unique username (3-30 characters)
- Provide a valid email address
- Create a secure password (min 6 chars, must include uppercase, lowercase, and number)
- Set your fitness level and goals (optional)

#### Login
- Use email and password to access your account
- Automatic token refresh for seamless experience

### Workout Management

#### Generating Workouts
- **Authenticated users**: Get personalized workouts based on profile
- **Guest users**: Generate basic workouts (not saved)
- **Muscle group selection**: Choose from 14 different muscle groups
- **AI customization**: Workouts adapted to your fitness level and goals

#### Tracking Progress
- **Workout history**: View all your generated workouts
- **Completion tracking**: Mark workouts as completed
- **Filtering**: Filter by completed/pending status
- **Detailed view**: See full workout plans with metadata

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/verify` - Verify JWT token

### Workouts
- `POST /workout-submit` - Generate workout (authenticated)
- `POST /workout-submit-demo` - Generate workout (unauthenticated)
- `GET /api/workouts` - Get user's workout history
- `PUT /api/workouts/:id` - Update workout (mark complete, add notes)
- `DELETE /api/workouts/:id` - Delete workout

### Other
- `POST /submit-form` - Contact form submission

## Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  profile: {
    firstName: String,
    lastName: String,
    fitnessLevel: String (enum: beginner/intermediate/advanced),
    goals: [String] (array of fitness goals)
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Workout Model
```javascript
{
  userId: ObjectId (ref: User),
  muscleGroups: [String],
  workoutPlan: String,
  completed: Boolean,
  rating: Number (1-5),
  notes: String,
  duration: Number (minutes),
  difficulty: String (enum: easy/medium/hard),
  generatedAt: Date,
  completedAt: Date
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Configured cross-origin policies

## Development

### Running in Development Mode

1. **Backend**:
   ```bash
   cd Website/express
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd Website/workout_app
   npm run dev
   ```

### Building for Production

1. **Build frontend**:
   ```bash
   cd Website/workout_app
   npm run build
   ```

2. **Copy build to backend**:
   ```bash
   cp -r dist/* ../express/dist_wo_app/
   ```

3. **Start production server**:
   ```bash
   cd ../express
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please contact [your-email@example.com].
