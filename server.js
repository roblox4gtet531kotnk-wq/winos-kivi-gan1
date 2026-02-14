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
    console.log('Получено сообщение:', message);
    
    const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-0Z7djtacHN2DcPs6go09XalNSOasbu5s'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'Ты весёлый помощник игры KIWI GUN. Отвечай на русском языке коротко и с эмодзи. Помогай игрокам с вопросами об игре.'},
          {role: 'user', content: message}
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    console.log('Ответ API:', JSON.stringify(data));
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      res.json({reply: data.choices[0].message.content});
    } else if (data.error) {
      res.json({reply: '❌ Ошибка API: ' + data.error.message});
    } else {
      res.json({reply: '🤔 Не получил ответ от ИИ'});
    }
  } catch(e) {
    console.log('Ошибка:', e.message);
    res.json({reply: '❌ Ошибка: ' + e.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🥝 KIWI GUN запущен на порту ' + PORT));