const mongoose = require('mongoose');

// Kobler til MongoDB – stopper appen hvis det feiler
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB tilkoblet');
  } catch (err) {
    console.error('MongoDB-tilkobling feilet:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
