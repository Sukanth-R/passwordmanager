import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ setUser, toggleSignup }) => { // Accept toggleSignup prop
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.email && credentials.password) {
      try {
        const response = await axios.post('http://localhost:5001/login', credentials);
        setUser(response.data.user);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div>
    <header className="login-header">
        <h1>🔐Password Manager</h1>
    </header>
    <div className="login-container">
      {/* Header section */}
      

      <div className="login-box">
        <div className="login-left">
          <h2 id="c1">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  placeholder="Enter OTP"
                  value={credentials.otp} // Make sure to update this to credentials.otp
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                <button type="button" className="input-button">Generate</button>
              </div>
            </div>

            <button type="submit" className="login-button">Sign In</button>
            <div className="remember-forgot">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
        <div className="login-right">
          <h2>Welcome to login</h2>
          <p>Don't have an account?</p>
          <button className="signup-button" onClick={toggleSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
