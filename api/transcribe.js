export const config = { api: { bodyParser: false, sizeLimit: '5mb' } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = req.headers['x-groq-key'];
  if (!apiKey) return res.status(400).json({ error: 'x-groq-key header required' });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': req.headers['content-type'],
    },
    body,
  });

  const text = await groqRes.text();
  res.status(groqRes.status).setHeader('Content-Type', 'text/plain').send(text);
}
