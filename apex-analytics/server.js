console.log('LOADED FROM:', __filename, 'at', new Date().toISOString());

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    console.log("CORS REQ FROM:", origin);
    const allowed = [
      'https://theapexinvestor.com',
      'https://www.theapexinvestor.com'
    ];
    if (!origin) return callback(null, true); // allow server-to-server/curl
    if (allowed.includes(origin)) {
      callback(null, origin); // ECHO the valid origin!
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  console.log('DEBUG: / GET HIT at', new Date().toISOString());

  // Generate or reuse cookies
  const userId = req.cookies.user_id || Math.random().toString(36).substring(2, 12);
  const sessionId = req.cookies.session_id || Math.random().toString(36).substring(2, 14);

  // Dynamically set cookie domain for prod/dev
  const isProd = process.env.NODE_ENV === 'production';
  const cookieDomain = isProd ? '.theapexinvestor.com' : undefined;

  res.cookie('user_id', userId, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'Lax',
    path: '/',
    secure: true,
    domain: cookieDomain
  });
  res.cookie('session_id', sessionId, {
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'Lax',
    path: '/',
    secure: true,
    domain: cookieDomain
  });

  console.log('Set cookies: user_id =', userId, ', session_id =', sessionId);
  // Also return as JSON for frontend JS access on first load
  res.json({ message: 'Hello from server! (cookies set)', user_id: userId, session_id: sessionId });
});

app.post('/api/track', async (req, res) => {
  console.log('Received /api/track POST:', req.body);
  const { user_id, session_id, event_type, page_url, event_data } = req.body;
  try {
    await pool.query(
      'INSERT INTO events (user_id, session_id, event_type, page_url, event_data) VALUES ($1, $2, $3, $4, $5)',
      [
        user_id,
        session_id,
        event_type,
        page_url,
        typeof event_data === 'string' ? event_data : JSON.stringify(event_data || {})
      ]
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Analytics API running on port', PORT));