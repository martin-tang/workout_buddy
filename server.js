const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const { generateWorkout, getUserWorkouts, updateWorkout, deleteWorkout } = require('./workoutAPI');
const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/database');
const openaiRoutes = require('./routes/openai'); // Add this line

const dotenv = require('dotenv');

dotenv.config();

// Connect to database (non-blocking)
connectDB().then(connected => {
  if (connected) {
    console.log('🚀 Full app features available (with authentication)');
  } else {
    console.log('🚀 Basic app features available (demo mode only)');
  }
});

const app = express();
const PORT = process.env.PORT || 5412;

// Enable CORS
app.use(cors());

// Enable compression
app.use(compression());

// Middleware
app.use(express.json());

// Serve static files from the client app's build directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// Authentication routes
app.use('/api/auth', authRoutes);

// OpenAI routes
app.use('/api/openai', openaiRoutes); // Add this line

// Serve the client application for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Workout routes
app.post("/workout-submit", authenticateToken, generateWorkout);
app.get("/api/workouts", authenticateToken, getUserWorkouts);
app.put("/api/workouts/:id", authenticateToken, updateWorkout);
app.delete("/api/workouts/:id", authenticateToken, deleteWorkout);

// Allow unauthenticated workout generation (for demo purposes)
app.post("/workout-submit-demo", generateWorkout);

app.listen(PORT, () => {
  console.log(`Running express endpoint on port ${PORT}...`);
});
