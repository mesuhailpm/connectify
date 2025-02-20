import React from 'react'
import { useSelector } from 'react-redux'

const About = () => {

  const {user} = useSelector((state) => state.auth);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>About</h1>
      <p>Welcome to the chat app!</p>
      {user && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#555' }}>User Information</h2>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#555' }}>Legal</h2>
        <p>
          Please read our <a href="/terms" style={{ color: '#007bff' }}>Terms and Conditions</a>, <a href="/privacy" style={{ color: '#007bff' }}>Privacy Policy</a>, and <a href="/contact" style={{ color: '#007bff' }}>Contact Us</a>.
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#555' }}>Who We Are</h2>
        <p>We are a team dedicated to providing the best chat experience for our users.</p>
      </div>
    </div>
  );
}

export default About