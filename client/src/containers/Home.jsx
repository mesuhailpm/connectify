import React from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function Home() {
  const deleteAllMessage = async () => {
    await fetch(API.get('api/chats/deleteAll'))
  }
  return (
    <div className="home-container text-black p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
      <p className="text-lg">
        This is the home page. Once you're logged in, you can access your chat threads and start messaging!
      </p>
      <p className="mt-4">
        Navigate to the <Link to={'login'} className="text-info/80 hover:underline">Login</Link> page to sign in or head over to the <Link to={'signup'} className="text-info/80">Sign Up</Link> page to create a new account.
      </p>Link
      <button onClick={deleteAllMessage} className='absolute top-0 bg-red-600'> Delete all Message</button>
    </div>
  );
}

export default Home;
