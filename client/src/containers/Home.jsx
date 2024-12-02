import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container text-black p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
      <p className="text-lg">
        This is the home page. Once you're logged in, you can access your chat threads and start messaging!
      </p>
      <p className="mt-4">
        Navigate to the <Link to={'login'} className="text-info/80 hover:underline">Login</Link> page to sign in or head over to the <Link to={'signup'} className="text-info/80">Sign Up</Link> page to create a new account.
      </p>Link
    </div>
  );
}

export default Home;
