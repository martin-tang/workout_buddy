import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleClose = () => {
    setMode('login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
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
          {mode === 'login' ? (
            <LoginForm onToggleMode={handleToggleMode} onClose={handleClose} />
          ) : (
            <RegisterForm onToggleMode={handleToggleMode} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 