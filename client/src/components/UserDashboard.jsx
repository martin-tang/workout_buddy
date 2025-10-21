import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = ({ onClose }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [filter, setFilter] = useState('all');
  const { getAuthHeader, user } = useAuth();

  useEffect(() => {
    fetchWorkouts();
  }, [filter]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: '20',
        ...(filter !== 'all' && { completed: filter === 'completed' })
      });
      
      const response = await fetch(`/api/workouts?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
      } else {
        throw new Error('Failed to fetch workouts');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkout = async (workoutId, updates) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(workouts.map(w => 
          w._id === workoutId ? data.workout : w
        ));
        if (selectedWorkout && selectedWorkout._id === workoutId) {
          setSelectedWorkout(data.workout);
        }
      } else {
        throw new Error('Failed to update workout');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        setWorkouts(workouts.filter(w => w._id !== workoutId));
        if (selectedWorkout && selectedWorkout._id === workoutId) {
          setSelectedWorkout(null);
        }
      } else {
        throw new Error('Failed to delete workout');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const WorkoutCard = ({ workout }) => (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-white">
            {workout.muscleGroups.join(', ')}
          </h3>
          <p className="text-sm text-gray-400">{formatDate(workout.generatedAt)}</p>
        </div>
        <div className="flex items-center space-x-2">
          {workout.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full bg-gray-800 ${getDifficultyColor(workout.difficulty)}`}>
              {workout.difficulty}
            </span>
          )}
          {workout.completed && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-800 text-green-200">
              Completed
            </span>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedWorkout(workout)}
          className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200"
        >
          View Details
        </button>
        <div className="flex space-x-2">
          {!workout.completed && (
            <button
              onClick={() => updateWorkout(workout._id, { completed: true })}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={() => deleteWorkout(workout._id)}
            className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const WorkoutDetails = ({ workout }) => (
    <div className="bg-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {workout.muscleGroups.join(', ')} Workout
          </h3>
          <p className="text-gray-400">Generated on {formatDate(workout.generatedAt)}</p>
        </div>
        <button
          onClick={() => setSelectedWorkout(null)}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-green-400 mb-2">Workout Plan</h4>
        <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
          {workout.workoutPlan}
        </pre>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Status:</span>
          <span className={workout.completed ? 'text-green-400' : 'text-yellow-400'}>
            {workout.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        {workout.difficulty && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Difficulty:</span>
            <span className={getDifficultyColor(workout.difficulty)}>
              {workout.difficulty}
            </span>
          </div>
        )}
        {workout.duration && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Duration:</span>
            <span className="text-white">{workout.duration} minutes</span>
          </div>
        )}
      </div>

      {workout.notes && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-400 mb-2">Notes</h4>
          <p className="text-gray-300">{workout.notes}</p>
        </div>
      )}

      <div className="flex space-x-4">
        {!workout.completed && (
          <button
            onClick={() => updateWorkout(workout._id, { completed: true })}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Mark as Completed
          </button>
        )}
        <button
          onClick={() => deleteWorkout(workout._id)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Delete Workout
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">
              Welcome back, {user?.profile?.firstName || user?.username}!
            </h2>
            <p className="text-gray-400">Track your fitness journey</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {selectedWorkout ? (
            <WorkoutDetails workout={selectedWorkout} />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Your Workouts</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      filter === 'all' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      filter === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      filter === 'pending' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <p className="text-gray-400 mt-2">Loading workouts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={fetchWorkouts}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : workouts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No workouts found.</p>
                  <p className="text-gray-500 mt-2">Start by generating your first workout!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workouts.map(workout => (
                    <WorkoutCard key={workout._id} workout={workout} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 