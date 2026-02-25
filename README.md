# WCAG vurdering

MVP for å vurdere nettsteder opp mot tilgjengelighetskrav (WCAG). Bygget med Node.js, Express, MongoDB og EJS.

## Kom i gang

### Forutsetninger

- [Node.js](https://nodejs.org/) (LTS anbefales)
- [MongoDB](https://www.mongodb.com/try/download/community) kjører lokalt, eller tilgjengelig via nettverk

### Installasjon

```bash
npm install
```

### Miljøvariabler

Opprett en `.env`-fil i prosjektroten (eller kopier fra `.env.example` om den finnes):

| Variabel        | Beskrivelse                    | Eksempel                              |
|-----------------|---------------------------------|----------------------------------------|
| `MONGODB_URI`   | Tilkoblingsstreng til MongoDB  | `mongodb://localhost:27017/wcag-oppgave` |
| `SESSION_SECRET`| Hemmelig nøkkel for session    | Bruk en lang, tilfeldig string         |

Eksempel `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/wcag-oppgave
SESSION_SECRET=din-hemmelige-nøkkel-her
```

### Seed-data (forhåndsregistrerte nettsteder)

Før første kjøring, eller for å nullstille nettstedene i databasen:

```bash
npm run seed
```

Dette legger inn 5 norske nettsteder (Digdir, NAV, Regjeringen.no, Udir, Brønnøysundregistrene). **MongoDB må kjøre** før du kjører seed.

### Starte appen

```bash
npm start
```

Åpne [http://localhost:3000](http://localhost:3000).

Med automatisk omstart ved endringer (utvikling):

```bash
npm run dev
```

## Skript

| Kommando       | Beskrivelse                          |
|----------------|--------------------------------------|
| `npm start`    | Starter serveren                      |
| `npm run dev`  | Starter med `--watch` (omstart ved endring) |
| `npm run seed` | Kjører seed-script for nettsteder     |

## Administrator

Brukere har rolle `user` eller `admin`. Kun admin kan åpne **Admin**-siden (rapporter).

**Gjøre en bruker til admin (mongosh):**

```bash
mongosh
use wcag-oppgave
db.users.updateOne(
  { username: "ditt_brukernavn" },
  { $set: { role: "admin" } }
)
```

Bytt ut `ditt_brukernavn` med brukernavnet. Logg ut og inn igjen – da vises **Admin**-lenken i headeren, og du kan åpne `/admin/reports`.


