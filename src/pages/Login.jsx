import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      alert(`Welcome back, ${username}!`);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">Sign In</h2>
        <p className="login-desc">Enter your credentials to access your account</p>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. johndoe"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••>"
          />
        </div>

        <button type="submit" className="login-submit-btn">
          Sign In
        </button>
      </form>
    </div>
  );
}