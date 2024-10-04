import React, { useState } from 'react';
import PasswordManager from './components/PasswordManager';
import Login from './components/Login';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      {!user ? <Login setUser={setUser} /> : <PasswordManager user={user} />}
    </div>
  );
};

export default App;
