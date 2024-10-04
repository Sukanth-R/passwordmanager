import React, { useState } from 'react';
import './PasswordManager.css'; // Import your CSS styles for this component

const PasswordManager = () => {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [storedPasswords, setStoredPasswords] = useState([]);

  // Function to generate a password related to the website
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    
    // Get a part of the website name to include in the password
    const websitePart = website.length > 3 ? website.slice(0, 3) : website; // Get first 3 characters of the website
    let password = websitePart; // Start password with website part

    // Add random characters to complete the password
    for (let i = websitePart.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    setGeneratedPassword(password); // Set the generated password
  };

  // Function to save the generated password
  const savePassword = () => {
    if (generatedPassword && website) {
      const newEntry = { website, password: generatedPassword };
      setStoredPasswords((prevPasswords) => [...prevPasswords, newEntry]);
      setWebsite(''); // Reset website input
      setGeneratedPassword(''); // Reset generated password
    } else {
      alert('Please generate a password and enter a website before saving.');
    }
  };

  return (
    <div className="app-container">
      <h2>Password Manager</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{ marginRight: '10px', flexGrow: 1 }} // Flex-grow to fill available space
        />
        <button onClick={generatePassword}>Generate Password</button>
      </div>

      {generatedPassword && (
        <div style={{ marginTop: '20px' }}>
          <p>Generated Password: <strong>{generatedPassword}</strong></p> {/* Display generated password */}
          <button onClick={savePassword}>Save Password</button>
        </div>
      )}

      <h3>Stored Passwords</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {storedPasswords.length > 0 ? (
          storedPasswords.map((entry, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>{entry.website}</strong>: {entry.password}
            </li>
          ))
        ) : (
          <li>No passwords stored yet.</li>
        )}
      </ul>
    </div>
  );
};

export default PasswordManager;
