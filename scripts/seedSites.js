require('dotenv').config();
const mongoose = require('mongoose');
const Site = require('../models/Site');

const sites = [
  {
    title: 'Digdir – Digitaliseringsdirektoratet',
    url: 'https://digdir.no',
    imagePath: 'https://picsum.photos/seed/digdir/400/250'
  },
  {
    title: 'NAV',
    url: 'https://nav.no',
    imagePath: 'https://picsum.photos/seed/nav/400/250'
  },
  {
    title: 'Regjeringen.no',
    url: 'https://regjeringen.no',
    imagePath: 'https://picsum.photos/seed/regjeringen/400/250'
  },
  {
    title: 'Udir – Utdanningsdirektoratet',
    url: 'https://udir.no',
    imagePath: 'https://picsum.photos/seed/udir/400/250'
  },
  {
    title: 'Brønnøysundregistrene',
    url: 'https://brreg.no',
    imagePath: 'https://picsum.photos/seed/brreg/400/250'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wcag-oppgave');
    await Site.deleteMany({});
    await Site.insertMany(sites);
    console.log(`Seed fullført: ${sites.length} nettsteder lagt inn.`);
  } catch (err) {
    console.error('Seed feilet:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
