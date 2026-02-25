require('dotenv').config();
const mongoose = require('mongoose');
const Site = require('../models/Site');

// Bildene ligger i public/img: digdir.png, nav.png, regjeringen.png, udir.png, brreg.png
const sites = [
  {
    title: 'Digdir – Digitaliseringsdirektoratet',
    url: 'https://digdir.no',
    imagePath: '/img/digdir.png'
  },
  {
    title: 'NAV',
    url: 'https://nav.no',
    imagePath: '/img/nav.png'
  },
  {
    title: 'Regjeringen.no',
    url: 'https://regjeringen.no',
    imagePath: '/img/regjeringen.png'
  },
  {
    title: 'Udir – Utdanningsdirektoratet',
    url: 'https://udir.no',
    imagePath: '/img/udir.png'
  },
  {
    title: 'Brønnøysundregistrene',
    url: 'https://brreg.no',
    imagePath: '/img/brreg.png'
  }
];

async function seed() {
  let exitCode = 0;
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wcag-oppgave');
    await Site.deleteMany({});
    await Site.insertMany(sites);
    console.log(`Seed fullført: ${sites.length} nettsteder lagt inn.`);
  } catch (err) {
    console.error('Seed feilet:', err);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(exitCode);
  }
}

seed();
