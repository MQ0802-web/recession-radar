export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { series_id, history, months, max, range } = req.query;
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return res.status(500).json({ error_message: 'FRED_API_KEY not set' });
  if (!series_id) return res.status(400).json({ error_message: 'Missing series_id' });
  try {
    let url;
    if (max === 'true') {
      url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=asc&file_type=json`;
    } else if (range && !isNaN(parseInt(range))) {
      const start = new Date();
      start.setFullYear(start.getFullYear() - parseInt(range));
      url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=asc&observation_start=${start.toISOString().split('T')[0]}&file_type=json`;
    } else if (history === 'true') {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 7);
      url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=asc&observation_start=${start.toISOString().split('T')[0]}&file_type=json`;
    } else if (months) {
      const start = new Date();
      start.setMonth(start.getMonth() - parseInt(months));
      url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=asc&observation_start=${start.toISOString().split('T')[0]}&file_type=json`;
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