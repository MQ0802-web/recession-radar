export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { series_id } = req.query;
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error_message: 'FRED_API_KEY environment variable not set in Vercel.' });
  }

  if (!series_id) {
    return res.status(400).json({ error_message: 'Missing series_id parameter.' });
  }

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=desc&limit=1&file_type=json`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error_message: e.message });
  }
}
