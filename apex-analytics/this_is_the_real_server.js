console.log('LOADED FROM:', __filename, 'at', new Date().toISOString());

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log('DEBUG: / GET HIT at', new Date().toISOString());
  res.send('Hello from server!');
});

app.listen(4000, () => console.log('Analytics API running on port 4000'));