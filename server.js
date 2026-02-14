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
    const message = req.body.message || 'Привет';
    
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Api-Key AQVNzgq9lmAwbcZ33luXEjGfnll-OcmcpZcbktR7'
      },
      body: JSON.stringify({
        modelUri: 'gpt://b1g2iq9nteq4s00ma2v1/yandexgpt-lite',
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 300
        },
        messages: [
          {role: 'system', text: 'Ты весёлый помощник игры KIWI GUN. Отвечай на русском коротко и с эмодзи.'},
          {role: 'user', text: message}
        ]
      })
    });
    
    const data = await response.json();
    
    if (data.result && data.result.alternatives && data.result.alternatives[0]) {
      res.json({reply: data.result.alternatives[0].message.text});
    } else if (data.error) {
      res.json({reply: '❌ ' + data.error.message});
    } else {
      res.json({reply: '🤔 Не получил ответ'});
    }
  } catch(e) {
    res.json({reply: '❌ ' + e.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🥝 KIWI GUN на порту ' + PORT));