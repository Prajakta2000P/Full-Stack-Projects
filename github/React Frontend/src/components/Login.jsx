import React, { useState } from 'react';
import { authService } from '../services/api';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = await authService.login(username, password);
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('roles', JSON.stringify(data.roles || []));
        onLogin();
      } else {
        setError("सर्व्हरकडून टोकन मिळाले नाही.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("लॉगिन अयशस्वी! युझरनेम किंवा पासवर्ड तपासा.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: 'Arial, sans-serif' }}>
      <div className="login-container" style={{ width: '100%', maxWidth: '360px', padding: '30px', backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: 0, color: '#2c3e50' }}>🔑 Login</h2>
        
        {/* लॉगिन अयशस्वी झाल्यास एरर मेसेज बॉक्स */}
        {error && (
          <div style={{ color: '#e74c3c', backgroundColor: '#fde8e7', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center', borderLeft: '4px solid #e74c3c', fontWeight: 'bold' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>Username</label>
            <input 
              type="text" 
              placeholder="Enter Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>Password</label>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            Login
          </button>
        </form>

        {/* 'onSwitchToRegister' चा वापर इथे केला आहे, ज्यामुळे वॉर्निंग निघून जाईल */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#7f8c8d' }}>
          Don't have an account?{' '}
          <span 
            onClick={onSwitchToRegister} 
            style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            Register here
          </span>
        </div>

      </div>
    </div>
  );
}