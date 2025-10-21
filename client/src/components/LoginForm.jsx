import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onToggleMode, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, loading, error } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
      <p className="text-gray-400 text-center mb-8">Sign in to your account</p>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 