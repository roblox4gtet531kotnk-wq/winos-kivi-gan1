const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/ai-chat', async (req, res) => {
  try {
    const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-0Z7djtacHN2DcPs6go09XalNSOasbu5s'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Ты весёлый помощник в игре KIWI GUN. Отвечай коротко и весело на русском. Используй эмодзи.' },
          ...req.body.history || [],
          { role: 'user', content: req.body.message }
        ],
        max_tokens: 200
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: '🤔 ИИ не ответил. Попробуй ещё раз!' });
    }
  } catch (e) {
    res.json({ reply: '❌ Ошибка: ' + e.message });
  }
});

app.listen(3000, () => console.log('🥝 KIWI GUN запущен на http://localhost:3000'));