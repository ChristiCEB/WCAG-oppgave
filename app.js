require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const siteRoutes = require('./routes/siteRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session i MongoDB så innlogging overlever restart
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// Sender bruker til alle sider (for header osv.)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', reviewRoutes);
app.use('/', adminRoutes);
app.use('/', siteRoutes);
app.use('/', authRoutes);

app.use((req, res) => {
  res.status(404).send('Siden ble ikke funnet.');
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server kjører på port ${PORT} (0.0.0.0)`);
});
