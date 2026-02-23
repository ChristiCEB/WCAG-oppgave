require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const siteRoutes = require('./routes/siteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', siteRoutes);

app.use((req, res) => {
  res.status(404).send('Siden ble ikke funnet.');
});

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
