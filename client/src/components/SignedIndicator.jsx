// src/components/SignedInIndicator.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../actions/authActions';

const SignedInIndicator = () => {
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();



  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');  // Redirect to login page after logout
  };


  if (!isAuthenticated) {
    return null; // Don't show the indicator if the user isn't signed in
  }

  return (
    <div className="flex items-center space-x-4 p-2 bg-gray-700 text-white rounded-lg">
      {user?.avatar && (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="h-8 w-8 rounded-full"
        />
      )}
      <span>Welcome, {user?.name || 'User'}!</span>
      <Link to="/profile" className="text-blue-300 hover:underline">
        Profile
      </Link>
      <Link to="/logout" className="text-red-400 hover:underline">
        Logout
      </Link>

      <button 
        onClick={handleLogout} 
        className="text-red-400 hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default SignedInIndicator;
