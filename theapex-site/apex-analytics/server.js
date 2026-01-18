console.log('LOADED FROM:', __filename, 'at', new Date().toISOString());

const express = require('express');
const cors = require('cors'); // <--- ADDED
const bodyParser = require('body-parser'); // <--- ADDED
const { Pool } = require('pg'); // <--- ADDED

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('DEBUG: / GET HIT at', new Date().toISOString());
  res.send('Hello from server!');
});

// Configure your PostgreSQL connection here
const pool = new Pool({
  user: 'apex_media_10',
  host: 'localhost',
  database: 'apex_media',
  password: 'l0GqUC5AAqkbiP1Ol3JtWERc0uil7y3m', // <--- Make sure this is correct!
  port: 5432,
});

app.post('/api/track', async (req, res) => {
  console.log('Received /api/track POST:', req.body);
  const { user_id, session_id, event_type, page_url, event_data } = req.body;
  try {
    await pool.query(
      'INSERT INTO events (user_id, session_id, event_type, page_url, event_data) VALUES ($1, $2, $3, $4, $5)',
      [user_id, session_id, event_type, page_url, event_data || {}]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('TRACK INSERT ERROR:', err);
    res.status(500).send('Error saving event');
  }
});

app.post('/api/consent', async (req, res) => {
  const { user_id, session_id, consent_given, consent_details } = req.body;
  try {
    await pool.query(
      'INSERT INTO consents (user_id, session_id, consent_given, consent_details) VALUES ($1, $2, $3, $4)',
      [user_id, session_id, consent_given, JSON.stringify(consent_details || {})]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving consent');
  }
});


console.log('***** I AM RUNNING THE RIGHT FILE *****');

app.listen(4000, () => console.log('Analytics API running on port 4000'));