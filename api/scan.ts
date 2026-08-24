export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const bodyPayload = typeof req.body === 'string' 
      ? req.body 
      : JSON.stringify(req.body);

    const tvResponse = await fetch('https://scanner.tradingview.com/turkey/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyPayload
    });

    if (!tvResponse.ok) {
      return res.status(tvResponse.status).json({ error: `TradingView responded with ${tvResponse.status}` });
    }

    const data = await tvResponse.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Vercel API scan proxy error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch TradingView data' });
  }
}
