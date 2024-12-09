// src/components/SignedInIndicator.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../actions/authActions";

const SignedInIndicator = () => {
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();



  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');  // Redirect to login page after logout
  };


  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center w-full text-white">
        <p>
          {`You have been missing. `}{" "}
          <span>
            <Link
              to="/login"
              className="text-blue-400 text-center hover:underline"
            >
              Login
            </Link>
          </span>
          {` into your account if you are a member, or `}
          <span>
            <Link
              to="/signup"
              className="text-blue-400 text-center hover:underline"
            >
              Create one
            </Link>
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-2 bg-gradient-to-br from-secondary border-2  to-secondary  via-surface/40 border-secondary text-white rounded-lg">
      {user?.avatar && (
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="h-8 w-8 rounded-full"
        />
      )}
      <span className="font-bold">Welcome, {user?._id} {user?.username || 'User'}!</span>
      <Link to="/profile" className="text-blue-300 font-bold hover:underline">
        Profile
      </Link>

      <button onClick={handleLogout} className="text-danger/60 font-bold hover:underline">
        Logout
      </button>
    </div>
  );
};

export default SignedInIndicator;
