const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/ai-chat', async (req, res) => {
  try {
    const r = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-0Z7djtacHN2DcPs6go09XalNSOasbu5s'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{role:'user',content:req.body.message}],
        max_tokens: 200
      })
    });
    const d = await r.json();
    res.json({reply: d.choices?.[0]?.message?.content || '🤔'});
  } catch(e) { res.json({reply: '❌ '+e.message}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🥝 KIWI GUN на порту ' + PORT));