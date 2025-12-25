export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { context } = req.body;
  const API_KEY = process.env.GROQ_API_KEY;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{
          role: 'system',
          content: 'Da una recomendación breve de comida: platillo, tiempo estimado y precio en USD.'
        }, {
          role: 'user',
          content: context || '¿Qué como?'
        }],
        max_tokens: 100
      })
    });

    const data = await response.json();
    res.status(200).json({ decision: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar decisión' });
  }
}
