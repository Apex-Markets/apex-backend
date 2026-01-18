console.log('LOADED FROM:', __filename, 'at', new Date().toISOString());

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');

const app = express();

app.use(cors({
  origin: 'https://theapexinvestor.com', // or your frontend domain(s)
  credentials: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const pool = new Pool({
  user: 'apex_media_10',
  host: 'localhost',
  database: 'apex_media',
  password: 'l0GqUC5AAqkbiP1Ol3JtWERc0uil7y3m', // <--- Use your actual password here
  port: 5432,
});

app.get('/', (req, res) => {
  console.log('DEBUG: / GET HIT at', new Date().toISOString());

  // Generate or reuse cookies
  const userId = req.cookies.user_id || Math.random().toString(36).substring(2, 12);
  const sessionId = req.cookies.session_id || Math.random().toString(36).substring(2, 14);

  // Set cookies to browser
 res.cookie('user_id', userId, {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: false,
  sameSite: 'Lax',
  path: '/',
  secure: true,
  domain: '.theapexinvestor.com'
});
res.cookie('session_id', sessionId, {
  maxAge: 2 * 60 * 60 * 1000,
  httpOnly: false,
  sameSite: 'Lax',
  path: '/',
  secure: true,
  domain: '.theapexinvestor.com'
});



  console.log('Set cookies: user_id =', userId, ', session_id =', sessionId);
  res.send('Hello from server! (cookies set)');
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