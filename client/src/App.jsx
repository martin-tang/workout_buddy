import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import SettingsModal from './components/SettingsModal';

import torsoChest from './assets/torso-chest.png'
import torsoBack from './assets/torso-back.png'
import torsoAbs from './assets/torso-abs.png'
import torsoLowerBack from './assets/torso-lower-back.png'

import armsBiceps from './assets/arms-biceps.png'
import armsTriceps from './assets/arms-triceps.png'
import armsForearms from './assets/arms-forearms.png'
import armsShoulders from './assets/arms-shoulders.png'

import legsAbductors from './assets/legs-abductors.png' 
import legsAdductors from './assets/legs-adductors.png'
import legsHamstrings from './assets/legs-hamstrings.png'
import legsQuadriceps from './assets/legs-quads.png'
import legsCalves from './assets/legs-calves.png'
import legsGlutes from './assets/legs-glutes.png' 

import greenOverlay from "./assets/green.png";

const muscleGroupsData = [
  { id: 'chest-cb', name: 'Chest', image: torsoChest },
  { id: 'back-cb', name: 'Back', image: torsoBack },
  { id: 'abs-cb', name: 'Abs', image: torsoAbs },
  { id: 'lower-back-cb', name: 'Lower Back', image: torsoLowerBack },
  { id: 'biceps-cb', name: 'Biceps', image: armsBiceps },
  { id: 'triceps-cb', name: 'Triceps', image: armsTriceps },
  { id: 'forearms-cb', name: 'Forearms', image: armsForearms },
  { id: 'shoulders-cb', name: 'Shoulders', image: armsShoulders },
  { id: 'quadriceps-cb', name: 'Quadriceps', image: legsQuadriceps },
  { id: 'hamstrings-cb', name: 'Hamstrings', image: legsHamstrings },
  { id: 'glutes-cb', name: 'Glutes', image: legsGlutes },
  { id: 'calves-cb', name: 'Calves', image: legsCalves },
  { id: 'abductors-cb', name: 'Abductors', image: legsAbductors },
  { id: 'adductors-cb', name: 'Adductors', image: legsAdductors },
];

function WorkoutPlanner() {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { user, logout, isAuthenticated, getAuthHeader } = useAuth();

  const handleMuscleGroupClick = (name) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedMuscleGroups.length === 0) {
      alert('Please select at least one muscle group.');
      return;
    }
    setLoading(true);
    setWorkoutPlan("");

    try {
      const endpoint = isAuthenticated ? '/workout-submit' : '/workout-submit-demo';
      const headers = {
        'Content-Type': 'application/json',
        ...(isAuthenticated ? getAuthHeader() : {})
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          muscleGroups: selectedMuscleGroups
        }),
      });
      
      const data = await response.json();
      
      if (data.workoutPlan) {
        setWorkoutPlan(data.workoutPlan);
        if (data.saved) {
          // Show success message for saved workout
          setTimeout(() => {
            setWorkoutPlan(prev => prev + '\n\n✅ Workout saved to your history!');
          }, 1000);
        }
      } else if (data.error) {
        console.error('Backend error:', data.error);
        setWorkoutPlan('Error generating workout plan: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling backend API:', error);
      setWorkoutPlan('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center rounded-2xl p-4 shadow-2xl">
      {/* Header with auth controls */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-5xl font-bold text-white">WorkoutBuddy</h1>
          {isAuthenticated && (
            <span className="text-green-400 text-sm">
              Welcome, {user?.profile?.firstName || user?.username}!
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={() => setDashboardOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                My Workouts
              </button>
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-400 mb-8">
        {isAuthenticated 
          ? "Select muscle groups to generate a personalized workout plan." 
          : "Select muscle groups to generate a workout plan. Sign up to save your workouts!"}
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
          {muscleGroupsData.map(group => {
            const isSelected = selectedMuscleGroups.includes(group.name);
            return (
              <div
                key={group.id}
                onClick={() => handleMuscleGroupClick(group.name)}
                className={`relative rounded-lg w-32 h-32 bg-cover cursor-pointer transform transition-transform duration-200 hover:scale-105 ${isSelected ? 'ring-4 ring-green-500' : ''}`}
                style={{ backgroundImage: `url(${group.image})` }}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-green-500 opacity-30 rounded-lg"></div>
                )}
                <input type="checkbox" id={group.id} name={group.id} checked={isSelected} className="hidden" readOnly />
                <span className="absolute bottom-2 left-2 font-bold text-white bg-black bg-opacity-50 px-2 py-1 rounded">{group.name}</span>
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="m-4 bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-500 w-full max-w-md"
        >
          {loading ? 'Generating...' : 'Generate Workout Plan'}
        </button>
      </form>

      {workoutPlan && (
        <div className="bg-gray-800 text-white rounded-xl p-6 m-4 w-full max-w-4xl whitespace-pre-line font-mono shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Your Custom Workout Plan</h2>
          <p>{workoutPlan}</p>
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg">
              <p className="text-blue-200 text-sm">
                💡 <strong>Sign up</strong> to save your workouts and track your progress!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* User Dashboard */}
      {dashboardOpen && (
        <UserDashboard onClose={() => setDashboardOpen(false)} />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkoutPlanner />
    </AuthProvider>
  );
}

export default App;