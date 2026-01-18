const express = require('express');
const cookie = require('cookie');

const app = express();

// Set a cookie: /api/set
app.get('/api/set', (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('myCookie', 'cookie-value', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 // 1 day
  }));
  res.send('Cookie set at /api/set!');
});

// Get the cookie: /api/get
app.get('/api/get', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  res.send('Cookie value: ' + (cookies.myCookie || 'not set'));
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));