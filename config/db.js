const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wcag-oppgave');
    console.log('MongoDB tilkoblet');
  } catch (err) {
    console.error('MongoDB-tilkobling feilet:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
