const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = 'your_client_id_here';
const CONSUMER_KEY = 'your_consumer_key_here';
const BASE_URL = 'https://api.snaptrade.com/api/v1';

app.post('/create-link', async (req, res) => {
  const userId = 'user_' + Date.now();

  try {
    await axios.post(`${BASE_URL}/snaptrade/registerUser`, { userId }, {
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    const { data } = await axios.get(`${BASE_URL}/snaptrade/login`, {
      params: { userId, redirectURI: 'https://yourwebsite.com/linked' },
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    res.json({ url: data.url, userId });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Error creating link' });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
