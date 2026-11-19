import React, { useState } from 'react';
import { authService } from '../services/api';

export default function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      
      const payload = { username, email, password };
      
      if (isAdmin) {
        await authService.registerAdmin(payload);
        setMessage("👑 ॲडमिन अकाउंट यशस्वीरित्या तयार झाले! कृपया लॉगिन करा.");
      } else {
        await authService.registerUser(payload);
        setMessage("👤 युझर अकाउंट यशस्वीरित्या तयार झाले! कृपया लॉगिन करा.");
      }

      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Registration error:", err);
      // सर्व्हरकडून आलेला खरा मेसेज स्क्रीनवर दाखवणे
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 403 || err.response?.status === 404) {
        setError("सर्व्हर एरर: बॅकएंड पाथ ब्लॉक होत आहे. कृपया SecurityConfig तपासा.");
      } else {
        setError("नेटवर्क एरर किंवा सर्व्हर बंद आहे. कृपया बॅकएंड कंसोल तपासा.");
      }
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '350px', margin: '80px auto', padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <h2>📝 Register Account</h2>
      
      {message && <div style={{ color: 'green', backgroundColor: '#e8f8f0', padding: '8px', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ color: 'red', backgroundColor: '#fde8e7', padding: '8px', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
      
      <form onSubmit={handleRegister}>
        <div className="form-group" style={{ textAlign: 'left', marginBottom: '12px' }}>
          <label style={{ fontWeight: '500' }}>Username</label>
          <input type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div className="form-group" style={{ textAlign: 'left', marginBottom: '12px' }}>
          <label style={{ fontWeight: '500' }}>Email ID</label>
          <input type="email" placeholder="Enter email address" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div className="form-group" style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label style={{ fontWeight: '500' }}>Password</label>
          <input type="password" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <input type="checkbox" id="adminCheck" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
          <label htmlFor="adminCheck" style={{ fontWeight: 'bold', color: '#2c3e50', cursor: 'pointer' }}>Register as ADMIN 👑</label>
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>
          Sign Up / Register
        </button>
      </form>

      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Already have an account?{' '}
        <span onClick={onSwitchToLogin} style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
          Login Here
        </span>
      </p>
    </div>
  );
}
