const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const text = document.body.textContent || '';
    const clean = text.replace(/\\s+/g, ' ').trim().slice(0, 8000);

    res.json({ content: clean });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du scraping' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Tikamart lancé sur http://localhost:${PORT}`);
});
