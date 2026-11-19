import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  // screen state: 'login' किंवा 'register' स्क्रीन साठवण्यासाठी
  const [currentScreen, setCurrentScreen] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('roles');
    // जर टोकन आणि रोल्स दोन्ही लोकल स्टोरेजमध्ये असतील तरच डॅशबोर्डवर नेणे
    if (token && roles) {
      setIsAuth(true);
    } else {
      localStorage.clear();
      setIsAuth(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    setCurrentScreen('login');
  };

  // १. युझर ऑथेंटिकेटेड असेल तर थेट डॅशボード दाखवा
  if (isAuth) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // २. ऑथेंटिकेटेड नसेल तर 'login' किंवा 'register' स्क्रीन दाखवा
  return currentScreen === 'login' ? (
    <Login 
      onLogin={handleLoginSuccess} 
      onSwitchToRegister={() => setCurrentScreen('register')} 
    />
  ) : (
    <Register 
      onSwitchToLogin={() => setCurrentScreen('login')} 
    />
  );
}
