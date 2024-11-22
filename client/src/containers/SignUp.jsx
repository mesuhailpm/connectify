// src/components/SignUp.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../actions/authActions"; // Import your signup action
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await dispatch(signUp({ username, email, password }));
    } catch (error) {
      toast.error("couldn't sign up!");
    } finally {
      setFormLoading( false );
    }
  };

  if (isAuthenticated) {
    // Redirect to the home page after sign-up
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-chat_background w-full">
      <div className="w-full max-w-md p-8 space-y-6  shadow-md bg-black text-white rounded-md">
        <h2 className="text-center text-2xl font-bold text-gray-100">
          Create an account
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
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
              formLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={formLoading}
          >
            {formLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
