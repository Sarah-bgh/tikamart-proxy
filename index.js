const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Limiteur : 1 requête / 10 secondes / IP
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 secondes
  max: 1, // max 1 requête
  message: {
    status: 429,
    error: 'Trop de requêtes. Veuillez patienter 10 secondes.'
  }
});
app.use('/chat', limiter); // limiter uniquement les appels à /chat

// ✉️ Route de génération OpenAI
app.post('/chat', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = openaiRes.data.choices[0].message.content;
    res.json({ result: message });
  } catch (err) {
    console.error('Erreur OpenAI:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erreur de génération.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Tikamart lancé sur http://localhost:${PORT}`);
});
