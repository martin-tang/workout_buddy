const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{
        role: "user",
        content: prompt
      }],
      model: "gpt-3.5-turbo",
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Error communicating with OpenAI.' });
  }
});

module.exports = router;
