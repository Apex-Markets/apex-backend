const express = require('express');
const path = require('path');
const app = express();

// Serve static files from theapex-site folder (like images, CSS, favicon, etc.)
app.use(express.static(path.join(__dirname, 'theapex-site')));

// Serve the actual homepage HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'theapex-site/index.html'));
});

// [Your other existing route]
app.get('/oauth/callback/schwab', (req, res) => {
  const code = req.query.code;
  console.log("Schwab Callback HIT!", code);

  if (!code) {
    return res.status(400).send('Missing code parameter from Schwab.');
  }

  res.send('Schwab account linked! You may now return to the app.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server listening on port', port);
});