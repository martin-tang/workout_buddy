const fetch = require('node-fetch');
const dotenv = require('dotenv');
const Workout = require('./models/Workout');
const { authenticateToken } = require('./middleware/auth');

dotenv.config();

// POST /api/workout - Generate and save workout
const generateWorkout = async (req, res) => {
  const { muscleGroups } = req.body;

  if (!Array.isArray(muscleGroups) || muscleGroups.length === 0) {
    return res.status(400).json({ error: 'muscleGroups must be a non-empty array.' });
  }

  const fitnessLevel = req.user?.profile?.fitnessLevel || 'beginner';
  const goals = req.user?.profile?.goals || [];
  
  let prompt = `Generate a detailed workout plan targeting the following muscle groups: ${muscleGroups.join(", ")}. Generate 3 excersizes for each muscle group.
Use a conversational and encouraging tone.
The user's fitness level is ${fitnessLevel}.
Their goals are: ${goals.join(', ')}.

Please structure the response with the following sections:
- **Introduction**: Briefly explain the workout's focus.
- **Warm-up**: 5-10 minutes of light cardio and dynamic stretching.
- **Workout Plan**: For each exercise, provide:
  - **Muscle Group**: The muscle group being targeted.
  - **Exercise Name**: The name of the exercise.
  - **Sets**: Number of sets.
  - **Reps**: Number of repetitions per set.
  - **Rest**: Rest time between sets.
  - **Instructions**: Clear, step-by-step instructions on how to perform the exercise.
- **Cool-down**: 5-10 minutes of static stretching.
- **Tips**: Extra advice for maximizing results and staying safe.

Respond in markdown format.`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables.');
    return res.status(500).json({ error: 'API configuration error' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
      }),
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const workoutPlan = data.choices[0].message.content;
      
      // Save workout to database if user is authenticated
      let workoutId = null;
      if (req.user) {
        try {
          const workout = new Workout({
            userId: req.user._id,
            muscleGroups,
            workoutPlan,
            difficulty: fitnessLevel === 'beginner' ? 'easy' : fitnessLevel === 'intermediate' ? 'medium' : 'hard'
          });
          
          const savedWorkout = await workout.save();
          workoutId = savedWorkout._id;
        } catch (dbError) {
          console.error('Database save error:', dbError);
          // Continue without failing - return workout even if save fails
        }
      }
      
      return res.json({ 
        workoutPlan,
        workoutId,
        saved: !!workoutId,
        message: workoutId ? 'Workout generated and saved!' : 'Workout generated!'
      });
    } else {
      return res.status(500).json({ error: 'No valid response from OpenAI.' });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: error.message || 'Error calling OpenAI API.' });
  }
};

// GET /api/workouts - Get user's workout history
const getUserWorkouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, completed } = req.query;
    
    const filter = { userId: req.user._id };
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    const workouts = await Workout.find(filter)
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Workout.countDocuments(filter);
    
    res.json({
      workouts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Workout fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

// PUT /api/workouts/:id - Update workout (mark complete, add rating/notes)
const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, rating, notes, duration } = req.body;
    
    const updateData = {};
    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed) {
        updateData.completedAt = new Date();
      }
    }
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
    if (duration !== undefined) updateData.duration = duration;
    
    const workout = await Workout.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    res.json({ message: 'Workout updated successfully', workout });
  } catch (error) {
    console.error('Workout update error:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
};

// DELETE /api/workouts/:id - Delete workout
const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    
    const workout = await Workout.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Workout deletion error:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};

module.exports = {
  generateWorkout,
  getUserWorkouts,
  updateWorkout,
  deleteWorkout
};