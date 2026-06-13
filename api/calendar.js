module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  var today = new Date();
  var from = today.toISOString().split('T')[0];
  var to = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  var url = 'https://finnhub.io/api/v1/calendar/economic?from=' + from + '&to=' + to + '&token=' + process.env.FINNHUB_API_KEY;

  try {
    var response = await fetch(url);
    var data = await response.json();

    var events = (data.economicCalendar || [])
      .filter(function(e) {
        return e.country === 'US' || e.country === 'GB';
      })
      .filter(function(e) {
        return e.impact === 'high' || e.impact === 'medium';
      })
      .map(function(e) {
        return {
          date: e.time.split(' ')[0],
          time: e.time.split(' ')[1] ? e.time.split(' ')[1].substring(0, 5) + ' ET' : 'TBC',
          country: e.country === 'GB' ? 'UK' : 'US',
          imp: e.impact,
          name: e.event,
          desc: e.event,
          prev: e.prev !== null && e.prev !== undefined ? String(e.prev) : '-',
          fore: e.estimate !== null && e.estimate !== undefined ? String(e.estimate) : '-'
        };
      })
      .sort(function(a, b) { return a.date > b.date ? 1 : -1; });

    res.setHeader('Cache-Control', 's-maxage=3600');
    res.json(events);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}