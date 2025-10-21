import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fitnessLevel: 'beginner',
    goals: []
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to exercise or getting back into fitness' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular exercise routine for 6+ months' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced athlete or fitness enthusiast' }
  ];

  const fitnessGoals = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'strength', label: 'Strength', icon: '🏋️' },
    { value: 'endurance', label: 'Endurance', icon: '🏃' },
    { value: 'flexibility', label: 'Flexibility', icon: '🤸' },
    { value: 'general_fitness', label: 'General Fitness', icon: '⚡' }
  ];

  // Initialize form data when user or modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        fitnessLevel: user.profile?.fitnessLevel || 'beginner',
        goals: user.profile?.goals || []
      });
      setErrors({});
      setSuccessMessage('');
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGoalToggle = (goalValue) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalValue)
        ? prev.goals.filter(g => g !== goalValue)
        : [...prev.goals, goalValue]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Basic validation
    const newErrors = {};
    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }
    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await updateProfile(formData);
    if (result.success) {
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setErrors({ general: result.error || 'Failed to update settings' });
    }
  };

  const handleClose = () => {
    setErrors({});
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg">
              <p className="text-green-200 text-sm">✅ {successMessage}</p>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">❌ {errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Fitness Level */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Fitness Level</h3>
              <div className="space-y-3">
                {fitnessLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      formData.fitnessLevel === level.value
                        ? 'border-green-500 bg-green-900 bg-opacity-20'
                        : 'border-gray-600 bg-gray-800 hover:bg-gray-750'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value={level.value}
                      checked={formData.fitnessLevel === level.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-green-500 focus:ring-green-500"
                    />
                    <div>
                      <div className="text-white font-medium">{level.label}</div>
                      <div className="text-gray-400 text-sm">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Fitness Goals */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Fitness Goals</h3>
              <p className="text-gray-400 text-sm mb-4">Select all that apply (optional)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fitnessGoals.map((goal) => (
                  <label
                    key={goal.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      formData.goals.includes(goal.value)
                        ? 'border-green-500 bg-green-900 bg-opacity-20'
                        : 'border-gray-600 bg-gray-800 hover:bg-gray-750'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal.value)}
                      onChange={() => handleGoalToggle(goal.value)}
                      className="mr-3 text-green-500 focus:ring-green-500"
                    />
                    <span className="mr-2">{goal.icon}</span>
                    <span className="text-white">{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 