export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { series_id, history } = req.query;
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return res.status(500).json({ error_message: 'FRED_API_KEY not set' });
  if (!series_id) return res.status(400).json({ error_message: 'Missing series_id' });
  try {
    let url;
    if (history === 'true') {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 7);
      const startStr = start.toISOString().split('T')[0];
      url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=asc&observation_start=${startStr}&file_type=json`;
    } else {
      url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=desc&limit=1&file_type=json`;
    }
    const r = await fetch(url);
    const d = await r.json();
    res.json(d);
  } catch(e) {
    res.status(500).json({ error_message: e.message });
  }
}
