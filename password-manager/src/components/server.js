const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For OTP generation

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/signupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Mongoose Schema for User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// In-memory OTP store (for demo, you can also store in a database with expiry time)
let otpStore = {};

// Nodemailer transporter setup (replace with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sukanth0021@gmail.com',
    pass: 'your-app-password', // Use the app password if 2FA is enabled
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates (useful in development)
  },
});

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Route to generate and send OTP
app.post('/generate-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = generateOTP();
  otpStore[email] = otp; // Store OTP temporarily

  const mailOptions = {
    from: 'sukanth93605@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    res.status(200).json({ message: 'OTP sent successfully!' });
  });
});

// Signup route (with OTP verification)
app.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword, otp } = req.body;

  // Basic validation
  if (!username || !email || !password || !confirmPassword || !otp) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Verify OTP
  if (otpStore[email] !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    // Clear OTP after successful signup
    delete otpStore[email];

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ error: 'Error saving user to database' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
