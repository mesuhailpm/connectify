// src/components/Login.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/authActions'; // Import your login action
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true)

     await dispatch(login({ email, password }));
    } catch (error) {
      toast.error('couldn\'t login!')
    } finally{
      setFormLoading( false )
    }

  };

  if (isAuthenticated) {
    // Redirect to the home page after login
    return <Navigate to="/chats" />;
  }

  return (
    <div className="flex items-center justify-center h-full max-h-full bg-chat_background w-full">
      <div className="w-full max-h-full max-w-md p-8 space-y-6  shadow-md bg-black text-white rounded-md">
        <h2 className="text-center text-2xl font-bold text-gray-100">Login to your account</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              formLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={formLoading}
          >
            {formLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center">
          <p>
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
